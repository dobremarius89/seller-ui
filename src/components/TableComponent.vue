<template>
  <div v-dragscroll.x id="table-content">
    <button style="display: none; height: 50px; width: 50px" @click="group('Status')"/>
    <div id="table-component-header">
      <div v-for="(column, index) in getVisibleColumns(columns)" class="table-component-header-cell" :key="index">
        {{ column.name }}
      </div>
    </div>
    <div v-for="(group, groupIndex) in groupedRows" class="table-component-group" :key="groupIndex">
      <div class="table-component-group-header" @dblclick="toggleExpandGroup(groupIndex)">
        <div class="table-component-group-name">
          <div class="table-component-group-text">{{ group.value }}</div>
          <div class="table-component-group-count">{{ group.count }}</div>
          <img :class="{'table-component-group-arrow-up' : isExpanded(groupIndex)}" class="table-component-group-arrow" src="@/assets/home/arrow_down.png"/>
        </div>
      </div>
      <transition name="fade">
        <div v-if="isExpanded(groupIndex)" class="table-component-group-rows">
          <div v-for="(row, index) in group.rows" class="table-component-group-row" :key="index">
            <div v-for="(column, index) in getVisibleColumns(columns)" class="table-component-group-cell" :key="index">
              {{ row[column.field] }}
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="!isGroupingActive" id="table-component-body">
      <div v-for="(row, index) in rows" class="table-component-body-row" :key="index">
        <div v-for="(column, index) in getVisibleColumns(columns)" class="table-component-body-cell" :key="index">
          {{ row[column.field] }}
        </div>
      </div>
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
    groupHeaderWidthUpdated: false,
    expandedGroups: [],
    isGroupingActive: false
  }),

  methods: {
    initTable() {
      this.groupedRows = [];
      this.isGroupingActive = false;
    },
    getVisibleColumns() {
      return this.columns.filter(column => column.hidden === false);
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
  align-items: center;
  justify-content: center;
  display: flex;
}

.table-component-header-cell:not(:last-child) {
  border-right: 1px solid white;
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

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>