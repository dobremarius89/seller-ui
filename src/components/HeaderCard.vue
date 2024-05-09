<template>
  <div class="header-card">
    <div class="card-title">
      <p class="card-title-text">{{ title }}</p>
    </div>
    <div class="card-elements">
      <div v-for="(topic, index) in getTopicNames(topics)" :key="index">
        <transition name="fade">
        <a v-if="isMainTopic(topic) || isMainTopicSelected(topic)"
           :class="{'sub-topic' : isSubTopic(topic), 'card-element' : isMainTopic(topic)}"
           :href="getTopicUrl(topics, topic)"
           @click="expandSubTopic(topics, topic, $event)">
          <span>{{ getTopicOrSubTopicName(topic) }}</span>
          <img v-if="hasSubTopics(topics, topic)"
               :class="{'card-element-arrow-up' : isMainTopicSelected(topic)}"
               class="card-element-arrow"
               src="@/assets/home/arrow-left.png"/>
        </a>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    topics: Object
  },

  data: () => ({
    selectedTopic: String
  }),

  methods: {
    getTopicNames(topics) {
      return Object.keys(this.flattenTopics(topics));
    },
    isSubTopic(topic) {
      return topic.includes(".");
    },
    isMainTopic(topic) {
      return !this.isSubTopic(topic);
    },
    isMainTopicSelected(topic) {
      const names = topic.split('.');
      const mainTopic = names[0];
      return this.selectedTopic === mainTopic;
    },
    hasSubTopics(topics, topic) {
      return this.flattenTopics(topics)[topic] === null;
    },
    getTopicUrl(topics, topic) {
      return this.flattenTopics(topics)[topic];
    },
    expandSubTopic(topics, topic, event) {
      this.selectedTopic = topic;
      event.stopPropagation();
    },
    flattenTopics(topics) {
      let result = {};
      function traverse(obj, path = '') {
        for (let key in obj) {
          if (typeof obj[key] === 'object') {
            result[path + key] = null;
            traverse(obj[key], path + key + '.');
          } else {
            result[path + key] = obj[key];
          }
        }
      }
      traverse(topics);
      return result;
    },
    getTopicOrSubTopicName(topic) {
      const names = topic.split('.');
      return names.length > 1 ? names[1] : topic;
    }
  }
}
</script>

<style scoped>
.header-card {
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

.card-title {
  align-items: center;
  border-bottom: 1px solid #D0D5DD;
  min-width: 280px;
  height: 60px;
  display: flex;
  margin: 0 20px 0 20px;
}

.card-title-text {
  font-family: Inter-Bold, serif;
  font-size: 18px;
  color: #4B465C;
  opacity: 65%;
}

.card-elements {
  font-family: Inter-Regular, serif;
  font-size: 18px;
  color: #4B465C;
  margin: 0 20px 0 20px;
}

.card-element {
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid;
  border-bottom-color: transparent;
  color: black;
  text-decoration: none;
  cursor: pointer;
  opacity: 50%;
}

.sub-topic {
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
}

.sub-topic:hover {
  background-color: #FFF3E9;
}

.card-element:hover {
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

.fade-enter-active, .fade-leave-active {
  transition: height 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
  height: 0;
  opacity: 0;
}
</style>