<template>
  <button :class="{'clicked' : clicked, 'unClicked': !clicked, [dropdownClass]: !!dropdownClass}" class="button">
    {{ text }}
    <img v-if="src" :class="{[dropdownClass]: !!dropdownClass}" class="image" :src="src">
    <img v-if="hasArrows" :class="{'arrow-up' : clicked, [dropdownClass]: !!dropdownClass}" class="arrow" src="@/assets/home/arrow_down.png">
  </button>
</template>

<script>
export default {
  props: {
    clicked: Boolean,
    text: String,
    src: String,
    hasArrows: Boolean,
    dropdownClass: String
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
  transition: background-color 0.5s ease;
}

.clicked {
  background-color: #344054
}

.unClicked:hover {
  cursor: pointer;
  background-color: #344054
}

.image {
  margin-left: 3px;
  scale: 65%;
}

.arrow {
  margin-left: auto;
  scale: 65%;
  transition: transform 0.5s ease;
}

.arrow-up {
  transform: rotate(180deg);
}
</style>