<template>
    <div class="list_card_box article" @click="go">
      <h3>{{ article.title }}</h3>
      <p class="desc">{{ article.description }}</p>
  
      <div class="meta">
        <span>{{ article.date }}</span>
        <span v-if="article.tags?.length">#{{ article.tags.join(' #') }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import type { ArticleMeta } from '../api/recipes'
  
  const props = defineProps<{ article: ArticleMeta }>()
  const router = useRouter()
  
  const go = () => {
    router.push(`/recipes/${props.article.id}`)
  }
  </script>
  
  <style scoped lang="scss">
  .article {
    cursor: pointer;
  
    h3 {
      margin-bottom: 8px;
    }
  
    .desc {
      font-size: 14px;
      opacity: 0.7;
      margin-bottom: 12px;
    }
  
    .meta {
      font-size: 12px;
      opacity: 0.5;
      display: flex;
      justify-content: space-between;
    }
  
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
    }
  }
  </style>