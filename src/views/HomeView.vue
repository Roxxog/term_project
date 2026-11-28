<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BoxNode from '../components/BoxNode.vue'
import { Node } from '../models/Node'

const nodes = ref<Node[]>([])
const selectedNodeId = ref<number | null>(null)
const workspace = ref<HTMLElement | null>(null)
const canvas = ref<HTMLElement | null>(null)
const viewX = ref(0)
const viewY = ref(0)
const zoom = ref(1)
const panStart = ref<{ pointerId: number; x: number; y: number } | null>(null)
const isPanning = ref(false)
const route = useRoute()
const router = useRouter()
const isNodeDetail = computed(() => route.name === 'node-detail')
const activeNode = computed(() => nodes.value.find((node) => String(node.id) === route.params.nodeId))
let nextNodeId = 1

function addNode() {
  selectedNodeId.value = null
  const node = new Node(nextNodeId++)
  node.moveTo(-viewX.value / zoom.value, -viewY.value / zoom.value)
  nodes.value.push(node)
}

function startPan(event: PointerEvent) {
  if (event.button !== 0 || panStart.value || !workspace.value) return

  workspace.value.setPointerCapture(event.pointerId)
  panStart.value = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
}

function pan(event: PointerEvent) {
  const start = panStart.value
  if (!start || start.pointerId !== event.pointerId) return

  const dx = event.clientX - start.x
  const dy = event.clientY - start.y
  if (!isPanning.value && Math.hypot(dx, dy) < 4) return

  isPanning.value = true
  viewX.value += dx
  viewY.value += dy
  start.x = event.clientX
  start.y = event.clientY
}

function stopPan(event: PointerEvent) {
  if (panStart.value?.pointerId !== event.pointerId) return

  if (event.type === 'pointerup' && !isPanning.value) finishEditingOnWorkspaceClick()
  panStart.value = null
  isPanning.value = false
}

function zoomAtCenter(event: WheelEvent) {
  if (!workspace.value || event.buttons !== 0) return

  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? workspace.value.clientHeight : 1
  const requestedZoom = zoom.value * Math.exp(-event.deltaY * unit * 0.0015)
  const nextZoom = Math.min(3, Math.max(Math.min(0.15, zoom.value), requestedZoom))
  const ratio = nextZoom / zoom.value
  viewX.value *= ratio
  viewY.value *= ratio
  zoom.value = nextZoom
}

function fitNodes() {
  if (!workspace.value || !canvas.value || !nodes.value.length) return

  const bounds = workspace.value.getBoundingClientRect()
  const origin = canvas.value.getBoundingClientRect()
  const boxes = Array.from(canvas.value.children, (element) => element.getBoundingClientRect())
  const left = Math.min(...boxes.map((box) => box.left))
  const right = Math.max(...boxes.map((box) => box.right))
  const top = Math.min(...boxes.map((box) => box.top))
  const bottom = Math.max(...boxes.map((box) => box.bottom))
  const nextZoom = Math.min(
    1,
    (bounds.width * 0.85 * zoom.value) / (right - left),
    (bounds.height * 0.7 * zoom.value) / (bottom - top),
  )
  const ratio = nextZoom / zoom.value

  viewX.value = (origin.left - (left + right) / 2) * ratio
  viewY.value = (origin.top - (top + bottom) / 2) * ratio
  zoom.value = nextZoom
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
    ref="workspace"
    class="workspace"
    :class="{ 'workspace--panning': isPanning }"
    aria-label="학습 작업 공간"
    @pointerdown.self="startPan"
    @pointermove="pan"
    @pointerup="stopPan"
    @pointercancel="stopPan"
    @lostpointercapture="stopPan"
    @wheel.prevent="zoomAtCenter"
  >
    <div class="workspace-tools">
      <button type="button" @click="addNode">노드 추가</button>
      <button type="button" :disabled="!nodes.length" @click="fitNodes">모든 노드 보기</button>
    </div>
    <div
      ref="canvas"
      class="canvas"
      :style="{ transform: `translate(${viewX}px, ${viewY}px) scale(${zoom})` }"
    >
      <BoxNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :zoom="zoom"
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
    </div>
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
  overflow: hidden;
  cursor: grab;
  touch-action: none;
}

.workspace--panning {
  cursor: grabbing;
}

.canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  pointer-events: none;
}

.workspace-tools {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
}

.workspace-tools button {
  padding: 0.5rem 0.75rem;
}
</style>
