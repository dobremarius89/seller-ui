<template>
  <div id="configuration-modal">
    <div id="configuration">
      <div id="configuration-title">
        <p id="configuration-title-text">Filter</p>
      </div>
      <div id="configuration-search-bar">
        <input id="configuration-search" v-model="searchText" placeholder="Search..." @input="filterColumn"/>
      </div>
      <div v-dragscroll.y id="configuration-rows">
        <transition-group name="flip-list" tag="div">
          <div v-for="value in filterColumns[0].values" :key="value">
            <div class="configuration-row">
              {{ value }}
            </div>
          </div>
        </transition-group>
      </div>
      <div id="configuration-buttons">
        <button id="button-cancel" @click="closeFilterConfiguration">Cancel</button>
        <button id="button-apply" @click="applyColumnConfiguration()">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";

export default {
  directives: {
    dragscroll
  },

  beforeMount() {
    this.initColumnConfiguration();
  },

  mounted() {
    console.log(this.filterColumns);
  },

  props: {
    filterColumns: Object
  },

  data: () => ({
    searchText: null,
    filterRows: [],
    updatedColumns: []
  }),

  methods: {
    initColumnConfiguration() {
      this.searchText = null;
    },
    closeFilterConfiguration() {
      this.$emit("closeFilterConfiguration");
    },
    applyColumnConfiguration() {
      this.unClickColumnButton();
      this.$emit("applyColumnConfiguration", this.updatedColumns);
      this.closeColumnConfiguration();
    },
    filterColumn() {
      if (this.searchText) {
        this.updatedColumns.forEach(column => {
          column.filtered = !column.field.toLocaleLowerCase().startsWith(this.searchText.toLowerCase());
        });
      } else {
        this.updatedColumns.forEach(column => column.filtered = false);
      }
    },
    receiveDataOverBus(data) {
      console.log(data);
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
