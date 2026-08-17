import { router } from '@inertiajs/react';
import {
    Download,
    FilterX,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import admin from '@/routes/admin';

const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    CONTACTED: 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    QUALIFIED: 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    UNQUALIFIED: 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    CONVERTED: 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
};

const TEMP_COLORS: Record<string, string> = {
    HOT: 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    WARM: 'bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    COLD: 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
};

type Lead = {
    id: string;
    tenant: { id: string; name: string; slug: string } | null;
    team: { id: string; name: string } | null;
    instance: { id: string; instance_name: string } | null;
    name: string;
    phone: string;
    email: string | null;
    status: string;
    temperature: string;
    contact_status: string;
    qualification_result: string | null;
    qualification_score: number;
    ai_summary: string | null;
    notes: string | null;
    is_new: boolean;
    created_at: string;
    last_activity_at: string | null;
};

type Props = {
    leads: Lead[];
    pagination: {
        from: number | null;
        to: number | null;
        total: number;
        last_page: number;
        per_page: number;
        current_page: number;
        links: PaginationLink[];
    };
    tenants: Array<{ id: string; name: string }>;
    filters: {
        tenant_id?: string;
        status?: string;
        temperature?: string;
        qualification?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    };
};

export default function LeadsIndex({ leads, pagination, tenants, filters }: Props) {
    const { t } = useTranslation();

    const [localFilters, setLocalFilters] = useState({
        tenant_id: filters.tenant_id ?? '',
        status: filters.status ?? '',
        temperature: filters.temperature ?? '',
        qualification: filters.qualification ?? '',
        search: filters.search ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const applyFilters = () => {
        const params: Record<string, string> = {};
        for (const [key, value] of Object.entries(localFilters)) {
            if (value) params[key] = value;
        }
        router.get(admin.leads.index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            tenant_id: '',
            status: '',
            temperature: '',
            qualification: '',
            search: '',
            date_from: '',
            date_to: '',
        });
        router.get(admin.leads.index().url, {}, {
            preserveState: true,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') applyFilters();
    };

    const goToPage = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString();
    };

    const timeAgo = (dateStr: string | null) => {
        if (!dateStr) return '—';
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return '1 day ago';
        if (days < 30) return `${days} days ago`;
        return formatDate(dateStr);
    };

    return (
        <SuperAdminLayout>
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('superAdmin.leads.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.tenant')}</p>
                                <Select
                                    value={localFilters.tenant_id}
                                    onValueChange={(v) => setLocalFilters((f) => ({ ...f, tenant_id: v === '_all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder={t('superAdmin.leads.filters.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">{t('superAdmin.leads.filters.all')}</SelectItem>
                                        {tenants.map((t) => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.status')}</p>
                                <Select
                                    value={localFilters.status}
                                    onValueChange={(v) => setLocalFilters((f) => ({ ...f, status: v === '_all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder={t('superAdmin.leads.filters.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">{t('superAdmin.leads.filters.all')}</SelectItem>
                                        <SelectItem value="NEW">NEW</SelectItem>
                                        <SelectItem value="CONTACTED">CONTACTED</SelectItem>
                                        <SelectItem value="QUALIFIED">QUALIFIED</SelectItem>
                                        <SelectItem value="UNQUALIFIED">UNQUALIFIED</SelectItem>
                                        <SelectItem value="CONVERTED">CONVERTED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.temperature')}</p>
                                <Select
                                    value={localFilters.temperature}
                                    onValueChange={(v) => setLocalFilters((f) => ({ ...f, temperature: v === '_all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('superAdmin.leads.filters.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">{t('superAdmin.leads.filters.all')}</SelectItem>
                                        <SelectItem value="HOT">HOT</SelectItem>
                                        <SelectItem value="WARM">WARM</SelectItem>
                                        <SelectItem value="COLD">COLD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.qualification')}</p>
                                <Select
                                    value={localFilters.qualification}
                                    onValueChange={(v) => setLocalFilters((f) => ({ ...f, qualification: v === '_all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('superAdmin.leads.filters.all')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="_all">{t('superAdmin.leads.filters.all')}</SelectItem>
                                        <SelectItem value="HOT">HOT</SelectItem>
                                        <SelectItem value="WARM">WARM</SelectItem>
                                        <SelectItem value="COLD">COLD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.search')}</p>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="w-52 pl-8"
                                        placeholder={t('superAdmin.leads.filters.searchPlaceholder')}
                                        value={localFilters.search}
                                        onChange={(e) => setLocalFilters((f) => ({ ...f, search: e.target.value }))}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.dateFrom')}</p>
                                <Input
                                    type="date"
                                    className="w-40"
                                    value={localFilters.date_from}
                                    onChange={(e) => setLocalFilters((f) => ({ ...f, date_from: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t('superAdmin.leads.filters.dateTo')}</p>
                                <Input
                                    type="date"
                                    className="w-40"
                                    value={localFilters.date_to}
                                    onChange={(e) => setLocalFilters((f) => ({ ...f, date_to: e.target.value }))}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={applyFilters}>
                                    <Search className="mr-2 h-4 w-4" />
                                    {t('superAdmin.leads.filters.search')}
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    <FilterX className="mr-2 h-4 w-4" />
                                    {t('superAdmin.leads.filters.clear')}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        for (const [key, value] of Object.entries(localFilters)) {
                                            if (value) params.set(key, value);
                                        }
                                        window.open(
                                            `${admin.leads.export().url}?${params.toString()}`,
                                            '_blank',
                                        );
                                    }}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('superAdmin.leads.filters.export')}
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('superAdmin.leads.table.headers.tenant')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.name')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.phone')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.email')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.status')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.temperature')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.qualification')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.lastActivity')}</TableHead>
                                        <TableHead>{t('superAdmin.leads.table.headers.created')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="font-medium">
                                                {lead.tenant?.name ?? '—'}
                                            </TableCell>
                                            <TableCell>{lead.name}</TableCell>
                                            <TableCell className="font-mono text-sm">{lead.phone}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {lead.email ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={STATUS_COLORS[lead.status] ?? ''}
                                                >
                                                    {lead.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={TEMP_COLORS[lead.temperature] ?? ''}
                                                >
                                                    {lead.temperature}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {lead.qualification_result
                                                    ? `${lead.qualification_result} (${lead.qualification_score})`
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {timeAgo(lead.last_activity_at)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(lead.created_at)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {leads.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                                                {t('superAdmin.leads.table.empty')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {pagination.from}–{pagination.to} of {pagination.total}
                                </p>
                                <div className="flex gap-1">
                                    {pagination.links.map((link, i) => {
                                        if (link.label.includes('...')) {
                                            return (
                                                <span key={i} className="px-2 py-1 text-sm text-muted-foreground">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={i}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className="min-w-9"
                                                onClick={() => goToPage(link.url)}
                                                disabled={!link.url}
                                            >
                                                {link.label
                                                    .replace('&laquo;', '‹')
                                                    .replace('&raquo;', '›')}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </SuperAdminLayout>
    );
}
