<template>
  <div class="menu">
    <ul class="list-elements">
      <li v-for="status in statuses" :key="status"
          :class="{'menu-title-text' : isCurrentStatus(status)}"
          class="list-element">{{ status }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    status: Set
  },

  computed: {
    statuses() {
      const statuses = new Set();
      statuses.add(this.status);
      this.allStatuses.forEach(status => {
        if (!statuses.has(status)) {
          statuses.add(status);
        }
      });
      return statuses;
    }
  },

  data: () => ({
    allStatuses: new Set(["Dismiss", "Review", "Pursue"])
  }),

  methods: {
    isCurrentStatus(status) {
      return status === this.status;
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
  min-width: 200px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
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

.list-element:hover:not(:last-child) {
  border-bottom: 1px solid #D0D5DD;
}
</style>