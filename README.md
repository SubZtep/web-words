# _Web Words_ – a browser extension

Show translated words on a tooltip on webpages with _Google Translate_ saved phrases.

:information_source: [HOWTO Save Google Translation History](https://support.google.com/translate/answer/9729699)

## Development

:construction: Aye.

Preload [mozilla/webextension-polyfill](https://github.com/mozilla/webextension-polyfill).

Testing it on **Firefox** and **Chrome**. (**Opera** :bug:)

### CLI Commands

```bash
# Project setup
npm install

# Compiles and watch for development
npm run dev

# Compiles and minifies for production
npm run build

# Run your unit tests
npm test

# Lints and fixes files
npm run lint
npm run lint-fix

# Generate icons
npm run postinstall
```

## Asset

### App base icon

<img src="./assets/language-duotone.svg" width="64" height="64" />

[ [base](https://fontawesome.com/icons/language?style=regular) · [parser](https://preview.npmjs.com/package/svg-app-icon) · [sizes](https://stackoverflow.com/a/60184542/1398275) ]

## Related _3rd party_ issues :mega:

### Would be nice to have
- [Google Translate Phrasebook API, which grants an access users' saved translations](https://issuetracker.google.com/issues/35881350)
- [WebRequest API: allow extensions to read response body](https://bugs.chromium.org/p/chromium/issues/detail?id=487422)
