const getDefaultLanguage = () => {
  const defaultTranslateLanguage = localStorage.getItem(
    `defaultTranslateLanguage`
  );

  if (!defaultTranslateLanguage) {
    return "en";
  }

  return defaultTranslateLanguage;
};

const setDefaultLanguage = (language: string) => {
  localStorage.setItem(`defaultTranslateLanguage`, language);
};

export { getDefaultLanguage, setDefaultLanguage };
