<template>
  <div class="container">
    <h1 class="title">小工具</h1>

    <div class="list">
      <ToolCard v-for="item in list" :key="item.id" :tool="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toolList, type ToolMeta } from "../content/tool/tools";
import ToolCard from "../components/ToolCard.vue";

const list: ToolMeta[] = toolList;
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 20px;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>
