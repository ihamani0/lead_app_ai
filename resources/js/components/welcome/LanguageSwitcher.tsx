'use client';

import { usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import i18n from '@/i18n';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({
    className,
}: {
    className?: string;
}) {
    // const { t } = useTranslation();
    const [lang, setLang] = useState(i18n.language);
    const { setLocale } = useTranslation();
    const { langVersion } = usePage().props;

    const handleLanguageChange = (lang: string) => {
        setLang(lang);

        i18n.services.backendConnector.backend.options.loadPath = `/translations/{{lng}}?v=${langVersion}`;
        setLocale(lang);
        localStorage.setItem('i18nextLng', lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn('rounded-xl', className)}
                >
                    <Languages className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={cn('rounded-2xl', className)}>
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    onValueChange={handleLanguageChange}
                    value={lang}
                >
                    <DropdownMenuRadioItem value="en">
                        <span className="flex items-center gap-2">
                            <span>🇺🇸</span>
                            <span>English</span>
                        </span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="fr">
                        <span className="flex items-center gap-2">
                            <span>🇫🇷</span>
                            <span>Français</span>
                        </span>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
