<template>
  <div id="header-content">
    <div id="logo-search-bar">
      <img id="logo-image" src="@/assets/logo.png"/>
      <div id="search-bar">
        <img id="search-image" src="@/assets/home/search.png"/>
        <input id="search-input" placeholder="Search"/>
      </div>
    </div>
    <div id="buttons">
      <div style="position: relative; display: inline-block;">
        <header-button :src="require('@/assets/home/bookmark.png')"
                       :clicked="clickedHeaderButton === 1"
                       @click="clickButton(1, $event)"/>
      </div>
      <div style="position: relative; display: inline-block;">
        <header-button :src="require('@/assets/home/help.png')"
                       :clicked="clickedHeaderButton === 2"
                       @click="clickButton(2, $event)"/>
        <header-card v-if="clickedHeaderButton === 2"
                     :title="'Help'"
                     :topics="helpTopics"/>
      </div>
        <header-button :src="require('@/assets/home/notification.png')"
                       :clicked="clickedHeaderButton === 3"
                       @click="clickButton(3, $event)"/>
      <div style="position: relative; display: inline-block;">
        <header-button :src="require('@/assets/home/portrait.png')"
                       style="margin-right: 0"
                       :text="'marius.dobre.romania'"
                       :clicked="clickedHeaderButton === 4"
                       :has-arrows="true"
                       @click="clickButton(4, $event)"/>
        <header-card v-if="clickedHeaderButton === 4"
                     :title="'Personal Profile'"
                     :topics="userTopics"/>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import HeaderButton from "@/components/HeaderButton.vue";
import HeaderCard from "@/components/HeaderCard.vue";

export default defineComponent({
  components: {HeaderCard, HeaderButton},

  beforeMount() {
    document.addEventListener('click', this.unClickButton);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.unClickButton);
  },


  data: () => ({
    clickedHeaderButton: 0,
    helpTopics: {
      "Anakademy for our Anakademic users": "http://localhost/anakademy",
      "Anakademy": "http://localhost/anakademy",
      "Legal": {
        "Privacy statement": "http://localhost/privacy",
        "Security statement": "http://localhost/security",
        "Terms of use": "http://localhost/terms-of-use",
        "Participation guidelines": "http://localhost/participation",
        "Cookie preferences": "http://localhost/cookies"
      },
      "Get Support": "http://localhost/support",
      "Anakademy test": "http://localhost/anakademy",
      "Get Support right away if you really need": {
        "Terms of use for this website that i work on at this moment": "http://localhost/terms-of-use",
        "Participation guidelines1": "http://localhost/participation",
        "Cookie preferences1": "http://localhost/cookies"
      }
    },
    userTopics: {
      "Profile": "http://localhost/anakademy",
      "Preferences": "http://localhost/anakademy",
      "Logout": "http://localhost/locout"
    }
  }),

  methods: {
    clickButton(number, event) {
      this.clickedHeaderButton = number;
      event.stopPropagation();
    },
    unClickButton() {
      this.clickedHeaderButton = 0;
    }
  }
})
</script>

<style scoped>
#header-content {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background-color: white;
}

#logo-search-bar {
  margin-left: 32px;
  display: flex;
  /* Align the logo and search bar with table */
  /* 60% of the allowed width, adding table's left margin and subtracting logo's left margin */
  width: calc(60% + 60px - 32px);
}

#search-bar {
  margin-left: auto;
  height: 55px;
  width: 550px;
  border: 1px solid #D0D5DD;
  border-radius: 25px;
  display: flex;
  align-items: center;
}

#search-image {
  margin-left: 24px;
}

#search-input {
  margin: 0 24px 0 24px;
  width: 100%;
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #969696;
  border: none;
  outline: none;
}

#buttons {
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 32px;
}
</style>