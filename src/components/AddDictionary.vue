<template lang="pug">
v-card(flat)
  v-card-text
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
        if (cols.length === 4) {
          const [fromLang, toLang] = [cols.shift()!, cols.shift()!]
          if (dict[fromLang] === undefined) dict[fromLang] = {}
          if (dict[fromLang][toLang] === undefined) dict[fromLang][toLang] = []
          dict[fromLang][toLang].push(cols)
        }
      })
      for (const [fromLang, toLangs] of Object.entries(dict)) {
        await browser.storage.local.set({ [fromLang]: toLangs })
      }
      this.loading = false
    },
  },
})
</script>
