<template>
  <div class="menu">
    <div class="menu-title">
      <p class="menu-title-text">Update</p>
    </div>
      <ul class="list-elements">
          <li class="list-element">Set action date</li>
          <li class="list-element">Tags</li>
          <li class="list-element" @click="expandTopic('status', $event)">Status
            <img :class="{'card-element-arrow-up' : isExpandedTopic('status')}"
                 class="card-element-arrow"
                 src="@/assets/home/arrow-left.png"/>
          </li>
          <transition-group name="dropdown">
            <li v-if="isExpandedTopic('status')" class="sub-list-element">Dismiss</li>
            <li v-if="isExpandedTopic('status')" class="sub-list-element">Review</li>
            <li v-if="isExpandedTopic('status')" class="sub-list-element">Pursue</li>
          </transition-group>
          <li class="list-element">Mark as read</li>
          <li class="list-element">Mark as unread</li>
          <li class="list-element">Move to archive</li>
          <li class="list-element">Move to wintactics</li>
      </ul>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    topics: Object
  },

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
  min-width: 280px;
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

  transform-origin: top;
  transition: transform .4s ease-in-out;
  overflow: hidden;
}

.sub-list-element:hover {
  background-color: #FFF3E9;
}

.list-element:hover:not(:last-child) {
  border-bottom: 1px solid #D0D5DD;
}

.card-element-arrow {
  scale: 80%;
  margin-left: auto;
  transition: transform 0.5s ease;
}

.card-element-arrow-up {
  transform: rotate(90deg);
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: height 0.25s linear;
}

.dropdown-enter-from, .dropdown-leave-to {
  height: 0;
}
</style>