<template>
  <main class="workspace" aria-label="학습 작업 공간">
    <button class="add-node" type="button" disabled>노드 추가</button>
  </main>
</template>

<style scoped>
.workspace {
  position: fixed;
  inset: 3rem 0 0;
  background: #f8f9fa;
}

.add-node {
  margin: 1rem;
  padding: 0.5rem 0.75rem;
}
</style>
