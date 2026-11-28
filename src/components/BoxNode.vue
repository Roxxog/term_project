<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { nodeColors, nodeTitleColors, type Node, type NodeColor, type NodeTitleColor } from '../models/Node'

const props = defineProps<{ node: Node; selected: boolean }>()
const emit = defineEmits<{
  'update:draftTitle': [title: string]
  confirmTitle: []
  changeColor: [color: NodeColor]
  changeTitleColor: [color: NodeTitleColor]
  move: [x: number, y: number]
  select: []
  delete: []
}>()

const draftTitle = computed({
  get: () => props.node.draftTitle,
  set: (title: string) => emit('update:draftTitle', title),
})
const titleInput = ref<HTMLInputElement | null>(null)
const dragStart = ref<{ pointerId: number; offsetX: number; offsetY: number } | null>(null)
const isDragging = ref(false)

onMounted(() => titleInput.value?.focus())

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || dragStart.value) return
  if (!(event.currentTarget instanceof HTMLElement)) return

  event.preventDefault()
  event.currentTarget.focus()
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

  const x = event.clientX - start.offsetX
  const y = event.clientY - start.offsetY
  if (!isDragging.value && Math.hypot(x - props.node.x, y - props.node.y) < 4) return

  isDragging.value = true
  emit('move', x, y)
}

function stopDrag(event: PointerEvent) {
  if (dragStart.value?.pointerId !== event.pointerId) return

  if (event.type === 'pointerup' && !isDragging.value) emit('select')
  dragStart.value = null
  isDragging.value = false
}
</script>

<template>
  <div
    class="box-node"
    :class="{ 'box-node--dragging': isDragging, 'box-node--selected': selected }"
    :style="{
      left: `calc(50% + ${node.x}px)`,
      top: `calc(50% + ${node.y}px)`,
      backgroundColor: node.color,
    }"
    tabindex="0"
    :aria-label="node.title || '제목 없는 노드'"
    @keydown.enter.self.prevent="emit('select')"
    @pointerdown="startDrag"
    @pointermove="drag"
    @pointerup="stopDrag"
    @pointercancel="stopDrag"
    @lostpointercapture="stopDrag"
  >
    <form v-if="node.isEditingTitle" @submit.prevent="emit('confirmTitle')">
      <input
        ref="titleInput"
        v-model="draftTitle"
        class="title-input"
        aria-label="노드 제목"
        placeholder="제목 입력"
        @pointerdown.stop
        @click="emit('select')"
      />
    </form>
    <span v-else :style="{ color: node.titleColor }">{{ node.title }}</span>
    <div v-if="selected" class="node-actions" @pointerdown.stop>
      <details class="color-picker">
        <summary>
          <span class="current-color" :style="{ backgroundColor: node.color }" aria-hidden="true"></span>
          색상
        </summary>
        <div class="color-palette">
          <div class="color-group" role="group" aria-label="바탕색상">
            <span>바탕색상</span>
            <div class="color-swatches">
              <button
                v-for="color in nodeColors"
                :key="color.value"
                class="color-swatch"
                type="button"
                :style="{ backgroundColor: color.value }"
                :aria-label="color.name"
                :aria-pressed="node.color === color.value"
                :title="color.name"
                @click="emit('changeColor', color.value)"
              >
                <span v-if="node.color === color.value" aria-hidden="true">✓</span>
              </button>
            </div>
          </div>
          <div class="color-group" role="group" aria-label="제목 색상">
            <span>제목 색상</span>
            <div class="color-swatches">
              <button
                v-for="color in nodeTitleColors"
                :key="color.value"
                class="color-swatch"
                type="button"
                :style="{
                  backgroundColor: color.value,
                  color: color.value === '#171717' ? '#fff' : '#171717',
                }"
                :aria-label="color.name"
                :aria-pressed="node.titleColor === color.value"
                :title="color.name"
                @click="emit('changeTitleColor', color.value)"
              >
                <span v-if="node.titleColor === color.value" aria-hidden="true">✓</span>
              </button>
            </div>
          </div>
        </div>
      </details>
      <button type="button" aria-label="노드 삭제" @click="emit('delete')">삭제</button>
    </div>
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
  color: #171717;
  overflow-wrap: anywhere;
  text-align: center;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.box-node--dragging {
  cursor: grabbing;
}

.box-node--selected {
  z-index: 1;
  outline: 2px solid #555;
}

.node-actions {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
}

.node-actions > button,
.color-picker summary {
  box-sizing: border-box;
  padding: 0.35rem 0.5rem;
  border: 1px solid #aaa;
  border-radius: 0.25rem;
  background: #fff;
  color: #171717;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
}

.color-picker summary {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  list-style: none;
}

.color-picker summary::-webkit-details-marker {
  display: none;
}

.current-color {
  width: 0.8rem;
  height: 0.8rem;
  border: 1px solid #666;
  border-radius: 50%;
}

.color-palette {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  display: grid;
  gap: 0.5rem;
  padding: 0.375rem;
  border: 1px solid #aaa;
  border-radius: 0.25rem;
  background: #fff;
}

.color-group {
  display: grid;
  gap: 0.25rem;
  text-align: left;
}

.color-swatches {
  display: flex;
  gap: 0.25rem;
}

.color-swatch {
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 1px solid #666;
  border-radius: 0.25rem;
  color: #171717;
  cursor: pointer;
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
