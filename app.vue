<template>
  <div>
    <nav class="px-10 pb-4 pt-10">
      <ul
        class="flex flex-row justify-between items-center justify-items-center min-h-[44px]"
      >
        <li>
          <NuxtLink to="/"
            ><img src="/logo.webp" alt="logo" class="h-12"
          /></NuxtLink>
        </li>
        <li v-if="user">
          <UButton
            icon="i-heroicons-arrow-right-start-on-rectangle"
            size="xl"
            variant="outline"
            @click="logout"
            >Logout</UButton
          >
        </li>
        <li v-else>
          <UButton
            v-if="!$route.path.includes('/login')"
            icon="i-heroicons-arrow-right-start-on-rectangle"
            size="xl"
            variant="outline"
            @click="navigateTo('/login')"
            >Login</UButton
          >
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
const user = useUser()

async function logout() {
  await $fetch('/logout', {
    method: 'POST',
  })
  await navigateTo('/login')
  user.value = null
}
</script>
