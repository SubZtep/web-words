/**
 * Local dictionary for content parse.
 */
declare type LocalDict = Map<string, string>

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
 * TODO: Map instead of object, insert in right order
 */
declare type Words = {
  [word: string]: string
}

/**
 * Google's POST request data for star new word.
 */
declare type AddRequestData = {
  formData: {
    q: string[]
    utrans: string[]
  }
}

type WordsMessage = {
  type: "WORDS_FOUND"
  count: number
}

type LanguageMessage = {
  type: "TAB_LANGUAGE"
  language: string
}

type ProcessingMessage = {
  type: "TAB_PROCESSING"
}

type FetchDictionary = {
  type: "FETCH_DICTIONARY"
}

declare type AppMessage = WordsMessage | LanguageMessage | ProcessingMessage | FetchDictionary
