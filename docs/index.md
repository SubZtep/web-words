# _Web Words_ – a browser extension

Show translated words on a tooltip on webpages with _[Google Translate](https://translate.google.com/)_ saved phrases.

[]

## How It Works?

If you logged in with your _Google_ account, you are able to save translations with the star icon.

[]

After a while you'll have too many words and there is a possibility of memorize them permanent immediately isn't on the _skills list_. They are the target audience.

> (-(-\_(-\_-)\_-)-)

**(-(–\_(—\_—)\_–)-)**

(—(‒\_(-_-)\_‒)—)

This plugin manages to access to this list. When you open a webpage, it tries to [detect its language](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/detectLanguage). If success and found word(s) from the dictionary translate them. At least try, the plugin is **beta** and under development, you are more than welcome to [report any issue](https://github.com/SubZtep/web-words/issues).

You will need to update the local dictionary manually. Click the icon on the _browser action bar_ and press the button.

[]

## How To Install

### From Source

Clone the project locally and build with _NodeJS_. Add `dist` directory in the browser menu somewhere in dev mode.

## Your Data

Your data never leaves your browser. This plugin simply opens the Google Translate
page and copy your starred words into your [browser local storage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage), there is
no custom server call involved.

## FAQ

### Why?

Started for personal use. (⁄ ⁄•⁄ω⁄•⁄ ⁄)

### Supported Languages

All of them. It's up to the user's dictionary which languages are translate from.

The interface is english only atm but translatable easily.


---

🔗 [./fun.md](./fun.md)

٩(◕‿◕｡)۶

---
