<template>
  <div id="table-component">
    <div id="table-component-header">
      <div v-for="column in visibleColumns"
           class="table-component-header-cell"
           :key="column.field"
           @click="sort(column)"
           @mouseenter="showColumnFilter(column)"
           @mouseleave="hideColumnFilter(column)">
        <div :class="{'table-header-text-animation' : shouldShowFilter(column)}" class="table-component-header-text">
          <span>{{ column.name }}</span>
        </div>
        <div :class="{'table-header-sort-animation-move' : shouldShowFilter(column)}" class="table-header-sort-image">
          <transition name="fade-in-out">
            <img :class="{'table-header-sort-animation-rotate' : isSortedAsc(column)}"
                 :style="{opacity: isSortedAsc(column) || isSortedDesc(column) ? '1' : '0'}"
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
    <div v-dragscroll.x id="table-component-body">
      <!-- Grouped rows -->
      <transition-group name="flip-list">
        <div v-for="(group, groupIndex) in groupedRows" :key="group.field + group.value">
          <div class="table-component-group-header"
               :style="{width: scrollableWidth}"
               @dblclick="toggleExpandGroup(groupIndex)">
            <div class="table-component-group-name">
              <div class="table-component-group-text">{{ group.value }}</div>
              <div class="table-component-group-count">{{ group.count }}</div>
              <img :class="{'table-component-group-arrow-up' : isExpanded(groupIndex)}"
                   class="table-component-group-arrow"
                   src="@/assets/home/arrow_down.png"/>
            </div>
          </div>
          <div v-if="isExpanded(groupIndex)" class="table-component-group-rows">
            <transition-group name="flip-list">
              <div v-for="row in group.rows"
                   class="table-component-group-row"
                   :style="{width: scrollableWidth}"
                   :key="row.customer + row.wintactic">
                <div v-for="column in visibleColumns" class="table-component-group-cell" :key="column.field">
                  {{ row[column.field] }}
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </transition-group>
      <!-- Ungrouped rows -->
      <div v-if="!isGroupingActive">
        <transition-group name="flip-list">
          <div v-for="row in rows" :key="row.customer + row.wintactic">
            <div v-if="!isRowFiltered(row)"
                 class="table-component-body-row"
                 :style="{width: scrollableWidth}">
              <div v-for="column in visibleColumns" class="table-component-body-cell" :key="column.field">
                {{ row[column.field] }}
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
import {getGroupingColum} from "@/utils/table-utils";
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
    columns(updatedColumns) {
      //todo check not to do the grouping if visibility changes or order of columns
      this.initTable();
      const groupingColumn = getGroupingColum(updatedColumns);
      if (groupingColumn) {
        this.groupByColumn(groupingColumn)
      }
    }
  },

  props: {
    columns: Object
  },

  data: () => ({
    rows: [
      {
        "customer": "Zellos Systems",
        "wintactic": "Transform aaS",
        "status": "Dismiss",
        "tags": "#aas,#priority#2,#opex",
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
        "tags": "#3D,#Manuf,#x-sell",
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
        "tags": "#service,#priority_3",
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
        "tags": "#service,#priority_2",
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
        "tags": "#retain,#priority_1,#traditional",
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
        "tags": "#aas,#priority#2,#opex",
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
        "tags": "#retain,#priority_1,#traditional",
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
        "tags": "#aas,#priority#2,#opex",
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
        "tags": "#retain,#priority_1,#traditional",
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
        "tags": "#aas,#priority#2,#opex",
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
        "tags": "#3D,#Manuf,#x-sell",
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
        "tags": "#service,#priority_2",
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
        "tags": "#service,#priority_3",
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
        "tags": "#service,#priority_2",
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
        "tags": "#retain,#priority_1,#traditional",
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
        "tags": "#aas,#priority#2,#opex",
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
        "tags": "#3D,#Manuf,#x-sell",
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
        "tags": "#service,#priority_3",
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
        "tags": "#aas,#priority#2,#opex",
        "action_date": "",
        "start_date": "1-Jan-24",
        "end_date": "31-Dec-24",
        "strategy": "Pivot to aaS",
        "unread_comments": 0,
        "total_comments": 0
      }
    ],
    groupedRows: [],
    shownColumFilter: Boolean,
    scrollableWidth: String,
    sortingColumn: {
      column: String,
      sorting: String
    },
    filterColumns: [],
  }),

  computed: {
    visibleColumns() {
      return this.columns.filter(column => column.hidden === false);
    },
    isGroupingActive() {
      return !!getGroupingColum(this.columns)
    }
  },

  methods: {
    initTable() {
      this.groupedRows = [];
    },
    groupByColumn(columnField) {
      const groupedData = new Map();
      this.rows.forEach(obj => {
        const value = obj[columnField];
        if (!groupedData.has(value)) {
          groupedData.set(value, {
            field: columnField,
            value: value,
            count: 0,
            rows: []
          });
        }
        groupedData.get(value).count++;
        groupedData.get(value).rows.push(obj);
      });
      this.groupedRows = Array.from(groupedData.values());
    },
    toggleExpandGroup(index) {
      this.groupedRows[index].expanded = this.groupedRows[index].expanded !== true;
    },
    isExpanded(index) {
      return this.groupedRows[index].expanded === true;
    },
    showColumnFilter(column) {
      this.shownColumFilter = column.field;
    },
    hideColumnFilter() {
      this.shownColumFilter = null;
    },
    shouldShowFilter(column) {
      const index = this.filterColumns.findIndex(val => val.column === column.field);
      return index !== -1 || this.shownColumFilter === column.field;
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
      if (getGroupingColum(this.columns) === this.sortingColumn.column) {
        const groupedRows = [];
        this.groupedRows.forEach(groupedRow => {
          if (groupedRow.expanded === true) {
            groupedRows.push(groupedRow.value)
          }
          groupedRow.expanded = false;
        });
        this.groupedRows.sort((first, second) => {
          const firstValue = first.value;
          const secondValue = second.value;
          if (this.sortingColumn.sorting === "asc") {
            return firstValue < secondValue ? -1 : (firstValue > secondValue ? 1 : 0);
          } else {
            return firstValue > secondValue ? -1 : (firstValue < secondValue ? 1 : 0);
          }
        });
        setTimeout(() => {
          this.groupedRows.forEach(groupedRow => {
            groupedRows.forEach(row => {
              if (row === groupedRow.value) {
                groupedRow.expanded = true;
              }
            });
          })
        }, 500);
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
    openFilter(column, event) {
      /* Search in the array and retrieve the index and get all possible distinct values
      * If the index does not exist, initialize and emit the event
      * Else, send the filter as it is stored */
      const index = this.filterColumns.findIndex(col => col.column === column.field);
      const values = this.getDistinctValues(column);
      if (index !== -1) {
        this.filterColumns[index].checked = this.updateCheckedValues(this.filterColumns[index].selected, values);
        this.filterColumns[index].unchecked = this.updateUncheckedValues(values, this.filterColumns[index].checked);
        this.$emit("openFilterConfiguration", this.filterColumns[index]);
      } else {
        this.$emit("openFilterConfiguration", {
          column: column.field,
          unchecked: [],
          checked: values,
          selected: values
        });
      }
      event.stopPropagation();
    },
    updateCheckedValues(firstSet, secondSet) {
      const remainingSet = new Set();
      firstSet.forEach(value => {
        if (secondSet.has(value)) {
          remainingSet.add(value)
        }
      })
      return remainingSet;
    },
    updateUncheckedValues(firstSet, secondSet) {
      const remainingSet = new Set;
      firstSet.forEach(value => {
        if (!secondSet.has(value)) {
          remainingSet.add(value)
        }
      })
      return remainingSet;
    },
    getDistinctValues(column) {
      let tmpRows = [...this.rows];
      this.filterColumns.forEach(filter => {
        if (filter.column !== column.field) {
          tmpRows = tmpRows.filter(row => {
            return filter.selected.has(row[filter.column]);
          });
        }
      });
      return new Set(tmpRows.map(row => row[column.field]))
    },
    applyFilter(selectedValues) {
      const index = this.filterColumns.findIndex(val => val.column === selectedValues.column);
      if (index !== -1) {
        this.filterColumns[index].selected = selectedValues.selected;
        this.filterColumns[index].checked = selectedValues.checked;
        this.filterColumns[index].unchecked = selectedValues.unchecked;
      } else {
        this.filterColumns.push(selectedValues);
      }
      this.filterRows();
    },
    deleteFilter(column) {
      const index = this.filterColumns.findIndex(val => val.column === column);
      if (index !== -1) {
        this.filterColumns.splice(index, 1)
        this.filterRows();
      }
    },
    clearFilters() {
      this.filterColumns = [];
      this.filterRows();
    },
    filterRows() {
      this.rows.forEach(row => row.filtered =
          this.filterColumns.some(filter => {
            return !filter.selected.has(row[filter.column]);
          }));
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
    }
  }
}
</script>

<style scoped>
#table-component {
  /* Calculate high as 100vh minus headers, minus metrics, minus 3 margins */
  height: calc(100vh - 100px - 226px - 55px - 40px - 40px - 40px);
  /* Table's width should match the left margin of header's search bar */
  /* Calculate width as 60%* of total width, including left margin */
  width: calc((100% + 2 * 60px) * 0.6);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #FFFAEB;
}

#table-component-body {
  overflow-x: hidden;
  /* Calculate high as 100vh minus headers, minus metrics, minus 3 margins */
  height: calc(100vh - 100px - 45px - 226px - 55px - 40px - 40px - 40px);
}

#table-component-body::-webkit-scrollbar {
  display: none;
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
  cursor: pointer;
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
  transform: translateX(-30px);
}

.table-header-sort-image {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease;
}

.table-header-sort-image img {
  transition: all 0.5s ease;
}

.table-header-sort-animation-move {
  transform: translateX(-30px);
}

.table-header-sort-animation-rotate {
  transform: rotate(180deg);
}

.table-header-filter-image {
  /* Adjust margins from grid directly, not in this class */
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
  background-color: #C7C7C7;
}

.table-component-body-cell {
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

.table-component-group-header {
  height: 65px;
  background-color: white;
  font-size: 16px;
  font-family: Inter-Medium, serif;
  display: flex;
  cursor: pointer;
  border-bottom: 1px solid #D0D5DD;
  user-select: none;
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
  background-color: #C7C7C7;
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
</style>