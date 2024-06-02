<template>
  <div class="grid m-10 gap-4 w-96">
    <div class="flex flex-row justify-between">
      <UInput
        type="text"
        v-model="urlToBookmark"
        size="xl"
        class="w-72"
        placeholder="url to bookmark"
      />
      <UButton @click="submitUrl" size="xl">Submit</UButton>
    </div>
    <UCard v-if="desc && image">
      <template #header>
        <div>{{ title }}</div>
      </template>
      <img :src="image" alt="" />
      <template #footer>
        {{ desc }}
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const urlToBookmark = defineModel('urlToBookmark', {
  type: String,
  default: '',
})

const desc = ref()
const title = ref()
const image = ref()

async function submitUrl() {
  const { i, d, t } = await $fetch('/c', {
    method: 'POST',
    body: JSON.stringify({ url: urlToBookmark.value }),
  })

  desc.value = d
  title.value = t
  image.value = i
}
</script>
