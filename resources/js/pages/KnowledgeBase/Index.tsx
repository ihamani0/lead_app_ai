import { Head, useForm } from '@inertiajs/react';
import {
    FileText,
    UploadCloud,
    Loader2,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Database,
    Zap,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { store } from '@/routes/knowledge';

type DocumentStatus = 'indexed' | 'processing' | 'failed';

interface KnowledgeDocument {
    id: number;
    name: string;
    status: DocumentStatus;
    created_at: string;
}

// interface Instance {
    // instance_name: string;
// }

interface KnowledgeBaseIndexProps {
    documents: KnowledgeDocument[];
}
// instances: Instance[];

export default function KnowledgeBaseIndex({
    documents,
}: KnowledgeBaseIndexProps) {
    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        file: null as File | null,
    });
    // instance_names: [] as string[],

    // const toggleInstance = (instance_name: string) => {
    //     if (data.instance_names.includes(instance_name)) {
    //         setData(
    //             'instance_names',
    //             data.instance_names.filter((i) => i !== instance_name),
    //         );
    //     } else {
    //         setData('instance_names', [...data.instance_names, instance_name]);
    //     }
    // };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setData('file', selected);
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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const clearFile = () => {
        setData('file', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const submit = (e: React.SubmitEvent) => {
        e.preventDefault();
        post(store().url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const getStatusIcon = (status: DocumentStatus) => {
        if (status === 'indexed')
            return (
                <Badge className="border-emerald-500/30 bg-emerald-500/15 font-medium text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] backdrop-blur-sm dark:text-emerald-400">
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    {t("knowledgeBase.status.ready")}
                </Badge>
            );

        if (status === 'processing')
            return (
                <Badge className="border-blue-500/30 bg-blue-500/15 font-medium text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-sm dark:text-blue-400">
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    {t("knowledgeBase.status.processing")}
                </Badge>
            );

        return (
            <Badge className="border-rose-500/30 bg-rose-500/15 font-medium text-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.3)] backdrop-blur-sm dark:text-rose-400">
                <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
                {t("knowledgeBase.status.failed")}
            </Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Knowledge Base" />

            <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10 lg:py-12">
                <div className="mx-auto max-w-7xl space-y-10">
                    {/* Header - Stone Gradient (Dark for both modes) */}
                    <div className="hidden lg:block relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-600 via-stone-700 to-stone-800 p-8 shadow-2xl ring-1 ring-stone-400/30 md:p-12 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 dark:ring-stone-700/50">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
                        
                        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md">
                                        <Database className="h-8 w-8 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                                        {t("knowledgeBase.title")}
                                    </h1>
                                </div>
                                <p className="max-w-xl text-lg font-light text-white/90">
                                    {t("knowledgeBase.description")}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow-lg backdrop-blur-md">
                                    <Zap className="h-4 w-4" />
                                    <span>{documents.length} {t("knowledgeBase.documentsCount")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Upload Card */}
                        <div className="lg:col-span-4">
                            <Card className="overflow-hidden border-0 bg-white/80 shadow-2xl ring-1 ring-white/50 backdrop-blur-xl dark:bg-slate-900/80 dark:ring-white/10">
                                <div className="absolute inset-0 bg-card text-foreground" />

                                <CardHeader className="relative pb-6">
                                    <div className="mb-2 flex items-center gap-3">
                                        <div className="rounded-xl bg-linear-to-br from-sky-500 to-teal-600 p-2.5 shadow-lg shadow-sky-500/25">
                                            <UploadCloud className="h-5 w-5 text-white" />
                                        </div>
                                        <CardTitle className="bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-slate-300">
                                            {t("knowledgeBase.upload.title")}
                                        </CardTitle>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {t("knowledgeBase.upload.description")}
                                    </p>
                                </CardHeader>

                                <CardContent className="relative space-y-6">
                                    <form
                                        onSubmit={submit}
                                        className="space-y-5"
                                    >
                                        {/* Document Name Input */}
                                        <div className="group space-y-2.5">
                                            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                <FileText className="h-4 w-4 text-slate-400" />
                                                {t("knowledgeBase.upload.documentName")}
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    value={data.name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g., Pricing Strategy 2024"
                                                    className="h-12 rounded-xl border-slate-200/60 bg-white/60 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700/60 dark:bg-slate-800/60"
                                                />
                                            </div>
                                            {errors.name && (
                                                <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* File Upload - Fixed Working Version */}
                                        <div className="space-y-2.5">
                                            <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                <UploadCloud className="h-4 w-4 text-slate-400" />
                                                {t("knowledgeBase.upload.uploadFile")}
                                            </Label>
                                            <div
                                                className={`group relative ${dragActive ? 'scale-[1.02]' : ''}`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <div
                                                    className={`absolute -inset-0.5 rounded-2xl bg-linear-to-r from-sky-500 to-teal-500 opacity-0 transition duration-500 ${dragActive ? 'opacity-100' : 'group-hover:opacity-30'}`}
                                                />
                                                <div
                                                    className={`relative flex h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-slate-50/50 backdrop-blur-sm transition-all duration-300 dark:bg-slate-800/30 ${dragActive ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20' : 'border-slate-300 hover:bg-sky-50/50 dark:border-slate-600 dark:hover:bg-sky-900/20'}`}
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                >
                                                    <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-teal-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                                    {data.file ? (
                                                        <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
                                                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                <CheckCircle className="h-5 w-5" />
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="max-w-[200px] truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                                                    {
                                                                        data
                                                                            .file
                                                                            .name
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-slate-500">
                                                                    {(
                                                                        data
                                                                            .file
                                                                            .size /
                                                                        1024 /
                                                                        1024
                                                                    ).toFixed(
                                                                        2,
                                                                    )}{' '}
                                                                    MB
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    clearFile();
                                                                }}
                                                                className="mt-1 rounded-full p-1 text-rose-500 transition-colors hover:bg-rose-100 dark:hover:bg-rose-900/30"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="relative z-10 flex flex-col items-center gap-2 text-slate-500 transition-colors group-hover:text-sky-600 dark:text-slate-400 dark:group-hover:text-sky-400">
                                                            <div className="rounded-full bg-white/80 p-3 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800/80">
                                                                <UploadCloud className="h-6 w-6" />
                                                            </div>
                                                            <span className="text-sm font-medium">
                                                                {t("knowledgeBase.upload.dropFile")}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {t("knowledgeBase.upload.supportedFormats")}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>
                                            {errors.file && (
                                                <p className="flex items-center gap-1 text-xs font-medium text-rose-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.file}
                                                </p>
                                            )}
                                        </div>

                                        {/* Instance Selection */}
                                        

                                        {/* Submit Button - Success Emerald/Teal linear */}
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="group relative h-14 w-full overflow-hidden rounded-xl font-semibold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
                                            <span className="relative flex items-center justify-center gap-2">
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        <span>
                                                            {t("knowledgeBase.upload.processingDocument")}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-5 w-5" />
                                                        <span>
                                                            {t("knowledgeBase.upload.uploadTrain")}
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Documents Table */}
                        <div className="lg:col-span-8">
                            <Card className="h-full overflow-hidden border-0 bg-card shadow-2xl ring-1 ring-white/50 backdrop-blur-xl dark:ring-white/10">
                                <div className="pointer-events-none absolute inset-0" />

                                <CardHeader className="relative border-b border-slate-200/50 pb-4 dark:border-slate-700/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-linear-to-br from-slate-700 to-slate-900 p-2.5 shadow-lg dark:from-slate-600 dark:to-slate-800">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                                    {t("knowledgeBase.documentsTable.title")}
                                                </CardTitle>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {t("knowledgeBase.documentsTable.description")}
                                                </p>
                                            </div>
                                        </div>
                                        {/* <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            Last updated: Just now
                                        </div> */}
                                    </div>
                                </CardHeader>

                                <CardContent className="relative p-0">
                                    <div className="w-full overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-b border-slate-200/50 bg-slate-50/50 backdrop-blur-sm hover:bg-transparent dark:border-slate-700/50 dark:bg-slate-800/30">
                                                    <TableHead className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("knowledgeBase.documentsTable.documentLabel")}
                                                    </TableHead>
                                                    <TableHead className="py-4 font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("knowledgeBase.documentsTable.status")}
                                                    </TableHead>
                                                    <TableHead className="py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                                                        {t("knowledgeBase.documentsTable.uploaded")} 
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {documents.map((doc, index) => (
                                                    <TableRow
                                                        key={doc.id}
                                                        className="group border-b border-slate-100 transition-all duration-300 hover:bg-sky-50/30 dark:border-slate-800/50 dark:hover:bg-sky-900/10"
                                                        style={{
                                                            animationDelay: `${index * 50}ms`,
                                                        }}
                                                    >
                                                        <TableCell className="py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="rounded-lg bg-linear-to-br from-sky-100 to-teal-100 p-2 text-sky-600 transition-transform duration-300 group-hover:scale-110 dark:from-sky-900/30 dark:to-teal-900/30 dark:text-sky-400">
                                                                    <FileText className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-slate-900 transition-colors group-hover:text-sky-600 dark:text-slate-100 dark:group-hover:text-sky-400">
                                                                        {
                                                                            doc.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                                        ID:{' '}
                                                                        {doc.id}{' '}
                                                                        •
                                                                        Document
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            {getStatusIcon(
                                                                doc.status,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="py-4 text-right">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                    {new Date(
                                                                        doc.created_at,
                                                                    ).toLocaleDateString(
                                                                        undefined,
                                                                        {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                        },
                                                                    )}
                                                                </span>
                                                                <span className="text-xs text-slate-400">
                                                                    {new Date(
                                                                        doc.created_at,
                                                                    ).toLocaleTimeString(
                                                                        undefined,
                                                                        {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                        },
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {documents.length === 0 && (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="h-64"
                                                        >
                                                            <div className="flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-500">
                                                                <div className="rounded-2xl bg-slate-100 p-4 backdrop-blur-sm dark:bg-slate-800/50">
                                                                    <FileText className="h-8 w-8 opacity-50" />
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                                                                        {t("knowledgeBase.documentsTable.noDocuments")}
                                                                    </p>
                                                                    <p className="text-sm">
                                                                        {t("knowledgeBase.documentsTable.uploadFirstDocument")}
                                                                         
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}



{/* <div className="space-y-3">
<Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
<Sparkles className="h-4 w-4 text-slate-400" />
{ }
</Label>
<div className="flex flex-wrap gap-2 rounded-xl border border-slate-200/50 bg-slate-100/50 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/30">
{instances.map((instance) => {
const active =
data.instance_names.includes(
instance.instance_name,
);
return (
<button
key={
instance.instance_name
}
type="button"
onClick={() =>
toggleInstance(
instance.instance_name,
)
}
className={`relative transform rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
active
? 'border-0 bg-linear-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/25'
: 'border border-slate-200 bg-white text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-400'
} `}
>
{active && (
<span className="absolute inset-0 animate-pulse rounded-full bg-white/20" />
)}
<span className="relative flex items-center gap-1.5">
{active && (
<CheckCircle className="h-3.5 w-3.5" />
)}
{
instance.instance_name
}
</span>
</button>
);
})}
</div>
{errors.instance_names && (
<p className="flex items-center gap-1 text-xs font-medium text-rose-500">
<AlertCircle className="h-3 w-3" />
{errors.instance_names}
</p>
)}
</div> */}