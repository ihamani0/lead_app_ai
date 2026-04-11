import {
    Bot,
    BrainCircuit,
    Calendar,
    Eye,
    MessageCircle,
    MessageSquare,
    Phone,
    Sparkles,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getTempBadge } from '@/lib/leadHelper';
import type { Lead } from '@/types';

export default function ViewLead({ selectedLead }: { selectedLead: Lead }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-2xl  gap-0 overflow-hidden border-border bg-background p-0" style={{maxWidth:"612px"}}>
                {/* Header with linear background */}
                <div className="relative bg-linear-to-br from-violet-500/10 via-purple-500/5 to-blue-500/10 p-6 pb-4 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-blue-950/50">
                    <div className="bg-grid-white/10 dark:bg-grid-white/5 absolute inset-0 mask-[linear-linear(0deg,white,rgba(255,255,255,0.6))]"></div>

                    <DialogHeader className="relative">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-xl bg-linear-to-br from-violet-500 to-purple-600 p-2 shadow-lg shadow-violet-500/20">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-semibold tracking-tight">
                                    Lead Details
                                </DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    Full profile and AI analysis
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <ScrollArea className="max-h-[calc(100vh-12rem)]">
                    {selectedLead && (
                        <div className="space-y-6 p-6">
                            {/* Core Info Card */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <div className="h-4 w-1 rounded-full bg-linear-to-b from-violet-500 to-purple-600" />
                                    Contact Information
                                </div>

                                <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
                                    <div className="group flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-3.5 w-3.5" />
                                            Name
                                        </div>
                                        <p className="font-semibold text-foreground">
                                            {selectedLead.name}
                                        </p>
                                    </div>

                                    <Separator className="bg-border/50" />

                                    <div className="group flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5" />
                                            Phone
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                                            <span className="text-muted-foreground">
                                                +
                                            </span>
                                            {selectedLead.phone}
                                        </div>
                                    </div>

                                    <Separator className="bg-border/50" />

                                    {/* NEW: Handled By (Instance Name) */}
                                    <div className="group flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            Handled By
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 font-medium text-foreground">
                                            <p className="font-medium text-slate-900 dark:text-foreground">
                                                {selectedLead.instance
                                                    ?.display_name ||
                                                    selectedLead.instance
                                                        ?.instance_name ||
                                                    'Main Agent'}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-foreground">
                                                +
                                                {selectedLead.instance
                                                    ?.phone_number || '-- --'}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="bg-border/50" />

                                    <div className="group flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Created
                                        </div>
                                        <div className="text-sm font-medium text-foreground">
                                            {new Date(
                                                selectedLead.created_at,
                                            ).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Analysis Section */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <div className="h-4 w-1 rounded-full bg-linear-to-b from-blue-500 to-cyan-500" />
                                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                                    Qualification IA
                                </div>

                                <div className="space-y-3">
                                    {/* AI Qualification Status */}
                                    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                        <span className="text-sm font-medium text-foreground">
                                            Statut de qualification IA
                                        </span>
                                        <Badge
                                            variant={
                                                selectedLead.ai_qualification_status ===
                                                'QUALIFIE'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className={
                                                selectedLead.ai_qualification_status ===
                                                'QUALIFIE'
                                                    ? 'bg-green-500'
                                                    : ''
                                            }
                                        >
                                            {selectedLead.ai_qualification_status ===
                                            'QUALIFIE'
                                                ? 'Qualifié'
                                                : 'Non qualifié'}
                                        </Badge>
                                    </div>

                                    {/* Qualification Result */}
                                    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                        <span className="text-sm font-medium text-foreground">
                                            Résultat de qualification
                                        </span>
                                        {getTempBadge(
                                            selectedLead.qualification_result?.toLowerCase() ||
                                                'cold',
                                        )}
                                    </div>

                                    {/* Confidence Score */}
                                    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">
                                                Score de qualification
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="font-bold tabular-nums"
                                            >
                                                {selectedLead.qualification_score ??
                                                    0}
                                                /10
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={
                                                ((selectedLead.qualification_score ??
                                                    0) *
                                                    100) /
                                                10
                                            }
                                            className="h-2 bg-secondary"
                                        />
                                    </div>

                                    {/* Treatment Status */}
                                    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                        <span className="text-sm font-medium text-foreground">
                                            Statut de traitement
                                        </span>
                                        <Badge
                                            variant={
                                                selectedLead.treatment_status ===
                                                'TRAITE'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={
                                                selectedLead.treatment_status ===
                                                'TRAITE'
                                                    ? 'bg-blue-500'
                                                    : ''
                                            }
                                        >
                                            {selectedLead.treatment_status ===
                                            'TRAITE'
                                                ? 'Traité'
                                                : 'Non traité'}
                                        </Badge>
                                    </div>

                                    {/* Qualified At */}
                                    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                        <span className="text-sm font-medium text-foreground">
                                            Date qualification IA
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {selectedLead.qualified_at
                                                ? new Date(
                                                      selectedLead.qualified_at,
                                                  ).toLocaleString('fr-FR', {
                                                      day: '2-digit',
                                                      month: '2-digit',
                                                      year: 'numeric',
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : '-'}
                                        </span>
                                    </div>

                                    {/* Notes */}
                                    {selectedLead.notes && (
                                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                                            <div className="mb-2 text-sm font-medium text-foreground">
                                                Notes
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedLead.notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Conversation History */}
                                    {selectedLead.recent_messages &&
                                        selectedLead.recent_messages.length >
                                            0 && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                    <div className="h-4 w-1 rounded-full bg-linear-to-b from-violet-500 to-purple-500" />
                                                    <MessageCircle className="h-4 w-4 text-violet-500" />
                                                    Conversation
                                                </div>

                                                <div className="max-h-[300px] space-y-3 overflow-y-auto rounded-xl border bg-card p-4">
                                                    {selectedLead.recent_messages.map(
                                                        (msg, index) => (
                                                            <div
                                                                key={index}
                                                                className={`flex flex-col gap-1 ${
                                                                    msg.direction ===
                                                                    'client'
                                                                        ? 'items-start'
                                                                        : 'items-end'
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`flex items-center gap-2 ${
                                                                        msg.direction ===
                                                                        'client'
                                                                            ? 'flex-row'
                                                                            : 'flex-row-reverse'
                                                                    }`}
                                                                >
                                                                    <Badge
                                                                        className={
                                                                            msg.direction ===
                                                                            'client'
                                                                                ? 'bg-blue-500 text-white'
                                                                                : 'bg-violet-500 text-white'
                                                                        }
                                                                    >
                                                                        {msg.direction ===
                                                                        'client'
                                                                            ? '👤 Client'
                                                                            : '🤖 AI'}
                                                                    </Badge>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(
                                                                            msg.timestamp,
                                                                        ).toLocaleString(
                                                                            'fr-FR',
                                                                            {
                                                                                day: '2-digit',
                                                                                month: '2-digit',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            },
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className={`rounded-lg p-3 text-sm ${
                                                                        msg.direction ===
                                                                        'client'
                                                                            ? 'bg-blue-50 text-foreground dark:bg-blue-950/30'
                                                                            : 'bg-violet-50 text-foreground dark:bg-violet-950/30'
                                                                    }`}
                                                                >
                                                                    {
                                                                        msg.message
                                                                    }
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* AI Summary Card */}
                                    <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-linear-to-br from-blue-50/50 to-cyan-50/50 p-4 shadow-sm dark:from-blue-950/20 dark:to-cyan-950/20">
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <Bot className="h-16 w-16 text-blue-500" />
                                        </div>
                                        <div className="relative">
                                            <div className="mb-3 flex items-center gap-2">
                                                <div className="rounded-lg bg-blue-500/10 p-1.5">
                                                    <BrainCircuit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-xs font-semibold tracking-wider text-blue-800 uppercase dark:text-blue-300">
                                                    AI Summary
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed text-slate-700 italic dark:text-slate-300">
                                                {selectedLead.ai_summary ||
                                                    'No summary generated yet.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Custom Data */}
                            {selectedLead.custom_data &&
                                Object.keys(selectedLead.custom_data).length >
                                    0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <div className="h-4 w-1 rounded-full bg-linear-to-b from-emerald-500 to-teal-500" />
                                            Extracted Data
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {Object.entries(
                                                selectedLead.custom_data,
                                            ).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    <p className="mb-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                        {key.replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="truncate text-sm font-semibold text-foreground">
                                                        {String(value)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
