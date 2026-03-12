import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Called once at boot from app.tsx with values from Inertia shared props
export function setupI18n(locale: string, version: string) {
    if (i18n.isInitialized) return;

    i18n.use(HttpBackend)
        .use(initReactI18next)
        .init({
            lng: locale,
            fallbackLng: 'en',
            supportedLngs: ['en', 'fr'],
            backend: {
                loadPath: `/translations/{{lng}}?v=${version}`,
            },
            interpolation: { escapeValue: false },
            // react: {
            //     useSuspense: false,
            // },
            // ns: ['messages', 'validation'],
            // defaultNS: 'messages',
        });
}

export default i18n;
