<template>
  <div id="story-container">
    <insight-view v-if="showInsight" @closeInsight="closeInsight"/>
    <div id="story-header-container">
      <div id="story-header-tabs">
        <button :class="{'story-header-tab-active' : activeTab === 1, 'story-header-tab-inactive' : activeTab !== 1}"
                class="story-header-tab"
                style="border-radius: 30px 0 0 0"
                @click="changeTab(1)">
          Details
        </button>
        <button :class="{'story-header-tab-active' : activeTab === 2, 'story-header-tab-inactive' : activeTab !== 2}"
                class="story-header-tab"
                style="border-radius: 0 30px 0 0"
                @click="changeTab(2)">
          Collaboration
        </button>
      </div>
      <div id="functions">
        <div v-if="selectedRow"
             style="position: relative; display: inline-block;">
          <table-header-button style="width: 110px"
                               :dropdown-class="'status-dropdown'"
                               :text="selectedRow.status"
                               :has-arrows="true"
                               :clicked="clickedHeaderButton === 1"
                               @click="clickButton(1)"/>
          <status-menu v-if="clickedHeaderButton === 1"
                       :status="selectedRow.status"/>
        </div>
      </div>
    </div>
    <div v-if="selectedRow" id="story-content">
      <div id="story-content-header">
        <span class="story-content-header-cell">{{ selectedRow.wintactic }}</span>
        <span class="story-content-header-cell">{{ selectedRow.customer }}</span>
        <span class="story-content-header-cell">{{ selectedRow.end_date }}</span>
      </div>
      <div v-if="activeTab === 1"
           id="story-content-body"
           v-html="story"
           v-on:click="openInsight($event)"/>
      <div v-if="activeTab === 2" id="story-content-body"/>
    </div>
  </div>
</template>

<script>
import eventBus from "@/config/emitter.config";
import TableHeaderButton from "@/components/TableHeaderButton.vue";
import StatusMenu from "@/components/StatusMenu.vue";
import InsightView from "@/components/InsightView.vue";

export default {
  components: {InsightView, StatusMenu, TableHeaderButton},

  mounted() {
    eventBus.on("closeStatusDropdown", this.unClickButton);
  },

  beforeUnmount() {
    eventBus.off("closeStatusDropdown", this.unClickButton);
  },

  props: {
    selectedRows: Map
  },

  computed: {
    selectedRow() {
        return this.selectedRows.values().next().value;
    }
  },

  data: () => ({
    showInsight: false,
    story: "What:" +
        "<p>Position aaS Printing for Acme Inc.</p>" +
        "Why:" +
        "<p>They have <span class='link'>63 Laser 3K printers</span> coming End of Support this year " +
        "suitable to target for refresh to Laser 4.5K aaS." +
        "</br>" +
        "50% of the orders they placed with us over the past 2 years have been through leasing, suggesting preference for OpEx." +
        "High volatility in printing usage indicates they can benefit from pay- per-use model." +
        "According to marketing data, they have adopted OpEx from AWS." +
        "They operate in a low cash flow industry per HSBC analysis and can benefit from payment predictability." +
        "</br>" +
        "According to marketing data, they have adopted OpEx from AWS." +
        "</br>" +
        "They operate in a low cash flow industry per HSBC analysis and can benefit from payment predictability." +
        "</br>" +
        "According to marketing data, they have adopted OpEx from AWS." +
        "</br>" +
        "They operate in a low cash flow industry per HSBC analysis and can benefit from payment predictability.</p>" +
        "How:" +
        "</p>Refresh your memory on aaS Transition Sales Plays." +
        "</br>" +
        "Prepare customer call using the customer presentation and leveraging the Acme Inc. insights above" +
        "</br>" +
        "Engage with Tom Billings." +
        "</br>" +
        "Mark this Wintactic as Pursued to create an opportunity in Salesforce.com or dismiss the Wintactics." +
        "</br>" +
        "Mark this Wintactic as Pursued to create an opportunity in Salesforce.com or dismiss the Wintactics." +
        "</br>" +
        "Mark this Wintactic as Pursued to create an opportunity in Salesforce.com or dismiss the Wintactics.</p>",
    activeTab: 1,
    clickedHeaderButton: 0,
    possibleStatuses: new Set(["Review", "Pursue", "Dismiss"]) ,
    status: String,
    wintactic: String,
    customer: String,
    date: String
  }),

  methods: {
    changeTab(tabNumber) {
      this.activeTab = tabNumber;
    },
    clickButton(number) {
      this.clickedHeaderButton = number;
    },
    unClickButton() {
      this.clickedHeaderButton = 0;
    },
    openInsight(event) {
      const classes = new Set(event.target.classList);
      if (classes.has("link")) {
        this.showInsight = true;
      }
    },
    closeInsight() {
      this.showInsight = false;
    }
  }
}
</script>

<style scoped>
#story-container {
  margin-left: 30px;
}

#story-content {
  background-color: white;
  margin-left: auto;
}

#story-content-body {
  /* Calculate high as 100vh minus headers, minus metrics, minus 3 margins, minus padding */
  height: calc(100vh - 100px - 45px - 226px - 55px - 40px - 40px - 40px - 30px);
  padding: 30px 30px 0 30px;
  font-size: 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  font-family: Inter-Regular, serif;
}

#story-content-header {
  display: flex;
  height: 45px;
  background-color: #FE8325;
  font-family: Inter-Regular, serif;
  font-size: 16px;
  color: white;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
}

.story-content-header-cell {
  min-width: 165px;
}

.table-header-sort-image img {
  transition: all 0.5s ease;
}

#story-header-container {
  display: flex;
  background-color: white;
  border-radius: 30px 30px 0 0;
  margin-left: auto;
}

#story-header-tabs {
}

.story-header-tab {
  background-color: #FFF3E9;
  height: 55px;
  width: 140px;
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #0B1215;
  border: none;
}

.story-header-tab-inactive:hover {
  background: pink;
  cursor: pointer;
}

.story-header-tab-active {
  background-color: #FE8325;
}

#functions {
  margin-left: auto;
  margin-right: 15px;
  display: flex;
  align-items: center
}

#story-content-body >>> .link {
  text-decoration: underline;
  cursor: pointer;
}

#story-content-body >>> .link::before {
  content: url("../assets/story/logo.png");
  margin-right: 5px;
}
</style>