/* eslint-disable @typescript-eslint/no-empty-function */
import { shallowMount } from "@vue/test-utils"
import AddDictionary from "@/components/AddDictionary.vue"
import Vue from "vue"
import Vuetify from "vuetify"

Vue.use(Vuetify)

globalThis.browser = {
  runtime: {
    // @ts-ignore
    sendMessage: () => {},
  },
  i18n: {
    // @ts-ignore
    getMessage: () => {},
  },
}

describe("AddDictionary.vue", () => {
  const vuetify = new Vuetify()

  it("exists", () => {
    const wrapper = shallowMount(AddDictionary, { vuetify })
    expect(wrapper).toBeDefined()
  })
})
