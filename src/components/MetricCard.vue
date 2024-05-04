<template>
  <div id="strategy-container">
    <table id="strategy-content">
      <tr>
        <th class="title" style="text-align: left">Strategy</th>
        <th class="title">Total</th>
        <th/>
      </tr>
      <tr v-for="(metric, index) in metrics" :key="index">
        <td class="metric">{{ metric.name }}</td>
        <td class="total">{{ metric.total}}</td>
        <td class="bar-cell">
          <div class="bar-empty">
            <div class="bar-full" :style="{width: metric.percent + '%'}"/>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  data: () => ({
    metrics: [
      {
        "name": "Retain",
        "total": "54",
        "percent": 32
      },
      {
        "name": "Expand footprint",
        "total": "42",
        "percent": 25
      },
      {
        "name": "Acquire New Logos",
        "total": "39",
        "percent": 21
      },
      {
        name: "Improve Customer IDontKnowWhat",
        "total": "21",
        "percent": 52
      },
      {
        "name": "Pivot to aaS",
        "total": "05",
        "percent": 73
      }
    ]
  }),

  methods: {}
})
</script>

<style scoped>
#strategy-container {
  width: 600px;
  background-color: white;
  border-radius: 20px;
}

#strategy-content {
  margin: 10px 20px 10px 20px;
  border-collapse: separate;
  border-spacing: 6px;
}

.metric {
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #3C4144;
  max-width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.title {
  font-family: Inter-Medium, serif;
  font-size: 24px;
  color: #3C4144;
  padding: 5px 0 10px 0;
}

.total {
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #3C4144;
  text-align: center;
}

.bar-cell {
  width: 100%;
  height: 20px;
}

.bar-empty {
  height: 100%;
  background-color: #F8F8F8;
  border-radius: 20px;
}

.bar-full {
  width: 0;
  height: 100%;
  background-color: #FE8325;
  border-radius: 20px 0 0 20px;
}
</style>