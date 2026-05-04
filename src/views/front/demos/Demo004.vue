<template>
  <div class="flip_card_container">
    <div class="flip_card" :class="{ flipped }" @click="toggle">
      <div class="face front">Front</div>
      <div class="face back">Back</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const flipped = ref(false);
const toggle = () => (flipped.value = !flipped.value);
</script>

<style scoped lang="scss">
.flip_card_container {
  width: 300px;
  height: 200px;
  perspective: 800px;
  position: relative;
}

.flip_card {
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

  &.flipped {
    transform: rotateY(180deg);
  }
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  border-radius: 10px;

  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}
</style>
