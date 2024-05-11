<template>
  <div v-dragscroll.x id="table-content">
    <div id="table-component-header">
      <div v-for="column in visibleColumns"
           class="table-component-header-cell"
           :key="column.field"
           @click="sort(column)"
           @mouseenter="showColumnFilter(column)"
           @mouseleave="hideColumnFilter(column)">
        <div><!-- keep this empty because it is the first column in the grid --></div>
        <div :class="{'table-header-text-animation' : shouldShowFilter(column)}" class="table-component-header-text">
          <span>{{ column.name }}</span>
          <transition name="fade-in-out">
          <img v-if="isSortedAsc(column) || isSortedDesc(column)"
               :class="{'table-header-sort-animation' : isSortedAsc(column)}"
               class="table-header-sort-image" src="@/assets/table/arrow_up.png"/>
          </transition>
        </div>
        <transition name="fade-in-out">
          <div v-if="shouldShowFilter(column)" class="table-header-filter-image" @click="filter($event)">
            <img src="@/assets/table/filter.png"/>
          </div>
        </transition>
      </div>
    </div>
    <div v-for="(group, groupIndex) in groupedRows" class="table-component-group" :key="groupIndex">
      <div class="table-component-group-header" @dblclick="toggleExpandGroup(groupIndex)">
        <div class="table-component-group-name">
          <div class="table-component-group-text">{{ group.value }}</div>
          <div class="table-component-group-count">{{ group.count }}</div>
          <img :class="{'table-component-group-arrow-up' : isExpanded(groupIndex)}" class="table-component-group-arrow"
               src="@/assets/home/arrow_down.png"/>
        </div>
      </div>
      <transition name="fade">
        <div v-if="isExpanded(groupIndex)" class="table-component-group-rows">
          <div v-for="(row, index) in group.rows" class="table-component-group-row" :key="index">
            <div v-for="column in visibleColumns" class="table-component-group-cell" :key="column.field">
              {{ row[column.field] }}
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="!isGroupingActive" id="table-component-body">
      <transition-group name="flip-list" tag="div">
        <div v-for="row in sortedRows" class="table-component-body-row" :key="row.customer + row.wintactic">
          <div v-for="column in visibleColumns" class="table-component-body-cell" :key="column.field">
            {{ row[column.field] }}
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";
import {getGroupingColum} from "@/utils/table-utils";

export default {
  directives: {
    dragscroll
  },

  beforeMount() {
    this.sortedRows = JSON.parse(JSON.stringify(this.rows));
  },

  updated() {
    //Update group header width to match the width of the header
    //Update is running only when grouping is clicked and update width has not been performed
    if (this.isGroupingActive && !this.groupHeaderWidthUpdated) {
      const tableHeader = document.getElementById("table-component-header");
      const groupHeaders = document.getElementsByClassName("table-component-group-header");
      for (let i = 0; i < groupHeaders.length; i++) {
        const header = groupHeaders[i];
        header.style.width = tableHeader.scrollWidth + "px";
      }
      this.groupHeaderWidthUpdated = true;
    }
  },

  watch: {
    columns(updatedColumns) {
      this.initTable();
      const groupingColumn = getGroupingColum(updatedColumns);
      if (groupingColumn) {
        this.groupByColumn(groupingColumn)
      }
    }
  },

  props: {
    rows: Object,
    columns: Object
  },

  data: () => ({
    groupedRows: [],
    sortedRows: [],
    groupHeaderWidthUpdated: false,
    expandedGroups: [],
    isGroupingActive: false,
    shownColumFilter: null,
    sortingColumn: {
      column: null,
      sorting: null
    }
  }),

  computed: {
    visibleColumns() {
      return this.columns.filter(column => column.hidden === false);
    },
  },

  methods: {
    initTable() {
      this.groupedRows = [];
      this.isGroupingActive = false;
    },
    groupByColumn(columnField) {
      const groupedData = {};
      this.rows.forEach(obj => {
        const value = obj[columnField];
        if (!groupedData[value]) {
          groupedData[value] = {
            field: columnField,
            value: value,
            count: 0,
            rows: []
          };
        }
        groupedData[value].count++;
        groupedData[value].rows.push(obj);
      });
      for (const value in groupedData) {
        this.groupedRows.push(groupedData[value]);
      }
      this.isGroupingActive = true;
    },
    toggleExpandGroup(index) {
      const position = this.expandedGroups.indexOf(index);
      if (position === -1) {
        this.expandedGroups.push(index);
      } else {
        this.expandedGroups = this.expandedGroups.filter(element => element !== index);
      }
    },
    isExpanded(index) {
      return this.expandedGroups.indexOf(index) !== -1;
    },
    showColumnFilter(column) {
      this.shownColumFilter = column.field;
    },
    hideColumnFilter() {
      this.shownColumFilter = null;
    },
    shouldShowFilter(column) {
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

      return this.sortedRows.sort((first, second) => {
        const firstValue = first[this.sortingColumn.column];
        const secondValue = second[this.sortingColumn.column];
        if (this.sortingColumn.sorting === "asc") {
          return firstValue < secondValue ? -1 : (firstValue > secondValue ? 1 : 0);
        } else {
          return firstValue > secondValue ? -1 : (firstValue < secondValue ? 1 : 0);
        }
      });
    },
    filter(event) {
      alert("filter");
      event.stopPropagation();
    }
  }
}
</script>

<style scoped>
#table-content {
  /* Calculate high as 100vh minus headers, minus metrics, minus 3 margins */
  height: calc(100vh - 100px - 226px - 55px - 40px - 40px - 40px);
  /* Table's width should match the left margin of header's search bar */
  /* Calculate width as 60%* of total width, including left margin */
  width: calc((100% + 2 * 60px) * 0.6);
  overflow-x: hidden;
  background-color: #FFFAEB;
}

#table-content::-webkit-scrollbar {
  display: none;
}

#table-component-header {
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
  grid-template-columns: 40px 120px 40px;
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
  max-width: 120px;
  text-align: center;
}

.table-header-text-animation {
  transform: translateX(-30px);
}

.table-header-sort-image {
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-header-sort-image {
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s ease;
}

.table-header-sort-animation {
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
}

.table-component-body-cell {
  min-width: 200px;
  max-width: 200px;
  height: 50px;
  background-color: #FFFAEB;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  align-items: center;
  justify-content: center;
  display: flex;
}

.table-component-group {
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
}

.table-component-group-cell {
  min-width: 200px;
  max-width: 200px;
  height: 50px;
  background-color: #FFFAEB;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  align-items: center;
  justify-content: center;
  display: flex;
}

.fade-in-out-enter-active {
  animation: fade-in 0.25s ease;
}

.fade-in-out-leave-to {
  opacity: 0;
}

.fade-in-out-leave-active {
  transition: opacity 0.25s ease;
}

.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to {
  opacity: 0;
  height: 0;
}

.fade-enter-active {
  animation: fade-in 0.5s ease;
}

.flip-list-move {
  transition: transform 0.25s;
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