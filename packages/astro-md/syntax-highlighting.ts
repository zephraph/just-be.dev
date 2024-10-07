import { bundledLanguagesInfo } from "shiki/langs";
import { bundledThemesInfo } from "shiki/themes";

interface Theme {
  id: string;
}
type ThemeMap = Record<string, Theme>;

const themes: ThemeMap = bundledThemesInfo.reduce(
  (themes: ThemeMap, theme: Theme) => {
    themes[theme.id] = theme;
    return themes;
  },
  {}
);

interface Lang {
  id: string;
  aliases?: string[];
}
type LangMap = Record<string, Lang>;

const langs: LangMap = bundledLanguagesInfo.reduce(
  (langs: LangMap, lang: Lang) => {
    langs[lang.id] = lang;
    for (const alias of lang.aliases ?? []) {
      langs[alias] = lang;
    }
    return langs;
  },
  {}
);

export const isThemeSupported = (theme: string) => {
  return !!themes[theme];
};

export const isLangSupported = (lang: string) => {
  return !!langs[lang];
};
