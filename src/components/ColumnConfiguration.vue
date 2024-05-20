<template>
  <div id="configuration-modal">
    <div id="configuration">
      <div id="configuration-title">
        <label id="configuration-title-text">Column</label>
      </div>
      <div id="configuration-search-bar">
        <input id="configuration-search" v-model="searchText" placeholder="Search..." @input="searchColumn"/>
      </div>
      <div v-dragscroll.y id="configuration-rows">
        <transition-group name="flip-list" tag="div">
          <div v-for="column in updatedColumns" :key="column.field">
            <div v-if="column.filtered !== true"  class="configuration-row">
              {{ column.name }}
              <div class="configuration-row-images">
                <img v-if="!isGroupingColumn(column)"
                     class="image-group"
                     src="../assets/column/ungroup.png"
                     @click="groupColumn(column)">
                <img v-if="isGroupingColumn(column)"
                     class="image-group"
                     src="../assets/column/group.png"
                     @click="unGroupColumn(column)">
                <img :class="{'image-disabled' : isGroupingColumn(column) || shouldDisableMovingUp(column)}"
                     class="image-arrow" src="@/assets/common/arrow_up.png"
                     @click="shiftColumn(column, 'left')">
                <img :class="{'image-disabled' : isGroupingColumn(column) || shouldDisableMovingDown(column)}"
                     class="image-arrow" src="@/assets/common/arrow_down.png"
                     @click="shiftColumn(column, 'right')">
                <img v-if="!isHidden(column)"
                     :class="{'image-disabled' : isGroupingColumn(column)}"
                     class="image-show" src="@/assets/column/show.png"
                     @click="hideColumn(column)">
                <img v-if="isHidden(column)" class="image-show" src="@/assets/column/hide.png" @click="showColumn(column)">
              </div>
            </div>
          </div>
        </transition-group>
      </div>
      <div id="configuration-buttons">
        <button id="button-cancel" @click="closeColumnConfiguration">Cancel</button>
        <button id="button-apply" @click="applyColumnConfiguration">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";
import {getGroupingColum} from "@/utils/table-utils"
import eventBus from "@/config/emitter.config";

export default {
  directives: {
    dragscroll
  },

  beforeMount() {
    this.initColumnConfiguration();
  },

  props: {
    columns: Object
  },

  data: () => ({
    groupingColumn: String,
    searchText: null,
    hiddenColumns: [],
    updatedColumns: []
  }),

  methods: {
    initColumnConfiguration() {
      this.groupingColumn = getGroupingColum(this.columns);
      this.hiddenColumns = this.columns.filter(column => column.hidden === true)
          .map(column => column.field);
      this.updatedColumns = JSON.parse(JSON.stringify(this.columns));
      this.searchText = null;
    },
    closeColumnConfiguration() {
      this.unClickColumnButton();
      this.initColumnConfiguration();
      this.$emit("closeColumnConfiguration");
    },
    isGroupingColumn(column) {
      return this.groupingColumn === column.field;
    },
    groupColumn(column) {
      this.updatedColumns.forEach(column => column.grouping = false);
      this.groupingColumn = column.field;
      column.grouping = true;
      this.showColumn(column)
      this.moveGroupingColumnFirst();
      this.scrollToFirstColumn();
    },
    scrollToFirstColumn() {
      const configurationRows = document.getElementById("configuration-rows");
      if (configurationRows) {
        configurationRows.scrollTop = 0;
      }
    },
    unGroupColumn(column) {
      this.groupingColumn = null;
      column.grouping = false;
    },
    moveGroupingColumnFirst() {
      const index = this.updatedColumns.findIndex(column => column.grouping === true);
      if (index !== -1) {
        const [header] = this.updatedColumns.splice(index, 1);
        this.updatedColumns.unshift(header);
      }
    },
    shiftColumn(column, position) {
      const index = this.updatedColumns.findIndex(col => col.field === column.field);
      const adjacentIndex = position === "left" ? index - 1 : index + 1;
      const temp = this.updatedColumns[index];
      this.updatedColumns[index] = JSON.parse(JSON.stringify(this.updatedColumns[adjacentIndex]));
      this.updatedColumns[adjacentIndex] = JSON.parse(JSON.stringify(temp));
    },
    shouldDisableMovingUp(column) {
      const index = this.updatedColumns.findIndex(col => col.field === column.field);
      if (index === 0) {
        return true;
      } else if (index === 1 && this.updatedColumns[0].grouping === true) {
        return true;
      }
      return false;
    },
    shouldDisableMovingDown(column) {
      const index = this.updatedColumns.findIndex(col => col.field === column.field);
      return index === this.updatedColumns.length - 1;
    },
    hideColumn(column) {
      this.hiddenColumns.push(column.field);
      column.hidden = true;
    },
    showColumn(column) {
      const index =  this.hiddenColumns.indexOf(column.field);
      if (index !== -1) {
        this.hiddenColumns.splice(index, 1);
        column.hidden = false;
      }
    },
    isHidden(column) {
      return column.hidden;
    },
    applyColumnConfiguration() {
      this.unClickColumnButton();
      this.$emit("applyColumnConfiguration", this.updatedColumns);
      this.closeColumnConfiguration();
    },
    unClickColumnButton() {
      eventBus.emit("unClickColumnButton", "3");
    },
    searchColumn() {
      if (this.searchText) {
        this.updatedColumns.forEach(column => {
          column.filtered = !column.field.toLocaleLowerCase().startsWith(this.searchText.toLowerCase());
        });
      } else {
        this.updatedColumns.forEach(column => column.filtered = false);
      }
    }
  }
}
</script>

