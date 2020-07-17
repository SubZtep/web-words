<template lang="pug">
v-expansion-panels
  template(v-for="(toLangs, fromLang) in dict")
    v-expansion-panel(v-for="(trans, toLang) in toLangs" :key="`${fromLang}-${toLang}`")
      v-expansion-panel-header {{fromLang}} - {{toLang}}
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
