<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Node } from '../models/Node'

const props = defineProps<{ node: Node }>()
const emit = defineEmits<{ confirmTitle: [title: string]; move: [x: number, y: number] }>()

const draftTitle = ref(props.node.title)
const titleInput = ref<HTMLInputElement | null>(null)
const dragStart = ref<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)

onMounted(() => titleInput.value?.focus())

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || dragStart.value) return
  if (!(event.currentTarget instanceof HTMLElement)) return

  event.preventDefault()
  event.currentTarget.setPointerCapture(event.pointerId)
  dragStart.value = {
    pointerId: event.pointerId,
    offsetX: event.clientX - props.node.x,
    offsetY: event.clientY - props.node.y,
  }
}

function drag(event: PointerEvent) {
  const start = dragStart.value
  if (!start || start.pointerId !== event.pointerId) return

  emit('move', event.clientX - start.offsetX, event.clientY - start.offsetY)
}

function stopDrag(event: PointerEvent) {
  if (dragStart.value?.pointerId === event.pointerId) dragStart.value = null
}
</script>

<template>
  <div
    class="box-node"
    :class="{ 'box-node--dragging': dragStart }"
    :style="{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)` }"
    @pointerdown="startDrag"
    @pointermove="drag"
    @pointerup="stopDrag"
    @pointercancel="stopDrag"
    @lostpointercapture="stopDrag"
  >
    <form v-if="node.isEditingTitle" @submit.prevent="emit('confirmTitle', draftTitle)">
      <input
        ref="titleInput"
        v-model="draftTitle"
        class="title-input"
        aria-label="노드 제목"
        placeholder="제목 입력"
        @pointerdown.stop
      />
    </form>
    <span v-else>{{ node.title }}</span>
  </div>
</template>

<style scoped>
.box-node {
  position: fixed;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: max-content;
  min-width: min(6rem, 90vw);
  max-width: 90vw;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  background: #a0a0a0;
  overflow-wrap: anywhere;
  text-align: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.box-node--dragging {
  cursor: grabbing;
}

.title-input {
  box-sizing: border-box;
  field-sizing: content;
  min-width: 0;
  max-width: 100%;
  text-align: center;
  user-select: text;
}
</style>
