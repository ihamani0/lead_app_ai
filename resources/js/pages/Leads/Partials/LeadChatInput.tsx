import { Ban, Paperclip, Send, Smile } from 'lucide-react';
import type { FC } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LeadChatInputProps {
    onSend?: (message: string) => void;
    isBotActive?: boolean;
    placeholder?: string;
}

export const LeadChatInput: FC<LeadChatInputProps> = ({
    onSend,
    isBotActive = false,
    placeholder = 'Répondre au message...',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (isBotActive) return;
        if (inputRef.current && inputRef.current.value && onSend) {
            onSend(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center gap-2 border-t bg-card px-4 py-3">
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-muted-foreground"
                disabled={isBotActive}
            >
                <Smile className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
                <Input
                    ref={inputRef}
                    placeholder={
                        isBotActive
                            ? 'Le bot est actif — mettez-le en pause pour répondre'
                            : placeholder
                    }
                    className="bg-muted pr-10"
                    disabled={isBotActive}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    disabled={isBotActive}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>
            </div>
            <Button
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40"
                onClick={handleSend}
                disabled={isBotActive}
            >
                {isBotActive ? (
                    <Ban className="h-4 w-4" />
                ) : (
                    <Send className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
};
