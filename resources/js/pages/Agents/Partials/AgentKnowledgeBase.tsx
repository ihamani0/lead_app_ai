import { router, useForm } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    CloudUpload,
    FileText,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Trash2,
    Download,
    MoreHorizontal,
    Upload,
    BookOpen,
    File,
} from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import agents from '@/routes/workspaces/agents';
import type { AgentConfig } from '@/types';

interface KnowledgeDocument {
    id: string;
    name: string;
    file_size: number | null;
    status: 'indexed' | 'processing' | 'failed';
    created_at: string;
    updated_at: string;
}

interface Props {
    agent: AgentConfig;
    canManage: boolean;
    slug: string;
}

const ITEMS_PER_PAGE = 7;

export default function AgentKnowledgeBase({ agent, canManage, slug }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const addInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    const { setData, post, processing, reset } = useForm({
        file: null as File | null,
    });

    const getDocs = (): KnowledgeDocument[] =>
        (agent as unknown as { knowledge_bases?: KnowledgeDocument[] })
            .knowledge_bases || [];

    const [docs, setDocs] = useState<KnowledgeDocument[]>(getDocs);

    useEffect(() => {
        setDocs(getDocs());
    }, [agent]);

    const channel = `knowledge-base.agent.${agent.id}`;
    useEcho(
        channel,
        ['DocumentStatusUpdated'],
        (event: {
            documentId: string;
            status: string;
            documentName: string;
        }) => {
            setDocs((prev) =>
                prev.map((doc) =>
                    doc.id === event.documentId
                        ? {
                              ...doc,
                              status: event.status as KnowledgeDocument['status'],
                          }
                        : doc,
                ),
            );

            if (event.status === 'indexed') {
                toast.success(`"${event.documentName}" Finished successfully`, {
                    position: 'top-right',
                });
            } else if (event.status === 'failed') {
                toast.error(`"${event.documentName}" indexing failed`);
            }
        },
    );

    const knowledgeStats = useMemo(() => {
        const total_documents = docs.length;
        const indexed_count = docs.filter((d) => d.status === 'indexed').length;
        const processing_count = docs.filter(
            (d) => d.status === 'processing',
        ).length;
        const totalWords = docs.reduce((sum, d) => sum + (d.file_size || 0), 0);
        const total_words = Math.floor(totalWords / 5);
        const dates = docs.map((d) => d.updated_at).filter(Boolean);
        const last_updated_at =
            dates.length > 0
                ? dates.reduce((latest, curr) =>
                      curr > latest ? curr : latest,
                  )
                : null;

        return {
            total_documents,
            indexed_count,
            processing_count,
            total_words,
            last_updated_at,
        };
    }, [docs]);

    const filteredDocs = docs.filter((doc) => {
        const matchesSearch = doc.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const ext = doc.name.split('.').pop()?.toLowerCase() || '';
        const matchesType = typeFilter === 'all' || ext === typeFilter;
        const matchesStatus =
            statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredDocs.length / ITEMS_PER_PAGE),
    );
    const paginatedDocs = filteredDocs.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
    );

    const getTypeInfo = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const map: Record<string, { label: string; class: string }> = {
            pdf: {
                label: 'PDF',
                class: 'bg-red-100 text-red-700 border-red-200',
            },
            docx: {
                label: 'DOCX',
                class: 'bg-blue-100 text-blue-700 border-blue-200',
            },
            xlsx: {
                label: 'XLSX',
                class: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            },
            txt: {
                label: 'TXT',
                class: 'bg-slate-100 text-slate-600 border-slate-200',
            },
        };
        return (
            map[ext] || {
                label: ext.toUpperCase(),
                class: 'bg-slate-100 text-slate-600 border-slate-200',
            }
        );
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'indexed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Analysé
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        En cours
                    </span>
                );
            case 'failed':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        <AlertCircle className="h-3 w-3" />
                        Échec
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        <Clock className="h-3 w-3" />
                        {status}
                    </span>
                );
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} o`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const relativeTime = (dateString: string | null) => {
        if (!dateString) return 'Jamais';
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "À l'instant";
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30) return `Il y a ${diffDays}j`;
        return formatDate(dateString);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (processing || !selected) return;
        if (selected) {
            setData('file', selected);
            post(agents.knowledge.store({ slug, agent: agent.id }).url, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (addInputRef.current) addInputRef.current.value = '';
                },
            });
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (processing) return;
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setData('file', file);
            post(agents.knowledge.store({ slug, agent: agent.id }).url, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (addInputRef.current) addInputRef.current.value = '';
                },
            });
        }
    };

    const handleDelete = (docId: string) => {
        if (confirm('Supprimer ce document ?')) {
            router.delete(
                agents.knowledge.destroy({ slug, agent: agent.id, id: docId })
                    .url,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const typeOptions = [
        { value: 'all', label: 'Type : Tous' },
        { value: 'pdf', label: 'PDF' },
        { value: 'docx', label: 'DOCX' },
        { value: 'xlsx', label: 'XLSX' },
        { value: 'txt', label: 'TXT' },
    ];

    const statusOptions = [
        { value: 'all', label: 'Statut : Tous' },
        { value: 'indexed', label: 'Analysé' },
        { value: 'processing', label: 'En cours' },
        { value: 'failed', label: 'Échec' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Connaissances
                </h1>
                <p className="text-muted-foreground">
                    Ajoutez et gérez les connaissances que votre IA utilisera
                    pour répondre avec précision.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left column: Upload + Table */}
                <div className="space-y-6 lg:col-span-8">
                    {/* Upload Zone */}
                    {canManage && (
                        <div
                            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                                processing
                                    ? 'border-slate-300 bg-slate-50/50 opacity-60'
                                    : dragActive
                                      ? 'border-purple-400 bg-purple-50/50'
                                      : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50/30'
                            } ${processing ? 'pointer-events-none' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div
                                className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${
                                    processing
                                        ? 'bg-slate-200'
                                        : 'bg-purple-100'
                                }`}
                            >
                                {processing ? (
                                    <Loader2 className="h-7 w-7 animate-spin text-slate-500" />
                                ) : (
                                    <CloudUpload className="h-7 w-7 text-purple-600" />
                                )}
                            </div>
                            <p className="text-base font-medium text-slate-700">
                                {processing
                                    ? 'Upload en cours…'
                                    : 'Glissez-déposez vos fichiers ici'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {processing
                                    ? 'Veuillez patienter pendant le traitement du document.'
                                    : 'PDF, DOCX, TXT acceptés (max. 25 Mo par fichier)'}
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4 gap-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Upload className="h-4 w-4" />
                                )}
                                Parcourir les fichiers
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.txt,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Vos documents
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Retrouvez, filtrez et gérez tous les documents
                                utilisés par votre IA.
                            </p>
                        </div>
                        {canManage && (
                            <Button
                                className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
                                onClick={() => addInputRef.current?.click()}
                                disabled={processing}
                            >
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <File className="h-4 w-4" />
                                )}
                                {processing
                                    ? 'Upload en cours…'
                                    : 'Ajouter des documents'}
                            </Button>
                        )}
                        <input
                            ref={addInputRef}
                            type="file"
                            accept=".pdf,.txt,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Rechercher un document..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="h-10 pl-9"
                            />
                        </div>
                        <Select
                            value={typeFilter}
                            onValueChange={(v) => {
                                setTypeFilter(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-10 w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {typeOptions.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={(v) => {
                                setStatusFilter(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="h-10 w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Document Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                        <TableHead className="font-semibold">
                                            Document
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Type
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Statut
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            Ajouté le
                                        </TableHead>
                                        <TableHead className="w-16" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedDocs.length > 0 ? (
                                        paginatedDocs.map((doc) => {
                                            const type = getTypeInfo(doc.name);
                                            return (
                                                <TableRow
                                                    key={doc.id}
                                                    className="group hover:bg-slate-50/50"
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                                                                <FileText className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {doc.name}
                                                                </p>
                                                                {doc.file_size && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {formatFileSize(
                                                                            doc.file_size,
                                                                        )}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${type.class}`}
                                                        >
                                                            {type.label}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            doc.status,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDate(
                                                            doc.created_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-40"
                                                            >
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        window.open(
                                                                            agents.document.download(
                                                                                {
                                                                                    slug,
                                                                                    agent: agent.id,
                                                                                    id: doc.id,
                                                                                },
                                                                            )
                                                                                .url,
                                                                        )
                                                                    }
                                                                >
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Télécharger
                                                                </DropdownMenuItem>
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
                                                                        Supprimer
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-48 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <BookOpen className="h-8 w-8 opacity-50" />
                                                    <p className="text-sm font-medium">
                                                        Aucun document trouvé
                                                    </p>
                                                    <p className="text-xs">
                                                        {searchQuery ||
                                                        typeFilter !== 'all' ||
                                                        statusFilter !== 'all'
                                                            ? 'Essayez de modifier vos filtres.'
                                                            : 'Déposez vos premiers fichiers ci-dessus.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {filteredDocs.length} document
                                {filteredDocs.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Précédent
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Suivant
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column: Stats */}
                <div className="space-y-4 lg:col-span-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4 text-purple-600" />
                                Aperçu des connaissances
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Documents
                                </span>
                                <span className="font-semibold">
                                    {knowledgeStats.total_documents}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Mots analysés
                                </span>
                                <span className="font-semibold">
                                    {knowledgeStats.total_words.toLocaleString(
                                        'fr-FR',
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Indexés
                                </span>
                                <span className="font-semibold text-emerald-600">
                                    {knowledgeStats.indexed_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Dernière mise à jour
                                </span>
                                <span className="font-semibold">
                                    {relativeTime(
                                        knowledgeStats.last_updated_at,
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
