import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    MessageCircle,
    MoreHorizontal,
    Phone,
    PowerOff,
    RefreshCw,
    Trash2,
    Unplug,
} from 'lucide-react';
import { useState } from 'react';
import { CreateInstanceDialog } from '@/components/Instances/CreateInstanceDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import {
    destroy,
    disconnect,
    restart,
    show,
    update,
} from '@/routes/workspaces/instances';
import type { EvolutionInstance } from '@/types';

interface WhatsappStats {
    connected: number;
    total: number;
    messages_today: number;
}

interface WhatsappTabProps {
    instances: EvolutionInstance[];
    stats: WhatsappStats;
    slug: string;
    canCreate: boolean;
    canManage: boolean;
}

function RenameDialog({
    instance,
    slug,
    open,
    onOpenChange,
}: {
    instance: EvolutionInstance;
    slug: string;
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [displayName, setDisplayName] = useState(instance.display_name || '');

    const handleSave = () => {
        router.put(
            update({ slug, id: instance.id }).url,
            { display_name: displayName || null },
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Renommer l'instance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="rename-display">Nom d'affichage</Label>
                        <Input
                            id="rename-display"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder={instance.instance_name}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>
                    <Button onClick={handleSave}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function InstanceCard({
    instance,
    slug,
    canManage,
}: {
    instance: EvolutionInstance;
    slug: string;
    canManage: boolean;
}) {
    const { t } = useTranslation();
    const [renameOpen, setRenameOpen] = useState(false);

    const isConnected = instance.status === 'connected';
    const isConnecting = instance.status === 'connecting';

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Êtes-vous sûr de vouloir supprimer cette instance ?')) {
            router.delete(destroy({ slug, id: instance.id }).url, {
                preserveScroll: true,
            });
        }
    };

    const handleReconnect = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.put(restart({ slug, id: instance.id }).url, {
            preserveScroll: true,
        });
    };

    const handleDisconnect = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Êtes-vous sûr de vouloir déconnecter cette instance ?')) {
            router.post(disconnect({ slug, id: instance.id }).url, {
                preserveScroll: true,
            });
        }
    };

    const qualityColor =
        instance.connection_quality === 'excellente'
            ? 'text-emerald-600 dark:text-emerald-400'
            : instance.connection_quality === 'bonne'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400';

    return (
        <>
            <RenameDialog
                instance={instance}
                slug={slug}
                open={renameOpen}
                onOpenChange={setRenameOpen}
            />
            <Link
                href={
                    slug ? show({ slug, id: instance.instance_name }).url : '#'
                }
            >
                <Card
                    className={cn(
                        'group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
                        isConnected &&
                            'border-emerald-200/50 dark:border-emerald-500/20',
                        isConnecting &&
                            'border-amber-200/50 dark:border-amber-500/20',
                        !isConnected &&
                            !isConnecting &&
                            'border-destructive/30',
                    )}
                >
                    <div
                        className={cn(
                            'absolute top-0 left-0 h-1 w-full',
                            isConnected && 'bg-emerald-500',
                            isConnecting && 'bg-amber-500',
                            !isConnected && !isConnecting && 'bg-destructive',
                        )}
                    />

                    <div className="space-y-3 pt-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-lg',
                                        isConnected &&
                                            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
                                        isConnecting &&
                                            'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
                                        !isConnected &&
                                            !isConnecting &&
                                            'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
                                    )}
                                >
                                    {isConnected ? (
                                        <MessageCircle className="h-5 w-5" />
                                    ) : (
                                        <PowerOff className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        {instance.display_name ||
                                            instance.instance_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {instance.phone_number
                                            ? `+${instance.phone_number}`
                                            : '--- --- ---'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'flex items-center gap-1 text-xs font-medium',
                                        isConnected &&
                                            'text-emerald-600 dark:text-emerald-400',
                                        isConnecting &&
                                            'text-amber-600 dark:text-amber-400',
                                        !isConnected &&
                                            !isConnecting &&
                                            'text-red-600 dark:text-red-400',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'inline-block h-2 w-2 rounded-full',
                                            isConnected && 'bg-emerald-500',
                                            isConnecting &&
                                                'animate-pulse bg-amber-500',
                                            !isConnected &&
                                                !isConnecting &&
                                                'bg-red-500',
                                        )}
                                    />
                                    {t(
                                        `bibliotheque.whatsapp.status.${instance.status}`,
                                    )}
                                </span>
                                {canManage && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            asChild
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <button className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-44"
                                        >
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setRenameOpen(true);
                                                }}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Renommer
                                            </DropdownMenuItem>
                                            {isConnected && (
                                                <DropdownMenuItem
                                                    onClick={handleDisconnect}
                                                >
                                                    <Unplug className="mr-2 h-4 w-4" />
                                                    Déconnecter
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={handleDelete}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t(
                                                    'bibliotheque.whatsapp.actions.delete',
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-3 text-xs">
                            <div>
                                <span className="text-muted-foreground">
                                    {t('bibliotheque.whatsapp.instanceId')}
                                </span>
                                <p className="font-mono text-foreground">
                                    {instance.instance_name.slice(0, 16)}...
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {t('bibliotheque.whatsapp.linkedAgent')}
                                </span>
                                <p className="text-foreground">
                                    {instance.agent_config?.name || '—'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {t('bibliotheque.whatsapp.messagesToday')}
                                </span>
                                <p className="text-foreground">
                                    {instance.messages_today ?? 0}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    {t(
                                        'bibliotheque.whatsapp.connectionQuality',
                                    )}
                                </span>
                                <p className={cn('font-medium', qualityColor)}>
                                    {instance.connection_quality
                                        ? t(
                                              `bibliotheque.whatsapp.${instance.connection_quality}`,
                                          )
                                        : '—'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-muted-foreground">
                                {instance.created_at
                                    ? `Ajouté le ${new Date(instance.created_at).toLocaleDateString('fr-FR')}`
                                    : ''}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                                    {t(
                                        'bibliotheque.whatsapp.actions.viewDetails',
                                    )}
                                </span>
                                {(isConnected || isConnecting) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={handleReconnect}
                                    >
                                        <RefreshCw className="mr-1 h-3 w-3" />
                                        {t(
                                            'bibliotheque.whatsapp.actions.reconnect',
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        </>
    );
}

export function WhatsappTab({
    instances,
    stats,
    slug,
    canCreate,
    canManage,
}: WhatsappTabProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {t('bibliotheque.whatsapp.title')}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {t('bibliotheque.whatsapp.description')}
                        </p>
                    </div>
                    {canCreate && <CreateInstanceDialog t={t} slug={slug} />}
                </div>

                {instances.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {instances.map((instance) => (
                            <motion.div
                                key={instance.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <InstanceCard
                                    instance={instance}
                                    slug={slug}
                                    canManage={canManage}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="border border-dashed bg-card py-16">
                        <CardContent className="flex flex-col items-center gap-4 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Phone className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    {t('bibliotheque.whatsapp.emptyTitle')}
                                </p>
                            </div>
                            {canCreate && (
                                <CreateInstanceDialog t={t} slug={slug} />
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-4 xl:col-span-4">
                <Card className="border bg-card shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">
                            Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('bibliotheque.whatsapp.stats.connected')}
                            </span>
                            <Badge variant="secondary">
                                {stats.connected}/{stats.total}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('bibliotheque.whatsapp.stats.messagesToday')}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                                {stats.messages_today}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {t('bibliotheque.whatsapp.stats.availability')}
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                {stats.total > 0
                                    ? Math.round(
                                          (stats.connected / stats.total) * 100,
                                      )
                                    : 0}
                                %
                            </span>
                        </div>
                    </CardContent>
                </Card>

                 
            </div>
        </div>
    );
}
