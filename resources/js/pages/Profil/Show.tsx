import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { ArrowLeft, Loader2, Power, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import {
    disconnect,
    fetchQr,
    index,
    restart,
} from '@/routes/workspaces/instances';
import type { BreadcrumbItem, EvolutionInstance } from '@/types';

import { AgentLinkCard } from './Partials/AgentLinkCard';
import { ConnectedBanner } from './Partials/ConnectedBanner';
import { ConnectingStatus } from './Partials/ConnectingStatus';
import { InstanceDetailsSidebar } from './Partials/InstanceDetailsSidebar';
import { InstanceQuickActions } from './Partials/InstanceQuickActions';
import { InstanceStatsGrid } from './Partials/InstanceStatsGrid';
import { QRScanner } from './Partials/QRScanner';

interface Props {
    instance: EvolutionInstance;
}

const statusBadge: Record<string, { label: string; color: string }> = {
    connected: {
        label: 'Connecté',
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    connecting: {
        label: 'Connexion',
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    },
    disconnected: {
        label: 'Déconnecté',
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

export default function InstanceShow({ instance }: Props) {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace();
    const slug = activeWorkspace?.slug;

    const [localInstance, setLocalInstance] = useState(instance);
    const [qrCode, setQrCode] = useState<string | null>(instance.qr_code ?? null);
    const [isLoadingQr, setIsLoadingQr] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isWaitingForQr, setIsWaitingForQr] = useState(false);

    const previousStatusRef = useRef(instance.status);

    const channel = `instance.${instance.instance_name}`;

    useEcho(channel, ['QrCodeUpdated', 'InstanceConnectionUpdated'], (e) => {
        if (e.qrCode) {
            setQrCode(e.qrCode);
            setIsLoadingQr(false);
            setIsWaitingForQr(false);
        }

        if (e.instance) {
            const newInstance = e.instance as EvolutionInstance;
            const newStatus = newInstance.status;

            previousStatusRef.current = newStatus;
            setLocalInstance(newInstance);

            if (newStatus === 'connecting' && !newInstance.qr_code) {
                setQrCode(null);
            }

            if (newStatus === 'connected') {
                setQrCode(null);
                setIsWaitingForQr(false);
                router.reload({ only: ['instance'] });
            }
        }
    });

    useEffect(() => {
        setLocalInstance(instance);
    }, [instance]);

    const handleFetchQr = useCallback(() => {
        setIsLoadingQr(true);
        setIsWaitingForQr(true);
        setQrCode(null);
        setLocalInstance((prev) => ({ ...prev, status: 'connecting' }));

        if (!slug) return;
        router.post(
            fetchQr({ slug, id: instance.id }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setIsLoadingQr(false);
                    setIsWaitingForQr(false);
                },
            },
        );
    }, [instance.id, slug]);

    const handleDisconnect = useCallback(() => {
        if (!slug) return;
        if (confirm('Déconnecter ce numéro WhatsApp ?')) {
            router.post(
                disconnect({ slug, id: localInstance.id }),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    }, [localInstance.id, slug]);

    const handleRestart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!slug) return;
            if (confirm('Redémarrer cette instance ?')) {
                setIsRestarting(true);
                router.put(
                    restart({ slug, id: localInstance.id }),
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onFinish: () => setIsRestarting(false),
                    },
                );
            }
        },
        [localInstance.id, slug],
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: slug ? index({ slug }).url.replace('/instances', '') : '#',
        },
        { title: 'Instances', href: slug ? index({ slug }).url : '#' },
        {
            title: localInstance.display_name || localInstance.instance_name,
            href: '',
        },
    ];

    const isConnected = localInstance.status === 'connected';
    const badge = statusBadge[localInstance.status] ?? statusBadge.disconnected;

    const renderStatusSection = () => {
        if (qrCode && localInstance.status !== 'connected') {
            return (
                <QRScanner
                    qrCode={qrCode}
                    isLoading={isLoadingQr}
                    onGenerate={handleFetchQr}
                    t={t}
                />
            );
        }

        switch (localInstance.status) {
            case 'connected':
                return null;
            case 'connecting':
                return (
                    <ConnectingStatus
                        instanceName={localInstance.instance_name}
                        onRestart={handleRestart}
                        isRestarting={isRestarting}
                        isWaitingForQr={isWaitingForQr}
                    />
                );
            default:
                return (
                    <QRScanner
                        qrCode={qrCode}
                        isLoading={isLoadingQr}
                        onGenerate={handleFetchQr}
                        t={t}
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`${localInstance.display_name || localInstance.instance_name} | Instance`}
            />

            <div className="py-6 md:py-10">
                <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Back link */}
                    <a
                        href={slug ? index({ slug }).url : '#'}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux instances
                    </a>

                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {localInstance.display_name ||
                                        localInstance.instance_name}
                                </h1>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {localInstance.phone_number
                                        ? `+${localInstance.phone_number}`
                                        : '--- --- ---'}
                                </p>
                            </div>
                            <Badge
                                className={cn(
                                    'gap-1.5 px-3 py-1 text-xs font-medium',
                                    badge.color,
                                )}
                            >
                                <span
                                    className={cn(
                                        'inline-block h-2 w-2 rounded-full',
                                        isConnected && 'bg-emerald-500',
                                        localInstance.status === 'connecting' &&
                                            'animate-pulse bg-amber-500',
                                        localInstance.status ===
                                            'disconnected' && 'bg-red-500',
                                    )}
                                />
                                {badge.label}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                            {isConnected && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDisconnect}
                                    className="gap-1.5 text-red-600"
                                >
                                    <Power className="h-4 w-4" />
                                    Déconnecter
                                </Button>
                            )}
                            <Button
                                variant={isConnected ? 'outline' : 'default'}
                                size="sm"
                                onClick={handleRestart}
                                disabled={isRestarting}
                                className="gap-1.5"
                            >
                                {isRestarting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                {isConnected ? 'Redémarrer' : 'Connecter'}
                            </Button>
                        </div>
                    </div>

                    {/* Status section (QR / connecting) */}
                    {renderStatusSection()}

                    {/* Connected: full detail view */}
                    {isConnected && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left column */}
                            <div className="space-y-6 lg:col-span-2">
                                <ConnectedBanner
                                    phoneNumber={localInstance.phone_number}
                                    messagesToday={
                                        localInstance.messages_today ?? 0
                                    }
                                    lastConnectedAt={localInstance.connected_at}
                                />
                                <InstanceStatsGrid
                                    messagesToday={
                                        localInstance.messages_today ?? 0
                                    }
                                    leadsCount={localInstance.leads_count ?? 0}
                                    connectionQuality={
                                        localInstance.connection_quality ??
                                        'faible'
                                    }
                                    connectedAt={localInstance.connected_at}
                                />
                                <AgentLinkCard
                                    agentConfig={localInstance.agent_config}
                                />
                            </div>

                            {/* Right sidebar */}
                            <div className="space-y-4">
                                <InstanceDetailsSidebar
                                    instanceName={localInstance.instance_name}
                                    phoneNumber={localInstance.phone_number}
                                    webhookUrl={localInstance.webhook_url}
                                    createdAt={localInstance.created_at}
                                    connectedAt={localInstance.connected_at}
                                />
                                {slug && (
                                    <InstanceQuickActions
                                        slug={slug}
                                        instanceId={localInstance.id}
                                        isConnected={isConnected}
                                        onFetchQr={handleFetchQr}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
