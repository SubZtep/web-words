# Web Words :construction: _browser extension_

Show translated words on webpages with _Google Translate_ saved phrases on a tooltip.

:information_source: [HOWTO Save Google Translation History](https://support.google.com/translate/answer/9729699)


```bash
# Project setup
npm install

# Compiles and watch for development
npm run dev

# Compiles and minifies for production
npm run build

# Run your unit tests
npm run test

# Lints and fixes files
npm run lint
npm run lint-fix

# Generate icons
npm run postinstall
```

## Icon

> * * Asset: https://fontawesome.com/icons/language?style=regular
> * * App: https://preview.npmjs.com/package/svg-app-icon
> * * Sizes: https://stackoverflow.com/a/60184542/1398275

```bash
$ sed 's/currentColor/yellow/' assets/language-regular.svg | npx svg-app-icon -i png -d dist/icons -s 16 -s 24 -s 32 -s 48 -s 128
```

```
Size:   Manifest - Icons:   chrome.browserAction:

16      Yes                 Yes
24      No                  Yes
32      Yes                 Yes
48      Yes                 No
128     Yes                 No
```

https://bugs.chromium.org/p/chromium/issues/detail?id=487422
