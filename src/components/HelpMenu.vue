<template>
  <div class="menu">
    <div class="menu-title">
      <p class="menu-title-text">Help</p>
    </div>
    <ul class="list-elements">
      <li class="list-element">
        <a href="localhost/anakademy">Anakademy</a>
      </li>
      <li class="list-element">
        <a href="localhost/support">Get Support</a>
      </li>
      <li class="list-element" @click="expandTopic('status', $event)">
        Legal
        <img :class="{'arrow-up' : isExpandedTopic('status')}"
             class="arrow"
             src="@/assets/home/arrow-left.png"/>
      </li>
      <transition-group name="dropdown">
        <li v-if="isExpandedTopic('status')" class="sub-list-element">
          <a href="localhost/privacy">Privacy statement</a>
        </li>
        <li v-if="isExpandedTopic('status')" class="sub-list-element">
          <a href="localhost/security">Security statement</a>
        </li>
        <li v-if="isExpandedTopic('status')" class="sub-list-element">
          <a href="localhost/terms">Terms of use</a>
        </li>
        <li v-if="isExpandedTopic('status')" class="sub-list-element">
          <a href="localhost/participation">Participation</a>
        </li>
        <li v-if="isExpandedTopic('status')" class="sub-list-element">
          <a href="localhost/cookies">Cookies preferences</a>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    expandedTopic: String
  }),

  methods: {
    expandTopic(topic, event) {
      if (this.isExpandedTopic(topic)) {
        this.expandedTopic = null;
      } else {
        this.expandedTopic = topic;
      }
      /* Disable closing the dropdown when expanding topic */
      event.stopPropagation();
    },
    isExpandedTopic(topic) {
      return this.expandedTopic === topic;
    }
  }
}
</script>

<style scoped>
.menu {
  display: block;
  position: absolute;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: white;
  border: 1px solid #D0D5DD;
  border-radius: 25px;
  min-width: 250px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%); /* Center the dropdown content horizontally */
}

.menu-title {
  align-items: center;
  border-bottom: 1px solid #D0D5DD;
  height: 60px;
  display: flex;
  margin: 0 20px 0 20px;
}

.menu-title-text {
  font-family: Inter-Bold, serif;
  font-size: 18px;
  color: #4B465C;
  opacity: 65%;
}

.list-elements {
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #4B465C;
  margin: 0 20px 0 20px;
  padding: 0;
}

.list-elements a {
  text-decoration: none;
  color: inherit;
}

.list-element {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  border-bottom-color: transparent;
  color: black;
  text-decoration: none;
  cursor: pointer;
  opacity: 50%;
  list-style-type: none;
  padding: 0;
  user-select: none;
}

.sub-list-element {
  font-size: 16px;
  color: #FE8325;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  opacity: 80%;
  padding-left: 20px;
  margin-left: 5px;
  user-select: none;
}

.sub-list-element:last-child {
  margin-bottom: 20px;
}

.sub-list-element:hover {
  background-color: #FFF3E9;
}

.list-element:hover:not(:last-child) {
  border-bottom: 1px solid #D0D5DD;
}

.arrow {
  scale: 80%;
  margin-left: auto;
  transition: transform 0.5s ease;
}

.arrow-up {
  transform: rotate(90deg);
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.25s linear;
}

.dropdown-enter-from, .dropdown-leave-to {
  height: 0;
  opacity: 0;
}
</style>