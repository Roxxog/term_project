<script setup lang="ts">
import { ref } from 'vue'
import BoxNode from '../components/BoxNode.vue'

const nodes = ref<{ id: number }[]>([])

function addNode() {
  nodes.value.push({ id: nodes.value.length + 1 })
}
</script>

<template>
  <main class="workspace" aria-label="학습 작업 공간">
    <button class="add-node" type="button" @click="addNode">노드 추가</button>
    <BoxNode v-for="node in nodes" :key="node.id" />
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
