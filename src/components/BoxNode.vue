<script setup lang="ts">
import { onMounted, ref } from 'vue'

const title = ref('')
const isEditingTitle = ref(true)
const titleInput = ref<HTMLInputElement | null>(null)

onMounted(() => titleInput.value?.focus())

function confirmTitle() {
  title.value = title.value.trim()
  isEditingTitle.value = false
}
</script>

<template>
  <div class="box-node">
    <form v-if="isEditingTitle" @submit.prevent="confirmTitle">
      <input
        ref="titleInput"
        v-model="title"
        class="title-input"
        aria-label="노드 제목"
        placeholder="제목 입력"
      />
    </form>
    <span v-else>{{ title }}</span>
  </div>
</template>

<style scoped>
.box-node {
  position: fixed;
  top: 50%;
  left: 50%;
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
}

.title-input {
  box-sizing: border-box;
  field-sizing: content;
  min-width: 0;
  max-width: 100%;
  text-align: center;
}
</style>
