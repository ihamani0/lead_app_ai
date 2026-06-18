import { Head, Link, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    ChevronDown,
    Download,
    Filter,
    Flame,
    Loader2,
    Search,
    Snowflake,
    Sparkles,
    ThermometerSun,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import {
    index,
    show,
    triggerQualification,
    bulkQualify,
    exportMethod as exportLeads,
} from '@/routes/workspaces/leads';
import type { EvolutionInstance, Lead as LeadType } from '@/types';
import EditLead from './Partials/EditLead';

type Props = {
    leads: { data: LeadType[]; links: PaginationLink[] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any;
    instances: EvolutionInstance[];
    canManage: boolean;
};

export default function LeadsIndex({
    leads: initialLeads,
    filters,
    instances,
    canManage,
}: Props) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();

    const [leads, setLeads] = useState<LeadType[]>(initialLeads.data);

    useEffect(() => {
        setLeads(initialLeads.data);
    }, [initialLeads.data]);

    useEcho('lead', ['QulificationUpdate'], (event) => {
        const updatedLead = event.lead;
        setLeads((prevLeads) =>
            prevLeads.map((lead) =>
                lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead,
            ),
        );
    });

    useEcho('lead', ['LeadMessageUpdated'], (event) => {
        const updatedLead = event.lead;
        setLeads((prevLeads) =>
            prevLeads.map((lead) =>
                lead.id === updatedLead.id ? { ...lead, ...updatedLead } : lead,
            ),
        );
    });

    const [params, setParams] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        instance_id: filters?.instance_name || '',
        temperature: filters?.temperature || '',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        min_score: filters?.min_score || '',
    });

    const isFirstRender = useRef(true);

    const [triggeringLeadId, setTriggeringLeadId] = useState<string | null>(
        null,
    );

    const [selectedLeads, setSelectedLeads] = useState<Set<string | number>>(
        new Set(),
    );
    const [bulkTriggering, setBulkTriggering] = useState(false);

    const handleSelectLead = (leadId: string | number) => {
        setSelectedLeads((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(leadId)) {
                newSet.delete(leadId);
            } else {
                newSet.add(leadId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedLeads.size === leads.length) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(leads.map((l) => l.id)));
        }
    };

    const handleBulkQualify = () => {
        if (selectedLeads.size === 0) return;
        setBulkTriggering(true);
        router.post(
            bulkQualify({ slug: activeWorkspace!.slug }).url,
            { lead_ids: Array.from(selectedLeads) },
            {
                preserveScroll: true,
                onFinish: () => {
                    setBulkTriggering(false);
                    setSelectedLeads(new Set());
                },
            },
        );
    };

    const handleTriggerQualification = (leadId: string | number) => {
        setTriggeringLeadId(String(leadId));
        router.post(
            triggerQualification({ slug: activeWorkspace!.slug, id: leadId })
                .url,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setTriggeringLeadId(null);
                },
            },
        );
    };

    const workspaceSlugRef = useRef(activeWorkspace?.slug);

    useEffect(() => {
        workspaceSlugRef.current = activeWorkspace?.slug;
    }, [activeWorkspace?.slug]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const slug = workspaceSlugRef.current;
        if (!slug) return;

        const timeoutId = setTimeout(() => {
            router.get(index({ slug }).url, params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [params]);

    const handleChange = (key: string, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setParams({
            search: '',
            status: '',
            temperature: '',
            date_from: '',
            date_to: '',
            min_score: '',
            instance_id: '',
        });
    };

    const hasActiveFilters = Object.values(params).some((val) => val !== '');

    const formatMessageTime = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'now';
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    const getQualificationResultBadge = (result: string | null) => {
        switch (result?.toUpperCase()) {
            case 'HOT':
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-800">
                        <Flame className="mr-1 h-3 w-3" /> Hot
                    </Badge>
                );
            case 'WARM':
                return (
                    <Badge className="border-orange-200 bg-orange-100 text-orange-800">
                        <ThermometerSun className="mr-1 h-3 w-3" /> Warm
                    </Badge>
                );
            case 'COLD':
                return (
                    <Badge className="border-blue-200 bg-blue-100 text-blue-800">
                        <Snowflake className="mr-1 h-3 w-3" /> Cold
                    </Badge>
                );
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const getTreatmentStatusBadge = (status: string | null) => {
        switch (status) {
            case 'TRAITE':
                return (
                    <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                        Traité
                    </Badge>
                );
            case 'NON_TRAITE':
                return (
                    <Badge className="border-amber-200 bg-amber-100 text-amber-800">
                        Non traité
                    </Badge>
                );
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const getNotesPreview = (notes: string | null) => {
        if (!notes) return <span className="text-muted-foreground">-</span>;
        const preview =
            notes.length > 50 ? notes.substring(0, 50) + '...' : notes;
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="cursor-help border-b border-dotted border-muted-foreground">
                            {preview}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                        <p>{notes}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    const TooltipHeader = ({
        children,
        text,
    }: {
        children: React.ReactNode;
        text: string;
    }) => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dotted border-muted-foreground">
                        {children}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    const [sortBy, setSortBy] = useState('lastActivity');

    return (
        <AppLayout>
            <Head title={t('leads.title')} />

            <div className="min-h-screen bg-background">
                <div className="border-b   px-4 py-5 sm:px-6 lg:px-8">
                        
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                    {t('leads.title')}
                                </h1>
                                <Badge variant="secondary" className="text-xs">
                                    {initialLeads.data.length}
                                </Badge>
                            </div>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {t('leads.description')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2">
                            <a
                                href={exportLeads({ slug: activeWorkspace!.slug }).url + '?' + new URLSearchParams(
                                    Object.fromEntries(
                                        Object.entries(params).filter(([, v]) => v !== ''),
                                    ),
                                ).toString()}
                                download
                            >
                                <Button variant="outline" size="sm">
                                    <Download className="mr-1.5 h-4 w-4" />
                                    {t('leads.actions.export')}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder={t('leads.search.placeholder')}
                                className="pl-9"
                                value={params.search}
                                onChange={(e) =>
                                    handleChange('search', e.target.value)
                                }
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Filter className="mr-1.5 h-4 w-4" />
                                    {t('leads.search.filters')}
                                    {(params.instance_id ||
                                        params.temperature ||
                                        params.min_score ||
                                        params.date_from ||
                                        params.date_to) && (
                                        <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                                            {
                                                [
                                                    params.instance_id,
                                                    params.temperature,
                                                    params.min_score,
                                                    params.date_from,
                                                    params.date_to,
                                                ].filter(Boolean).length
                                            }
                                        </span>
                                    )}
                                    <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>
                                    {t('leads.search.allInstances')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {instances.map((inst) => (
                                    <DropdownMenuItem
                                        key={inst.id}
                                        onClick={() =>
                                            handleChange(
                                                'instance_id',
                                                params.instance_id === inst.id
                                                    ? ''
                                                    : inst.id,
                                            )
                                        }
                                    >
                                        {params.instance_id === inst.id && (
                                            <span className="mr-2 text-primary">
                                                ✓
                                            </span>
                                        )}
                                        {inst.display_name ||
                                            inst.instance_name}
                                    </DropdownMenuItem>
                                ))}
                                {instances.length > 0 && (
                                    <DropdownMenuSeparator />
                                )}

                                <DropdownMenuLabel>
                                    {t('leads.search.allTemperatures')}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {[
                                    { value: '', label: 'Tous' },
                                    {
                                        value: 'UNQUALIFIED',
                                        label: '⏳ Non qualifiés',
                                    },
                                    {
                                        value: 'HOT',
                                        label: `🔥 ${t('leads.search.hot')}`,
                                    },
                                    {
                                        value: 'WARM',
                                        label: `☀️ ${t('leads.search.warm')}`,
                                    },
                                    {
                                        value: 'COLD',
                                        label: `❄️ ${t('leads.search.cold')}`,
                                    },
                                ].map((opt) => (
                                    <DropdownMenuItem
                                        key={opt.value}
                                        onClick={() =>
                                            handleChange(
                                                'temperature',
                                                opt.value,
                                            )
                                        }
                                    >
                                        {params.temperature === opt.value && (
                                            <span className="mr-2 text-primary">
                                                ✓
                                            </span>
                                        )}
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    {t('leads.search.minScore')}
                                </DropdownMenuLabel>
                                <div className="px-2 py-1.5">
                                    <Input
                                        type="number"
                                        placeholder="0-10"
                                        min="0"
                                        max="10"
                                        value={params.min_score}
                                        onChange={(e) =>
                                            handleChange(
                                                'min_score',
                                                e.target.value,
                                            )
                                        }
                                        className="h-8"
                                    />
                                </div>
                                <DropdownMenuSeparator />
                                <div className="grid grid-cols-2 gap-1 px-2 py-1.5">
                                    <div>
                                        <p className="mb-1 text-[11px] text-muted-foreground">
                                            {t('leads.search.dateFrom')}
                                        </p>
                                        <Input
                                            type="date"
                                            value={params.date_from}
                                            onChange={(e) =>
                                                handleChange(
                                                    'date_from',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[11px] text-muted-foreground">
                                            {t('leads.search.dateTo')}
                                        </p>
                                        <Input
                                            type="date"
                                            value={params.date_to}
                                            onChange={(e) =>
                                                handleChange(
                                                    'date_to',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <select
                            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="lastActivity">
                                {t('leads.search.sortBy')} :{' '}
                                {t('leads.search.lastActivity')}
                            </option>
                            <option value="name">
                                {t('leads.search.sortBy')} :{' '}
                                {t('leads.search.name')}
                            </option>
                            <option value="createdAt">
                                {t('leads.search.sortBy')} :{' '}
                                {t('leads.search.createdAt')}
                            </option>
                        </select>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <X className="mr-1 h-4 w-4" />
                                {t('leads.search.clearFilters')}
                            </Button>
                        )}
                    </div>

                    <div
                        className="overflow-hidden rounded-lg border bg-card shadow-sm"
                        data-tour="leads-table"
                    >
                        {canManage && selectedLeads.size > 0 && (
                            <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
                                <span className="text-sm text-muted-foreground">
                                    {selectedLeads.size}{' '}
                                    {t('leads.table.selected')}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleBulkQualify}
                                    disabled={bulkTriggering}
                                    className="ml-auto"
                                >
                                    {bulkTriggering ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    {t('leads.actions.triggerQualification')}
                                </Button>
                            </div>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">
                                        <button
                                            onClick={handleSelectAll}
                                            className="flex items-center justify-center"
                                        >
                                            {selectedLeads.size ===
                                                leads.length &&
                                            leads.length > 0 ? (
                                                <Sparkles className="h-4 w-4 text-primary" />
                                            ) : (
                                                <div className="h-4 w-4 rounded border border-input" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        {t('leads.table.contact')}
                                    </TableHead>
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.result_tooltip',
                                            )}
                                        >
                                            {t('leads.table.result')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.aiScore_tooltip',
                                            )}
                                        >
                                            {t('leads.table.aiScore')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.status_tooltip',
                                            )}
                                        >
                                            {t('leads.table.status')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead className="max-w-[150px]">
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.notes_tooltip',
                                            )}
                                        >
                                            {t('leads.table.notes')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead className="max-w-[180px]">
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.lastMessage_tooltip',
                                            )}
                                        >
                                            {t('leads.table.lastMessage')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead>
                                        {t('leads.table.lastActive')}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t('leads.table.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            <button
                                                onClick={() =>
                                                    handleSelectLead(lead.id)
                                                }
                                                className="flex items-center justify-center"
                                            >
                                                {selectedLeads.has(lead.id) ? (
                                                    <Sparkles className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <div className="h-4 w-4 rounded border border-input" />
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={
                                                    show({
                                                        slug: activeWorkspace!
                                                            .slug,
                                                        lead: lead.id,
                                                    }).url
                                                }
                                                className="block"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {lead.is_new && (
                                                        <Badge className="bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                                                            NEW
                                                        </Badge>
                                                    )}
                                                    <p className="text-sm font-medium text-foreground">
                                                        {lead.name}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    +{lead.phone}
                                                </p>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {getQualificationResultBadge(
                                                lead.qualification_result,
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress
                                                    value={
                                                        ((lead.qualification_score ??
                                                            0) *
                                                            100) /
                                                        10
                                                    }
                                                    className="h-2 w-16"
                                                />
                                                <span className="w-8 text-xs font-medium tabular-nums">
                                                    {lead.qualification_score ??
                                                        0}
                                                    /10
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getTreatmentStatusBadge(
                                                lead.treatment_status,
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[150px]">
                                            {getNotesPreview(lead.notes)}
                                        </TableCell>
                                        <TableCell className="max-w-[180px]">
                                            {lead.recent_messages &&
                                            lead.recent_messages.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={
                                                            lead
                                                                .recent_messages[0]
                                                                .direction ===
                                                            'client'
                                                                ? 'bg-emerald-500 hover:bg-emerald-600'
                                                                : 'bg-teal-500 hover:bg-teal-600'
                                                        }
                                                    >
                                                        {lead.recent_messages[0]
                                                            .direction ===
                                                        'client'
                                                            ? '👤'
                                                            : '🤖'}
                                                    </Badge>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs">
                                                            {lead
                                                                .recent_messages[0]
                                                                .message
                                                                .length > 30
                                                                ? lead.recent_messages[0].message.substring(
                                                                      0,
                                                                      30,
                                                                  ) + '...'
                                                                : lead
                                                                      .recent_messages[0]
                                                                      .message}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {lead.recent_messages &&
                                            lead.recent_messages.length > 0
                                                ? formatMessageTime(
                                                      lead.recent_messages[0]
                                                          .timestamp,
                                                  )
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={
                                                        show({
                                                            slug: activeWorkspace!
                                                                .slug,
                                                            lead: lead.id,
                                                        }).url
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Users className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {canManage && (
                                                    <EditLead lead={lead} />
                                                )}
                                                {canManage && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleTriggerQualification(
                                                                lead.id,
                                                            )
                                                        }
                                                        disabled={
                                                            triggeringLeadId ===
                                                            lead.id
                                                        }
                                                        title={t(
                                                            'leads.actions.triggerQualification',
                                                        )}
                                                    >
                                                        {triggeringLeadId ===
                                                        lead.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Sparkles className="h-4 w-4 text-yellow-500" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {leads.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="py-12 text-center text-muted-foreground"
                                        >
                                            <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                            <p>{t('leads.empty.title')}</p>
                                            <p className="text-sm">
                                                {t('leads.empty.description')}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination links={initialLeads.links} />
                </div>
            </div>
        </AppLayout>
    );
}
