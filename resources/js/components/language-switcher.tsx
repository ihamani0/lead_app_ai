import { router, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import i18n from '@/i18n';
import { update as languageUpdate } from '@/routes/language';

type Props = {
    availableLocales: string[];
    currentLocale: string;
};

export function LanguageSwitcher({ availableLocales, currentLocale }: Props) {
    const { setLocale } = useTranslation();
    const { langVersion } = usePage().props;

    const handleLocaleChange = (locale: string) => {
    // ✅ 1. update i18next load path first
        i18n.services.backendConnector.backend.options.loadPath =
            `/translations/{{lng}}?v=${langVersion}`;

        // ✅ 2. patch backend — let the Inertia reload drive the locale change
        router.patch(
            languageUpdate.url(),
            { locale },
            {
                replace: true,
                preserveState: false, // 👈 force fresh shared props (locale + langVersion)
                onSuccess: () => {
                    setLocale(locale) 
                    window.location.reload()
                }, // ✅ 3. only update frontend after success
            },
        );
    };

    const getLanguageLabel = (locale: string) => {
        const labels: Record<string, string> = {
            en: 'English',
            fr: 'Français',
        };
        return labels[locale] || locale;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Languages className="h-4 w-4" />
                    {getLanguageLabel(currentLocale)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {availableLocales.map((locale) => (
                    <DropdownMenuItem
                        key={locale}
                        onClick={() => handleLocaleChange(locale)}
                        className={
                            locale === currentLocale ? 'bg-accent' : ''
                        }
                    >
                        {getLanguageLabel(locale)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
