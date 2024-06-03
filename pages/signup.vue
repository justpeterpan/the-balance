<script lang="ts" setup>
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const error = ref<string | null>(null)

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Must be at least 6 characters'),
})

type Schema = z.output<typeof loginSchema>

const state = reactive({
  username: '',
  password: '',
})

async function signup(e: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(e.data),
    })

    await $fetch('/login', {
      method: 'POST',
      body: JSON.stringify(e.data),
    })

    await navigateTo('/')
  } catch (err: any) {
    error.value = err.data?.me
  }
}
</script>

<template>
  <div class="grid justify-items-center items-center w-full">
    <h1 class="pb-10 italic font-serif text-2xl font-extralight">
      Create account
    </h1>
    <UForm
      :schema="loginSchema"
      :state="state"
      class="space-y-4 w-96"
      @submit="signup"
    >
      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" autocomplete />
      </UFormGroup>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </div>
</template>
