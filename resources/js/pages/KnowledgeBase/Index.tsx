import { Head, useForm } from "@inertiajs/react";
import {
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Database,
  Clock,
  Zap,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AppLayout from "@/layouts/app-layout";
import { store } from "@/routes/knowledge";

type DocumentStatus = "indexed" | "processing" | "failed";

interface KnowledgeDocument {
  id: number;
  name: string;
  status: DocumentStatus;
  created_at: string;
}

interface Instance {
  instance_name: string;
}

interface KnowledgeBaseIndexProps {
  documents: KnowledgeDocument[];
  instances: Instance[];
}

export default function KnowledgeBaseIndex({
  documents,
  instances,
}: KnowledgeBaseIndexProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    name: "",
    instance_names: [] as string[],
    file: null as File | null,
  });

  const toggleInstance = (instance_name: string) => {
    if (data.instance_names.includes(instance_name)) {
      setData(
        "instance_names",
        data.instance_names.filter((i) => i !== instance_name)
      );
    } else {
      setData("instance_names", [...data.instance_names, instance_name]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setData("file", selected);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setData("file", e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setData("file", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(store().url, {
      forceFormData: true,
      onSuccess: () => {
        reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    });
  };

  const getStatusIcon = (status: DocumentStatus) => {
    if (status === "indexed")
      return (
        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 backdrop-blur-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Ready
        </Badge>
      );

    if (status === "processing")
      return (
        <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 backdrop-blur-sm font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          Processing
        </Badge>
      );

    return (
      <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 backdrop-blur-sm font-medium shadow-[0_0_15px_rgba(244,63,94,0.3)]">
        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
        Failed
      </Badge>
    );
  };

  return (
    <AppLayout>
      <Head title="Knowledge Base" />

      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Header - Ocean Breeze Gradient (Blue to Cyan/Teal) */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-100 via-stone-200 to-stone-300 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 p-8 md:p-12 shadow-2xl ring-1 ring-stone-200/50 dark:ring-stone-700/50">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                    <Database className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                    Knowledge Base
                  </h1>
                </div>
                <p className="text-lg text-white/90 max-w-xl font-light">
                  Upload documents to train your AI assistants with intelligent context awareness.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium shadow-lg">
                  <Zap className="w-4 h-4" />
                  <span>{documents.length} Documents</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Upload Card */}
            <div className="lg:col-span-4">
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden ring-1 ring-white/50 dark:ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-teal-500/5 dark:from-sky-500/10 dark:via-blue-500/10 dark:to-teal-500/10 pointer-events-none" />
                
                <CardHeader className="relative pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-teal-600 shadow-lg shadow-sky-500/25">
                      <UploadCloud className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Train AI
                    </CardTitle>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Upload documents to enhance your AI capabilities
                  </p>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <form onSubmit={submit} className="space-y-5">
                    
                    {/* Document Name Input */}
                    <div className="space-y-2.5 group">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        Document Name
                      </Label>
                      <div className="relative">
                        <Input
                          value={data.name}
                          onChange={(e) => setData("name", e.target.value)}
                          placeholder="e.g., Pricing Strategy 2024"
                          className="h-12 bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all duration-300 backdrop-blur-sm placeholder:text-slate-400"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* File Upload - Fixed Working Version */}
                    <div className="space-y-2.5">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-slate-400" />
                        Upload File
                      </Label>
                      <div 
                        className={`relative group ${dragActive ? 'scale-[1.02]' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-teal-500 rounded-2xl opacity-0 transition duration-500 ${dragActive ? 'opacity-100' : 'group-hover:opacity-30'}`} />
                        <div 
                          className={`relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 transition-all duration-300 cursor-pointer backdrop-blur-sm overflow-hidden ${dragActive ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-900/20' : 'border-slate-300 dark:border-slate-600 hover:bg-sky-50/50 dark:hover:bg-sky-900/20'}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {data.file ? (
                            <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
                              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[200px] truncate">
                                  {data.file.name}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearFile();
                                }}
                                className="mt-1 p-1 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="relative z-10 flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              <div className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <span className="text-sm font-medium">
                                Drop file here or click to browse
                              </span>
                              <span className="text-xs text-slate-400">
                                Supports PDF, TXT, DOCX
                              </span>
                            </div>
                          )}
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.txt,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                      {errors.file && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.file}
                        </p>
                      )}
                    </div>

                    {/* Instance Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-slate-400" />
                        Target Instances
                      </Label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                        {instances.map((instance) => {
                          const active = data.instance_names.includes(instance.instance_name);
                          return (
                            <button
                              key={instance.instance_name}
                              type="button"
                              onClick={() => toggleInstance(instance.instance_name)}
                              className={`
                                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
                                ${active 
                                  ? "bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg shadow-sky-500/25 border-0" 
                                  : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-sky-400 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
                                }
                              `}
                            >
                              {active && (
                                <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                              )}
                              <span className="relative flex items-center gap-1.5">
                                {active && <CheckCircle className="w-3.5 h-3.5" />}
                                {instance.instance_name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.instance_names && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.instance_names}
                        </p>
                      )}
                    </div>

                    {/* Submit Button - Success Emerald/Teal Gradient */}
                    <Button
                      type="submit"
                      disabled={processing}
                      className="w-full h-14 relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative flex items-center justify-center gap-2">
                        {processing ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            <span>Processing Document...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5" />
                            <span>Upload & Train AI</span>
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
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl overflow-hidden ring-1 ring-white/50 dark:ring-white/10 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-sky-500/5 to-teal-500/5 dark:from-slate-500/10 dark:via-sky-500/10 dark:to-teal-500/10 pointer-events-none" />
                
                <CardHeader className="relative pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 shadow-lg">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                          Documents Library
                        </CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Manage your AI training documents
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      Last updated: Just now
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative p-0">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm">
                          <TableHead className="text-slate-700 dark:text-slate-300 font-semibold py-4">Document</TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-300 font-semibold py-4">Status</TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-300 font-semibold py-4 text-right">Uploaded</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc, index) => (
                          <TableRow 
                            key={doc.id} 
                            className="group border-b border-slate-100 dark:border-slate-800/50 hover:bg-sky-50/30 dark:hover:bg-sky-900/10 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-teal-100 dark:from-sky-900/30 dark:to-teal-900/30 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {doc.name}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500">
                                    ID: {doc.id} • Document
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {getStatusIcon(doc.status)}
                            </TableCell>
                            <TableCell className="py-4 text-right">
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {new Date(doc.created_at).toLocaleDateString(undefined, { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(doc.created_at).toLocaleTimeString(undefined, {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {documents.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-64">
                              <div className="flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-500">
                                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 backdrop-blur-sm">
                                  <FileText className="h-8 w-8 opacity-50" />
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No documents yet</p>
                                  <p className="text-sm">Upload your first document to get started</p>
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