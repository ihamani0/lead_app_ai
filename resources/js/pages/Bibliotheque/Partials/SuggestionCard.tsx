import { Check, PencilLine, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Faq } from '../types';

interface SuggestionCardProps {
    suggestion: Faq;
    onAccept: () => void;
    onEdit: () => void;
    onReject: () => void;
}

export function SuggestionCard({
    suggestion,
    onAccept,
    onEdit,
    onReject,
}: SuggestionCardProps) {
    const confidence = suggestion.suggestion_data?.confidence ?? 0;
    const sourceCount = suggestion.suggestion_data?.source_count ?? 0;

    return (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-white p-3 shadow-sm dark:border-amber-800 dark:bg-amber-950/10">
            <div className="min-w-0 flex-1 space-y-1.5">
                <p className="line-clamp-2 text-sm font-medium text-foreground">
                    {suggestion.question}
                </p>
                {suggestion.answer && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                        {suggestion.answer}
                    </p>
                )}
                <div className="flex items-center gap-2">
                    <Badge
                        className={cn(
                            'text-[10px]',
                            confidence >= 0.9
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                                : confidence >= 0.7
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                                  : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
                        )}
                        variant="outline"
                    >
                        Confiance {Math.round(confidence * 100)}%
                    </Badge>
                    {sourceCount > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                            {sourceCount} conversations
                        </span>
                    )}
                </div>
            </div>

            <TooltipProvider delayDuration={400}>
                <div className="flex shrink-0 items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                onClick={onAccept}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Accepter</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onEdit}
                            >
                                <PencilLine className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Modifier</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                                onClick={onReject}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rejeter</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </div>
    );
}
