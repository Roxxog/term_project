<script setup lang="ts">
import { ref } from 'vue'
import BoxNode from '../components/BoxNode.vue'
import { Node } from '../models/Node'

const nodes = ref<Node[]>([])
const selectedNodeId = ref<number | null>(null)
let nextNodeId = 1

function addNode() {
  selectedNodeId.value = null
  nodes.value.push(new Node(nextNodeId++))
}

function deleteNode(id: number) {
  nodes.value = nodes.value.filter((node) => node.id !== id)
  if (selectedNodeId.value === id) selectedNodeId.value = null
}
</script>

<template>
  <main class="workspace" aria-label="학습 작업 공간" @click.self="selectedNodeId = null">
    <button class="add-node" type="button" @click="addNode">노드 추가</button>
    <BoxNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :selected="selectedNodeId === node.id"
      @select="selectedNodeId = node.id"
      @delete="deleteNode(node.id)"
      @confirm-title="node.confirmTitle($event)"
      @move="(x, y) => node.moveTo(x, y)"
    />
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
