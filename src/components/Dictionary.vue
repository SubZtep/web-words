<template lang="pug">
v-expansion-panels
  v-expansion-panel(v-for="(trans, lang) in dict" :key="lang")
    v-expansion-panel-header {{lang}}
    v-expansion-panel-content
      v-simple-table
        tbody
          tr(v-for="words in trans" :key="`${lang}-${words.join('-')}`")
            td(v-for="word in words" :key="`${lang}-${word}`") {{word}}
</template>

<script lang="ts">
import Vue from "vue"
import { Dict } from "@/assets/types"

export default Vue.extend({
  data() {
    return {
      dict: {},
    }
  },
  async created() {
    this.dict = (await browser.storage.local.get()) as Dict
  },
})
</script>
