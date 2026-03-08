import { useCallback, useState } from 'react';

export type CopiedValue = string | null;
export type CopyFn = (text: string, field?: string) => Promise<boolean>;

export interface UseClipboardReturn {
    copiedText: CopiedValue;
    copy: CopyFn;
    isCopied: (field: string) => boolean;
}

export function useClipboard(timeout = 2000): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copy: CopyFn = useCallback(
        async (text, field) => {
            if (!navigator?.clipboard) {
                console.warn('Clipboard not supported');
                return false;
            }

            try {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);
                if (field) setCopiedField(field);

                setTimeout(() => {
                    setCopiedText(null);
                    if (field) setCopiedField(null);
                }, timeout);

                return true;
            } catch (error) {
                console.warn('Copy failed', error);
                setCopiedText(null);
                setCopiedField(null);
                return false;
            }
        },
        [timeout],
    );

    const isCopied = useCallback(
        (field: string) => copiedField === field,
        [copiedField],
    );

    return { copiedText, copy, isCopied };
}
