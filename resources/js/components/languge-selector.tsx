import { usePage } from '@inertiajs/react';
import { LanguageSwitcher } from './language-switcher';
 
type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            avatar?: string;
        };
    };
    locale: string;
    availableLocales: string[];
}; 

export function LanguageSelector() {
    const page = usePage<PageProps>();
    const { locale, availableLocales } = page.props;

    return (
        <>
            <LanguageSwitcher
                availableLocales={availableLocales}
                currentLocale={locale}
            />
        </>
    );
}
