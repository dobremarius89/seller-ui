<template>
  <div id="container">
    <div id="content">
      <header-component/>
      <div id="home-cards">
        <upcoming-card/>
        <strategy-card/>
        <strategy-card/>
        <engagement-card/>
      </div>
      <div id="tables-container">
        <table-header @openColumnConfiguration="openColumnConfiguration"/>
        <table-component :columns="columns"
                         :rows="rows"
                         :filterValues="filterValues"
                         @openFilterConfiguration="openFilterConfiguration"/>
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
import UpcomingCard from "@/components/UpcomingCard.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import EngagementCard from "@/components/EngagementCard.vue";
import StrategyCard from "@/components/MetricCard.vue";
import TableComponent from "@/components/TableComponent.vue";
import TableHeader from "@/components/TableHeader.vue";
import ColumnConfiguration from "@/components/ColumnConfiguration.vue";
import FilterConfiguration from "@/components/FilterConfiguration.vue";

export default {
  components: {
    FilterConfiguration,
    ColumnConfiguration,
    TableHeader, TableComponent, StrategyCard, EngagementCard, HeaderComponent, UpcomingCard},

  data: () => ({
    rows: [
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
      //todo use event bus and send columns to table component directly
      this.columns = JSON.parse(JSON.stringify(updatedColumns));
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
}
</style>