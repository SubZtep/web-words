# _Web Words_ – browser extension

<img src="./dist/icons/192x192.png" width="64" height="64" align="left" />

Import **Google Translate** saved phrases into the local storage and display them on a tooltip for relevant text on a web page.

## Development

:construction: _Aye_.

Preload [mozilla/webextension-polyfill](https://github.com/mozilla/webextension-polyfill), the only production dependency.

Testing it on **Firefox** and **Chrome**. (**Opera** :bug:)

Build with **Rollup** to `/dist` folder that contains templates (temporary).

### CLI Commands

```bash
# Project setup
npm install

# Compiles and watch for development
npm run dev

# Compiles and minifies for production
npm run build
```

## Links

### Self
 - [Website](https://subztep.github.io/web-words/)
 - [Firefox add-on](https://addons.mozilla.org/addon/web-words/)
 - [Chrome web store](https://chrome.google.com/webstore/detail/web-words/oafbnidobflmgdldmjjdiofefhofknbm)

### Related _3rd party_ issues :mega:
- [Google Translate Phrasebook API, which grants an access users' saved translations](https://issuetracker.google.com/issues/35881350)
- [WebRequest API: allow extensions to read response body](https://bugs.chromium.org/p/chromium/issues/detail?id=487422)

### Other

- :information_source: [HOWTO Save Google Translation History](https://support.google.com/translate/answer/9729699)
