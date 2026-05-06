<template>
  <div class="container">
    <div class="content_box detail">
      <h1>{{ title }}</h1>
      <div class="meta">{{ date }}</div>

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

  const modules = import.meta.glob("../content/recipe/*.md", {
    query: "?raw",
    import: "default",
  });

  const path = `../content/recipe/${id}.md`;
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

  h1 {
    margin-bottom: 10px;
  }

  .meta {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 20px;
  }

  .content {
    line-height: 1.8;

    h1,
    h2,
    h3 {
      margin: 20px 0 10px;
    }

    p {
      margin: 10px 0;
    }

    ul {
      padding-left: 20px;
    }

    code {
      background: rgba(0, 0, 0, 0.05);
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
}
</style>
