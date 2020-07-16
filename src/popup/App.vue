<template lang="pug">
v-app
  v-toolbar.flex-grow-0
    v-tabs(v-model="tab")
      v-tab Add Dictionary
      v-tab Dictionary

  v-tabs-items(v-model="tab")
    v-tab-item
      add-dictionary
    v-tab-item
      dictionary
</template>

<script lang="ts">
import Vue from "vue"
import AddDictionary from "@/components/AddDictionary.vue"
import Dictionary from "@/components/Dictionary.vue"

export default Vue.extend({
  name: "App",
  components: { AddDictionary, Dictionary },
  data() {
    return {
      tab: 0,
    }
  },
})
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
