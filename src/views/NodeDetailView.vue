<script setup lang="ts">
import { computed } from 'vue'
import type { Node } from '../models/Node'

const props = defineProps<{ node?: Node }>()

const description = computed({
  get: () => props.node?.description ?? '',
  set: (value: string) => props.node?.setDescription(value),
})
</script>

<template>
  <main class="node-detail">
    <RouterLink to="/">작업 공간으로 돌아가기</RouterLink>
    <template v-if="node">
      <h1>{{ node.title || '제목 없는 개념' }}</h1>
      <label for="node-description">개념 설명</label>
      <textarea id="node-description" v-model="description" rows="12" />
    </template>
    <p v-else>현재 작업 공간에서 이 노드를 찾을 수 없습니다.</p>
  </main>
</template>

<style scoped>
.node-detail {
  max-width: 48rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

.node-detail h1 {
  overflow-wrap: anywhere;
}

.node-detail label {
  display: block;
  margin-bottom: 0.5rem;
}

.node-detail textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 0.75rem;
  font: inherit;
  resize: vertical;
}
</style>
