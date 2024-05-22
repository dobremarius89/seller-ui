<template>
  <div id="table-header-container">
    <div id="table-tabs">
      <button :class="{'table-tab-active' : activeTab === 1, 'table-tab-inactive' : activeTab !== 1}"
              class="table-tab"
              style="border-radius: 30px 0 0 0"
              @click="changeTab(1)">
        Wintactics
      </button>
      <button :class="{'table-tab-active' : activeTab === 2, 'table-tab-inactive' : activeTab !== 2}"
              class="table-tab"
              style="border-radius: 0 30px 0 0"
              @click="changeTab(2)">
        Archive
      </button>
    </div>
    <div id="functions">
      <div style="position: relative; display: inline-block;">
        <table-header-button :text="'Update'"
                             :has-arrows="true"
                             :clicked="clickedHeaderButton === 1"
                             @click="clickButton(1, $event)"/>
        <update-menu v-if="clickedHeaderButton === 1"/>
      </div>
      <div style="position: relative; display: inline-block;">
        <table-header-button :text="'Export'"
                             :src="require('@/assets/home/download.png')"
                             :clicked="clickedHeaderButton === 2"
                             @click="clickButton(2, $event)"/>
        <export-menu v-if="clickedHeaderButton === 2"/>
      </div>
      <table-header-button :text="'Column'"
                           :clicked="clickedHeaderButton === 3"
                           @click="openColumnConfiguration()"/>
      <table-header-button :text="'Clear Filter'"
                           :clicked="clickedHeaderButton === 4"
                           @click="clearAllFilters()"/>
    </div>
  </div>
</template>

<script>
import TableHeaderButton from "@/components/TableHeaderButton.vue";
import eventBus from "@/config/emitter.config";
import UpdateMenu from "@/components/UpdateMenu.vue";
import ExportMenu from "@/components/ExportMenu.vue";

export default {
  components: {ExportMenu, UpdateMenu, TableHeaderButton},

  beforeMount() {
    document.addEventListener('click', this.unClickButtonOverListener);
  },

  mounted() {
    eventBus.on("unClickColumnButton", this.unClickButtonOverBus);
    eventBus.on("closeNonHeaderDropdowns", this.unClickButtonOverBus);
  },

  beforeUnmount() {
    eventBus.off("unClickColumnButton", this.unClickButtonOverBus);
    eventBus.off("closeNonHeaderDropdowns", this.unClickButtonOverBus);
    document.removeEventListener('click', this.unClickButtonOverListener);
  },

  data: () => ({
    activeTab: 1,
    clickedHeaderButton: 0
  }),

  methods: {
    changeTab(tabNumber) {
      this.activeTab = tabNumber;
    },
    clickButton(number, event) {
      this.clickedHeaderButton = number;
      eventBus.emit("closeNonTableDropdowns")
      event.stopPropagation();
    },
    unClickButtonOverBus() {
      this.clickedHeaderButton = 0;
    },
    unClickButtonOverListener() {
      if (this.clickedHeaderButton !== 3) {
        this.clickedHeaderButton = 0;
      }
    },
    openColumnConfiguration() {
      this.clickedHeaderButton = 3;
      this.$emit("openColumnConfiguration");
    },
    clearAllFilters() {
      eventBus.emit("clearFilterConfiguration");
    }
  }
}
</script>

<style>
#table-header-container {
  display: flex;
  background-color: white;
  border-radius: 30px 30px 0 0;
  /* Table's header width should match width of the table */
  width: calc((100% + 2 * 60px) * 0.6);
}

#table-tabs {
}

.table-tab {
  background-color: #FFF3E9;
  height: 55px;
  width: 200px;
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #0B1215;
  border: none;
}

.table-tab-inactive:hover {
  background: pink;
  cursor: pointer;
}

.table-tab-active {
  background-color: #FE8325;
}

#functions {
  margin-left: auto;
  margin-right: 15px;
  display: flex;
  align-items: center
}
</style>