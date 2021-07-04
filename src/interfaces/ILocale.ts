export interface ILocale {
  getLocales(): Array<string>;
  getCurrentLocale(): string;
  setLocale(): void;
  translate(): string;
}
