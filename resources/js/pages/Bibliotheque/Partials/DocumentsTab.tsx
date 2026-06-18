import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/use-translation';
import type { AgentConfig } from '@/types';
import { DocumentsKpiCards } from './DocumentsKpiCards';
import { DocumentTable } from './DocumentTable';
import { KnowledgeQualityCard } from './KnowledgeQualityCard';

interface KnowledgeDocument {
    id: string;
    name: string;
    file_path?: string | null;
    file_size?: number | null;
    file_size_formatted?: string;
    file_type?: string;
    folder?: string;
    usage_count?: number;
    status: string;
    created_at: string;
    updated_at: string;
    agent_config_id?: string | null;
    team_id?: number | null;
    agent?: AgentConfig | null;
}

interface DocumentStats {
    total: number;
    words_analyzed: number;
    size_bytes: number;
    size_gb: number;
    sources: number;
}

interface DocumentsTabProps {
    documents: KnowledgeDocument[];
    stats: DocumentStats;
    qualityScore: number;
    canManage: boolean;
    tenantId: string;
}

const FILE_TYPES = ['PDF', 'XLSX', 'DOCX', 'TXT'];
const STATUSES = ['analyzed', 'processing', 'failed'];

const STATUS_MAP: Record<string, string> = {
    analyzed: 'indexed',
    processing: 'processing',
    failed: 'failed',
};

export function DocumentsTab({
    documents,
    stats,
    qualityScore,
    canManage,
}: DocumentsTabProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const filtered = useMemo(() => {
        let result = [...documents];

        if (search) {
            result = result.filter((doc) =>
                doc.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (typeFilter !== 'all') {
            result = result.filter(
                (doc) =>
                    doc.file_type?.toLowerCase() === typeFilter.toLowerCase(),
            );
        }

        if (statusFilter !== 'all') {
            const dbStatus = STATUS_MAP[statusFilter] ?? statusFilter;
            result = result.filter((doc) => doc.status === dbStatus);
        }

        if (sortBy === 'recent') {
            result.sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            );
        } else if (sortBy === 'oldest') {
            result.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime(),
            );
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [documents, search, typeFilter, statusFilter, sortBy]);

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <DocumentsKpiCards stats={stats} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                {/* Main content */}
                <div className="space-y-4 xl:col-span-8">
                    {/* Filters */}
                    <Card className="border-0 bg-card shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="relative min-w-[200px] flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder={t(
                                            'bibliotheque.documents.filters.search',
                                        )}
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="h-10 rounded-lg pl-9"
                                    />
                                </div>

                                <Select
                                    value={typeFilter}
                                    onValueChange={setTypeFilter}
                                >
                                    <SelectTrigger className="h-10 w-[130px] rounded-lg">
                                        <SelectValue
                                            placeholder={t(
                                                'bibliotheque.documents.filters.typeAll',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t(
                                                'bibliotheque.documents.filters.typeAll',
                                            )}
                                        </SelectItem>
                                        {FILE_TYPES.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type.toLowerCase()}
                                            >
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="h-10 w-[130px] rounded-lg">
                                        <SelectValue
                                            placeholder={t(
                                                'bibliotheque.documents.filters.statusAll',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t(
                                                'bibliotheque.documents.filters.statusAll',
                                            )}
                                        </SelectItem>
                                        {STATUSES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {t(
                                                    `bibliotheque.documents.status.${s}`,
                                                )}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="ml-auto">
                                    <Select
                                        value={sortBy}
                                        onValueChange={setSortBy}
                                    >
                                        <SelectTrigger className="h-10 w-[160px] rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">
                                                {t(
                                                    'bibliotheque.documents.filters.sortRecent',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="oldest">
                                                {t(
                                                    'bibliotheque.documents.filters.sortOldest',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="name">
                                                {t(
                                                    'bibliotheque.documents.filters.sortName',
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table */}
                    <DocumentTable documents={filtered} canManage={canManage} />
                </div>

                {/* Right sidebar */}
                <div className="space-y-4 xl:col-span-4">
                    <KnowledgeQualityCard score={qualityScore} />
                </div>
            </div>
        </div>
    );
}
