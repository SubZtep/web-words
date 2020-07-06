<template>
  <div>
    <div v-if="!loading">
      <p>{{ pasteDictionary }}</p>
      <textarea ref="txt"></textarea>
      <button @click="saveDict()">{{ saveDictionary }}</button>
    </div>
    <div v-else>
      <p>{{ loadingText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Dict } from "@/assets/types"

export default Vue.extend({
  name: "Dictionary",
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
    }
  },
  methods: {
    async saveDict() {
      this.loading = true
      const { value } = this.$refs["txt"] as HTMLTextAreaElement

      const dict: Dict = {}
      value.split("\n").forEach(row => {
        const cols = row.split("\t")
        const key = cols.shift() + "-" + cols.shift()
        if (dict[key] === undefined) {
          dict[key] = []
        }
        dict[key].push(cols)
      })

      for (const [key, words] of Object.entries(dict)) {
        await browser.storage.local.set({ [key]: words })
      }

      this.loading = false
    },
  },
})
</script>

<style scoped>
p {
  font-size: 20px;
}
textarea {
  width: 80%;
  height: 120px;
}
</style>
