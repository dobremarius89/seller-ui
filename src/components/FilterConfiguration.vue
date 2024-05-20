<template>
  <div id="filter-modal">
    <div id="filter">
      <div id="filter-title">
          <label id="filter-title-text">Filter</label>
          <input :checked="shouldCheckSelectAll()" style="margin-left: auto" type="checkbox" @input="checkOrUncheckAllValues">
          <label id="filter-select-all" @click="checkOrUncheckAllValues">Select all</label>
      </div>
      <div id="filter-search-bar">
        <input id="filter-search" v-model="searchText" placeholder="Search..." @input="searchValue"/>
      </div>
      <div v-dragscroll.y id="filter-rows">
        <transition-group name="flip-list" tag="div">
          <div v-for="value in filteredValues" :key="value">
            <div class="filter-row">
              <input :checked="shouldCheckBox(value)"
                     :value="value"
                     class="filter-checkbox"
                     @input="checkOrUncheckValue(value)"
                     type="checkbox">
              <label class="filter-row-text" @click="checkOrUncheckValue(value)">{{ value }}</label>
            </div>
          </div>
        </transition-group>
      </div>
      <div id="filter-buttons">
        <button id="button-cancel" @click="closeFilterConfiguration">Cancel</button>
        <button id="button-apply" @click="applyFilterConfiguration">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";
import eventBus from "@/config/emitter.config";

export default {
  directives: {
    dragscroll
  },

  beforeMount() {
    this.initFilterConfiguration();
  },

  props: {
    filterValues: Object
  },

  computed: {
    distinctValues() {
      return this.filterValues.values;
    },
    isAllChecked() {
      return this.selectedValues.length === this.distinctValues.length && this.selectedValues.length > 0
    }
  },

  data: () => ({
    searchText: null,
    selectedValues: [],
    updatedColumns: [],
    filteredValues: [],
  }),

  methods: {
    initFilterConfiguration() {
      this.searchText = null;
      this.filteredValues = [...this.distinctValues];
      this.selectedValues = [...this.filterValues.selected];
    },
    closeFilterConfiguration() {
      this.$emit("closeFilterConfiguration");
    },
    applyFilterConfiguration() {
      if (this.isAllChecked) {
        eventBus.emit("deleteFilterConfiguration", this.filterValues.column);
      } else {
        eventBus.emit("applyFilterConfiguration", {
          column: this.filterValues.column,
          selected: this.selectedValues,
          values: this.filterValues.values
        });
      }
      this.closeFilterConfiguration();
    },
    searchValue() {
      if (this.searchText) {
        this.filteredValues = this.distinctValues.filter(value => value.toLocaleLowerCase().startsWith(this.searchText.toLowerCase()));
      } else {
        this.filteredValues = [...this.distinctValues];
      }
    },
    checkOrUncheckAllValues() {
      if (!this.isAllChecked) {
        this.selectedValues = [...this.distinctValues];
      } else {
        this.selectedValues = [];
      }
    },
    shouldCheckBox(value) {
      return this.selectedValues.findIndex(val => val === value) !== -1;
    },
    shouldCheckSelectAll() {
      return this.isAllChecked;
    },
    checkOrUncheckValue(value) {
      const index = this.selectedValues.findIndex(val => val === value);
      if (index !== -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(value);
      }
    }
  }
}
</script>

<style scoped>
#filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1;
}

#filter {
  position: absolute;
  width: 400px;
  top: calc(50% - 200px);
  left: calc(50% - 225px);
  background-color: white;
  border: 1px solid #BAC1CC;
  border-radius: 20px;
}

#filter-title {
  align-items: center;
  border-bottom: 1px solid #D0D5DD;
  min-width: 280px;
  height: 60px;
  display: flex;
  margin: 0 20px 0 20px;
}

#filter-title-text {
  font-family: Inter-Bold, serif;
  font-size: 18px;
  color: #4B465C;
  opacity: 65%;
}

#filter-select-all {
  font-family: Inter-Regular, serif;
  font-size: 14px;
  color: #717171;
  opacity: 65%;
  user-select: none;
  margin-left: 5px;
}

#filter-search-bar {
  margin: 15px 20px 0 20px;
  background-color: #E4E4E4;
  border-radius: 20px;
  width: calc(100% - 20px - 20px);
  height: 45px;
  display: flex;
  align-items: center;
}

#filter-search {
  margin: 0 20px 0 20px;
  border: none;
  background-color: #E4E4E4;
  outline: none;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  width: 100%;
}

#filter-rows {
  margin: 15px 20px 0 20px;
  border: 1px solid #D0D5DD;
  border-radius: 20px;
  height: 200px;
  overflow-y: scroll;
  user-select: none;
}

#filter-rows::-webkit-scrollbar {
  display: none;
}

.filter-row {
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #4B465C;
  height: 50px;
  align-items: center;
  margin-left: 20px;
  display: flex;
}

.filter-row-text {
  margin-left: 10px;
  opacity: 65%;
}

#filter-buttons {
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

.flip-list-move {
  transition: transform 0.25s;
}
</style>
