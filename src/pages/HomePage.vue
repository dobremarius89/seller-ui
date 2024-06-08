<template>
  <div id="container">
    <div id="content">
      <header-component/>
      <div id="home-cards">
        <upcoming-wintactics/>
        <strategy-card/>
        <strategy-card/>
        <customer-engaged/>
      </div>
      <div id="tables-container">
        <table-header style="grid-row: 1 / 2; grid-column: 1 / 2" @openColumnConfiguration="openColumnConfiguration"/>
        <table-component style="grid-row: 2 / 3; grid-column: 1 / 2" :columns="columns"
                         @selectRows="selectRows"
                         @openFilterConfiguration="openFilterConfiguration"/>
        <story-component style="grid-row: 1 / 3; grid-column: 2 / 3"
                         :selectedRows="selectedRows"/>
        <column-configuration v-if="isColumnConfigurationOpened"
                              :columns="columns"
                              :isColumnConfigurationOpened="isColumnConfigurationOpened"
                              @closeColumnConfiguration="closeColumnConfiguration"
                              @applyColumnConfiguration="applyColumnConfiguration"/>
        <filter-configuration v-if="isFilterConfigurationOpened"
                              :filterValues="filterValues"
                              @closeFilterConfiguration="closeFilterConfiguration"/>
      </div>
    </div>
  </div>
</template>

<script>
import UpcomingWintactics from "@/components/UpcomingWintactics.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import CustomerEngaged from "@/components/CustomerEngaged.vue";
import StrategyCard from "@/components/MetricCard.vue";
import TableComponent from "@/components/TableComponent.vue";
import TableHeader from "@/components/TableHeader.vue";
import ColumnConfiguration from "@/components/ColumnConfiguration.vue";
import FilterConfiguration from "@/components/FilterConfiguration.vue";
import StoryComponent from "@/components/StoryComponent.vue";
import eventBus from "@/config/emitter.config";

export default {
  components: {
    StoryComponent,
    FilterConfiguration,
    ColumnConfiguration,
    TableHeader,
    TableComponent,
    StrategyCard,
    CustomerEngaged,
    HeaderComponent,
    UpcomingWintactics
  },

  beforeMount() {
    document.addEventListener('click', this.closeDropdowns);
  },

  data: () => ({
    columns: [
      {
        field: "customer",
        name: "Customer",
        grouping: false,
        hidden: false
      },
      {
        field: "wintactic",
        name: "Wintactic",
        grouping: false,
        hidden: false
      },
      {
        field: "status",
        name: "Status",
        grouping: false,
        hidden: false
      },
      {
        field: "unread_comments",
        name: "Unread Comments",
        grouping: false,
        hidden: false
      },
      {
        field: "total_comments",
        name: "Total Comments",
        grouping: false,
        hidden: false
      },
      {
        field: "tags",
        name: "Tags",
        grouping: false,
        hidden: false
      },
      {
        field: "action_date",
        name: "Action Date",
        grouping: false,
        hidden: false
      },
      {
        field: "start_date",
        name: "Start Date",
        grouping: false,
        hidden: false
      },
      {
        field: "end_date",
        name: "End Date",
        grouping: false,
        hidden: false
      },
      {
        field: "strategy",
        name: "Strategy",
        grouping: false,
        hidden: false
      }
    ],
    filterValues: [],
    selectedRows: new Map(),
    isColumnConfigurationOpened: false,
    isFilterConfigurationOpened: false
  }),

  methods: {
    openColumnConfiguration() {
      this.isColumnConfigurationOpened = true;
    },
    closeColumnConfiguration() {
      this.isColumnConfigurationOpened = false;
    },
    openFilterConfiguration(filterValues) {
      this.filterValues = filterValues;
      this.isFilterConfigurationOpened = true;
    },
    closeFilterConfiguration() {
      this.isFilterConfigurationOpened = false;
    },
    applyColumnConfiguration(updatedColumns) {
      this.columns = updatedColumns;
    },
    selectRows(selectedRows) {
      this.selectedRows = selectedRows;
    },
    closeDropdowns(event) {
      const classes = new Set(event.target.classList);
      if (!classes.has("help-dropdown") && !classes.has("user-dropdown")) {
        eventBus.emit("closeHeaderDropdown");
      }
      if (!classes.has("update-dropdown")) {
        eventBus.emit("closeUpdateDropdown");
      }
      if (!classes.has("status-dropdown")) {
        eventBus.emit("closeStatusDropdown");
      }
    }
  }
}
</script>

<style>
#container {
  margin: 0 auto;
  width: 1920px;
  height: 100vh;
  background-color: lightgray;
}

#home-cards {
  margin: 40px 60px 0 60px;
  display: flex;
  justify-content: space-between;
}

#tables-container {
  margin: 40px 60px 0 60px;
  display: grid;
  /* Table's width should match the left margin of header's search bar */
  /* Calculate width as 60%* of total width, including left margin */
  grid-template-columns: calc((100% + 2 * 60px) * 0.6) calc((100% + 2 * 60px) * 0.338);
}
</style>