<template>
  <div class="home container">
    <!-- 欢迎卡片 -->
    <section class="card_box hero">
      <h1>Palmsugar Lab</h1>
      <p class="subtitle">记录成长 · 分享知识 · 构建工具</p>
      <p class="desc">
        这里是我的个人频道：博客、日语学习、EJU备考、食谱与小工具集合。
      </p>
    </section>

    <!-- 模块入口 -->
    <section class="grid">
      <div class="card_box entry" @click="go('/blog')">
        <h2>📓 博客</h2>
        <p>日常记录 & 学习进展</p>
      </div>

      <div class="card_box entry" @click="go('/japanese')">
        <h2>🇯🇵 日语</h2>
        <p>干货整理 / 刷题·背单词站（DEMO）</p>
      </div>

      <div class="card_box entry" @click="go('/eju')">
        <h2>🎓 EJU</h2>
        <p>真题解析 & 模拟练习</p>
      </div>

      <div class="card_box entry" @click="go('/recipes')">
        <h2>🍳 食谱</h2>
        <p>喜欢的料理分享</p>
      </div>

      <div class="card_box entry" @click="go('/front')">
        <h2>🍳 前端小技术</h2>
        <p>展示我原创或收录的前端小技术</p>
      </div>

      <div class="card_box entry" @click="go('/tools')">
        <h2>🧰 工具</h2>
        <p>自制小工具合集</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const go = (path: string) => {
    router.push(path)
  }
</script>

<style scoped lang="scss">
.hero {
  text-align: center;

  h1 {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 16px;
    opacity: 0.7;
    margin-bottom: 12px;
  }

  .desc {
    font-size: 14px;
    opacity: 0.6;
  }
}

.grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.entry {
  cursor: pointer;
  transition: all 0.25s ease;

  h2 {
    margin-bottom: 8px;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }
}
</style>