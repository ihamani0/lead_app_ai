import { router } from '@inertiajs/react';
import {
    ExternalLink,
    Globe,
    PlugZap,
    QrCode,
    RefreshCw,
    Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { destroy, disconnect, restart } from '@/routes/workspaces/instances';

interface InstanceQuickActionsProps {
    slug: string;
    instanceId: string;
    isConnected: boolean;
    onFetchQr: () => void;
}

export function InstanceQuickActions({
    slug,
    instanceId,
    isConnected,
    onFetchQr,
}: InstanceQuickActionsProps) {
    const handleRestart = () => {
        if (!confirm('Redémarrer cette instance ?')) return;
        router.put(restart({ slug, id: instanceId }).url, {
            preserveScroll: true,
        });
    };

    const handleDisconnect = () => {
        if (!confirm('Déconnecter ce numéro WhatsApp ?')) return;
        router.post(disconnect({ slug, id: instanceId }).url, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette instance ?'))
            return;
        router.delete(destroy({ slug, id: instanceId }).url, {
            preserveScroll: true,
        });
    };

    const actions = [
        {
            icon: Globe,
            label: 'Ouvrir WhatsApp Web',
            onClick: () => window.open('https://web.whatsapp.com', '_blank'),
            external: true,
        },
        {
            icon: QrCode,
            label: 'Générer un nouveau QR',
            onClick: onFetchQr,
            disabled: !isConnected,
        },
        {
            icon: RefreshCw,
            label: 'Redémarrer',
            onClick: handleRestart,
        },
        {
            icon: PlugZap,
            label: 'Déconnecter',
            onClick: handleDisconnect,
            danger: true,
        },
        {
            icon: Trash2,
            label: 'Supprimer',
            onClick: handleDelete,
            danger: true,
        },
    ];

    return (
        <Card className="border bg-card shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                    Actions rapides
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 ${
                            action.danger
                                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                                : 'text-foreground'
                        }`}
                    >
                        <action.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-left">{action.label}</span>
                        {action.external && (
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                    </button>
                ))}
            </CardContent>
        </Card>
    );
}
