module.exports = {
  pages: {
    popup: {
      template: "public/browser-extension.html",
      entry: "./src/popup/main.ts",
      title: "Popup",
    },
    options: {
      template: "public/browser-extension.html",
      entry: "./src/options/main.ts",
      title: "Options",
    },
  },
  pluginOptions: {
    exports: {},
    browserExtension: {
      componentOptions: {
        background: {
          entry: "src/background.ts",
        },
        contentScripts: {
          entries: {
            "content-script": ["src/content-scripts/content-script.ts"],
          },
        },
        // include: {
        //   entry: "src/assets/web-words.css",
        // },
      },
    },
  },
}
