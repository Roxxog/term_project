<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function login() {
  errorMessage.value = ''
  loading.value = true

  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    await router.push('/')
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>로그인</h1>

    <form @submit.prevent="login">
      <div>
        <label for="email">이메일</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>

      <div>
        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <RouterLink to="/register">회원가입으로 이동</RouterLink>
  </main>
</template>
