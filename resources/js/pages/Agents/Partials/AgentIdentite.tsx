import { useForm } from '@inertiajs/react';
import {
    Bot,
    Calendar,
    Check,
    ChevronsUpDown,
    Info,
    MapPin,
    MessageSquare,
    Paintbrush,
    Settings,
    Star,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { cn } from '@/lib/utils';
import workspaces from '@/routes/workspaces';
import { SECTORS } from '@/types/wizard';
import type { AgentConfig } from '@/types';

interface AgentStats {
    total_conversations: number;
    qualified_leads: number;
    satisfaction_rate: number | null;
    last_activity: string | null;
}

interface Props {
    agent: AgentConfig;
    slug: string;
    stats?: AgentStats;
}

interface IdentityFormData {
    name: string;
    settings: {
        sector: string;
        tone: string;
        languages: string[];
        main_objective: string;
        response_style: string;
        greeting_message: string;
        call_to_action: string;
        max_response_length: string;
        knowledge_mode: string;
        google_maps_url: string;
        calendar_url: string;
        additional_info: string;
        custom_prompt: string;
    };
}

const TONES = [
    {
        value: 'professionnel',
        label: 'Professionnel & Expert',
        recommended: true,
    },
    { value: 'amical', label: 'Amical & Décontracté', recommended: false },
    { value: 'formel', label: 'Formel & Strict', recommended: false },
    {
        value: 'enthousiaste',
        label: 'Enthousiaste & Dynamique',
        recommended: false,
    },
    { value: 'pedagogue', label: 'Pédagogue & Explicatif', recommended: false },
    {
        value: 'humoristique',
        label: 'Humoristique & Léger',
        recommended: false,
    },
] as const;

const LANGUAGES = [
    { value: 'francais', label: 'Français' },
    { value: 'arabe', label: 'Arabe' },
    { value: 'anglais', label: 'Anglais' },
    { value: 'darija', label: 'Darija (الدارجة)' },
    { value: 'espagnol', label: 'Espagnol' },
    { value: 'allemand', label: 'Allemand' },
    { value: 'bilingue_fr_ar', label: 'Bilingue Français/Arabe' },
    { value: 'bilingue_fr_en', label: 'Bilingue Français/Anglais' },
] as const;

const OBJECTIVES = [
    {
        value: 'generer_leads',
        label: 'Générer des leads qualifiés et prendre des rendez-vous',
    },
    { value: 'support_client', label: 'Assistance et support client' },
    { value: 'information', label: 'Fournir des informations et conseils' },
    { value: 'vente', label: 'Vente et promotion de produits/services' },
    { value: 'qualification', label: 'Qualification et filtrage de prospects' },
    { value: 'prise_rdv', label: 'Prise de rendez-vous uniquement' },
] as const;

const RESPONSE_STYLES = [
    {
        value: 'concis',
        label: 'Concis & Direct — réponses courtes et efficaces',
        desc: 'Idéal pour le service client rapide',
    },
    {
        value: 'equilibree',
        label: 'Équilibré — ni trop concis, ni trop long',
        desc: 'Bon équilibre pour la plupart des cas',
    },
    {
        value: 'detaillee',
        label: 'Détaillé — réponses complètes et riches',
        desc: "Parfait pour l'information et le conseil",
    },
] as const;

const CALL_TO_ACTIONS = [
    { value: 'visite', label: 'Proposer une visite' },
    { value: 'devis', label: 'Demander un devis' },
    { value: 'appel', label: 'Programmer un appel' },
    { value: 'email', label: 'Envoyer un email' },
    { value: 'rdv', label: 'Prendre un rendez-vous' },
    { value: 'inscription', label: "S'inscrire" },
] as const;

const KNOWLEDGE_MODES = [
    {
        value: 'strict',
        label: 'Strict — uniquement les infos fournies',
        desc: "L'IA ne répond qu'avec les documents fournis",
    },
    {
        value: 'hybride',
        label: 'Hybride — documents + connaissances',
        desc: "L'IA complète avec ses connaissances générales",
    },
    {
        value: 'libre',
        label: 'Libre — connaissances générales',
        desc: "L'IA utilise ses connaissances en priorisant vos documents",
    },
] as const;

const DEFAULT_TRAITS: Record<string, string[]> = {
    professionnel: ['Professionnel', 'Expert', 'Fiable', 'Réactif'],
    amical: ['Amical', 'Accessible', 'Chaleureux', "À l'écoute"],
    formel: ['Formel', 'Précis', 'Structuré', 'Respectueux'],
    enthousiaste: ['Enthousiaste', 'Dynamique', 'Motivant', 'Positif'],
    pedagogue: ['Pédagogue', 'Patient', 'Clair', 'Didactique'],
    humoristique: ['Drôle', 'Léger', 'Créatif', 'Sympathique'],
};

function getLabelByValue<T extends { value: string; label: string }>(
    list: readonly T[],
    value: string,
    fallback = '—',
): string {
    return list.find((item) => item.value === value)?.label ?? fallback;
}

function relativeTime(dateString: string | null | undefined): string {
    if (!dateString) return '—';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
}

function resolveInitialSettings(
    agent: AgentConfig,
): IdentityFormData['settings'] {
    const s = (agent.settings ?? {}) as Record<string, unknown>;

    return {
        sector: (s.sector as string) || '',
        tone: (s.tone as string) || '',
        languages: Array.isArray(s.languages)
            ? (s.languages as string[])
            : ['francais'],
        main_objective: (s.main_objective as string) || '',
        response_style: (s.response_style as string) || 'equilibree',
        greeting_message: (s.greeting_message as string) || '',
        call_to_action: (s.call_to_action as string) || '',
        max_response_length: (s.max_response_length as string) || '',
        knowledge_mode: (s.knowledge_mode as string) || 'strict',
        google_maps_url: (s.google_maps_url as string) || '',
        calendar_url: (s.calendar_url as string) || '',
        additional_info: (s.additional_info as string) || '',
        custom_prompt: (s.custom_prompt as string) || '',
    };
}

interface LanguageMultiSelectProps {
    value: string[];
    onChange: (languages: string[]) => void;
}

function LanguageMultiSelect({ value, onChange }: LanguageMultiSelectProps) {
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
            <Label>Langues</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                    >
                        {value.length > 0
                            ? `${value.length} langue(s) sélectionnée(s)`
                            : 'Sélectionnez les langues'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Rechercher une langue..." />
                        <CommandList>
                            <CommandEmpty>Aucune langue trouvée.</CommandEmpty>
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
                                            <span>{lang.label}</span>
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
                    {value.map((lang) => (
                        <Badge key={lang} variant="secondary" className="gap-1">
                            {getLabelByValue(LANGUAGES, lang, lang)}
                            <button
                                type="button"
                                onClick={() => toggle(lang)}
                                className="ml-0.5 rounded-full hover:bg-muted-foreground/20"
                                aria-label={`Retirer ${lang}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}

interface AgentPreviewCardProps {
    name: string;
    sector: string;
    tone: string;
    objective: string;
    responseStyle: string;
    knowledgeMode: string;
}

function AgentPreviewCard({
    name,
    sector,
    tone,
    objective,
    responseStyle,
    knowledgeMode,
}: AgentPreviewCardProps) {
    const traits = DEFAULT_TRAITS[tone] ?? ['Professionnel', 'Fiable'];
    const styleLabel = getLabelByValue(
        RESPONSE_STYLES,
        responseStyle,
        'équilibré',
    );
    const objectiveLabel = getLabelByValue(
        OBJECTIVES,
        objective,
        'vous assister',
    );

    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">
                        Aperçu de votre IA
                    </h3>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Agent configuré
                    </Badge>
                </div>

                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                        <Bot className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-base font-semibold">
                        {name || 'Assistant'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Assistant{' '}
                        {getLabelByValue(
                            SECTORS,
                            sector,
                            'professionnel',
                        ).toLowerCase()}
                    </p>
                </div>

                <div className="space-y-1.5 text-sm">
                    <p>
                        <span className="font-medium">Objectif :</span>{' '}
                        {objectiveLabel}
                    </p>
                    <p>
                        <span className="font-medium">Style :</span>{' '}
                        {styleLabel}
                    </p>
                    <p>
                        <span className="font-medium">Mode connaissance :</span>{' '}
                        {getLabelByValue(
                            KNOWLEDGE_MODES,
                            knowledgeMode,
                            'strict',
                        )}
                    </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {traits.map((trait) => (
                        <Badge
                            key={trait}
                            variant="secondary"
                            className="bg-purple-50 text-purple-700"
                        >
                            {trait}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface AgentStatsCardProps {
    stats?: AgentStats;
}

function AgentStatsCard({ stats }: AgentStatsCardProps) {
    const items = [
        {
            value: stats?.total_conversations ?? '—',
            label: 'Conversations mémorisées',
        },
        { value: stats?.qualified_leads ?? '—', label: 'Leads qualifiés' },
        {
            value:
                stats?.satisfaction_rate != null
                    ? `${stats.satisfaction_rate}%`
                    : '—',
            label: 'Taux de qualification',
        },
        {
            value: relativeTime(stats?.last_activity),
            label: 'Dernière activité',
        },
    ];

    const isActive = stats && stats.total_conversations > 0;

    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {items.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <p className="text-lg font-bold">{value}</p>
                            <p className="text-[10px] text-muted-foreground">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Statut général : {isActive ? 'Actif' : 'En attente'}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AgentIdentite({ agent, slug, stats }: Props) {
    const identityForm = useForm<IdentityFormData>({
        name: agent.name || '',
        settings: resolveInitialSettings(agent),
    });

    const handleSaveIdentity = () => {
        identityForm.put(
            workspaces.agents.update({ slug, agent: agent.id }).url,
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Agent mis à jour avec succès'),
            },
        );
    };

    const setSettings = (patch: Partial<IdentityFormData['settings']>) => {
        identityForm.setData('settings', {
            ...identityForm.data.settings,
            ...patch,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Mon IA</h1>
                <p className="mt-1 text-muted-foreground">
                    Configurez l'identité, le comportement et les paramètres
                    avancés de votre agent IA
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                <div className="space-y-6">
                    {/* ██ IDENTITY */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Bot className="h-5 w-5 text-purple-500" />
                                    Identité
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Définissez la personnalité et l'objectif
                                    principal
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="name">
                                            Nom de l'agent
                                        </Label>
                                        <span className="text-xs text-muted-foreground">
                                            {identityForm.data.name.length}/50
                                        </span>
                                    </div>
                                    <Input
                                        id="name"
                                        value={identityForm.data.name}
                                        onChange={(e) =>
                                            identityForm.setData(
                                                'name',
                                                e.target.value.slice(0, 50),
                                            )
                                        }
                                        placeholder="Assistant Immo"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Métier / Secteur</Label>
                                    <Select
                                        value={
                                            identityForm.data.settings.sector
                                        }
                                        onValueChange={(v) =>
                                            setSettings({ sector: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un secteur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SECTORS.map((s) => (
                                                <SelectItem
                                                    key={s.value}
                                                    value={s.value}
                                                >
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ton de l'IA</Label>
                                    <Select
                                        value={identityForm.data.settings.tone}
                                        onValueChange={(v) =>
                                            setSettings({ tone: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un ton" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TONES.map((t) => (
                                                <SelectItem
                                                    key={t.value}
                                                    value={t.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {t.label}
                                                        {t.recommended && (
                                                            <Badge
                                                                variant="outline"
                                                                className="gap-0.5 border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                                                            >
                                                                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                                                Recommandé
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <LanguageMultiSelect
                                    value={identityForm.data.settings.languages}
                                    onChange={(languages) =>
                                        setSettings({ languages })
                                    }
                                />

                                <div className="space-y-2">
                                    <Label>Objectif principal</Label>
                                    <Select
                                        value={
                                            identityForm.data.settings
                                                .main_objective
                                        }
                                        onValueChange={(v) =>
                                            setSettings({ main_objective: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un objectif" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {OBJECTIVES.map((o) => (
                                                <SelectItem
                                                    key={o.value}
                                                    value={o.value}
                                                >
                                                    {o.label}
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
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <MessageSquare className="h-5 w-5 text-blue-500" />
                                    Style & Comportement
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Personnalisez la manière dont l'IA
                                    communique
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Style de réponse</Label>
                                    <Select
                                        value={
                                            identityForm.data.settings
                                                .response_style
                                        }
                                        onValueChange={(v) =>
                                            setSettings({ response_style: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisissez un style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RESPONSE_STYLES.map((rs) => (
                                                <SelectItem
                                                    key={rs.value}
                                                    value={rs.value}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>{rs.label}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {rs.desc}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="greeting_message">
                                        Message d'accueil
                                    </Label>
                                    <Input
                                        id="greeting_message"
                                        value={
                                            identityForm.data.settings
                                                .greeting_message
                                        }
                                        onChange={(e) =>
                                            setSettings({
                                                greeting_message:
                                                    e.target.value,
                                            })
                                        }
                                        placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Call to action principal</Label>
                                    <Select
                                        value={
                                            identityForm.data.settings
                                                .call_to_action
                                        }
                                        onValueChange={(v) =>
                                            setSettings({ call_to_action: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisissez un CTA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CALL_TO_ACTIONS.map((cta) => (
                                                <SelectItem
                                                    key={cta.value}
                                                    value={cta.value}
                                                >
                                                    {cta.label}
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
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Settings className="h-5 w-5 text-amber-500" />
                                    Contraintes & Connaissances
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Limitez le champ d'action de l'IA
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Mode de connaissances</Label>
                                    <Select
                                        value={
                                            identityForm.data.settings
                                                .knowledge_mode
                                        }
                                        onValueChange={(v) =>
                                            setSettings({ knowledge_mode: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisissez un mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {KNOWLEDGE_MODES.map((km) => (
                                                <SelectItem
                                                    key={km.value}
                                                    value={km.value}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>{km.label}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {km.desc}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ██ COMPANY INFO */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Info className="h-5 w-5 text-sky-500" />
                                    Informations entreprise
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Lieu, agenda et infos complémentaires
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="google_maps_url"
                                        className="flex items-center gap-2 text-sm font-normal"
                                    >
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        Google Maps URL
                                    </Label>
                                    <Input
                                        id="google_maps_url"
                                        type="url"
                                        placeholder="https://maps.google.com/?q=..."
                                        value={
                                            identityForm.data.settings
                                                .google_maps_url
                                        }
                                        onChange={(e) =>
                                            setSettings({
                                                google_maps_url: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="calendar_url"
                                        className="flex items-center gap-2 text-sm font-normal"
                                    >
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        Calendar / Agenda URL
                                    </Label>
                                    <Input
                                        id="calendar_url"
                                        type="url"
                                        placeholder="https://calendly.com/..."
                                        value={
                                            identityForm.data.settings
                                                .calendar_url
                                        }
                                        onChange={(e) =>
                                            setSettings({
                                                calendar_url: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="additional_info">
                                        Informations complémentaires
                                    </Label>
                                    <Textarea
                                        id="additional_info"
                                        value={
                                            identityForm.data.settings
                                                .additional_info
                                        }
                                        onChange={(e) =>
                                            setSettings({
                                                additional_info: e.target.value,
                                            })
                                        }
                                        placeholder="Horaires, adresse, services proposés..."
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
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Paintbrush className="h-5 w-5 text-pink-500" />
                                    Instructions personnalisées
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Instructions libres qui seront ajoutées au
                                    prompt système généré
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="custom_prompt">
                                    Instructions personnalisées
                                </Label>
                                <Textarea
                                    id="custom_prompt"
                                    value={
                                        identityForm.data.settings.custom_prompt
                                    }
                                    onChange={(e) =>
                                        setSettings({
                                            custom_prompt: e.target.value,
                                        })
                                    }
                                    placeholder="Ex: Tu dois toujours demander le nom du prospect avant de proposer quoi que ce soit..."
                                    className="min-h-[120px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ces instructions sont ajoutées
                                    automatiquement au prompt système.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ██ SAVE */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSaveIdentity}
                            disabled={
                                !identityForm.isDirty || identityForm.processing
                            }
                            className="flex-1 gap-2"
                            size="lg"
                        >
                            {identityForm.processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer les modifications'
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <AgentPreviewCard
                        name={identityForm.data.name}
                        sector={identityForm.data.settings.sector}
                        tone={identityForm.data.settings.tone}
                        objective={identityForm.data.settings.main_objective}
                        responseStyle={
                            identityForm.data.settings.response_style
                        }
                        knowledgeMode={
                            identityForm.data.settings.knowledge_mode
                        }
                    />
                    <AgentStatsCard stats={stats} />
                </div>
            </div>
        </div>
    );
}
