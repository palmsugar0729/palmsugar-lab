<template>
  <div class="container">
    <h2>图片格式转换工具</h2>

    <!-- 选择文件 -->
    <input type="file" multiple accept="image/*" @change="handleFiles" />

    <p>已选择 {{ files.length }} / 20 个文件</p>

    <!-- 格式选择 -->
    <select v-model="format">
      <option value="image/jpeg">JPG</option>
      <option value="image/png">PNG</option>
      <option value="image/webp">WEBP</option>
    </select>

    <!-- 转换按钮 -->
    <button @click="convert">开始转换</button>

    <!-- 下载 ZIP -->
    <button v-if="results.length" @click="downloadZip">一键下载 ZIP</button>

    <!-- 单个下载（保留） -->
    <ul v-if="results.length">
      <li v-for="(item, i) in results" :key="i">
        <a :href="item.url" :download="item.name">
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import JSZip from "jszip";

const files = ref<File[]>([]);
const format = ref("image/jpeg");

const results = ref<{ blob: Blob; name: string; url: string }[]>([]);

// 选择文件
const handleFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;

  files.value = Array.from(input.files).slice(0, 20);
};

// 转换
const convert = async () => {
  results.value = [];

  for (const file of files.value) {
    const img = await loadImage(file);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, format.value)
    );

    if (!blob) continue;

    const url = URL.createObjectURL(blob);
    const ext = format.value.split("/")[1];
    const name = file.name.replace(/\.\w+$/, "") + "." + ext;

    results.value.push({ blob, name, url });
  }
};

// ZIP 下载
const downloadZip = async () => {
  const zip = new JSZip();

  results.value.forEach((item) => {
    zip.file(item.name, item.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });

  const url = URL.createObjectURL(content);

  const a = document.createElement("a");
  a.href = url;
  a.download = "images.zip";
  a.click();

  URL.revokeObjectURL(url);
};

// 加载图片
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
  });
};
</script>

<style scoped>
.container {
  max-width: 520px;
  margin: 40px auto;
  text-align: center;
}

button {
  margin: 10px 5px;
  padding: 8px 16px;
}

select {
  margin-top: 10px;
}
</style>
