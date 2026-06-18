import { router } from '@inertiajs/react';
import {
    Download,
    File as FileIcon,
    FileSpreadsheet,
    FileText,
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import knowledge from '@/routes/workspaces/knowledge';
import type { AgentConfig } from '@/types';

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
    agent?: AgentConfig | null;
}

interface DocumentTableProps {
    documents: KnowledgeDocument[];
    canManage: boolean;
}

const TYPE_STYLES: Record<
    string,
    { icon: React.ReactNode; badgeClass: string }
> = {
    PDF: {
        icon: <FileText className="h-4 w-4 text-red-500" />,
        badgeClass: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    },
    XLSX: {
        icon: <FileSpreadsheet className="h-4 w-4 text-emerald-500" />,
        badgeClass:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    DOCX: {
        icon: <FileText className="h-4 w-4 text-blue-500" />,
        badgeClass:
            'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    },
    TXT: {
        icon: <FileIcon className="h-4 w-4 text-gray-500" />,
        badgeClass:
            'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
};

const DEFAULT_STYLE = {
    icon: <FileText className="h-4 w-4 text-gray-500" />,
    badgeClass: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

function getStatusBadge(status: string) {
    if (status === 'indexed') {
        return (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ Analysé
            </span>
        );
    }
    if (status === 'processing') {
        return (
            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                En cours
            </span>
        );
    }
    return (
        <span className="text-xs font-medium text-red-600 dark:text-red-400">
            Échec
        </span>
    );
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function DocumentTable({ documents, canManage }: DocumentTableProps) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();

    const handleDelete = (id: string) => {
        if (confirm(t('knowledgeBase.deleteConfirm') || 'Are you sure?')) {
            router.delete(
                knowledge.destroy({ slug: activeWorkspace!.slug, id }).url,
            );
        }
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-transparent">
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.document')}
                            </TableHead>
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.type')}
                            </TableHead>
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.folder')}
                            </TableHead>
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.status')}
                            </TableHead>
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.usedIn')}
                            </TableHead>
                            <TableHead className="font-semibold">
                                {t('bibliotheque.documents.table.addedOn')}
                            </TableHead>
                            <TableHead className="w-[50px] font-semibold">
                                {t('bibliotheque.documents.table.actions')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-48 text-center text-muted-foreground"
                                >
                                    {t(
                                        'knowledgeBase.documentsTable.noDocuments',
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => {
                                const style =
                                    TYPE_STYLES[doc.file_type ?? ''] ??
                                    DEFAULT_STYLE;
                                return (
                                    <TableRow
                                        key={doc.id}
                                        className="transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-3">
                                                {style.icon}
                                                <div>
                                                    <p className="max-w-[220px] truncate text-sm font-medium text-foreground">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {doc.file_size_formatted ||
                                                            '—'}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={cn(
                                                    'inline-block rounded-md px-2 py-0.5 text-xs font-medium',
                                                    style.badgeClass,
                                                )}
                                            >
                                                {doc.file_type || '—'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {doc.folder || '—'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(doc.status)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {doc.agent?.name || '—'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(doc.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-40"
                                                >
                                                    <DropdownMenuItem>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        {t(
                                                            'bibliotheque.documents.actions.view',
                                                        )}
                                                    </DropdownMenuItem>
                                                    {doc.status !==
                                                        'processing' && (
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <a
                                                                href={
                                                                    activeWorkspace
                                                                        ? knowledge.web.download(
                                                                              {
                                                                                  slug: activeWorkspace.slug,
                                                                                  id: doc.id,
                                                                              },
                                                                          ).url
                                                                        : '#'
                                                                }
                                                                className="flex items-center"
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Télécharger
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    {canManage && (
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    doc.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            {t(
                                                                'bibliotheque.documents.actions.delete',
                                                            )}
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {documents.length > 0 && (
                <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
                    <span>
                        {t('bibliotheque.documents.pagination.showing')
                            .replace('{from}', String(documents.length))
                            .replace('{total}', String(documents.length))}
                    </span>
                    <span>
                        10 {t('bibliotheque.documents.pagination.perPage')}
                    </span>
                </div>
            )}
        </div>
    );
}
