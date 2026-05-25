import { Check, ChevronsUpDown, Code, Globe, Info, MapPin, MessageSquareText, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { LANGUAGES, OBJECTIVES, TONES } from '@/types/wizard';
import type { WizardFormData } from '@/types/wizard';

interface Step3ConfigureAgentProps {
    formData: WizardFormData;
    setFormData: (data: WizardFormData | ((prev: WizardFormData) => WizardFormData)) => void;
}

export function Step3ConfigureAgent({
    formData,
    setFormData,
}: Step3ConfigureAgentProps) {
    const { t } = useTranslation();

    const updateField = (field: keyof WizardFormData, value: string) => {
        setFormData((prev: WizardFormData) => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleLanguage = (lang: string) => {
        setFormData((prev: WizardFormData) => {
            const exists = prev.languages.includes(lang);

            return {
                ...prev,
                languages: exists
                    ? prev.languages.filter((l) => l !== lang)
                    : [...prev.languages, lang],
            };
        });
    };

    const selectedLanguageLabels = formData.languages
        .map((code) => {
            const lang = LANGUAGES.find((l) => l.value === code);

            return lang ? t(lang.labelKey) : code;
        })
        .join(', ');

    const buildConfigJson = () => {
        const config: Record<string, unknown> = {
            agent_name: formData.agent_name || null,
            languages: formData.languages.length > 0 ? formData.languages : null,
            primary_objective: formData.primary_objective || null,
            tone: formData.tone || null,
        };

        if (formData.google_maps_url) config.google_maps_url = formData.google_maps_url;
        if (formData.calendar_url) config.calendar_url = formData.calendar_url;
        if (formData.additional_info) config.additional_info = formData.additional_info;
        if (formData.prompt) config.prompt = formData.prompt;

        return JSON.stringify(config, null, 2);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('wizard.step3.title')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('wizard.step3.description')}
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="agent_name">
                        {t('wizard.step3.agent_name')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="agent_name"
                        placeholder={t('wizard.step3.agent_name_placeholder')}
                        value={formData.agent_name}
                        onChange={(e) => updateField('agent_name', e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            {t('wizard.step3.language')} <span className="text-destructive">*</span>
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        'w-full justify-between',
                                        !formData.languages.length && 'text-muted-foreground',
                                    )}
                                >
                                    <span className="truncate">
                                        {formData.languages.length > 0
                                            ? selectedLanguageLabels
                                            : t('wizard.step3.select_languages')}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <Command>
                                    <CommandInput placeholder={t('wizard.step3.search_language')} />
                                    <CommandList>
                                        <CommandEmpty>{t('wizard.step3.no_language')}</CommandEmpty>
                                        <CommandGroup>
                                            {LANGUAGES.map((lang) => {
                                                const isSelected = formData.languages.includes(lang.value);

                                                return (
                                                    <CommandItem
                                                        key={lang.value}
                                                        value={lang.value}
                                                        onSelect={() => toggleLanguage(lang.value)}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                                isSelected
                                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                                    : 'border-muted-foreground',
                                                            )}
                                                        >
                                                            {isSelected && <Check className="h-3 w-3" />}
                                                        </div>
                                                        {t(lang.labelKey)}
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {formData.languages.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                                {formData.languages.map((code) => {
                                    const lang = LANGUAGES.find((l) => l.value === code);

                                    return (
                                        <Badge
                                            key={code}
                                            variant="secondary"
                                            className="cursor-pointer gap-1"
                                            onClick={() => toggleLanguage(code)}
                                        >
                                            {lang ? t(lang.labelKey) : code}
                                            <span className="ml-1">&times;</span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>{t('wizard.step3.tone')}</Label>
                        <Select
                            value={formData.tone}
                            onValueChange={(value) => updateField('tone', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TONES.map((tone) => (
                                    <SelectItem key={tone.value} value={tone.value}>
                                        {t(tone.labelKey)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>
                        {t('wizard.step3.objective')} <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.primary_objective}
                        onValueChange={(value) => updateField('primary_objective', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {OBJECTIVES.map((obj) => (
                                <SelectItem key={obj.value} value={obj.value}>
                                    {t(obj.labelKey)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    <Globe className="h-4 w-4" />
                    {t('wizard.step3.external_links')}
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="google_maps_url" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t('wizard.step3.google_maps_url')}
                    </Label>
                    <Input
                        id="google_maps_url"
                        type="url"
                        placeholder="https://maps.google.com/?q=..."
                        value={formData.google_maps_url}
                        onChange={(e) => updateField('google_maps_url', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="calendar_url" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {t('wizard.step3.calendar_url')}
                    </Label>
                    <Input
                        id="calendar_url"
                        type="url"
                        placeholder="https://calendly.com/..."
                        value={formData.calendar_url}
                        onChange={(e) => updateField('calendar_url', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="additional_info" className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    {t('wizard.step3.additional_info')}
                </Label>
                <Textarea
                    id="additional_info"
                    placeholder={t('wizard.step3.additional_info_placeholder')}
                    value={formData.additional_info}
                    onChange={(e) => updateField('additional_info', e.target.value)}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="prompt" className="flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-muted-foreground" />
                    {t('wizard.step3.prompt_label')}
                </Label>
                <Textarea
                    id="prompt"
                    placeholder={t('wizard.step3.prompt_placeholder')}
                    value={formData.prompt}
                    onChange={(e) => updateField('prompt', e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                    {t('wizard.step3.prompt_hint')}
                </p>
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    {t('wizard.step3.config_preview')}
                </Label>
                <Textarea
                    value={buildConfigJson()}
                    readOnly
                    rows={12}
                    className="bg-muted/50 font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                    {t('wizard.step3.config_hint')}
                </p>
            </div>
        </div>
    );
}
