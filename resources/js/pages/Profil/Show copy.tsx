// resources/js/Pages/Instances/Show.tsx
import { Head, router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import {
    QrCode,
    Loader2,
    CheckCircle,
    Power,
    RefreshCw,
    Activity,
    Zap,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { disconnect, fetchQr, index } from '@/routes/profile';
import type { BreadcrumbItem, EvolutionInstance } from '@/types';
import AgentManager from './Partials/AgentManager';

export default function InstanceShow({
    instance,
}: {
    instance: EvolutionInstance;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Home', href: dashboard().url },
        { title: 'Profile', href: index().url },
        { title: `Details - ${instance.instance_name} `, href: '' },
    ];

    const [loadingQr, setLoadingQr] = useState(false);

    const [qrCode, setQrCode] = useState<string | null>(null);
    const [localInstance, setLocalInstance] = useState(instance);

    const channel = `instance.${instance.instance_name}`;

    const { leaveChannel } = useEcho(
        channel,
        ['QrCodeUpdated', 'InstanceConnectionUpdated'],
        (e) => {
            console.log(e);
            if (e.qrCode) {
                setQrCode(e.qrCode);
                setLoadingQr(false);
            }

            if (e.instance) {
                setLocalInstance(e.instance);

                if (e.instance.status === 'connected') {
                    setQrCode(null);
                    leaveChannel();
                }
            }
        },
    );

    // --- 2. ACTIONS ---
    const fetchQrCode = () => {
        setLoadingQr(true);

        router.post(fetchQr(instance.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDisconnect = () => {
        if (confirm('Are you sure you want to disconnect this number?')) {
            router.post(disconnect(localInstance.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Manage ${localInstance.instance_name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* --- DYNAMIC HEADER AREA --- */}
                    {localInstance.status === 'connected' ? (
                        // STATE: CONNECTED
                        <div className="relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-linear-to-br from-emerald-50/50 to-white p-6 shadow-sm transition-all hover:shadow-md dark:border-emerald-500/20 dark:from-emerald-950/20 dark:to-background">
                            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 shadow-inner dark:bg-emerald-900/30">
                                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
                                            localInstance Connected
                                        </h3>
                                        <p className="mt-1 text-emerald-700/80 dark:text-emerald-400/80">
                                            {localInstance.phone_number
                                                ? `Successfully linked to +${localInstance.phone_number}`
                                                : 'WhatsApp localInstance is active and ready for automation.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full items-center gap-3 md:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={handleDisconnect}
                                        className="h-11 w-full border-red-200 bg-white/50 text-red-600 hover:bg-red-50 hover:text-red-700 md:w-auto dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <Power className="mr-2 h-4 w-4" />
                                        Disconnect Instance
                                    </Button>
                                </div>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />
                        </div>
                    ) : (
                        // STATE: DISCONNECTED / QR SCAN
                        <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-linear-to-br from-amber-50/50 to-white p-8 shadow-sm dark:border-amber-500/20 dark:from-amber-950/20 dark:to-background">
                            <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                        <QrCode className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight text-amber-950 dark:text-amber-50">
                                            Link Your WhatsApp
                                        </h3>
                                        <p className="mt-2 max-w-md text-lg text-amber-800/80 dark:text-amber-400/80">
                                            Scan the QR code with WhatsApp to
                                            start automating your conversations.
                                        </p>
                                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-700 md:justify-start dark:text-amber-500">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                                                1
                                            </span>
                                            Open WhatsApp on your phone
                                        </div>
                                        <div className="mt-1 flex items-center justify-center gap-2 text-sm text-amber-700 md:justify-start dark:text-amber-500">
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                                                2
                                            </span>
                                            Go to Settings {'>'} Linked Devices
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    {!qrCode ? (
                                        <Button
                                            size="lg"
                                            className="h-14 rounded-xl bg-amber-600 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-amber-700 hover:shadow-amber-200 dark:hover:shadow-none"
                                            onClick={fetchQrCode}
                                            disabled={loadingQr}
                                        >
                                            {loadingQr ? (
                                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            ) : (
                                                <QrCode className="mr-3 h-6 w-6" />
                                            )}
                                            Generate QR Code
                                        </Button>
                                    ) : (
                                        <div className="group relative animate-in duration-500 zoom-in">
                                            <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-transform md:group-hover:scale-105 dark:bg-slate-900">
                                                <QRCodeSVG
                                                    value={qrCode}
                                                    size={220}
                                                    level={'H'}
                                                    includeMargin={true}
                                                    className="rounded-lg"
                                                />
                                                {/* Pulse effect to show we are waiting */}
                                                <div className="absolute inset-0 animate-pulse rounded-3xl border-4 border-amber-500/20" />
                                            </div>

                                            <div className="mt-4 flex flex-col items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="animate-pulse border-amber-500/50 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                                                >
                                                    <span className="mr-1.5 flex h-2 w-2 rounded-full bg-amber-500" />
                                                    Waiting for scan
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={fetchQrCode}
                                                    className="h-8 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                                >
                                                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                                    Regenerate QR
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
                        </div>
                    )}

                    {/* 2. THE TABS SECTION */}
                    {localInstance.status === 'connected' && (
                        <Tabs
                            defaultValue="overview"
                            className="mt-10 w-full animate-in duration-700 slide-in-from-bottom-4"
                        >
                            <TabsList className="mb-8 inline-flex h-12 items-center justify-center rounded-xl bg-slate-100 p-1.5 dark:bg-slate-900">
                                <TabsTrigger
                                    value="overview"
                                    className="flex items-center gap-2 rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
                                >
                                    <Activity className="h-4 w-4" />
                                    <span>Overview & Stats</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="automation"
                                    className="flex items-center gap-2 rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800"
                                >
                                    <Zap className="h-4 w-4 text-purple-500" />
                                    <span>AI Automation</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* TAB 1: OVERVIEW */}
                            <TabsContent value="overview" className="space-y-6">
                                {/* STATS CARDS */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {/* These are placeholder-ish in the original code, keeping structure same but adding a bit of style */}
                                    <Card className="border-none shadow-xl dark:bg-slate-900">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Status
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                Active
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-none shadow-xl dark:bg-slate-900">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Provider
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                Evolution
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-none shadow-xl dark:bg-slate-900">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                                Platform
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                WhatsApp
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* DETAILS CARD */}
                                <Card className="overflow-hidden border-none shadow-xl dark:bg-slate-900">
                                    <CardHeader className="border-b bg-slate-50/50 px-6 py-4 dark:bg-gray-700/15">
                                        <CardTitle className="text-lg font-semibold">
                                            Instance Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            <div className="flex items-center justify-between px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    Instance Identity
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {
                                                        localInstance.instance_name
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    WhatsApp Number
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {localInstance.phone_number
                                                        ? `+${localInstance.phone_number}`
                                                        : 'Unlinked'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between px-6 py-4">
                                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    Last Synced
                                                </span>
                                                <span className="text-sm text-slate-600 italic dark:text-slate-400">
                                                    Just now
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* TAB 2: AI AUTOMATION */}
                            <TabsContent
                                value="automation"
                                className="animate-in duration-500 fade-in slide-in-from-right-4"
                            >
                                <AgentManager instance={localInstance} />
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