<style scoped>
#configuration-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1;
}

#configuration {
  position: absolute;
  width: 400px;
  top: calc(50% - 200px);
  left: calc(50% - 225px);
  background-color: white;
  border: 1px solid #BAC1CC;
  border-radius: 20px;
}

#configuration-title {
  align-items: center;
  border-bottom: 1px solid #D0D5DD;
  min-width: 280px;
  height: 60px;
  display: flex;
  margin: 0 20px 0 20px;
}

#configuration-title-text {
  font-family: Inter-Bold, serif;
  font-size: 18px;
  color: #4B465C;
  opacity: 65%;
}

#configuration-search-bar {
  margin: 15px 20px 0 20px;
  background-color: #E4E4E4;
  border-radius: 20px;
  width: calc(100% - 20px - 20px);
  height: 45px;
  display: flex;
  align-items: center;
}

#configuration-search {
  margin: 0 20px 0 20px;
  border: none;
  background-color: #E4E4E4;
  outline: none;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  width: 100%;
}

#configuration-rows {
  margin: 15px 20px 0 20px;
  border: 1px solid #D0D5DD;
  border-radius: 20px;
  height: 200px;
  overflow-y: scroll;
  user-select: none;
}

#configuration-rows::-webkit-scrollbar {
  display: none;
}

.configuration-row {
  font-family: Inter-Regular, serif;
  font-size: 16px;
  opacity: 65%;
  color: #4B465C;
  height: 50px;
  align-items: center;
  margin-left: 20px;
  display: flex;
}

#configuration-buttons {
  display: flex;
  justify-content: center;
  margin: 20px 0 20px 0;
}

#button-apply {
  height: 40px;
  width: 130px;
  font-size: 15px;
  font-family: Inter-SemiBold, serif;
  border-radius: 10px;
  border: 1px solid #E77722;
  background-color: #FE8325;
  color: white;
  margin-left: 20px;
  cursor: pointer;
}

#button-cancel {
  height: 40px;
  width: 130px;
  font-size: 15px;
  font-family: Inter-SemiBold, serif;
  border-radius: 10px;
  border: 1px solid #98A2B3;
  background-color: #F2F4F7;
  color: #98A2B3;
  cursor: pointer;
}

.configuration-row-images {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.image-arrow {
  margin-right: 5px;
  cursor: pointer;
}

.image-group {
  cursor: pointer;
}

.image-disabled {
  opacity: 0.25;
  cursor: default;
  pointer-events: none;
}

.image-show {
  width: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.flip-list-move {
  transition: transform 0.25s;
}
</style>
