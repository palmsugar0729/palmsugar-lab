<template>
  <header class="header">
    <div class="inner">
      <div class="logo" @click="$router.push('/')">Palmsugar</div>
      <nav>
        <router-link to="/blog">博客</router-link>
        <router-link to="/japanese">日语</router-link>
        <router-link to="/eju">EJU</router-link>
        <router-link to="/recipes">食谱</router-link>
        <router-link to="/front">前端小技术</router-link>
        <router-link to="/tools">工具</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  backdrop-filter: blur(12px);
  background: rgba(255,255,255,0.6);
  position: sticky;
  top: 0;
  z-index: 10;
}

.inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
}

.logo {
  font-weight: bold;
  cursor: pointer;
}

nav {
  display: flex;
  gap: 18px;

  a {
    text-decoration: none;
    color: #2c3e50;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}
</style>