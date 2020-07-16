<template lang="pug">
v-app
  v-expansion-panels
    v-expansion-panel
      v-expansion-panel-header Add Dictionary
      v-expansion-panel-content
        add-dictionary
</template>

<script lang="ts">
import Vue from "vue"
import AddDictionary from "@/components/AddDictionary.vue"

export default Vue.extend({
  name: "App",
  components: { AddDictionary },
})
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
