<template>
  <div id="engagement-container">
    <div id="engagement-content">
      <span id="engagement-number">{{ targetValue }}%</span>
      <span id="engagement-text">Customer Engaged</span>
      <div id="stars-container">
        <div id="stars">
          <div v-for="(number, index) in stars" :key="index">
            <img v-if="number === 1" class="star" src="@/assets/home/star_full.png">
            <img v-if="number === 0.5" class="star" src="@/assets/home/star_half.png">
            <img v-if="number === 0" class="star" src="@/assets/home/star_empty.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import gsap from "gsap";

export default defineComponent({
  mounted() {
    this.number = 98;
  },

  watch: {
    number(newVal) {
      gsap.to(this.$data, { duration: 1, startingValue: Number(newVal) || 0 });
    },
    startingValue() {
      this.fillStars()
    }
  },

  computed: {
    targetValue() {
      return Math.round(this.startingValue);
    }
  },

  data: () => ({
    stars: [],
    number: 0,
    startingValue: 0
  }),

  methods: {
    fillStars() {
      let number = this.startingValue;
      this.stars = [];
      for (let i = 0; i < 5; i++) {
        if (number >= 20) {
          this.stars.push(1);
          number -= 20;
        } else if (number >= 10) {
          this.stars.push(0.5);
          number -= 10;
        } else {
          this.stars.push(0);
        }
      }
    }
  }
})
</script>

<style scoped>
#engagement-container {
  width: 220px;
  background-color: white;
  border-radius: 20px;
}

#engagement-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#engagement-number {
  margin-top: 24px;
  font-size: 64px;
  font-family: Inter-Bold, serif;
  color: #FE8325;
}

#engagement-text {
  margin-top: 16px;
  font-size: 18px;
  font-family: Inter-Medium, serif;
  color: #5C6062;
}

#stars-container {
  height: 40px;
  background-color: #FFF9E6;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin: 16px 0 32px 0;
}

#stars {
  padding: 0 23px 0 23px;
  display: flex;
  align-items: center;
}

.star {
  scale: 80%;
  padding: 0 2px 0 2px;
}
</style>