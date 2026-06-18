import { Check, Copy, Server } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InstanceDetailsSidebarProps {
    instanceName: string;
    phoneNumber?: string | null;
    webhookUrl?: string | null;
    createdAt: string;
    connectedAt?: string | null;
}

function CopyableRow({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium text-foreground">
                    {value}
                </p>
            </div>
            <button
                onClick={handleCopy}
                className="ml-2 shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                    <Copy className="h-3.5 w-3.5" />
                )}
            </button>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function InstanceDetailsSidebar({
    instanceName,
    phoneNumber,
    webhookUrl,
    createdAt,
    connectedAt,
}: InstanceDetailsSidebarProps) {
    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    Détails de l'instance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                <CopyableRow label="ID Instance" value={instanceName} />
                <CopyableRow
                    label="Numéro de téléphone"
                    value={phoneNumber ? `+${phoneNumber}` : 'Non lié'}
                />
                {webhookUrl && (
                    <CopyableRow label="Webhook URL" value={webhookUrl} />
                )}
                <InfoRow
                    label="Date de création"
                    value={formatDate(createdAt)}
                />
                {connectedAt && (
                    <InfoRow
                        label="Dernière connexion"
                        value={formatDate(connectedAt)}
                    />
                )}
            </CardContent>
        </Card>
    );
}
