import { Loader2, Pencil } from 'lucide-react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface InlineEditFieldProps {
    value: string;
    onSave: (value: string) => Promise<void> | void;
    type?: 'text' | 'textarea';
    placeholder?: string;
    className?: string;
    multiline?: boolean;
}

export function InlineEditField({
    value,
    onSave,
    type = 'text',
    placeholder = 'Modifier...',
    className,
}: InlineEditFieldProps) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const startEditing = () => {
        setDraft(value);
        setEditing(true);
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    const cancelEditing = () => {
        setEditing(false);
        setDraft(value);
    };

    const save = async () => {
        if (draft === value || saving) return;
        setSaving(true);
        try {
            await onSave(draft);
        } finally {
            setSaving(false);
            setEditing(false);
        }
    };

    const handleKeyDown = (e: ReactKeyboardEvent) => {
        if (e.key === 'Enter' && type === 'text') {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    if (editing) {
        return (
            <div className="flex items-center gap-1.5">
                {type === 'textarea' ? (
                    <Textarea
                        ref={inputRef as React.Ref<HTMLTextAreaElement>}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={cn('min-h-[60px] text-xs', className)}
                        placeholder={placeholder}
                        rows={3}
                    />
                ) : (
                    <Input
                        ref={inputRef as React.Ref<HTMLInputElement>}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={save}
                        onKeyDown={handleKeyDown}
                        className={cn('h-7 text-xs', className)}
                        placeholder={placeholder}
                    />
                )}
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            </div>
        );
    }

    return (
        <div
            className="group flex items-center gap-1.5"
            onClick={startEditing}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') startEditing();
            }}
        >
            <span className={cn('cursor-pointer transition-colors group-hover:text-primary', className)}>
                {value || placeholder}
            </span>
            <Pencil className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
