<template>
  <div id="modal">
    <div id="insight-container" :style="{width:adjustedWidth}">
      <div id="insight-title">{{ insight.title }}</div>
      <div id="insight-summary">{{ insight.summary }}</div>
      <div v-dragscroll.x id="table-container">
        <div id="table-header"
             :style="{width: shouldCenterTable ? null : adjustedWidth, justifyContent: shouldCenterTable ? 'center': null}">
          <div v-for="column in insight.columns" class="table-header-cell" :key="column.field">
            <div class="table-header-text">
              <span>{{ column.name }}</span>
            </div>
          </div>
        </div>
        <ul id="table-body" :style="{width: shouldCenterTable ? null : adjustedWidth, height: adjustedHeight}">
          <li v-for="(row, index) in insight.data" :key="row"
              :style="{width: scrollableWidth, justifyContent: shouldCenterTable ? 'center': null}">
            <div v-if="isRowInPage(index)" class="table-body-row insight-row-animation">
              <div v-for="column in insight.columns" class="table-body-cell" :key="column.field">
                {{ row[column.field] }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="insight-footer">
        <div id="insight-footer-pages">
          <img class="table-page-arrow"
               :class="{'image-disabled' : shouldDisableShiftLeft}"
               src="@/assets/story/double-arrow-left.png"
               @click="shiftAtStart()"/>
          <img class="table-page-arrow"
               :class="{'image-disabled' : shouldDisableShiftLeft}"
               src="@/assets/story/arrow-left.png"
               @click="shiftPages(-1)"/>
          <div v-for="pageNumber in pages"
               :class="{'table-page-selected' : pageNumber === this.page}"
               class="table-page"
               :key="pageNumber" @click="selectPage(pageNumber)">
            {{ pageNumber }}
          </div>
          <img class="table-page-arrow"
               :class="{'image-disabled' : shouldDisableShiftRight}"
               src="@/assets/story/arrow-right.png"
               @click="shiftPages(1)"/>
          <img class="table-page-arrow"
               :class="{'image-disabled' : shouldDisableShiftRight}"
               src="@/assets/story/double-arrow-right.png"
               @click="shiftAtEnd()"/>
        </div>
        <div style="margin-left: auto">
          <button id="button-cancel" @click="closeInsight">Cancel</button>
          <button id="button-export" @click="closeInsight">Export</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {dragscroll} from "vue-dragscroll";
import gsap from "gsap";

export default {
  directives: {
    dragscroll
  },

  mounted() {
    this.computeScrollableWidth();
    this.animateRows();
  },

  computed: {
    adjustedWidth() {
      const columns = this.insight.columns.length;
      if (columns <= this.minColumns) {
        return (this.minColumns + 1) * 200 + "px";
      } else if (columns <= this.maxColumns) {
        return columns * 200 + "px";
      } else {
        return this.maxColumns * 200 + "px";
      }
    },
    adjustedHeight() {
      /* Set width to include maxRowsPerPage */
      return 51 * this.maxRowsPerPage + "px";
    },
    shouldCenterTable() {
      return this.insight.columns.length < 3;
    },
    totalPages() {
      return Math.ceil(this.insight.data.length / this.maxRowsPerPage);
    },
    pages() {
      const endingPage = Math.min(this.totalPages, this.endingPage);
      return Array.from({length: endingPage - this.startingPage + 1}, (_, i) => this.startingPage + i);
    },
    shouldDisableShiftLeft() {
      return this.pages[0] === 1;
    },
    shouldDisableShiftRight() {
      return this.pages[this.pages.length - 1] === this.totalPages;
    }
  },

  data: () => ({
    /* If the table contains less or equal than minColumns, adjust the width of the modal and center the table */
    minColumns: 3,
    /* If the table contains more or equal than maxColumns, adjust the width of the modal */
    maxColumns: 7,
    maxRowsPerPage: 15,
    page: 1,
    startingPage: 1,
    /* Maximum number of pages to display */
    endingPage: 5,
    scrollableWidth: String,
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
          field: "ship_date",
          name: "Ship Date"
        },
        {
          field: "support_type",
          name: "Support Type"
        },
        {
          field: "ship_date",
          name: "Ship Date"
        },
        {
          field: "support_type",
          name: "Support Type"
        },
      ],
      data: [
        {
          "product_code": "YSN38621",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38632",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38623",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12854",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN918005",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38626",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38637",
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
          "product_code": "YSN12859",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN918000",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38621",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38632",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN38623",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12854",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12365",
          "product_name": "Printer 3K 1640x",
          "ship_date": "01-Jun-2005",
          "support_type": "EoL Extension",
        },
        {
          "product_code": "YSN12366",
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
    },
    computeScrollableWidth() {
      const tableHeader = document.getElementById("table-header");
      console.log(tableHeader.scrollWidth + "px");
      this.scrollableWidth = tableHeader.scrollWidth + "px"
    },
    selectPage(page) {
      if (page !== this.page) {
        this.page = page;
        /* If animation per page is wanted */
        // this.$nextTick(() => {
        //   this.animateRows();
        // });
      }
    },
    shiftPages(value) {
      this.endingPage = this.endingPage + value;
      this.startingPage = this.startingPage + value;
    },
    shiftAtEnd() {
      this.startingPage = this.totalPages + this.startingPage - this.endingPage;
      this.endingPage = this.totalPages;
    },
    shiftAtStart() {
      this.endingPage = this.endingPage - this.startingPage + 1;
      this.startingPage = 1;
    },
    isRowInPage(index) {
      return index <= (this.page * this.maxRowsPerPage - 1) && index >= (this.page - 1) * this.maxRowsPerPage;
    },
    animateRows() {
      gsap.fromTo(
          ".insight-row-animation",
          {opacity: 0},
          {opacity: 1, duration: 1, stagger: 0.05}
      );
    }
  }

}
</script>

<style scoped>
#modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1;
}

#insight-container {
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  border: 2px solid #EAECF0;
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
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.table-body-row {
  display: flex;
  user-select: none;
  border-bottom: 1px solid #D0D5DD;
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

.table-page-arrow {
  cursor: pointer;
  transition: opacity 0.3s linear;
}

.image-disabled {
  opacity: 0.25;
  cursor: default;
  pointer-events: none;
}

.table-page {
  height: 40px;
  width: 40px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: #3C4144;
  border-radius: 10px;
  transition: background-color 0.3s linear;
}

.table-page-selected {
  background-color: #FE8325;
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
  flex-direction: row;
  user-select: none;
}

#insight-footer-pages {
  margin-left: 20px;
  display: flex;
  align-items: center;
}
</style>