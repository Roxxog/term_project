<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BoxNode from '../components/BoxNode.vue'
import { Node } from '../models/Node'

const nodes = ref<Node[]>([])
const selectedNodeId = ref<number | null>(null)
const route = useRoute()
const router = useRouter()
const isNodeDetail = computed(() => route.name === 'node-detail')
const activeNode = computed(() => nodes.value.find((node) => String(node.id) === route.params.nodeId))
let nextNodeId = 1

function addNode() {
  selectedNodeId.value = null
  nodes.value.push(new Node(nextNodeId++))
}

function deleteNode(id: number) {
  nodes.value = nodes.value.filter((node) => node.id !== id)
  if (selectedNodeId.value === id) selectedNodeId.value = null
}

function finishEditingOnWorkspaceClick() {
  for (const node of nodes.value) {
    node.confirmTitle()
  }
  selectedNodeId.value = null
}

function openNode(node: Node) {
  finishEditingOnWorkspaceClick()
  void router.push({ name: 'node-detail', params: { nodeId: node.id } })
}
</script>

<template>
  <main
    v-show="!isNodeDetail"
    class="workspace"
    aria-label="학습 작업 공간"
    @click.self="finishEditingOnWorkspaceClick"
  >
    <button class="add-node" type="button" @click="addNode">노드 추가</button>
    <BoxNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :selected="selectedNodeId === node.id"
      @select="selectedNodeId = node.id"
      @open="openNode(node)"
      @delete="deleteNode(node.id)"
      @update:draft-title="node.draftTitle = $event"
      @edit-title="node.startTitleEditing()"
      @confirm-title="node.confirmTitle()"
      @change-color="node.setColor($event)"
      @change-title-color="node.setTitleColor($event)"
      @move="(x, y) => node.moveTo(x, y)"
    />
  </main>
  <RouterView v-slot="{ Component }">
    <component :is="Component" v-if="Component" :node="activeNode" />
  </RouterView>
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
