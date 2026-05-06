<template>
  <div class="container">
    <!-- 工具组件 -->
    <component v-if="component" :is="component" />

    <div v-else>工具不存在</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { toolList } from "../content/tool/tools";

// 手动引入所有工具组件
import ImageTool from "../views/tools/imageTools.vue";

const route = useRoute();
const id = route.params.id as string;

// 找到当前工具
const tool = computed(() => {
  return toolList.find((item) => item.id === id);
});

// 映射组件
const componentMap: Record<string, any> = {
  ImageTool,
};

// 获取当前组件
const component = computed(() => {
  if (!tool.value) return null;
  return componentMap[tool.value.component];
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
}

.desc {
  margin-bottom: 20px;
  opacity: 0.7;
}
</style>
