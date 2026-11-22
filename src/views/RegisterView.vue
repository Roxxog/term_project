<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function register() {
  errorMessage.value = ''
  loading.value = true

  try {
    await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    await router.push('/')
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '회원가입에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>회원가입</h1>

    <form @submit.prevent="register">
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
          minlength="6"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? '가입 중...' : '회원가입' }}
      </button>
    </form>

    <p v-if="errorMessage">{{ errorMessage }}</p>

    <RouterLink to="/login">로그인으로 이동</RouterLink>
  </main>
</template>
