import { ref } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from './firebase'

export const currentUser = ref<User | null>(null)

export const authReady = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    resolve()
  })
})