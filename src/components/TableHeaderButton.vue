<template>
  <button :class="{'clicked' : clicked, 'unClicked': !clicked}" class="button" @click="handleClick">
    {{ text }}
    <img v-if="src" class="image" :src="src">
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
  background-color: white;
  border: 1px solid #D0D5DD;
  border-radius: 30px;
  height: 40px;
  font-size: 18px;
  font-family: Inter-Regular, serif;
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
  padding: 0 10px 0 10px;
}

.clicked {
  background-color: lightgray;
}

.unClicked:hover {
  background-color: lightgray;
}

.image {
  margin-left: 3px;
  scale: 65%;
}

.arrow {
  margin-left: 3px;
  scale: 65%;
  transition: transform 0.5s ease;
}

.arrow-up {
  transform: rotate(180deg);
}
</style>