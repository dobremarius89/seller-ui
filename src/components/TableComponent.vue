<template>
  <div id="table-component">
    <div id="table-component-header">
      <div v-for="column in visibleColumns"
           class="table-component-header-cell"
           :key="column.field"
           @mouseenter="showColumnFilter(column)"
           @mouseleave="hideColumnFilter(column)">
        <div :class="{'table-header-text-animation' : (isMouseOverFilter(column) && !hasFilter(column)) || (isSorted(column) && hasFilter(column))}"
             class="table-component-header-text">
          <span>{{ column.name }}</span>
        </div>
        <div :class="{'table-header-sort-animation-move' : shouldShowFilter(column)}"
             class="table-header-sort-image"
             :style="{opacity: isSorted(column) || isMouseOverFilter(column) ? 1 : 0}"
             @click="sort(column)">
          <transition name="fade-in-out">
            <img :class="{'table-header-sort-animation-rotate' : isSortedAsc(column)}"
                 src="@/assets/table/arrow_up.png"/>
          </transition>
        </div>
        <transition name="fade-in-out">
          <div v-if="shouldShowFilter(column)" class="table-header-filter-image" @click="openFilter(column, $event)">
            <img src="@/assets/table/filter.png"/>
          </div>
        </transition>
      </div>
    </div>
    <div v-dragscroll.x id="table-component-body" :style="{height : containerHeight}">
      <!-- Grouped rows -->
      <transition-group name="flip-list">
        <div v-for="[group, value] in groupedRows.entries()" :key="group">
          <div class="table-component-group-header"
               :style="{width: scrollableWidth}"
               @dblclick="toggleExpandGroup(group)">
            <div class="table-component-group-name">
              <div class="table-component-group-text">{{ group }}</div>
              <div class="table-component-group-count">{{ value.count }}</div>
              <img :class="{'table-component-group-arrow-up' : isGroupExpanded(group)}"
                   class="table-component-group-arrow"
                   src="@/assets/home/arrow_down.png"/>
            </div>
          </div>
          <div v-if="isGroupExpanded(group)" class="table-component-group-rows">
            <transition-group name="flip-list">
              <div v-for="(row, index) in value.rows"
                   :class="{'table-component-body-row-selected' : isRowSelected(getRowKey(row))}"
                   class="table-component-group-row"
                   :style="{width: scrollableWidth}"
                   :key="row.customer + row.wintactic"
                   @click="selectOrDeselectGroupRow(group, index, $event)">
                <div v-for="column in visibleColumns" :key="column.field">
                  <div v-if="column.field !== 'tags'" class="table-component-body-cell">
                    {{ row[column.field] }}
                  </div>
                  <div v-else class="table-component-body-cell-tags">
                    <div v-for="tag in row['tags']" class="tag" :key="tag">
                      {{ tag }}
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </transition-group>
      <!-- Ungrouped rows -->
      <div v-if="!isGroupingActive">
        <transition-group name="flip-list">
          <div v-for="(row, index) in rows" :key="getRowKey(row)">
            <div v-if="!isRowFiltered(row)"
                 :class="{'table-component-body-row-selected' : isRowSelected(getRowKey(row))}"
                 class="table-component-body-row"
                 :style="{width: scrollableWidth}"
                 @click="selectOrDeselectRow(index, $event)">
              <div v-for="column in visibleColumns" :key="column.field">
                <div v-if="column.field !== 'tags'" class="table-component-body-cell">
                  {{ row[column.field] }}
                </div>
                <div v-else class="table-component-body-cell-tags">
                  <div v-for="tag in row['tags']" class="tag" :key="tag">
                    {{ tag }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";
import eventBus from "@/config/emitter.config";
import * as XLSX from "xlsx";

export default {
  directives: {
    dragscroll
  },

  mounted() {
    this.addScrollListener();
    this.computeScrollableWidth();
    eventBus.on("exportCsv", this.exportCsv);
    eventBus.on("exportXlsx", this.exportXlsx);
    eventBus.on("applyFilterConfiguration", this.applyFilter);
    eventBus.on("deleteFilterConfiguration", this.deleteFilter);
    eventBus.on("clearFilterConfiguration", this.clearFilters);
    /* Default select the first row and reset all previous selections */
    this.initializeSelectedRows()
  },

  beforeUnmount() {
    this.removeScrollListener();
    eventBus.off("exportCsv", this.exportCsv);
    eventBus.off("exportXlsx", this.exportXlsx);
    eventBus.off("applyFilterConfiguration", this.applyFilter);
    eventBus.off("deleteFilterConfiguration", this.deleteFilter);
    eventBus.off("clearFilterConfiguration", this.clearFilters);
  },

  watch: {
    columns() {
      const newGroupingColumn = this.columns.find(column => column.grouping === true);
      if (newGroupingColumn) {
        if (newGroupingColumn.field !== this.groupingColumn) {
          this.groupingColumn = newGroupingColumn.field;
          this.groupByColumn(newGroupingColumn.field);
          this.initializeSelectedRows();
        }
      } else {
        this.groupedRows = new Map();
        this.groupingColumn = "";
      }
    }
  },

  props: {
    columns: Object,
    isExpanded: Boolean
  },

  data: () => ({
    rows: [
      {
        "customer": "Zellos Systems",
        "wintactic": "Transform aaS",
        "status": "Dismiss",
        "tags": ["#aas", "#priority#2", "#opex", "#others", "#anaka"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 1,
        "total_comments": 1
      },
      {
        "customer": "Acme Inc",
        "wintactic": "3D Engage",
        "status": "Review",
        "tags": ["#3D", "#Manuf", "#x-sell"],
        "action_date": "1-Jun-24",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Acquire New Logos",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Acme Inc",
        "wintactic": "Hyper-care Upsell",
        "status": "Review",
        "tags": ["#service", "#priority_3"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Expand Footprint",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Acme Inc",
        "wintactic": "Renew Support",
        "status": "Dismiss",
        "tags": ["#service"],
        "action_date": "1-Feb-24",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Retain",
        "unread_comments": 0,
        "total_comments": 2
      },
      {
        "customer": "Acme Inc",
        "wintactic": "Tech Refresh Printers",
        "status": "Pursue",
        "tags": ["#retain", "#priority_1", "#traditional"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Improve Customer Lifetime Value",
        "unread_comments": 3,
        "total_comments": 8
      },
      {
        "customer": "Acme Inc",
        "wintactic": "Transform aaS",
        "status": "Review",
        "tags": ["#aas", "#priority#2", "#opex"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 1,
        "total_comments": 5
      },
      {
        "customer": "Astral",
        "wintactic": "Tech Refresh Printers",
        "status": "Dismiss",
        "tags": ["#retain", "#priority_1", "#traditional"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Improve Customer Lifetime Value",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Astral",
        "wintactic": "Transform aaS",
        "status": "Pursue",
        "tags": ["#aas", "#priority#2", "#opex"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Apex Ventures",
        "wintactic": "Tech Refresh Printers",
        "status": "Review",
        "tags": ["#retain", "#priority_1", "#traditional"],
        "action_date": "1-Jun",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Improve Customer Lifetime Value",
        "unread_comments": 0,
        "total_comments": 1
      },
      {
        "customer": "Apex Ventures",
        "wintactic": "Transform aaS",
        "status": "Review",
        "tags": ["#aas", "#priority#2", "#opex"],
        "action_date": "1-Jun",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Celestial Synthetics",
        "wintactic": "3D Engage",
        "status": "Review",
        "tags": ["#3D", "#Manuf", "#x-sell"],
        "action_date": "1-Jun",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Acquire New Logos",
        "unread_comments": 0,
        "total_comments": 1
      },
      {
        "customer": "Celestial Synthetics",
        "wintactic": "Renew Support",
        "status": "Review",
        "tags": ["#service", "#priority_2"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Retain",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Cosmo Catalyst",
        "wintactic": "Hyper-care Upsell",
        "status": "Review",
        "tags": ["#service", "#priority_3"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Expand Footprint",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "CyberPulse",
        "wintactic": "Renew Support",
        "status": "Review",
        "tags": ["#service", "#priority_2"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Retain",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "CyberPulse",
        "wintactic": "Tech Refresh Printers",
        "status": "Review",
        "tags": ["#retain", "#priority_1", "#traditional"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Improve Customer Lifetime Value",
        "unread_comments": 1,
        "total_comments": 2
      },
      {
        "customer": "CyberPulse",
        "wintactic": "Transform aaS",
        "status": "Pursue",
        "tags": ["#aas", "#priority#2", "#opex"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Elysian Echo Systems",
        "wintactic": "3D Engage",
        "status": "Dismiss",
        "tags": ["#3D", "#Manuf", "#x-sell"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Acquire New Logos",
        "unread_comments": 0,
        "total_comments": 1
      },
      {
        "customer": "Elysian Echo Systems",
        "wintactic": "Hyper-care Upsell",
        "status": "Dismiss",
        "tags": ["#service", "#priority_3"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Expand Footprint",
        "unread_comments": 0,
        "total_comments": 0
      },
      {
        "customer": "Elysian Echo Systems",
        "wintactic": "Transform aaS",
        "status": "Dismiss",
        "tags": ["#aas", "#priority#2", "#opex"],
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 0,
        "total_comments": 0
      }
    ],
    groupedRows: new Map(),
    groupedRowsArray: [],
    selectedRows: new Map(),
    selectedWithShiftRows: new Map(),
    expandedGroups: new Set(),
    shownColumFilter: Boolean,
    scrollableWidth: String,
    sortingColumn: {
      column: String,
      sorting: String
    },
    groupingColumn: "",
    filterColumns: new Map(),
    selectedRowKeyBeforeShift: String
  }),

  computed: {
    visibleColumns() {
      return this.columns.filter(column => column.hidden === false);
    },
    isGroupingActive() {
      return !!this.groupingColumn;
    },
    containerHeight() {
      if (this.isExpanded) {
        // 100vh minus headers, minus 3 margins, minus table functions and header
        return `calc(100vh - 100px - 30px - 30px - 55px - 45px - 30px)`
      } else {
        // 100vh minus headers, minus metrics, minus 3 margins, minus table functions and header
        return `calc(100vh - 100px - 30px - 226px - 30px - 55px - 45px - 30px)`
      }
    }
  },

  methods: {
    groupByColumn(column) {
      const groupedData = new Map();
      this.rows
          .filter(row => row.filtered !== true)
          .forEach(row => {
            const value = row[column];
            if (!groupedData.has(value)) {
              groupedData.set(value, {
                field: column,
                value: value,
                count: 0,
                rows: []
              });
            }
            groupedData.get(value).count++;
            groupedData.get(value).rows.push(row);
          });
      this.groupedRows = groupedData;
      this.groupedRowsArray = Array.from(this.groupedRows.values()).flatMap(value => value.rows);
    },
    toggleExpandGroup(group) {
      if (this.expandedGroups.has(group)) {
        this.expandedGroups.delete(group);
      } else {
        this.expandedGroups.add(group);
      }
    },
    isGroupExpanded(group) {
      return this.expandedGroups.has(group);
    },
    showColumnFilter(column) {
      this.shownColumFilter = column.field;
    },
    hideColumnFilter() {
      this.shownColumFilter = null;
    },
    shouldShowFilter(column) {
      return this.hasFilter(column) || this.isMouseOverFilter(column);
    },
    hasFilter(column) {
      return this.filterColumns.has(column.field);
    },
    isMouseOverFilter(column) {
      return this.shownColumFilter === column.field;
    },
    isSortedAsc(column) {
      if (this.sortingColumn.column === column.field) {
        return this.sortingColumn.sorting === "asc";
      } else {
        return false;
      }
    },
    isSortedDesc(column) {
      if (this.sortingColumn.column === column.field) {
        return this.sortingColumn.sorting === "desc";
      } else {
        return false;
      }
    },
    isSorted(column) {
      return this.isSortedAsc(column) || this.isSortedDesc(column);
    },
    sort(column) {
      if (this.sortingColumn.column === column.field) {
        if (this.sortingColumn.sorting === "asc") {
          this.sortingColumn.sorting = "desc";
        } else {
          this.sortingColumn.sorting = "asc"
        }
      } else {
        this.sortingColumn.sorting = "asc";
      }
      this.sortingColumn.column = column.field;
      if (this.isGroupingActive) {
        this.sortGroups();
      } else {
        this.sortRows();
      }
    },
    sortRows() {
      this.rows.sort((first, second) => {
        const firstValue = first[this.sortingColumn.column];
        const secondValue = second[this.sortingColumn.column];
        if (this.sortingColumn.sorting === "asc") {
          return firstValue < secondValue ? -1 : (firstValue > secondValue ? 1 : 0);
        } else {
          return firstValue > secondValue ? -1 : (firstValue < secondValue ? 1 : 0);
        }
      });
    },
    sortGroups() {
      /* If sorting by grouping column */
      if (this.groupingColumn === this.sortingColumn.column) {
        /* Store the expanded groups, collapse them, sort them and expand them with a delay */
        const expandedGroups = new Set(this.expandedGroups);
        this.expandedGroups = new Set();
        const sortedGroupedRows = new Map();
        const sortedGroups = Array.from(this.groupedRows.keys()).sort((first, second) => {
          if (this.sortingColumn.sorting === "asc") {
            return first < second ? -1 : (first > second ? 1 : 0);
          } else {
            return first > second ? -1 : (first < second ? 1 : 0);
          }
        });
        sortedGroups.forEach(group => {
          sortedGroupedRows.set(group, this.groupedRows.get(group));
        });
        this.groupedRows = sortedGroupedRows;
        setTimeout(() => this.expandedGroups = expandedGroups, 500);
        /* Else, sorting by any other column */
      } else {
        this.groupedRows.forEach(groupedRow => {
          groupedRow.rows.sort((first, second) => {
            const firstValue = first[this.sortingColumn.column];
            const secondValue = second[this.sortingColumn.column];
            if (this.sortingColumn.sorting === "asc") {
              return firstValue < secondValue ? -1 : (firstValue > secondValue ? 1 : 0);
            } else {
              return firstValue > secondValue ? -1 : (firstValue < secondValue ? 1 : 0);
            }
          });
        });
      }
    },
    openFilter(column) {
      /* Search in the array and retrieve the index and get all possible distinct values
      * If the index does not exist, initialize and emit the event
      * Else, send the filter as it is stored */
      const values = this.getDistinctValues(column);
      if (this.filterColumns.has(column.field)) {
        const value = this.filterColumns.get(column.field);
        value.checked = this.updateCheckedValues(value.selected, values);
        value.unchecked = this.updateUncheckedValues(values, value.checked);
        this.filterColumns.set(column.field, value);
        this.$emit("openFilterConfiguration", {
          column: column.field,
          unchecked: value.unchecked,
          checked: value.checked,
          selected: value.selected
        });
      } else {
        this.$emit("openFilterConfiguration", {
          column: column.field,
          unchecked: [],
          checked: values,
          selected: values
        });
      }
    },
    updateCheckedValues(firstSet, secondSet) {
      const remainingSet = new Set();
      firstSet.forEach(value => {
        if (secondSet.has(value)) {
          remainingSet.add(value)
        }
      });
      return remainingSet;
    },
    updateUncheckedValues(firstSet, secondSet) {
      const remainingSet = new Set();
      firstSet.forEach(value => {
        if (!secondSet.has(value)) {
          remainingSet.add(value)
        }
      });
      return remainingSet;
    },
    getDistinctValues(column) {
      let tmpRows = [...this.rows];
      for (const [filter, value] of this.filterColumns.entries()) {
        if (filter !== column.field) {
          tmpRows = tmpRows.filter(row => {
            return value.selected.has(row[filter]);
          });
        }
      }
      return new Set(tmpRows
          .map(row => row[column.field])
          .sort((first, second) => first.toString().localeCompare(second))
      );
    },
    applyFilter(selectedValues) {
      this.filterColumns.set(selectedValues.column, {
        selected: selectedValues.selected,
        checked: selectedValues.checked,
        unchecked: selectedValues.unchecked
      })
      this.filterRows();
      if (this.isGroupingActive) {
        this.groupByColumn(this.groupingColumn);
      }
    },
    deleteFilter(column) {
      this.filterColumns.delete(column);
      this.filterRows();
      if (this.isGroupingActive) {
        this.groupByColumn(this.groupingColumn);
      }
    },
    clearFilters() {
      this.filterColumns = new Map();
      this.filterRows();
      if (this.isGroupingActive) {
        this.groupByColumn(this.groupingColumn);
      }
    },
    filterRows() {
      this.rows.forEach(row => {
        for (const [column, filter] of this.filterColumns.entries()) {
          if (!filter.selected.has(row[column])) {
            row.filtered = true;
            return;
          }
        }
        row.filtered = false;
      });
    },
    isRowFiltered(row) {
      return row.filtered === true;
    },
    exportXlsx() {
      const headers = this.columns.map(column => column.field);
      const rows = this.rows.map(row => {
        return headers.map(column => {
          const value = row[column] === null ? '' : row[column];
          return `${value.toString().replace(/"/g, '""')}`;
        });
      });
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet 1")
      const xlsx = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      const blob = new Blob([xlsx], {type: 'application/octet-stream'});
      const link = document.createElement('a');
      link.download = "table_export.xlsx";
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportCsv() {
      const headers = this.columns.map(column => column.field);
      const rows = this.rows.map(row => {
        return headers.map(column => {
          const value = row[column] === null ? '' : row[column];
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',');
      });
      const csv = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csv], {type: 'text/csv'});
      const link = document.createElement('a');
      link.download = "table_export.csv";
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    addScrollListener() {
      this.content = document.getElementById('table-component-body');
      this.header = document.getElementById('table-component-header');
      this.content.addEventListener('scroll', this.handleSynchronousScroll);
    },
    removeScrollListener() {
      this.content.removeEventListener('scroll', this.handleSynchronousScroll);
    },
    handleSynchronousScroll() {
      this.header.scrollLeft = this.content.scrollLeft;
    },
    computeScrollableWidth() {
      const tableHeader = document.getElementById("table-component-header");
      this.scrollableWidth = tableHeader.scrollWidth + "px"
    },
    selectOrDeselectRow(index, event) {
      const row = this.rows[index];
      const key = this.getRowKey(row);
      if (event.metaKey || event.ctrlKey) {
        this.selectedRows = new Map([...this.selectedRows, ...this.selectedWithShiftRows]);
        this.selectedRowKeyBeforeShift = key;
        if (this.isRowSelected(key) && this.selectedRows.size > 1) {
          this.selectedRows.delete(key);
          this.selectedWithShiftRows.delete(key)
        } else {
          this.selectedRows.set(key, row);
        }
      } else if (event.shiftKey) {
        const lastSelected = this.getRowIndexByKey(this.selectedRowKeyBeforeShift);
        this.selectedWithShiftRows = new Map();
        if (index > lastSelected) {
          for (let i = lastSelected; i <= index; i++) {
            const rowToAdd = this.rows[i];
            this.selectedWithShiftRows.set(this.getRowKey(rowToAdd), rowToAdd);
          }
        }
        if (index < lastSelected) {
          for (let i = index; i <= lastSelected; i++) {
            const rowToAdd = this.rows[i];
            this.selectedWithShiftRows.set(this.getRowKey(rowToAdd), rowToAdd);
          }
        }
      } else {
        this.selectedRowKeyBeforeShift = key;
        this.selectedWithShiftRows = new Map();
        this.selectedRows = new Map();
        this.selectedRows.set(key, row);
      }
      this.$emit("selectRows", this.selectedRows);
    },
    selectOrDeselectGroupRow(group, index, event) {
      const row = this.groupedRows.get(group).rows[index];
      const key = this.getRowKey(row);
      if (event.metaKey || event.ctrlKey) {
        this.selectedRows = new Map([...this.selectedRows, ...this.selectedWithShiftRows]);
        this.selectedRowKeyBeforeShift = key;
        if (this.isRowSelected(key) && this.selectedRows.size > 1) {
          this.selectedRows.delete(key);
          this.selectedWithShiftRows.delete(key)
        } else {
          this.selectedRows.set(key, row);
        }
      } else if (event.shiftKey) {
        const lastSelected = this.getGroupRowIndexByKey(this.selectedRowKeyBeforeShift);
        const arrayIndex = this.getGroupRowIndexByKey(key);
        this.selectedWithShiftRows = new Map();
        if (arrayIndex > lastSelected) {
          for (let i = lastSelected; i <= arrayIndex; i++) {
            const rowToAdd = this.rows[i];
            this.selectedWithShiftRows.set(this.getRowKey(rowToAdd), rowToAdd);
          }
        }
        if (arrayIndex < lastSelected) {
          for (let i = arrayIndex; i <= lastSelected; i++) {
            const rowToAdd = this.rows[i];
            this.selectedWithShiftRows.set(this.getRowKey(rowToAdd), rowToAdd);
          }
        }
      } else {
        this.selectedRowKeyBeforeShift = key;
        this.selectedWithShiftRows = new Map();
        this.selectedRows = new Map();
        this.selectedRows.set(key, row);
      }
      this.$emit("selectRows", this.selectedRows);
    },
    isRowSelected(key) {
      return this.selectedRows.has(key) || this.selectedWithShiftRows.has(key);
    },
    getRowKey(row) {
      return row.customer + row.wintactic;
    },
    getRowIndexByKey(key) {
      return this.rows.findIndex(row => key === this.getRowKey(row));
    },
    getGroupRowIndexByKey(key) {
      return this.groupedRowsArray.findIndex(row => key === this.getRowKey(row));
    },
    initializeSelectedRows() {
      this.selectedRows = new Map();
      this.selectedWithShiftRows = new Map();
      this.selectOrDeselectRow(0, {ctrlKey: true});
    }
  }
}
</script>

<style scoped>
#table-component {
  display: flex;
  flex-direction: column;
  background-color: #FFFAEB;
}

#table-component-body {
  /* High is computed property */
  overflow-x: hidden;
  user-select: none;
  transition: height 0.5s;
}

#table-component-header {
  overflow: hidden;
  display: flex;
}

.table-component-header-cell {
  min-width: 200px;
  max-width: 200px;
  height: 45px;
  background-color: #FE8325;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: white;
  display: grid;
  grid-template-columns: 1fr 25px 30px;
  grid-gap: 0;
  cursor: default;
}

.table-component-header-cell:not(:last-child) {
  border-right: 1px solid white;
}

.table-component-header-text {
  transition: transform 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  text-align: center;
}

.table-header-text-animation {
  transform: translateX(-10px);
}

.table-header-sort-image {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
  cursor: pointer;
}

.table-header-sort-image img {
  transition: all 0.5s ease;
}

.table-header-sort-animation-move {
  transform: translateX(-10px);
}

.table-header-sort-animation-rotate {
  transform: rotate(180deg);
}

.table-header-filter-image {
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.table-header-filter-image img {
  width: 21px;
  height: 22px;
}

.table-component-body-row {
  display: flex;
  transition: background-color 0.5s linear;
}

.table-component-body-row:hover {
  cursor: pointer;
  background-color: #EDEDED;
}

.table-component-body-row-selected {
  @extend .table-component-body-row
  cursor: pointer;
  background-color: #C7C7C7;
}

.table-component-body-cell {
  min-width: 200px;
  max-width: 200px;
  height: 50px;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  line-height: 50px;
}

.table-component-body-cell-tags {
  min-width: 200px;
  max-width: 200px;
  height: 50px;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-evenly;
}

.tag {
  background-color: #F9FAFB;
  border-radius: 10px;
  border: 1px solid #EAECF0;
  height: 20px;
  padding: 3px;
  margin-left: 3px;
  font-family: Inter-Medium, serif;
  color: #344054;
}

.table-component-group-header {
  height: 65px;
  background-color: white;
  font-size: 16px;
  font-family: Inter-Medium, serif;
  display: flex;
  cursor: pointer;
  border-bottom: 1px solid #D0D5DD;
}

.table-component-group-text {
  width: 100px;
}

.table-component-group-name {
  margin-left: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-component-group-count {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #FEDF89;
  font-family: Inter-Medium, serif;
  font-size: 24px;
  color: #101828;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-component-group-arrow {
  margin-left: 20px;
  scale: 65%;
  transition: transform 0.5s ease;
}

.table-component-group-arrow-up {
  transform: rotate(180deg);
}

.table-component-group-rows {
}

.table-component-group-row {
  display: flex;
  transition: background-color 0.5s linear;
}

.table-component-group-row:hover {
  cursor: pointer;
  background-color: #EDEDED;
}

.table-component-group-cell {
  min-width: 200px;
  max-width: 200px;
  height: 50px;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  align-items: center;
  justify-content: center;
  display: flex;
}

.fade-in-out-enter-active {
  animation: fade-in 0.5s linear;
}

.fade-in-out-leave-to {
  opacity: 0;
}

.fade-in-out-leave-active {
  transition: opacity 0.5s linear;
}

.flip-list-move {
  transition: all 0.5s;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.collapse-enter-active, .collapse-leave-active {
  height: 228px;
}

.collapse-enter-from, .collapse-leave-to {
  height: 0;
}
</style>