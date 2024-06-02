<template>
  <div class="flex flex-row gap-2 m-10">
    <UInput type="text" v-model="urlToBookmark" />
    <UButton @click="submitUrl">Submit</UButton>
  </div>
</template>

<script lang="ts" setup>
const urlToBookmark = defineModel('urlToBookmark', {
  type: String,
  default: '',
})

async function submitUrl() {
  await $fetch('/c', {
    method: 'POST',
    body: JSON.stringify({ url: urlToBookmark.value }),
  })
}
</script>
