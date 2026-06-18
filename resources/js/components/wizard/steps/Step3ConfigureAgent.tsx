import { Bot, Calendar, Check, ChevronsUpDown, Info, MapPin, MessageSquare, Paintbrush, Settings, Star, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    SECTORS,
    LANGUAGES,
    OBJECTIVES,
    TONES,
    RESPONSE_STYLES,
    CALL_TO_ACTIONS,
    KNOWLEDGE_MODES,
} from '@/types/wizard';
import type { WizardFormData } from '@/types/wizard';

interface Step3ConfigureAgentProps {
    formData: WizardFormData;
    setFormData: (
        data: WizardFormData | ((prev: WizardFormData) => WizardFormData),
    ) => void;
}

function LanguageMultiSelect({
    value,
    onChange,
}: {
    value: string[];
    onChange: (languages: string[]) => void;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const toggle = (lang: string) => {
        onChange(
            value.includes(lang)
                ? value.filter((v) => v !== lang)
                : [...value, lang],
        );
    };

    return (
        <div className="space-y-2">
            <Label>{t('wizard.step3.language')}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                    >
                        {value.length > 0
                            ? `${value.length} ${t('wizard.step3.languages_selected')}`
                            : t('wizard.step3.select_languages')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder={t('wizard.step3.search_language')}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {t('wizard.step3.no_language')}
                            </CommandEmpty>
                            <CommandGroup>
                                {LANGUAGES.map((lang) => {
                                    const isSelected = value.includes(
                                        lang.value,
                                    );
                                    return (
                                        <CommandItem
                                            key={lang.value}
                                            value={lang.value}
                                            onSelect={() => toggle(lang.value)}
                                        >
                                            <div
                                                className={cn(
                                                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'opacity-50',
                                                )}
                                            >
                                                {isSelected && (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                            <span>{t(lang.labelKey)}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((lang) => {
                        const langData = LANGUAGES.find(
                            (l) => l.value === lang,
                        );
                        return (
                            <Badge
                                key={lang}
                                variant="secondary"
                                className="gap-1"
                            >
                                {langData ? t(langData.labelKey) : lang}
                                <button
                                    type="button"
                                    onClick={() => toggle(lang)}
                                    className="ml-0.5 rounded-full hover:bg-muted-foreground/20"
                                    aria-label={`Retirer ${lang}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        );
                    })}
                </div>
            )}
        </div>
    );
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

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">
                    {t('wizard.step3.title')}
                </h2>
                <p className="mt-2 text-muted-foreground">
                    {t('wizard.step3.description')}
                </p>
            </div>

            {/* ██ IDENTITY */}
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Bot className="h-5 w-5 text-purple-500" />
                            {t('wizard.step3.identity_title')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step3.identity_description')}
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="agent_name">
                                    {t('wizard.step3.agent_name')}
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    {formData.agent_name.length}/50
                                </span>
                            </div>
                            <Input
                                id="agent_name"
                                value={formData.agent_name}
                                onChange={(e) =>
                                    updateField(
                                        'agent_name',
                                        e.target.value.slice(0, 50),
                                    )
                                }
                                placeholder={t(
                                    'wizard.step3.agent_name_placeholder',
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('wizard.step3.sector')}</Label>
                            <Select
                                value={formData.sector}
                                onValueChange={(value) =>
                                    updateField('sector', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.sector_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {SECTORS.map((s) => (
                                        <SelectItem
                                            key={s.value}
                                            value={s.value}
                                        >
                                            {t(s.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('wizard.step3.tone')}</Label>
                            <Select
                                value={formData.tone}
                                onValueChange={(value) =>
                                    updateField('tone', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.tone_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {TONES.map((tone) => (
                                        <SelectItem
                                            key={tone.value}
                                            value={tone.value}
                                        >
                                            <div className="flex items-center gap-2">
                                                {t(tone.labelKey)}
                                                {tone.value ===
                                                    'professionnel' && (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-0.5 border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                                                    >
                                                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                                        {t('wizard.step3.recommended')}
                                                    </Badge>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <LanguageMultiSelect
                            value={formData.languages}
                            onChange={(languages) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    languages,
                                }))
                            }
                        />

                        <div className="space-y-2">
                            <Label>{t('wizard.step3.objective')}</Label>
                            <Select
                                value={formData.main_objective}
                                onValueChange={(value) =>
                                    updateField('main_objective', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.objective_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {OBJECTIVES.map((obj) => (
                                        <SelectItem
                                            key={obj.value}
                                            value={obj.value}
                                        >
                                            {t(obj.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ██ RESPONSE STYLE */}
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                            {t('wizard.step3.style_title')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step3.style_description')}
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label>{t('wizard.step3.response_style')}</Label>
                            <Select
                                value={formData.response_style}
                                onValueChange={(value) =>
                                    updateField('response_style', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.response_style_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {RESPONSE_STYLES.map((rs) => (
                                        <SelectItem
                                            key={rs.value}
                                            value={rs.value}
                                        >
                                            <div className="flex flex-col">
                                                <span>{t(rs.labelKey)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {t(rs.descKey)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="greeting_message">
                                {t('wizard.step3.greeting_message')}
                            </Label>
                            <Input
                                id="greeting_message"
                                value={formData.greeting_message}
                                onChange={(e) =>
                                    updateField(
                                        'greeting_message',
                                        e.target.value,
                                    )
                                }
                                placeholder={t(
                                    'wizard.step3.greeting_message_placeholder',
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('wizard.step3.call_to_action')}</Label>
                            <Select
                                value={formData.call_to_action}
                                onValueChange={(value) =>
                                    updateField('call_to_action', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.call_to_action_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {CALL_TO_ACTIONS.map((cta) => (
                                        <SelectItem
                                            key={cta.value}
                                            value={cta.value}
                                        >
                                            {t(cta.labelKey)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ██ CONSTRAINTS */}
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Settings className="h-5 w-5 text-amber-500" />
                            {t('wizard.step3.constraints_title')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step3.constraints_description')}
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label>{t('wizard.step3.knowledge_mode')}</Label>
                            <Select
                                value={formData.knowledge_mode}
                                onValueChange={(value) =>
                                    updateField('knowledge_mode', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'wizard.step3.knowledge_mode_placeholder',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {KNOWLEDGE_MODES.map((km) => (
                                        <SelectItem
                                            key={km.value}
                                            value={km.value}
                                        >
                                            <div className="flex flex-col">
                                                <span>{t(km.labelKey)}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {t(km.descKey)}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* <div className="space-y-2">
                            <Label>
                                {t('wizard.step3.max_response_length')}
                            </Label>
                            <Input
                                type="number"
                                value={formData.max_response_length}
                                onChange={(e) =>
                                    updateField(
                                        'max_response_length',
                                        e.target.value,
                                    )
                                }
                                placeholder={t(
                                    'wizard.step3.max_response_length_placeholder',
                                )}
                            />
                        </div> */}
                    </div>
                </CardContent>
            </Card>

            {/* ██ COMPANY INFO */}
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Info className="h-5 w-5 text-sky-500" />
                            {t('wizard.step3.company_title')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step3.company_description')}
                        </p>
                    </div>
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="google_maps_url"
                                className="flex items-center gap-2 text-sm font-normal"
                            >
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {t('wizard.step3.google_maps_url')}
                            </Label>
                            <Input
                                id="google_maps_url"
                                type="url"
                                placeholder="https://maps.google.com/?q=..."
                                value={formData.google_maps_url}
                                onChange={(e) =>
                                    updateField(
                                        'google_maps_url',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="calendar_url"
                                className="flex items-center gap-2 text-sm font-normal"
                            >
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {t('wizard.step3.calendar_url')}
                            </Label>
                            <Input
                                id="calendar_url"
                                type="url"
                                placeholder="https://calendly.com/..."
                                value={formData.calendar_url}
                                onChange={(e) =>
                                    updateField('calendar_url', e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="additional_info">
                                {t('wizard.step3.additional_info')}
                            </Label>
                            <Textarea
                                id="additional_info"
                                value={formData.additional_info}
                                onChange={(e) =>
                                    updateField(
                                        'additional_info',
                                        e.target.value,
                                    )
                                }
                                placeholder={t(
                                    'wizard.step3.additional_info_placeholder',
                                )}
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ██ CUSTOM PROMPT */}
            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                            <Paintbrush className="h-5 w-5 text-pink-500" />
                            {t('wizard.step3.instructions_title')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('wizard.step3.instructions_description')}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prompt">
                            {t('wizard.step3.prompt_label')}
                        </Label>
                        <Textarea
                            id="prompt"
                            value={formData.prompt}
                            onChange={(e) =>
                                updateField('prompt', e.target.value)
                            }
                            placeholder={t(
                                'wizard.step3.prompt_placeholder',
                            )}
                            className="min-h-[120px]"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('wizard.step3.prompt_hint')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
