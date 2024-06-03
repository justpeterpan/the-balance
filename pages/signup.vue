<script lang="ts" setup>
const error = ref<string | null>(null)

async function signup(e: Event) {
  try {
    await $fetch('/signup', {
      method: 'POST',
      body: new FormData(e.target as HTMLFormElement),
    })
    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.me
  }
}
</script>

<template>
  <div>
    <h1>Create account</h1>
    <form method="post" action="/login" @submit.prevent="signup">
      <label for="username">Username</label>
      <input type="text" name="username" id="username" />
      <br />
      <label for="password">Password</label>
      <input type="password" name="password" id="password" />
      <br />
      <button>Continue</button>
      <p v-if="error">{{ error }}</p>
    </form>
    <NuxtLink to="/login">Sign in</NuxtLink>
  </div>
</template>
