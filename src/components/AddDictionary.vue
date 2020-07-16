<template lang="pug">
  div
    div(v-if="!loading")
      .body-1 {{ pasteDictionary }}
      v-textarea(outlined full-width v-model="txt")
      v-btn(block color="primary" @click="saveDict()") {{ saveDictionary }}
    div(v-else)
      | {{ loadingText }}
</template>

<script lang="ts">
import Vue from "vue"
import { Dict } from "@/assets/types"

export default Vue.extend({
  mounted() {
    browser.runtime.sendMessage({})
  },
  computed: {
    pasteDictionary() {
      return browser.i18n.getMessage("pasteDictionary")
    },
    saveDictionary() {
      return browser.i18n.getMessage("saveDictionary")
    },
    loadingText() {
      return browser.i18n.getMessage("loading")
    },
  },
  data() {
    return {
      loading: false,
      txt: "",
    }
  },
  methods: {
    async saveDict() {
      this.loading = true
      const dict: Dict = {}
      this.txt.split("\n").forEach(row => {
        const cols = row.split("\t").map(col => col.trim().toLowerCase())
        const key = cols.shift() + "-" + cols.shift()
        if (/.+-.+/.test(key)) {
          if (dict[key] === undefined) {
            dict[key] = []
          }
          dict[key].push(cols)
        }
      })
      for (const [langs, words] of Object.entries(dict)) {
        const obj = {} as { [key: string]: string[][] }
        obj[`dict-${langs}`] = words
        await browser.storage.local.set(obj)
      }
      this.loading = false
    },
  },
})
</script>
