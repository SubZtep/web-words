import Vue from "vue"
import App from "./App.vue"
import vuetify from "../plugins/vuetify"

new Vue({
  el: "#app",
  render: h => h(App),
  vuetify,
})
