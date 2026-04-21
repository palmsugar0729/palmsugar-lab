<template>
  <div class="flip_card" @click="toggle">
    <transition name="flip" mode="out-in">
      <div v-if="!flipped" key="front" class="face">
        Front
      </div>
      <div v-else key="back" class="face">
        Back
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flipped = ref(false)
const toggle = () => (flipped.value = !flipped.value)
</script>

<style scoped lang="scss">
.flip_card {
  width: 300px;
  height: 200px;
  perspective: 800px;
  cursor: pointer;
}

.face {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* 伪3D翻转 */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.4s ease;
  transform-style: preserve-3d;
}

.flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg) scale(0.95);
}

.flip-enter-to {
  opacity: 1;
  transform: rotateY(0deg) scale(1);
}

.flip-leave-from {
  opacity: 1;
  transform: rotateY(0deg) scale(1);
}

.flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg) scale(0.95);
}
</style>