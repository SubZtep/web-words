/**
 * From a language to all other language translations.
 */
declare type Dict = {
  [fromLang: string]: {
    [toLang: string]: [string, string][]
  }
}

/**
 * Word list in two languages. `{ Acne: "Pattanás", ... }`
 */
declare type Words = {
  [word: string]: string
}
