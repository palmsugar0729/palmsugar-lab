<template>
  <div class="container">
    <h1 class="title">美食食谱</h1>

    <div class="list">
      <ArticleCard v-for="item in list" :key="item.id" :article="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getArticleList, type ArticleMeta } from "@/api/recipes";
import ArticleCard from "@/components/RecipeCard.vue";

const list = ref<ArticleMeta[]>([]);

onMounted(async () => {
  list.value = await getArticleList();
});
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
