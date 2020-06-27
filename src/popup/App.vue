<template>
  <dictionary />
</template>

<script lang="ts">
import Vue from "vue"
import Dictionary from "@/components/Dictionary.vue"

export default Vue.extend({
  name: "App",
  components: { Dictionary },
})
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
