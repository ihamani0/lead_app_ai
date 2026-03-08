import {
    Bot,
    BrainCircuit,
    Calendar,
    Eye,
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
            <DialogContent className="w-full max-w-lg gap-0 overflow-hidden border-border bg-background p-0">
                {/* Header with linear background */}
                <div className="relative bg-linear-to-br from-violet-500/10 via-purple-500/5 to-blue-500/10 p-6 pb-4 dark:from-violet-950/50 dark:via-purple-950/30 dark:to-blue-950/50">
                    <div className="bg-grid-white/10 dark:bg-grid-white/5 absolute inset-0 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]"  
                    
                    />
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
                                    AI Qualification
                                </div>

                                <div className="space-y-3">
                                    {/* Temperature Badge */}
                                    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                        <span className="text-sm font-medium text-foreground">
                                            Lead Temperature
                                        </span>
                                        {getTempBadge(selectedLead.temperature)}
                                    </div>

                                    {/* Confidence Score */}
                                    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-foreground">
                                                Confidence Score
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="font-bold tabular-nums"
                                            >
                                                {selectedLead.qualification_score ||
                                                    0}
                                                %
                                            </Badge>
                                        </div>
                                        <Progress
                                            value={
                                                selectedLead.qualification_score ||
                                                0
                                            }
                                            className="h-2 bg-secondary"
                                        />
                                    </div>

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
                                                "
                                                {selectedLead.ai_summary ||
                                                    'No summary generated yet.'}
                                                "
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
