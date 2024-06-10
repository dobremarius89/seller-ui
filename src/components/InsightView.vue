<template>
  <div id="insight-container" :style="{width:adjustedWidth}">
    <div id="insight-title">{{ insight.title }}</div>
    <div id="insight-summary">{{ insight.summary }}</div>
    <div v-dragscroll.x id="table-container">
      <div id="table-header" :style="{width:adjustedWidth}">
        <div v-for="column in insight.columns" class="table-header-cell" :key="column.field">
          <div class="table-header-text">
            <span>{{ column.name }}</span>
          </div>
        </div>
      </div>
      <div id="table-body" :style="{width:adjustedWidth}">
        <div v-for="row in insight.data" :key="row">
          <div class="table-body-row">
            <div v-for="column in insight.columns" class="table-body-cell" :key="column.field">
              {{ row[column.field] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="insight-footer">
      <button id="button-export" @click="closeInsight">Export</button>
      <button id="button-cancel" @click="closeInsight">Cancel</button>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";

export default {
  directives: {
    dragscroll
  },

  mounted() {

  },

  computed: {
    adjustedWidth() {
      const columns = this.insight.columns.length;
      if (columns <= 3) {
        return 3 * 200 + "px";
      } else if (columns <= 7) {
        return columns * 200 + "px";
      } else {
        return 7 * 200 + "px";
      }
    }
  },

  data: () => ({
    insight: {
      title: "3K end of support printers",
      summary: "List of printer assets for this customer purchased since 2005 and with support coming to an end in " +
          "between H1FY24 and H1 FY25. Only main units are considered for model 3K. List of printer assets for this " +
          "customer purchased since 2005 and with support coming to an end in between H1FY24 and H1 FY25. Only main " +
          "units are considered for model 3K. aaaaaaaaaaaaaaaaaaa aaaaaa aaaaaaaaaa aaaa aaaaa  aaaaaa aaaaaaa aa aaaaa aaa aaaa aaaaaa",
      columns: [
        {
          field: "product_code",
          name: "Product Code"
        },
        {
          field: "product_name",
          name: "Product Name"
        },
        {
          field: "ship_date",
          name: "Ship Date"
        },
        {
          field: "support_type",
          name: "Support Type"
        },
        {
          field: "product_code",
          name: "Product Code"
        },
        {
          field: "product_name",
          name: "Product Name"
        },
        {
          field: "ship_date",
          name: "Ship Date"
        },
        {
          field: "support_type",
          name: "Support Type"
        }
      ],
      data: [
        {
          "product_code": "YSN38625",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38633",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38628",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12857",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN918001",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38625",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38633",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38628",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12857",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN918001",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38625",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38633",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38628",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12857",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12857",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        }
      ]
    }
  }),

  methods: {
    closeInsight() {
      this.$emit("closeInsight");
    }
  }

}
</script>

<style scoped>
#insight-container {
  max-height: 1100px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  border: 2px solid #EAECF0;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

#insight-title {
  color: #124372;
  font-family: Inter-Bold, serif;
  font-size: 24px;
  padding-top: 20px;
  text-align: center;
}

#insight-summary {
  padding: 30px 30px 0 30px;
  color: #124372;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  text-align: center;
}

#table-header {
  display: flex;
}

.table-header-cell {
  min-width: 200px;
  max-width: 200px;
  height: 45px;
  background-color: #FE8325;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: black;
  display: grid;
  grid-template-columns: 1fr 25px 30px;
  grid-gap: 0;
  cursor: default;
}

.table-header-text {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  text-align: center;
}

#table-container {
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
}

#table-body {
  /* Set max width to include header and 15 rows */
  max-height: 795px;
  /* Set max width to include header and 15 rows */
  min-height: 295px;
}

.table-body-row {
  display: flex;
  user-select: none;
}

.table-body-cell {
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

#button-export {
  height: 40px;
  width: 130px;
  font-size: 15px;
  font-family: Inter-SemiBold, serif;
  border-radius: 10px;
  border: 1px solid #E77722;
  background-color: #FE8325;
  color: white;
  cursor: pointer;
  margin-right: 30px;
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
  margin-right: 20px;
}

#insight-footer {
  padding: 30px 0 30px 0;
  display: flex;
  flex-direction: row-reverse;
}
</style>