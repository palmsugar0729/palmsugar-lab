<template>
  <div class="container">
    <div class="card-grid">
      <div
        class="card entry"
        v-for="item in list"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>

        <!-- 来源标签 -->
        <span class="tag" v-if="item.source === 'codepen'">
          CodePen
        </span>
        <span class="tag" v-else>
          自制
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { frontList } from '../../api/front'

const router = useRouter()
const list = frontList

const goDetail = (id: string) => {
  router.push(`/front/${id}`)
}
</script>

<style scoped lang="scss">
/* 卡片布局（容器） */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

/* 卡片本体 */
.card.entry {
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);

  cursor: pointer;
  transition: all 0.25s ease;

  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 18px;
    margin: 0;
  }

  p {
    font-size: 14px;
    opacity: 0.7;
    margin: 0;
  }
}

/* 标签 */
.tag {
  margin-top: 6px;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.05);
  width: fit-content;
}

/* 移动端优化 */
@media (max-width: 600px) {
  .card.entry {
    padding: 14px;
  }
}
</style>