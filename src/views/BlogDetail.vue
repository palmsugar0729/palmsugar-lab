<template>
  <div class="container">
    <div class="content_box detail">
      <div class="content markdown-body" v-html="html"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";

const route = useRoute();

const html = ref("");
const title = ref("");
const date = ref("");

onMounted(async () => {
  const id = route.params.id as string;

  const modules = import.meta.glob("../content/blog/*.md", {
    query: "?raw",
    import: "default",
  });

  const path = `../content/blog/${id}.md`;
  const loader = modules[path];

  if (!loader) {
    html.value = "<p>文章不存在</p>";
    return;
  }

  const content = (await loader()) as string;

  // 解析 frontmatter
  const match = content.match(/---([\s\S]*?)---/);

  let body = content;

  if (match) {
    const meta = match[1];

    const titleMatch = meta.match(/title:\s*(.*)/);
    const dateMatch = meta.match(/date:\s*(.*)/);

    title.value = titleMatch ? titleMatch[1] : "";
    date.value = dateMatch ? dateMatch[1] : "";

    body = content.replace(match[0], "");
  }
  const result = marked(body);
  html.value = typeof result === "string" ? result : "";
});
</script>

<style scoped lang="scss">
.detail {
  max-width: 800px;
  margin: 0 auto;

  .meta {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 20px;
  }

  .content {
    line-height: 1.8;
  }
}
</style>
