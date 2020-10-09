/**
 * Simplify code, so a detected website language match with language from the translator.
 */
export const langCode = (detectedLanguage: string) => detectedLanguage.split("-")[0]
