<script setup lang="ts">
import { currentUser } from '../auth'
</script>

<template>
  <main>
    <h1>로그인 성공</h1>
    <p>현재 로그인한 계정: {{ currentUser?.email }}</p>
    <p>이 화면은 로그인한 사용자만 접근할 수 있습니다.</p>
  </main>
</template>
