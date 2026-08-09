"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  COOKIE_LANG,
  isLocale,
  LOCALE_META,
  LOCALES,
  t,
  type Locale,
  type UiKey,
} from "./i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "rtl" | "ltr";
  tt: (key: UiKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(fallback: Locale = "ar"): Locale {
  if (typeof window === "undefined") return fallback;
  const fromStorage = localStorage.getItem(COOKIE_LANG);
  if (isLocale(fromStorage)) return fromStorage;
  const match = document.cookie.match(/(?:^|; )medak_lang=([^;]*)/);
  const fromCookie = match?.[1];
  if (isLocale(fromCookie)) return fromCookie;
  return fallback;
}

function persistLocale(locale: Locale) {
  localStorage.setItem(COOKIE_LANG, locale);
  document.cookie = `${COOKIE_LANG}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  const meta = LOCALE_META[locale];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
}

export function LocaleProvider({
  children,
  initialLocale = "ar",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const stored = readStoredLocale(initialLocale);
    setLocaleState(stored);
    persistLocale(stored);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dir: LOCALE_META[locale].dir,
      tt: (key: UiKey) => t(locale, key),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { locale, setLocale } = useLocale();
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
            locale === code
              ? "bg-teal text-white"
              : "text-ink/60 hover:bg-teal-50 hover:text-teal"
          }`}
        >
          {LOCALE_META[code].native}
        </button>
      ))}
    </div>
  );
}
