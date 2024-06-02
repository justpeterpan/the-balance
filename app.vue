<template>
  <div class="fle">
    <input type="text" v-model="urlToBookmark" />
  </div>
</template>

<script lang="ts" setup>
const urlToBookmark = defineModel('urlToBookmark', {
  type: String,
  default: '',
})

async function submitUrl() {
  await $fetch('http://localhost:3000/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ url: urlToBookmark.value }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
</script>
