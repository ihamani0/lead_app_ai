import { useTranslation as useI18nextTranslation } from 'react-i18next';

export function useTranslation() {
    const { t, i18n } = useI18nextTranslation();

    return {
        t,
        locale: i18n.language,
        setLocale: i18n.changeLanguage,
    };
}
