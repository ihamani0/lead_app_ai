import { router } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    HelpCircle,
    PencilLine,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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
import { cn } from '@/lib/utils';
import workspaces from '@/routes/workspaces';
import type { Agent, Faq, FaqPaginated } from '../types';
import { FaqFormPanel } from './FaqFormPanel';
import { SuggestionsDialog } from './SuggestionsDialog';

interface FaqTabProps {
    faqs: FaqPaginated;
    suggestions: Faq[];
    agents: Agent[];
    canCreate: boolean;
    canManage: boolean;
}

const CATEGORIES = [
    'price',
    'location',
    'process',
    'finance',
    'technical',
    'general',
];

const CATEGORY_COLORS: Record<string, string> = {
    price: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50',
    location:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50',
    process:
        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/50',
    finance:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50',
    technical:
        'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800/50',
    general:
        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-400 dark:border-gray-800/50',
};

export function FaqTab({
    faqs,
    suggestions,
    canCreate,
    canManage,
}: FaqTabProps) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);

    const filteredFaqs = (faqs?.data || []).filter((faq) => {
        const qMatch = faq.question
            .toLowerCase()
            .includes(search.toLowerCase());
        const catMatch =
            categoryFilter === 'all' || faq.category === categoryFilter;
        const statusMatch =
            statusFilter === 'all' ||
            (statusFilter === 'active' && faq.is_active) ||
            (statusFilter === 'inactive' && !faq.is_active);
        return qMatch && catMatch && statusMatch;
    });

    const handleDelete = (faq: Faq) => {
        if (confirm('Delete this FAQ question?')) {
            router.delete(
                workspaces.faqs.destroy({
                    slug: activeWorkspace!.slug,
                    faq: faq.id,
                }).url,
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    };

    const handleToggle = (faq: Faq) => {
        router.post(
            workspaces.faqs.toggle({ slug: activeWorkspace!.slug, faq: faq.id })
                .url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleEdit = (faq: Faq) => {
        setEditingFaq(faq);
        setShowForm(true);
    };

    const handleAdd = () => {
        setEditingFaq(null);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setEditingFaq(null);
        setShowForm(false);
    };

    const handleAnalyze = () => {
        setAnalyzing(true);
        router.post(
            workspaces.faqs.analyze({ slug: activeWorkspace!.slug }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setAnalyzing(false),
            },
        );
    };

    const handleAcceptSuggestion = (suggestion: Faq) => {
        router.post(
            workspaces.faqs.accept({
                slug: activeWorkspace!.slug,
                faq: suggestion.id,
            }).url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const handleEditSuggestion = (suggestion: Faq) => {
        setEditingFaq(suggestion);
        setShowForm(true);
    };

    return (
        <TooltipProvider delayDuration={400}>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold text-foreground">
                            {t('bibliotheque.faq.title')}
                        </h2>
                        <Badge variant="secondary">{faqs?.total ?? 0}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {suggestions.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950"
                                onClick={() => setShowSuggestionsDialog(true)}
                            >
                                <Sparkles className="h-4 w-4" />
                                Suggestions IA ({suggestions.length})
                            </Button>
                        )}
                        {canCreate && (
                            <Button
                                size="sm"
                                className="gap-2"
                                onClick={handleAdd}
                            >
                                <Plus className="h-4 w-4" />
                                {t('bibliotheque.faq.addQuestion')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Suggestions Dialog */}
                <SuggestionsDialog
                    open={showSuggestionsDialog}
                    onOpenChange={setShowSuggestionsDialog}
                    suggestions={suggestions}
                    onAccept={handleAcceptSuggestion}
                    onEdit={handleEditSuggestion}
                    onReject={handleDelete}
                />

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={t('bibliotheque.faq.filters.search')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 rounded-lg pl-9"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="h-10 w-full rounded-lg sm:w-[150px]">
                                <SelectValue
                                    placeholder={t(
                                        'bibliotheque.faq.filters.categoryAll',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('bibliotheque.faq.filters.categoryAll')}
                                </SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {t(
                                            `bibliotheque.faq.categories.${cat}`,
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="h-10 w-full rounded-lg sm:w-[140px]">
                                <SelectValue
                                    placeholder={t(
                                        'bibliotheque.faq.filters.statusAll',
                                    )}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('bibliotheque.faq.filters.statusAll')}
                                </SelectItem>
                                <SelectItem value="active">
                                    {t('bibliotheque.faq.table.active')}
                                </SelectItem>
                                <SelectItem value="inactive">
                                    {t('bibliotheque.faq.table.inactive')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Analyser card */}
                <div className="flex flex-col gap-3 rounded-lg border border-dashed bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        <span>
                            Analysez vos conversations pour générer des
                            suggestions de FAQ
                        </span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={handleAnalyze}
                        disabled={analyzing}
                    >
                        <Sparkles
                            className={cn(
                                'h-3.5 w-3.5',
                                analyzing && 'animate-pulse',
                            )}
                        />
                        {analyzing
                            ? 'Analyse en cours...'
                            : 'Analyser les conversations'}
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-transparent">
                                    <TableHead className="w-full min-w-[200px] font-semibold">
                                        {t('bibliotheque.faq.table.question')}
                                    </TableHead>
                                    <TableHead className="w-[100px] font-semibold">
                                        {t('bibliotheque.faq.table.category')}
                                    </TableHead>
                                    <TableHead className="w-[70px] font-semibold">
                                        {t('bibliotheque.faq.table.used')}
                                    </TableHead>
                                    <TableHead className="w-[80px] font-semibold">
                                        {t('bibliotheque.faq.table.status')}
                                    </TableHead>
                                    <TableHead className="w-[110px] text-right font-semibold">
                                        {t('bibliotheque.faq.table.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFaqs.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center text-muted-foreground"
                                        >
                                            No FAQ questions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFaqs.map((faq) => (
                                        <TableRow
                                            key={faq.id}
                                            className="transition-colors hover:bg-muted/50"
                                        >
                                            <TableCell className="py-3">
                                                <p className="line-clamp-2 text-sm font-medium break-words text-foreground">
                                                    {faq.question}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                {faq.category ? (
                                                    <span
                                                        className={cn(
                                                            'inline-block rounded-md border px-2 py-0.5 text-xs font-medium',
                                                            CATEGORY_COLORS[
                                                                faq.category
                                                            ] ??
                                                                'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800/50 dark:bg-gray-950/50 dark:text-gray-400',
                                                        )}
                                                    >
                                                        {t(
                                                            `bibliotheque.faq.categories.${faq.category}`,
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                                                {faq.usage_count} fois
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center gap-1.5 text-xs font-medium',
                                                        faq.is_active
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-muted-foreground',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'inline-block h-1.5 w-1.5 rounded-full',
                                                            faq.is_active
                                                                ? 'bg-emerald-500'
                                                                : 'bg-gray-300 dark:bg-gray-600',
                                                        )}
                                                    />
                                                    {faq.is_active
                                                        ? t(
                                                              'bibliotheque.faq.table.active',
                                                          )
                                                        : t(
                                                              'bibliotheque.faq.table.inactive',
                                                          )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-0.5">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 sm:h-8 sm:w-8"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        faq,
                                                                    )
                                                                }
                                                            >
                                                                <PencilLine className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Modifier
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 sm:h-8 sm:w-8"
                                                                onClick={() =>
                                                                    handleToggle(
                                                                        faq,
                                                                    )
                                                                }
                                                            >
                                                                {faq.is_active ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {faq.is_active
                                                                ? 'Désactiver'
                                                                : 'Activer'}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    {canManage && (
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 sm:h-8 sm:w-8 dark:hover:bg-red-950/50"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            faq,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                Supprimer
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {faqs && faqs.last_page > 1 && (
                        <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-center text-xs text-muted-foreground sm:text-left">
                                Page {faqs.current_page} / {faqs.last_page}
                            </span>
                            <div className="flex justify-center gap-2">
                                {faqs.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            router.get(
                                                window.location.pathname,
                                                {
                                                    tab: 'faq',
                                                    page: faqs.current_page - 1,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    >
                                        ← Précédent
                                    </Button>
                                )}
                                {faqs.current_page < faqs.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            router.get(
                                                window.location.pathname,
                                                {
                                                    tab: 'faq',
                                                    page: faqs.current_page + 1,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    >
                                        Suivant →
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sheet — formulaire coulissant */}
                <Sheet
                    open={showForm}
                    onOpenChange={(open) => {
                        if (!open) handleFormClose();
                    }}
                >
                    <SheetContent side="right" className="w-full sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>
                                {editingFaq
                                    ? 'Modifier la question'
                                    : 'Ajouter une question'}
                            </SheetTitle>
                            <SheetDescription>
                                {editingFaq
                                    ? 'Modifiez la question et la réponse ci-dessous.'
                                    : 'Ajoutez une nouvelle question fréquemment posée.'}
                            </SheetDescription>
                        </SheetHeader>
                        <FaqFormPanel
                            faq={editingFaq}
                            onClose={handleFormClose}
                        />
                    </SheetContent>
                </Sheet>
            </div>
        </TooltipProvider>
    );
}
