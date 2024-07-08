<template>
  <div class="grid my-10 justify-items-center gap-4 w-full">
    <!-- todo add cardstack of categories, expanding on drag and adding bookmarkcards on drop -->
    <!-- todo add 'create new category card' -->
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
      class="place-self-start px-10 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      <UCard class="w-60 h-32 grid place-items-center items-center shadow-md">
        <UButton
          label="Create Category"
          variant="ghost"
          icon="i-heroicons-plus-circle-solid"
          block
          size="xl"
          class="text-xl/5 w-10 text-left"
          :ui="{
            block: 'w-full flex justify-end',
            variant: {
              ghost:
                'text-{color}-500 dark:text-{color}-400 dark:hover:bg-transparent hover:bg-transparent disabled:bg-transparent dark:disabled:bg-transparent',
            },
          }"
          @click="categoryIsOpen = true"
        />
      </UCard>
      <UCard
        v-for="category of categories"
        :key="category.name"
        class="w-60 h-32 grid items-center shadow-md"
        ><div class="flex justify-items-center gap-4 text-xl">
          <div>{{ category.icon }}</div>
          <div>{{ category.name }}</div>
        </div></UCard
      >
    </div>
    <div class="px-10 mb-4 place-items-center place-self-start">
      <UBadge
        v-for="tag of allTags"
        :label="tag"
        :key="tag"
        class="m-0.5 cursor-pointer"
        @click="addFilter(tag)"
      />
      <UBadge
        label="clear filter"
        variant="outline"
        class="cursor-pointer"
        @click="clearFilter"
      />
    </div>
    <div
      v-if="bookmarks?.length"
      class="place-self-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-10"
    >
      <UCard
        v-for="bookmark of bookmarks"
        :key="bookmark.id"
        :class="{
          hidden: hasNoActiveFilter(bookmark.tags),
        }"
        :ui="{ body: { padding: 'px-4 py-5 sm:p-2' } }"
        class="shadow-2xl relative group"
      >
        <NuxtLink :to="bookmark.url" target="_blank">
          <img
            v-if="bookmark.image !== 'no image found'"
            :src="bookmark.image"
            alt=""
            class="object-cover object-left-top aspect-1 h-64 rounded"
          />
        </NuxtLink>
        <div
          class="absolute -translate-y-7 truncate group-hover:-translate-y-8 rounded-b-lg left-0 px-2 p-2 bg-white/0 group-hover:bg-white/100 w-full opacity-0 group-hover:opacity-100 duration-500 transition ease-in-out"
        >
          {{ bookmark.title }}
        </div>
      </UCard>
    </div>
    <div v-else>
      <div class="text-center pb-4">Start adding bookmarks</div>
      <div class="flex items-center justify-center gap-1">
        <UKbd class="h-12 min-w-[48px] text-[24px]">{{ metaSymbol }}</UKbd>
        +
        <UKbd class="h-12 min-w-[48px] text-[24px]">V</UKbd>
      </div>
    </div>
    <UModal
      v-model="categoryIsOpen"
      :ui="{
        overlay: { background: 'backdrop-blur' },
        container:
          'flex min-h-full items-start sm:items-end sm:items-center justify-center text-center',
      }"
      class="top-0"
    >
      <UCard>
        <div class="grid gap-2">
          <UInput
            v-model="categoryName"
            size="xl"
            placeholder="category name..."
          />
          <UInput
            v-model="categoryIcon"
            size="xl"
            placeholder="category icon..."
          />
        </div>
        <div class="grid grid-cols-2 gap-2 pt-2">
          <UButton
            label="cancel"
            variant="outline"
            size="xl"
            block
            @click="cancelCategory"
          />
          <UButton label="save" size="xl" block @click="createCategory" />
        </div>
      </UCard>
    </UModal>
    <UModal
      v-model="isOpen"
      :ui="{
        overlay: { background: 'backdrop-blur' },
        container:
          'flex min-h-full items-start sm:items-end sm:items-center justify-center text-center',
      }"
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
          <div v-if="title" class="absolute bottom-1 left-4 truncate w-80">
            {{ title }}
          </div>
        </div>
        <div class="mb-4">
          <UBadge
            v-for="tag of splitTags(tags)"
            :label="tag"
            :key="tag"
            variant="subtle"
            class="m-0.5"
          />
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
const { metaSymbol } = useShortcuts()
const route = useRoute()
const router = useRouter()

