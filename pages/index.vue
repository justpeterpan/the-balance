<template>
  <div class="grid my-10 px-10 justify-items-center gap-4 w-full">
    <div class="flex flex-row justify-between w-96">
      <UInput
        type="text"
        v-model="urlToBookmark"
        size="xl"
        class="w-72"
        placeholder="url to bookmark"
      />
      <UButton @click="submitUrl" size="xl">Submit</UButton>
    </div>
    <UAlert
      v-if="errorMsg"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      :title="errorMsg"
      @close="errorMsg = ''"
    />
    <div v-if="bookmarks?.length" class="grid grid-cols-3 gap-4">
      <UCard v-for="bookmark of bookmarks" :key="bookmark.id">
        <template #header>
          <div>{{ bookmark.title }}</div>
        </template>
        <NuxtLink :to="bookmark.url" target="_blank">
          <img
            v-if="bookmark.image !== 'no image found'"
            :src="bookmark.image"
            alt=""
            class="object-cover min-h-60 hover:ring-4 ring-primary rounded"
          />
        </NuxtLink>
        <div class="mt-4">
          {{ bookmark.description }}
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
})

const urlToBookmark = defineModel('urlToBookmark', {
  type: String,
  default: '',
})

const { data: bookmarks, refresh } = await useFetch('/b', {
  method: 'GET',
})

const desc = ref()
const title = ref()
const image = ref()
const errorMsg = ref('')

async function submitUrl() {
  try {
    const { i, d, t } = await $fetch('/c', {
      method: 'POST',
      body: JSON.stringify({ url: urlToBookmark.value }),
    })

    desc.value = d
    title.value = t
    image.value = i
    await refresh()
  } catch (e) {
    errorMsg.value = 'Error happened'
  }
}
</script>
