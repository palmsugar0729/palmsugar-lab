<template>
  <div class="container">
    <h1 class="title">日语学习</h1>

    <div class="exercise" @click="go('/exercise')">
      点击进入 -> 进入刷题·背单词专项页面
    </div>
    <div class="list">
      <ArticleCard
        v-for="item in list"
        :key="item.id"
        :article="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { getArticleList, type ArticleMeta } from '../api/japanese'
  import ArticleCard from '../components/JPAritcleCard.vue'
  import { useRouter } from 'vue-router'

  const list = ref<ArticleMeta[]>([])

  onMounted(async () => {
    list.value = await getArticleList()
  })

  // 点击跳转
  const router = useRouter()
  const go = (path: string) => {
    router.push(path)
  }
</script>

<style scoped lang="scss">
  .title {
    margin-bottom: 20px;
  }

  .exercise {
    min-height: 10vh;
    text-decoration: none;
    color: #ff0000;
  }

  .exercise:hover {
    text-decoration: underline;
    color: aqua;
    cursor: pointer;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
</style>