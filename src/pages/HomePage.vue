<template>
  <div id="container">
    <div id="content">
      <header-component/>
      <div id="home-cards">
        <upcoming-card/>
        <strategy-card/>
        <strategy-card/>
        <engagement-card/>
      </div>
    </div>
  </div>
</template>

<script>
import UpcomingCard from "@/components/UpcomingCard.vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import EngagementCard from "@/components/EngagementCard.vue";
import StrategyCard from "@/components/MetricCard.vue";

export default {
  components: {StrategyCard, EngagementCard, HeaderComponent, UpcomingCard}
}
</script>

<style>
#container {
  margin: 0 auto;
  width: 1920px;
  height: 100vh;
  background-color: lightgray;
}

#home-cards {
  margin: 40px 60px 0 60px;
  display: flex;
  justify-content: space-between;
}
</style>