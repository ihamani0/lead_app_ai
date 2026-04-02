import { Head, router } from '@inertiajs/react';
import {
    Flame,
    Search,
    Snowflake,
    ThermometerSun,
    X,
    Users,
    Loader2,
    Sparkles,
    Info,
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

import { index, triggerQualification } from '@/routes/leads';
import type { EvolutionInstance, Lead as LeadType } from '@/types';
import EditLead from './Partials/EditLead';
import ViewLead from './Partials/ViewLead';

type Props = {
    leads: { data: LeadType[]; links: PaginationLink[] };
    filters: any;
    instances: EvolutionInstance[];
};

export default function LeadsIndex({ leads, filters, instances }: Props) {
    const { t } = useTranslation();

    // Styling helper for Temperature

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

    // 2. Automatically apply filters when state changes (with debounce)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            router.get(index().url, params, {
                preserveState: true,
                preserveScroll: true,
                replace: true, // Prevents filling up browser history with every keystroke
            });
        }, 400); // 400ms delay

        return () => clearTimeout(timeoutId);
    }, [params]);

    // Handle input changes easily
    const handleChange = (key: string, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
    };

    // Clear filters
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

    const getTempBadge = (temp: string) => {
        switch (temp?.toUpperCase()) {
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
                return <Badge variant="outline">New</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'QUALIFYING':
                return (
                    <Badge className="border-purple-200 bg-purple-100 text-purple-800">
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Qualifying
                    </Badge>
                );
            case 'QUALIFIED':
                return (
                    <Badge className="border-green-200 bg-green-100 text-green-800">
                        Qualified
                    </Badge>
                );
            case 'IN_PROGRESS':
                return <Badge variant="secondary">In Progress</Badge>;
            case 'WON':
                return (
                    <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
                        Won
                    </Badge>
                );
            case 'LOST':
                return <Badge variant="destructive">Lost</Badge>;
            case 'NEW':
                return <Badge variant="outline">New</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const StatusInfoTooltip = () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Info className="mr-1 h-3 w-3" />
                        {t('leads.statusInfo.button')}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="w-auto bg-background p-3 text-foreground">
                    <div className="text-xs">
                        <p className="mb-2 font-semibold">
                            {t('leads.statusInfo.title')}
                        </p>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="pr-2 pb-1 font-medium">
                                        {t('leads.statusInfo.n8nStatus')}
                                    </th>
                                    <th className="pr-2 pb-1 font-medium">
                                        {t('leads.statusInfo.dbStatus')}
                                    </th>
                                    <th className="pb-1 font-medium">
                                        {t('leads.statusInfo.meaning')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-1 pr-2 text-red-600">
                                        HOT
                                    </td>
                                    <td className="py-1 pr-2">QUALIFIED</td>
                                    <td className="py-1">
                                        {t('leads.statusInfo.hot')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-orange-600">
                                        WARM
                                    </td>
                                    <td className="py-1 pr-2">IN_PROGRESS</td>
                                    <td className="py-1">
                                        {t('leads.statusInfo.warm')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-blue-600">
                                        COLD
                                    </td>
                                    <td className="py-1 pr-2">IN_PROGRESS</td>
                                    <td className="py-1">
                                        {t('leads.statusInfo.cold')}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-1 pr-2 text-gray-600">
                                        PENDING
                                    </td>
                                    <td className="py-1 pr-2">NEW</td>
                                    <td className="py-1">
                                        {t('leads.statusInfo.pending')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <AppLayout>
            <Head title={t('leads.title')} />
            <div className="space-y-6 py-12 sm:px-6 lg:px-8">
                {/* Header - Emerald/Green Gradient */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-teal-700 to-cyan-800 p-8 shadow-2xl ring-1 ring-emerald-400/30 md:p-12 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 dark:ring-emerald-700/50">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
                    <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl">
                                    {t('leads.title')}
                                </h1>
                            </div>
                            <p className="max-w-xl text-sm font-light text-white/90 md:text-base lg:text-lg">
                                {t('leads.description')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md md:text-sm">
                                <Users className="h-4 w-4" />
                                <span>
                                    {leads.data.length} {t('leads.leadsCount')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {/* Search Name/Phone */}
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

                    {/* NEW: Instance Select */}
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

                    {/* Status Select */}
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={params.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="">
                            {t('leads.search.allStatuses')}
                        </option>
                        <option value="NEW">{t('leads.search.new')}</option>
                        <option value="IN_PROGRESS">
                            {t('leads.search.inProgress')}
                        </option>
                        <option value="QUALIFIED">
                            {t('leads.search.qualified')}
                        </option>
                        <option value="QUALIFYING">
                            {t('leads.search.qualifying')}
                        </option>
                        <option value="WON">{t('leads.search.won')}</option>
                    </select>

                    {/* Temperature Select */}
                    <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={params.temperature}
                        onChange={(e) =>
                            handleChange('temperature', e.target.value)
                        }
                    >
                        <option value="">
                            {t('leads.search.allTemperatures')}
                        </option>
                        <option value="HOT">🔥 {t('leads.search.hot')}</option>
                        <option value="WARM">
                            ☀️ {t('leads.search.warm')}
                        </option>
                        <option value="COLD">
                            ❄️ {t('leads.search.cold')}
                        </option>
                    </select>

                    {/* Min Score */}
                    <Input
                        type="number"
                        placeholder={t('leads.search.minScore')}
                        value={params.min_score}
                        onChange={(e) =>
                            handleChange('min_score', e.target.value)
                        }
                        min="0"
                        max="100"
                    />

                    {/* Date From */}
                    <Input
                        type="date"
                        title="Created After Date"
                        value={params.date_from}
                        onChange={(e) =>
                            handleChange('date_from', e.target.value)
                        }
                    />

                    {/* Date To */}
                    <Input
                        type="date"
                        title="Created Before Date"
                        value={params.date_to}
                        onChange={(e) =>
                            handleChange('date_to', e.target.value)
                        }
                    />

                    {/* Active Filters / Clear Button */}
                    {Object.values(params).some((val) => val !== '') && (
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                                <X className="mr-1 h-4 w-4" />{' '}
                                {t('leads.search.clearFilters')}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-background">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-background dark:text-foreground">
                            <TableRow>
                                <TableHead>
                                    {t('leads.table.contact')}
                                </TableHead>
                                <TableHead>
                                    {t('leads.table.status')}
                                    <StatusInfoTooltip />
                                </TableHead>
                                <TableHead>
                                    {t('leads.table.temperature')}
                                </TableHead>
                                <TableHead className="w-[200px]">
                                    {t('leads.table.aiScore')}
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
                            {leads.data.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell>
                                        <p className="text-sm font-medium text-slate-900 md:text-base dark:text-foreground">
                                            {lead.name}
                                        </p>
                                        <p className="text-xs text-slate-500 md:text-sm dark:text-foreground">
                                            +{lead.phone}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(lead.status)}
                                    </TableCell>
                                    <TableCell>
                                        {getTempBadge(lead.temperature)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={
                                                    ((lead.qualification_score ||
                                                        0) *
                                                        100) /
                                                    10
                                                }
                                                className="h-2"
                                            />
                                            <span className="w-8 text-xs font-medium">
                                                {((lead.qualification_score ||
                                                    0) *
                                                    100) /
                                                    10}
                                                %
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {new Date(
                                            lead.updated_at,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="space-x-1 text-right">
                                        {/* Create this Show page next if you want detailed views */}
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
                                            {triggeringLeadId === lead.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4 text-yellow-500" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {leads.data.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
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

                {/* Add Pagination Component here if needed */}
                <Pagination links={leads.links} />
            </div>
        </AppLayout>
    );
}
