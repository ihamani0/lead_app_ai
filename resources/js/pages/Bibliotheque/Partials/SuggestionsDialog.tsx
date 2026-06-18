import { Check, Sparkles } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Faq } from '../types';
import { SuggestionCard } from './SuggestionCard';

interface SuggestionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suggestions: Faq[];
    onAccept: (suggestion: Faq) => void;
    onEdit: (suggestion: Faq) => void;
    onReject: (suggestion: Faq) => void;
}

export function SuggestionsDialog({
    open,
    onOpenChange,
    suggestions,
    onAccept,
    onEdit,
    onReject,
}: SuggestionsDialogProps) {
    const handleAcceptAll = () => {
        suggestions.forEach((s) => onAccept(s));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        Suggestions IA ({suggestions.length})
                    </DialogTitle>
                    <DialogDescription>
                        Passez en revue les suggestions générées par l'IA.
                        Acceptez, modifiez ou rejetez chaque suggestion.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-3">
                        {suggestions.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                Aucune suggestion pour le moment.
                            </p>
                        ) : (
                            suggestions.map((s) => (
                                <SuggestionCard
                                    key={s.id}
                                    suggestion={s}
                                    onAccept={() => onAccept(s)}
                                    onEdit={() => onEdit(s)}
                                    onReject={() => onReject(s)}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>

                <DialogFooter className="flex items-center justify-between gap-3 sm:justify-between">
                    <span className="text-xs text-muted-foreground">
                        {suggestions.length} suggestion
                        {suggestions.length > 1 ? 's' : ''} en attente
                    </span>
                    {suggestions.length > 1 && (
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-950"
                            onClick={handleAcceptAll}
                        >
                            <Check className="h-3.5 w-3.5" />
                            Tout accepter
                        </button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
