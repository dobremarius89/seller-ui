<template>
  <div class="menu">
    <div class="menu-title">
      <p class="menu-title-text">Personal Profile</p>
    </div>
    <ul class="list-elements">
      <li class="list-element">Profile</li>
      <li class="list-element">Preferences</li>
      <li class="list-element">Logout</li>
    </ul>
  </div>
</template>

<script>
export default {
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

.list-element:hover:not(:last-child) {
  border-bottom: 1px solid #D0D5DD;
}
</style>