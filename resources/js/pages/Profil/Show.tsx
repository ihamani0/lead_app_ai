// resources/js/Pages/Instances/Show.tsx
import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { restart } from '@/routes/instances';
import { disconnect, fetchQr, index } from '@/routes/profile';
import type { BreadcrumbItem, EvolutionInstance } from '@/types';

import { ConnectingStatus } from './Partials/ConnectingStatus';
import { ConnectionStatus } from './Partials/ConnectionStatus';
import { InstanceTabs } from './Partials/InstanceTabs';
import { QRScanner } from './Partials/QRScanner';

interface Props {
    instance: EvolutionInstance;
}

export default function InstanceShow({ instance }: Props) {
    const { t } = useTranslation();

    const [localInstance, setLocalInstance] = useState(instance);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoadingQr, setIsLoadingQr] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isReconnect, setIsReconnect] = useState(false);
    const [isWaitingForQr, setIsWaitingForQr] = useState(false);

    const [connectionStartTime, setConnectionStartTime] = useState<
        number | null
    >(null);

    const previousStatusRef = useRef(instance.status);

    // Initialize isReconnect based on was_connected from server
    useEffect(() => {
        const wasConnected =
            (instance.settings as Record<string, unknown>)?.was_connected ===
            true;
        if (instance.status === 'connecting') {
            setIsReconnect(wasConnected);
        }
    }, [instance.status, instance.settings]);

    // Track connection duration
    useEffect(() => {
        if (localInstance.status === 'connecting' && !connectionStartTime) {
            setConnectionStartTime(Date.now());
        } else if (localInstance.status === 'connected') {
            setConnectionStartTime(null);
        }
    }, [localInstance.status, connectionStartTime]);

    // Calculate elapsed time
    const elapsedTime = connectionStartTime
        ? Math.floor((Date.now() - connectionStartTime) / 1000)
        : 0;

    // WebSocket setup
    const channel = `instance.${instance.instance_name}`;

    useEcho(channel, ['QrCodeUpdated', 'InstanceConnectionUpdated'], (e) => {
        if (e.qrCode) {
            setQrCode(e.qrCode);
            setIsLoadingQr(false);
            setIsWaitingForQr(false);
            setLocalInstance((prev) => ({ ...prev, status: 'disconnected' }));
        }

        if (e.instance) {
            const newInstance = e.instance as EvolutionInstance;
            const prevStatus = previousStatusRef.current;
            const newStatus = newInstance.status;

            // Determine if this is a reconnect (was connected before)
            if (newStatus === 'connecting' && prevStatus === 'connected') {
                setIsReconnect(true);
            }

            previousStatusRef.current = newStatus;
            setLocalInstance(newInstance);

            if (newStatus === 'connected') {
                setQrCode(null);
                setIsWaitingForQr(false);

                router.reload({
                    only: ['instance'],
                });
            }
        }
    });

    // Sync with server-side props when they change (e.g., after refresh)
    useEffect(() => {
        setLocalInstance(instance);
    }, [instance]);

    // Actions
    const handleFetchQr = useCallback(() => {
        setIsLoadingQr(true);
        setIsWaitingForQr(true);
        setQrCode(null);
        setIsReconnect(false); // This is a new connection attempt
        setLocalInstance((prev) => ({ ...prev, status: 'connecting' }));
        router.post(
            fetchQr(instance.id),
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
    }, [instance.id]);

    const handleDisconnect = useCallback(() => {
        if (confirm('Disconnect this WhatsApp number?')) {
            router.post(
                disconnect(localInstance.id),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
    }, [localInstance.id]);

    const handleRestart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to restart this instance?')) {
                setIsRestarting(true);
                router.put(
                    restart(localInstance.id),
                    {},
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onFinish: () => setIsRestarting(false),
                    },
                );
            }
        },
        [localInstance.id],
    );

    const handleAutoRestart = useCallback(() => {
        setIsRestarting(true);
        router.put(
            restart(localInstance.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsRestarting(false),
            },
        );
    }, [localInstance.id]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Instances', href: index().url },
        {
            title: localInstance.display_name || localInstance.instance_name,
            href: '',
        },
    ];

    // Render appropriate status component
    const renderStatusSection = () => {
        // Priority 1: Show QR Scanner if we have a QR code
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

        // Priority 2: If waiting for QR (first connection), show spinner
        if (isWaitingForQr && localInstance.status === 'connecting') {
            return (
                <ConnectingStatus
                    instanceName={localInstance.instance_name}
                    onRestart={handleRestart}
                    onAutoRestart={handleAutoRestart}
                    elapsedTime={elapsedTime}
                    isRestarting={isRestarting}
                    isReconnect={false}
                    isWaitingForQr={true}
                />
            );
        }

        switch (localInstance.status) {
            case 'connected':
                return (
                    <ConnectionStatus
                        phoneNumber={localInstance.phone_number}
                        onDisconnect={handleDisconnect}
                    />
                );

            case 'connecting':
                return (
                    <ConnectingStatus
                        instanceName={localInstance.instance_name}
                        onRestart={handleRestart}
                        onAutoRestart={handleAutoRestart}
                        elapsedTime={elapsedTime}
                        isRestarting={isRestarting}
                        isReconnect={isReconnect}
                        isWaitingForQr={false}
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

            <div className="py-8 md:py-12">
                <div className="space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Status Section */}
                    <div className="pt-4">{renderStatusSection()}</div>

                    {/* Tabs Section - Only show when connected */}
                    {localInstance.status === 'connected' && (
                        <div className="pt-4">
                            <InstanceTabs instance={localInstance} />
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
