import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    Flame,
    Search,
    Snowflake,
    ThermometerSun,
    X,
    Users,
    Loader2,
    Sparkles,
    CheckCircle,
    CheckSquare,
    Square,
    MessageCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';

import { index, triggerQualification, bulkQualify } from '@/routes/leads';
import type { EvolutionInstance, Lead as LeadType } from '@/types';
import EditLead from './Partials/EditLead';
import ViewLead from './Partials/ViewLead';

type Props = {
    leads: { data: LeadType[]; links: PaginationLink[] };
    filters: any;
    instances: EvolutionInstance[];
};

export default function LeadsIndex({
    leads: initialLeads,
    filters,
    instances,
}: Props) {
    const { t } = useTranslation();

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
            bulkQualify().url,
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
            triggerQualification(leadId).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setTriggeringLeadId(null);
                },
            },
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(index().url, params, {
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

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                        <CheckCircle className="mr-1 h-3 w-3" /> Traité
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

    return (
        <AppLayout>
            <Head title={t('leads.title')} />
            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="space-y-6">
                    <div className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-4 shadow-xl ring-1 ring-emerald-400/30 sm:p-5 md:p-6 dark:from-emerald-700 dark:to-teal-700 dark:ring-emerald-600/40">
                        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
                                        <Users className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                    </div>
                                    <h1 className="text-lg leading-tight font-semibold text-white sm:text-xl md:text-3xl">
                                        {t('leads.title')}
                                    </h1>
                                </div>
                                <p className="max-w-xs text-xs font-light text-white/90 sm:max-w-md sm:text-sm md:text-base">
                                    {t('leads.description')}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm sm:text-xs">
                                    <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="whitespace-nowrap">
                                        {leads.length} {t('leads.leadsCount')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <div className="relative">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t('leads.search.placeholder')}
                                className="pl-9"
                                value={params.search}
                                onChange={(e) =>
                                    handleChange('search', e.target.value)
                                }
                            />
                        </div>

                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={params.instance_id}
                            onChange={(e) =>
                                handleChange('instance_id', e.target.value)
                            }
                        >
                            <option value="">
                                {t('leads.search.allInstances')}
                            </option>
                            {instances.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.display_name ||
                                        inst.instance_name.split('-')[1] ||
                                        inst.instance_name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={params.temperature}
                            onChange={(e) =>
                                handleChange('temperature', e.target.value)
                            }
                        >
                            <option value="">
                                {t('leads.search.allQualificationResults')}
                            </option>
                            <option value="UNQUALIFIED">
                                ⏳ Non qualifiés
                            </option>
                            <option value="HOT">
                                🔥 {t('leads.search.hot')}
                            </option>
                            <option value="WARM">
                                ☀️ {t('leads.search.warm')}
                            </option>
                            <option value="COLD">
                                ❄️ {t('leads.search.cold')}
                            </option>
                        </select>

                        <Input
                            type="number"
                            placeholder={t('leads.search.minScore')}
                            value={params.min_score}
                            onChange={(e) =>
                                handleChange('min_score', e.target.value)
                            }
                            min="0"
                            max="10"
                        />

                        <Input
                            type="date"
                            title="Created After Date"
                            value={params.date_from}
                            onChange={(e) =>
                                handleChange('date_from', e.target.value)
                            }
                        />

                        <Input
                            type="date"
                            title="Created Before Date"
                            value={params.date_to}
                            onChange={(e) =>
                                handleChange('date_to', e.target.value)
                            }
                        />

                        {Object.values(params).some((val) => val !== '') && (
                            <div className="flex justify-end pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    {t('leads.search.clearFilters')}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-white px-2 shadow-sm dark:bg-background">
                        {selectedLeads.size > 0 && (
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
                            <TableHeader className="bg-slate-50 dark:bg-background dark:text-foreground">
                                <TableRow>
                                    <TableHead className="w-10">
                                        <button
                                            onClick={handleSelectAll}
                                            className="flex items-center justify-center"
                                        >
                                            {selectedLeads.size ===
                                                leads.length &&
                                            leads.length > 0 ? (
                                                <CheckSquare className="h-4 w-4 text-primary" />
                                            ) : (
                                                <Square className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <div className="flex items-center gap-1">
                                            {t('leads.table.contact')}
                                        </div>
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
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.notes_tooltip',
                                            )}
                                        >
                                            {t('leads.table.notes')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        <TooltipHeader text={t('leads.table.lastMessage_tooltip')}>
                                            {t('leads.table.lastMessage')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.date_lastMessage_tooltip',
                                            )}
                                        >
                                            {t('leads.table.lastActive')}
                                        </TooltipHeader>
                                    </TableHead>
                                    <TableHead>
                                        <TooltipHeader
                                            text={t(
                                                'leads.table.lastQualificationDate_tooltip',
                                            )}
                                        >
                                            {t(
                                                'leads.table.lastQualificationDate',
                                            )}
                                        </TooltipHeader>
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
                                                    <CheckSquare className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <Square className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {lead.is_new && (
                                                    <Badge className="bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                                                        NEW
                                                    </Badge>
                                                )}
                                                <p className="text-sm font-medium text-slate-900 md:text-base dark:text-foreground">
                                                    {lead.name}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-500 md:text-sm dark:text-foreground">
                                                +{lead.phone}
                                            </p>
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
                                                    className="h-2"
                                                />
                                                <span className="w-8 text-xs font-medium">
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
                                        <TableCell className="max-w-[200px]">
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
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {formatMessageTime(
                                                                lead
                                                                    .recent_messages[0]
                                                                    .timestamp,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="w-[100px] text-xs text-slate-500">
                                            {lead.recent_messages &&
                                            lead.recent_messages.length > 0
                                                ? formatMessageTime(
                                                      lead.recent_messages[0]
                                                          .timestamp,
                                                  )
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {formatDateTime(lead.qualified_at)}
                                        </TableCell>
                                        <TableCell className="space-x-1 text-right">
                                            <ViewLead selectedLead={lead} />
                                            <EditLead lead={lead} />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleTriggerQualification(
                                                        lead.id,
                                                    )
                                                }
                                                disabled={
                                                    triggeringLeadId === lead.id
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {leads.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            {t('leads.empty.title')}!{' '}
                                            {t('leads.empty.description')}
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
