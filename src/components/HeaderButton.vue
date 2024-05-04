<template>
  <button :class="{'clicked' : clicked}" class="button" @click="handleClick">
    <img class="image" :src="src">
    <label v-if="text" class="text">{{ text }}</label>
    <img v-if="hasArrows" :class="{'arrow-up' : clicked}" class="arrow" src="@/assets/home/arrow_down.png">
  </button>
</template>

<script>
export default {
  props: {
    clicked: Boolean,
    text: String,
    src: String,
    hasArrows: Boolean
  },

  methods: {
    handleClick() {
    }
  }
}
</script>

<style scoped>
.button {
  margin-right: 18px;
  min-width: 60px;
  height: 0;
  padding-top: 60px;
  border-radius: 30px;
  border: none;
  background-color: #F2F4F7;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s ease;
}

.image {
  scale: 65%;
  margin-top: -60px;
}

.arrow {
  scale: 65%;
  margin: -60px 10px 0 0;
  transition: transform 0.5s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

.text {
  margin: -60px 10px 0 10px;
  font-size: 18px;
  color: black;
  font-family: Inter-SemiBold, serif;
}

.button:hover {
  cursor: pointer;
  background-color: #344054
}

.clicked {
  background-color: #344054
}
</style>