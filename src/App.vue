<script setup lang="ts">
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { currentUser } from './auth'

const router = useRouter()

async function logout() {
  await signOut(auth)
  await router.push('/login')
}
</script>

<template>
  <header v-if="currentUser">
    <span>{{ currentUser.email }}</span>
    <button @click="logout">로그아웃</button>
  </header>

  <RouterView />
</template>
