<template>
    <div class="container">
      <div class="content_box detail" v-if="item">
        <h1>{{ item.title }}</h1>
        <p>{{ item.description }}</p>
  
        <!-- 来源 -->
        <p v-if="item.source === 'codepen'">
          来源：
          <a :href="item.origin" target="_blank">查看原始作品</a>
        </p>
  
        <!-- 👇 这里就是 demo -->
        <component :is="demoComponent" v-if="demoComponent" />
      </div>
    </div>
</template>
  
<script setup lang="ts">
    import { useRoute } from 'vue-router'
    import { defineAsyncComponent, computed } from 'vue'
    import { frontList } from '../../api/front'

    const route = useRoute()

    const item = computed(() =>
      frontList.find(i => i.id === route.params.id)
    )

    const demoComponent = computed(() => {
      if (!item.value) return null

      return defineAsyncComponent(() =>
        import(`./demos/Demo${item.value!.id}.vue`)
      )
    })
</script>
  
<style scoped lang="scss">
  .detail {
    max-width: 900px;
    margin: 0 auto;
  }
  .desc {
    margin-bottom: 20px;
    opacity: 0.7;
  }
  .preview {
    width: 100%;
    height: 400px;
    border: none;
    border-radius: 10px;
  }
  .code {
    margin-top: 20px;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
  }
  .render {
    margin-top: 20px;
  }
</style>