const urlToBookmark = ref('')
const categoryName = defineModel('categoryName', { default: '' })
const categoryIcon = defineModel('categoryIcon', { default: '' })

const isOpen = ref(false)
const categoryIsOpen = ref(false)
const isLoading = ref(false)

function cancelCategory() {
  categoryIsOpen.value = false
  categoryName.value = ''
  categoryIcon.value = ''
}

async function createCategory() {
  try {
    const { message } = await $fetch('/category', {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName.value,
        icon: categoryIcon.value,
        userId: authUser.value.id,
      }),
    })

    categoryIsOpen.value = false
    await refreshCategories()
    categoryName.value = ''
    categoryIcon.value = ''
    toast.add({ title: message })
  } catch (e) {
    categoryIsOpen.value = false
    categoryName.value = ''
    categoryIcon.value = ''
    toast.add({ title: 'Error happened' })
  }
}

function clearFilter() {
  router.push({ path: route.path })
}

function addFilter(tag: string) {
  const query = { ...route.query }
  if (!query.tag?.includes(tag)) {
    query.tag = `${query.tag},${tag}`.replace(/undefined,/, '')
  }
  router.push({ path: route.path, query })
}

function hasNoActiveFilter(tags: string | null) {
  if (route.query.tag === undefined) return false
  return !splitTags(tags).some((tag: string) => route.query.tag?.includes(tag))
}

function initValues() {
  urlToBookmark.value = ''
  desc.value = ''
  title.value = ''
  image.value = ''
  errorMsg.value = ''
  tags.value = ''
}

function onCancel() {
  isOpen.value = false
  initValues()
}

const tags = ref()

function splitTags(tags: string | null) {
  if (!tags) return []
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((item) => item !== '')
}

async function getTagsAndDescriptionFromAi(
  url: string
): Promise<{ tags: string; description: string } | undefined> {
  try {
    const res = await $fetch('/t', {
      method: 'POST',
      body: JSON.stringify({
        url,
      }),
    })

    return {
      tags: res.tags,
      description: res.description,
    }
  } catch (e) {
    console.error(e)
  }
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
      const tagsAndDescription = await getTagsAndDescriptionFromAi(
        urlToBookmark.value
      )
      desc.value = tagsAndDescription?.description || ''
      tags.value = tagsAndDescription?.tags || ''
      isLoading.value = false
    }
  }
}

const { data: allTags, refresh: refreshTags } = await useFetch('/tags', {
  method: 'GET',
})

const { data: bookmarks, refresh } = await useFetch('/b', {
  method: 'GET',
})

const { data: categories, refresh: refreshCategories } = await useFetch(
  '/category',
  {
    method: 'GET',
  }
)

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
        tags: tags.value,
      }),
    })

    isOpen.value = false
    initValues()
    toast.add({ title: message })
    await refresh()
    await refreshTags()
  } catch (e) {
    isOpen.value = false
    errorMsg.value = 'Error happened'
  }
}

watch(urlToBookmark, async (NewValue) => {
  const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
  if (urlRegex.test(NewValue)) {
    isLoading.value = true
    await getUrlInfo()
    const tagsAndDescription = await getTagsAndDescriptionFromAi(
      urlToBookmark.value
    )
    desc.value = tagsAndDescription?.description || ''
    tags.value = tagsAndDescription?.tags || ''
    isLoading.value = false
  }
  console.log(NewValue)
})

onMounted(() => {
  window.addEventListener('keydown', onPaste)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onPaste)
})
</script>
