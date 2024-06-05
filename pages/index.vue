<template>
  <div class="grid my-10 justify-items-center gap-4 w-full">
    <UButton
      @click="isOpen = true"
      size="xl"
      block
      class="fixed rounded-full w-16 h-16 bottom-8 right-8 sm:hidden i-heroicons-plus-circle-solid"
    />
    <div class="w-full px-10">
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
    </div>
    <div
      v-if="bookmarks?.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-10"
    >
      <UCard
        v-for="bookmark of bookmarks"
        :key="bookmark.id"
        :draggable="true"
        @dragstart="drag"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <div class="truncate max-w-[85%]">{{ bookmark.title }}</div>
            <UIcon
              name="i-heroicons-bars-2"
              class="text-xl cursor-pointer"
              @click="drag"
            />
          </div>
        </template>
        <NuxtLink :to="bookmark.url" target="_blank">
          <img
            v-if="bookmark.image !== 'no image found'"
            :src="bookmark.image"
            alt=""
            class="object-cover w-full min-h-60 max-h-60 hover:ring-4 ring-primary rounded"
          />
        </NuxtLink>
        <div class="mt-4">
          {{ bookmark.description }}
        </div>
      </UCard>
    </div>
    <UModal
      v-model="isOpen"
      :ui="{ overlay: { background: 'backdrop-blur' } }"
      class="top-0"
    >
      <UCard class="grid gap-4">
        <div v-if="image || desc || title" class="mb-2 relative">
          <img
            v-if="image"
            :src="image"
            alt=""
            class="object-cover w-full border border-neutral-500/10 min-h-60 max-h-60 rounded-lg"
          />
          <div
            v-if="title"
            class="absolute bottom-0 rounded-b-lg w-full h-8 backdrop-blur bg-black/50"
          ></div>
          <div v-if="title" class="absolute bottom-1 left-4">
            {{ title }}
          </div>
        </div>
        <UInput v-model="urlToBookmark" size="xl" :autofocusDelay="1000" />
        <div class="grid grid-cols-2 gap-2 mt-2">
          <UButton size="xl" block variant="outline" @click="onCancel"
            >Cancel</UButton
          >
          <UButton size="xl" block :loading="isLoading" @click="saveUrl"
            >Save</UButton
          >
        </div>
      </UCard>
    </UModal>
    <UNotifications />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['protected'],
})
const authUser = useAuthenticatedUser()
const toast = useToast()

const urlToBookmark = ref('')

const isOpen = ref(false)
const isLoading = ref(false)

function onCancel() {
  isOpen.value = false
  urlToBookmark.value = ''
  desc.value = ''
  title.value = ''
  image.value = ''
  errorMsg.value = ''
}

async function onPaste(event: KeyboardEvent) {
  if (
    !isOpen.value &&
    ((event.metaKey && event.key === 'v') ||
      (event.ctrlKey && event.key === 'v'))
  ) {
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
    if (urlRegex.test(await navigator.clipboard.readText())) {
      isOpen.value = true
      urlToBookmark.value = await navigator.clipboard.readText()
      image.value = ''
      desc.value = ''
      title.value = ''
      isLoading.value = true
      await getUrlInfo()
      isLoading.value = false
    }
  }
}

function drag(e: PointerEvent) {
  console.log(e)
}

const { data: bookmarks, refresh } = await useFetch('/b', {
  method: 'GET',
})

const desc = ref()
const title = ref()
const image = ref()
const errorMsg = ref('')

async function getUrlInfo() {
  try {
    const { i, d, t } = await $fetch('/c', {
      method: 'POST',
      body: JSON.stringify({
        url: urlToBookmark.value,
      }),
    })

    desc.value = d
    title.value = t
    image.value = i
  } catch (e) {
    errorMsg.value = 'Error happened'
  }
}

async function saveUrl() {
  try {
    const { message } = await $fetch('/s', {
      method: 'POST',
      body: JSON.stringify({
        url: urlToBookmark.value,
        title: title.value,
        description: desc.value,
        image: image.value,
        userId: authUser.value.id,
      }),
    })

    isOpen.value = false
    toast.add({ title: message })
    await refresh()
  } catch (e) {
    isOpen.value = false
    errorMsg.value = 'Error happened'
  }
}

onMounted(() => {
  window.addEventListener('keydown', onPaste)
  window.addEventListener('dragstart', drag)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onPaste)
})
</script>
