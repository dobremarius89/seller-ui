<template>
  <div v-dragscroll.x id="table-content">
    <button style="height: 50px; width: 50px" @click="group('Status')"/>
    <div id="table-component-header">
      <div v-for="(column, index) in rearrangedColumns" class="table-component-header-cell" :key="index">
        {{ column.headerName }}
      </div>
    </div>
    <div v-for="(group, groupIndex) in groupedRows" class="table-component-group" :key="groupIndex">
      <div class="table-component-group-header" @click="toggleExpandGroup(groupIndex)">
        <div class="table-component-group-name">
          <div class="table-component-group-text">{{ group.value }}</div>
          <div class="table-component-group-count">
            {{ group.count }}
          </div>
          <img :class="{'table-component-group-arrow-up' : isExpanded(groupIndex)}" class="table-component-group-arrow" src="@/assets/home/arrow_down.png"/>
        </div>
      </div>
      <div v-if="isExpanded(groupIndex)" class="table-component-group-rows">
        <div v-for="(row, index) in group.rows" class="table-component-group-row" :key="index">
          <div v-for="(column, index) in rearrangedColumns" class="table-component-group-cell" :key="index">
            {{ row[column.field] }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isGroupingActive" id="table-component-body">
      <div v-for="(row, index) in rows" class="table-component-body-row" :key="index">
        <div v-for="(column, index) in rearrangedColumns" class="table-component-body-cell" :key="index">
          {{ row[column.field] }}
        </div>
      </div>
    </div>
  </div>
  <div id="table-contentX" style="height: 500px; visibility: hidden" class="ag-theme-quartz"
       @mouseup="stopScrolling"
       @mousedown="startScrolling"/>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {createGrid} from "ag-grid-community";
import {dragscroll} from "vue-dragscroll";

export default {
  directives: {
    dragscroll
  },

  mounted() {
    this.gridApi = createGrid(document.getElementById("table-contentX"), this.getGridOptions());

    //Deep clone to keep the original data intact
    // this.groupedRows = JSON.parse(JSON.stringify(this.rows));
    this.rearrangedColumns = JSON.parse(JSON.stringify(this.columns));
  },

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
    groupedRows: [],
    columns: [
      {
        field: "customer",
        headerName: "Customer"
      },
      {
        field: "wintactic",
        headerName: "Wintactic"
      },
      {
        field: "status",
        headerName: "Status"
      },
      {
        field: "tags",
        headerName: "Tags"
      },
      {
        field: "action_date",
        headerName: "Action Date"
      },
      {
        field: "start_date",
        headerName: "Start Date"
      },
      {
        field: "end_date",
        headerName: "End Date"
      },
      {
        field: "strategy",
        headerName: "Strategy"
      },
      {
        field: "unread_comments",
        headerName: "Unread Comments"
      },
      {
        field: "total_comments",
        headerName: "Total Comments"
      }
    ],
    rearrangedColumns: [],
    expandedGroups: [],
    isGroupingActive: false,
    isScrollingActive: false,
    gridApi: Object,
  }),

  methods: {
    startScrolling(event) {
      if (event.button === 0) {
        this.isScrollingActive = true;
      }
    },
    stopScrolling(event) {
      if (event.button === 0) {
        this.isScrollingActive = false
      }
    },
    handleScrolling(node, column) {
      if (this.isScrollingActive) {
        // this.gridApi.ensureNodeVisible(node, 'middle');
        this.gridApi.ensureColumnVisible(column, 'middle');
      }
    },
    getGridOptions() {
      return {
        autoGroupColumnDef: {
          minWidth: 200,
        },
        groupDisplayType: "groupRows",
        columnDefs: [
          {
            field: "customer",
            headerName: "Customer",
            rowGroup: true
          },
          {
            field: "wintactic",
            headerName: "Wintactic"
          },
          {
            field: "status",
            headerName: "Status"
          },
          {
            field: "tags",
            headerName: "Tags"
          },
          {
            field: "action_date",
            headerName: "Action Date"
          },
          {
            field: "start_date",
            headerName: "Start Date"
          },
          {
            field: "end_date",
            headerName: "End Date"
          },
          {
            field: "strategy",
            headerName: "Strategy"
          },
          {
            field: "unread_comments",
            headerName: "Unread Comments"
          },
          {
            field: "total_comments",
            headerName: "Total Comments"
          }
        ],
        rowData: [
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
        ]
        // onCellMouseDown: params => this.handleScrolling(params.node, params.column),
        // onCellMouseOver: params => this.handleScrolling(params.node, params.column)
      }
    },
    group(column) {
      const index = this.rearrangedColumns.findIndex(obj => obj.headerName === column);
      if (index >= 1) {
        const [header] = this.rearrangedColumns.splice(index, 1);
        this.rearrangedColumns.unshift(header);
      }

      this.regroup("status")
      this.isGroupingActive = true;
    },
    regroup(field) {
      const groupedData = {};
      this.rows.forEach(obj => {
        const value = obj[field];
        if (!groupedData[value]) {
          groupedData[value] = {
            field: field,
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
  height: 600px;
  overflow-x: hidden;
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

.ag-theme-quartz {
  --ag-font-size: 15px;
  --ag-font-family: Inter-Regular;

  --ag-header-foreground-color: white;
  --ag-header-background-color: #FE8325;
  --ag-header-column-resize-handle-height: 100%;
  --ag-header-column-resize-handle-width: 1px;
  --ag-header-column-resize-handle-color: white;


  --ag-borders: none;
  --ag-row-border-style: none;
  --ag-wrapper-border-radius: 0;
  --ag-range-selection-border-color: transparent;
}

:deep .ag-body-horizontal-scroll-viewport {
  /*overflow-x: hidden /* disable horizontal scroll bar */
}

:deep .ag-body-vertical-scroll-viewport {
  /*overflow-y: hidden /* disable vertical scroll bar */
}


</style>