<template>
  <div id="upcoming-container">
    <div id="upcoming-content">
      <span id="upcoming-number">{{ targetValue }}</span>
      <span id="upcoming-text">Upcoming Wintactics</span>
      <div id="upcoming-due-container">
        <span id="upcoming-due-text">Due in the next 30 days</span>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import gsap from 'gsap'

export default defineComponent({
  mounted() {
    this.number = 5;
  },

  watch: {
    number(newVal) {
      gsap.to(this, { duration: 1, startingValue: Number(newVal) || 0 });
    },
  },

  computed: {
    targetValue() {
      return Math.round(this.startingValue).toString().padStart(2, '0');
    }
  },

  data: () => ({
    number: Number,
    startingValue: 99,
  }),

  methods: {
  }
})
</script>

<style scoped>
#upcoming-container {
  width: 300px;
  background-color: white;
  border-radius: 20px;
}

#upcoming-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#upcoming-number {
  margin-top: 24px;
  font-size: 64px;
  font-family: Inter-Bold, serif;
  color: #FE8325;
}

#upcoming-text {
  margin-top: 16px;
  font-size: 18px;
  font-family: Inter-Medium, serif;
  color: #5C6062;
}

#upcoming-due-container {
  height: 40px;
  background-color: #FFEDB3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin: 16px 0 32px 0;
}

#upcoming-due-text {
  font-size: 18px;
  font-family: Inter-Regular, serif;
  color: #6B5304;
  padding: 0 25px 0 25px;
}
</style>