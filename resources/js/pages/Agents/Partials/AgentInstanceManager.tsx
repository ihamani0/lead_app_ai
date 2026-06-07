import { router } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import {
    CheckCircle2,
    Clock,
    Copy,
    ExternalLink,
    Globe,
    Loader2,
    LogOut,
    MessageCircle,
    MessageSquare,
    Phone,
    PlugZap,
    PlusCircle,
    QrCode,
    RefreshCw,
    Smartphone,
    Wifi,
    Wrench,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { agentApi } from '@/lib/api/agent';
import workspaces from '@/routes/workspaces';
import type { EvolutionInstance, InstanceStatus } from '@/types';

interface AgentStats {
    total_conversations: number;
    qualified_leads: number;
    satisfaction_rate: number | null;
    last_activity: string | null;
    messages_today: number;
}

interface AgentWithRelations {
    id: string;
    name: string | null;
    is_active: boolean;
    instance?: EvolutionInstance | null;
    evolution_instance_id?: string | null;
    created_at?: string;
}

interface AvailableInstance {
    id: string;
    instance_name: string;
    display_name: string | null;
    phone_number: string | null;
    status: string;
}

interface Props {
    agent: AgentWithRelations;
    availableInstances: AvailableInstance[];
    stats: AgentStats;
    onNavigateToTest?: () => void;
}

function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatRelative(dateStr: string | null): string {
    if (!dateStr) return 'Jamais';
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'Il y a quelques secondes';
    if (min < 60) return `Il y a ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `Il y a ${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `Il y a ${days} jours`;
}

function qualityLabel(status: InstanceStatus): { text: string; color: string } {
    switch (status) {
        case 'connected':
            return { text: 'Excellente', color: 'text-green-600' };
        case 'connecting':
            return { text: 'En cours', color: 'text-amber-600' };
        default:
            return { text: 'Déconnectée', color: 'text-slate-400' };
    }
}

function WhatsAppIconSmall({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="#25D366"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export default function AgentInstanceManager({
    agent,
    availableInstances,
    stats,
    onNavigateToTest,
}: Props) {
    const activeWorkspace = useActiveWorkspace()!;
    const [selectedInstanceId, setSelectedInstanceId] = useState<string>(
        agent.instance?.id || '',
    );
    const [isLinking, setIsLinking] = useState(false);
    const [isUnlinking, setIsUnlinking] = useState(false);

    const [localInstance, setLocalInstance] = useState<
        EvolutionInstance | undefined | null
    >(agent.instance);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoadingQr, setIsLoadingQr] = useState(false);
    const [isWaitingForQr, setIsWaitingForQr] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [mode, setMode] = useState<'link' | 'create'>('link');
    const [isCreating, setIsCreating] = useState(false);
    const [newInstanceName, setNewInstanceName] = useState('');
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    const previousStatusRef = useRef(localInstance?.status);

    const isLinked = localInstance !== null && localInstance !== undefined;

    const channel = localInstance
        ? `instance.${localInstance.instance_name}`
        : '';

    useEcho(channel, ['QrCodeUpdated', 'InstanceConnectionUpdated'], (e) => {
        if (e.qrCode) {
            setQrCode(e.qrCode as string);
            setIsLoadingQr(false);
            setIsWaitingForQr(false);
            setActionError(null);
            setLocalInstance((prev) =>
                prev ? { ...prev, status: 'disconnected' as const } : prev,
            );
        }

        if (e.instance) {
            const newInstance = e.instance as EvolutionInstance;
            const newStatus = newInstance.status;

            previousStatusRef.current = newStatus;
            setLocalInstance(newInstance);

            if (newStatus === 'connected') {
                setQrCode(null);
                setIsWaitingForQr(false);
                router.reload({ only: ['agent'] });
            }
        }
    });

    useEffect(() => {
        setLocalInstance(agent.instance);
    }, [agent.instance]);

    const allInstances =
        isLinked && localInstance
            ? [localInstance, ...availableInstances]
            : availableInstances;

    const isConnected = localInstance?.status === 'connected';
    const isConnecting = localInstance?.status === 'connecting';
    const hasQr = qrCode !== null;
    const status = (localInstance?.status ?? 'disconnected') as InstanceStatus;
    const ql = qualityLabel(status);

    const handleLink = () => {
        
        if (!selectedInstanceId) return;
        setIsLinking(true);
        router.post(
            workspaces.agents.linkInstance({
                slug: activeWorkspace.slug,
                agent: agent.id,
            }).url,
            { instance_id: selectedInstanceId },
            { onFinish: () => setIsLinking(false) },
        );
    };

    const handleUnlink = () => {
        if (!confirm('Dissocier cette instance ?')) return;
        setIsUnlinking(true);
        router.post(
            workspaces.agents.unlinkInstance({
                slug: activeWorkspace.slug,
                agent: agent.id,
            }).url,
            {},
            {
                onFinish: () => {
                    setIsUnlinking(false);
                    setLocalInstance(null);
                    setQrCode(null);
                },
            },
        );
    };

    const handleFetchQr = useCallback(async () => {
        if (!localInstance) return;

        setIsLoadingQr(true);
        setIsWaitingForQr(true);
        setQrCode(null);
        setActionError(null);

        try {
            await agentApi.fetchQr(activeWorkspace.slug, agent.id);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data as { error?: string };
                setActionError(
                    body.error || 'Erreur lors de la génération du QR code',
                );
            } else {
                setActionError('Erreur lors de la génération du QR code');
            }
            setIsWaitingForQr(false);
            setIsLoadingQr(false);
        }
    }, [localInstance, activeWorkspace.slug, agent.id]);

    const handleDisconnect = useCallback(async () => {
        if (!localInstance) return;
        if (!confirm('Déconnecter ce numéro WhatsApp ?')) return;

        setIsLoadingQr(true);
        setActionError(null);

        try {
            await agentApi.disconnect(activeWorkspace.slug, agent.id);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data as { error?: string };
                setActionError(
                    body.error || 'Erreur lors de la déconnexion',
                );
            } else {
                setActionError('Erreur lors de la déconnexion');
            }
            setIsLoadingQr(false);
        }
    }, [localInstance, activeWorkspace.slug, agent.id]);

    const handleRestart = useCallback(async () => {
        if (!localInstance) return;
        if (!confirm('Redémarrer cette instance ?')) return;

        setIsRestarting(true);
        setActionError(null);

        try {
            await agentApi.restart(activeWorkspace.slug, agent.id);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data as { error?: string };
                setActionError(
                    body.error || 'Erreur lors du redémarrage',
                );
            } else {
                setActionError('Erreur lors du redémarrage');
            }
            setIsRestarting(false);
        }
    }, [localInstance, activeWorkspace.slug, agent.id]);

    const handleCopy = (field: string, value: string) => {
        copyToClipboard(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleCreateInstance = async () => {
        if (!newInstanceName.trim()) return;
        setIsCreating(true);
        setActionError(null);

        try {
            const response = await agentApi.createInstance(
                activeWorkspace.slug,
                agent.id,
                {
                    instance_name: newInstanceName.trim(),
                    display_name: newDisplayName.trim() || undefined,
                    phone_number: newPhoneNumber.trim() || undefined,
                },
            );

            if (response.data?.instance) {
                setLocalInstance(response.data.instance as EvolutionInstance);
                setNewInstanceName('');
                setNewDisplayName('');
                setNewPhoneNumber('');
                setMode('link');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data as { error?: string };
                setActionError(
                    body.error || "Erreur lors de la création de l'instance",
                );
            } else {
                setActionError("Erreur lors de la création de l'instance");
            }
        } finally {
            setIsCreating(false);
        }
    };

    // Connection steps — shown when QR is displayed
    const steps = [
        {
            key: 'scan',
            icon: Smartphone,
            label: 'Scan du QR code',
            done: hasQr || isConnected,
            loading: false,
        },
        {
            key: 'web',
            icon: Wifi,
            label: 'Connexion au WhatsApp Web',
            done: isConnected,
            loading: isConnecting && hasQr,
        },
        {
            key: 'sync',
            icon: RefreshCw,
            label: 'Synchronisation',
            done: isConnected,
            loading: isConnecting,
        },
        {
            key: 'ready',
            icon: MessageCircle,
            label: 'Prêt à recevoir des messages',
            done: isConnected,
            loading: false,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* ===== Left Column ===== */}
            <div className="space-y-6 lg:col-span-2">
                {isLinked && localInstance ? (
                    <Card>
                        {/* Header */}
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <WhatsAppIconSmall className="h-8 w-8" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-lg">
                                                WhatsApp
                                            </CardTitle>
                                            {isConnected ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1.5 px-2.5 py-0.5 text-xs font-medium border-0">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                                                    Connecté
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 gap-1.5 px-2.5 py-0.5 text-xs font-medium border-0">
                                                    Déconnecté
                                                </Badge>
                                            )}
                                        </div>
                                        {localInstance.connected_at &&
                                            isConnected && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Connecté le{' '}
                                                    {formatDate(
                                                        localInstance.connected_at,
                                                    )}
                                                </p>
                                            )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleUnlink}
                                        disabled={isUnlinking}
                                    >
                                        <LogOut className="mr-1.5 h-4 w-4" />
                                        Dissocier
                                    </Button>
                                    {isConnected && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDisconnect}
                                            disabled={isLoadingQr}
                                            className="text-red-600 hover:bg-red-50 border-red-200"
                                        >
                                            <PlugZap className="mr-1.5 h-4 w-4" />
                                            Déconnecter
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-5 pt-5">
                            {actionError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {actionError}
                                </div>
                            )}

                            {/* QR Section — shown when not connected */}
                            {!isConnected ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Left: QR Code + Instructions */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm">
                                            Scannez le QR code avec votre WhatsApp
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Ouvrez WhatsApp sur votre téléphone →{' '}
                                            Paramètres → Appareils connectés →{' '}
                                            Connecter un appareil
                                        </p>

                                        <div className="flex justify-center py-2">
                                            {hasQr && qrCode ? (
                                                <div className="rounded-lg bg-white p-3 shadow-md border">
                                                    <QRCodeSVG
                                                        value={qrCode}
                                                        size={200}
                                                        level="H"
                                                        includeMargin
                                                    />
                                                </div>
                                            ) : isWaitingForQr ? (
                                                <div className="flex h-[216px] w-[216px] items-center justify-center rounded-lg border bg-muted/30">
                                                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <div className="flex h-[216px] w-[216px] flex-col items-center justify-center rounded-lg border bg-muted/30 gap-3">
                                                    <QrCode className="h-10 w-10 text-muted-foreground" />
                                                    <Button
                                                        size="sm"
                                                        onClick={handleFetchQr}
                                                        disabled={isLoadingQr}
                                                        className="gap-1.5"
                                                    >
                                                        {isLoadingQr ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <QrCode className="h-4 w-4" />
                                                        )}
                                                        Générer le QR code
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {hasQr && (
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleFetchQr}
                                                    className="gap-1.5 text-xs"
                                                >
                                                    <RefreshCw className="h-3.5 w-3.5" />
                                                    Rafraîchir le QR
                                                </Button>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="text-xs text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
                                            onClick={() =>
                                                window.open(
                                                    'https://faq.whatsapp.com/13121127155',
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Besoin d'aide ? Voir le guide de connexion
                                        </button>
                                    </div>

                                    {/* Right: Connection Status Steps */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-sm">
                                            Statut de la connexion
                                        </h3>
                                        <div className="space-y-3">
                                            {steps.map((step) => (
                                                <div
                                                    key={step.key}
                                                    className="flex items-center justify-between rounded-lg border bg-card px-3 py-2.5"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {step.done ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                        ) : step.loading ? (
                                                            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                                                        ) : (
                                                            <Clock className="h-5 w-5 text-slate-300" />
                                                        )}
                                                        <span className="text-sm">
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                    {step.done ? (
                                                        <span className="text-xs text-green-600 font-medium">
                                                            Connecté
                                                        </span>
                                                    ) : step.loading ? (
                                                        <span className="text-xs text-amber-600 font-medium">
                                                            En cours
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">
                                                            En attente
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Connected state */
                                <div className="rounded-lg border bg-green-50/40 p-6 text-center">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-green-800">
                                        WhatsApp connecté
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {localInstance.phone_number ||
                                            'Numéro inconnu'}
                                    </p>
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {stats.messages_today > 0
                                            ? `${stats.messages_today} message${stats.messages_today > 1 ? 's' : ''} aujourd'hui`
                                            : "Aucun message aujourd'hui"}
                                    </p>
                                </div>
                            )}

                            {/* Bottom Banner */}
                            <div className="flex items-start gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Gardez votre téléphone connecté à Internet
                                    pour maintenir la connexion active.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Not linked — create or link instance */
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                 WhatsApp
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {allInstances.length > 0 && (
                                <div className="flex gap-1 rounded-lg bg-muted p-1">
                                    <button
                                        type="button"
                                        onClick={() => setMode('link')}
                                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                            mode === 'link'
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Lier une existante
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode('create')}
                                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                                            mode === 'create'
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Créer une nouvelle
                                    </button>
                                </div>
                            )}

                            {mode === 'link' && allInstances.length > 0 ? (
                                <>
                                    <p className="text-sm text-muted-foreground">
                                        Sélectionnez une WhatsApp connectée
                                        pour lier à cet agent.
                                    </p>
                                    <Select
                                        value={selectedInstanceId}
                                        onValueChange={setSelectedInstanceId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir une instance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allInstances.map((instance) => (
                                                <SelectItem
                                                    key={instance.id}
                                                    value={instance.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        <span>
                                                            {instance.display_name ||
                                                                instance.phone_number ||
                                                                instance.instance_name}
                                                        </span>
                                                        {instance.status ===
                                                            'connected' && (
                                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Button
                                        onClick={handleLink}
                                        disabled={!selectedInstanceId || isLinking}
                                        className="gap-2"
                                    >
                                        {isLinking ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}
                                        Lier l'instance
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {allInstances.length === 0
                                            ? "Vous n'avez pas encore d'instance WhatsApp. Créez-en une pour connecter votre numéro."
                                            : 'Créez une nouvelle instance WhatsApp pour connecter un autre numéro.'}
                                    </p>
                                    <div className="space-y-2">
                                        <Label htmlFor="instance-name">Nom de WhatsApp </Label>
                                        <Input
                                            id="instance-name"
                                            value={newInstanceName}
                                            onChange={(e) =>
                                                setNewInstanceName(e.target.value)
                                            }
                                            placeholder="Ex: support-whatsapp"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="display-name">
                                            Nom d'affichage (optionnel)
                                        </Label>
                                        <Input
                                            id="display-name"
                                            value={newDisplayName}
                                            onChange={(e) =>
                                                setNewDisplayName(e.target.value)
                                            }
                                            placeholder="Ex: Support Client"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone-number">
                                            Numéro de téléphone (optionnel)
                                        </Label>
                                        <Input
                                            id="phone-number"
                                            value={newPhoneNumber}
                                            onChange={(e) =>
                                                setNewPhoneNumber(e.target.value)
                                            }
                                            placeholder="e.g. 212612345678"
                                        />
                                    </div>
                                    <Button
                                        onClick={handleCreateInstance}
                                        disabled={
                                            !newInstanceName.trim() || isCreating
                                        }
                                        className="gap-2"
                                    >
                                        {isCreating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <PlusCircle className="h-4 w-4" />
                                        )}
                                        Créer l'instance
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ===== Right Column ===== */}
            {isLinked && localInstance && (
                <div className="space-y-5">
                    {/* Instance Details */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Détails de l'instance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Numéro
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span>
                                        {localInstance.phone_number || '-'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                'phone',
                                                localInstance.phone_number ||
                                                    '',
                                            )
                                        }
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {copiedField === 'phone' ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    ID Instance
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs">
                                        {localInstance.instance_name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCopy(
                                                'id',
                                                localInstance.instance_name,
                                            )
                                        }
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {copiedField === 'id' ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Statut
                                </span>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                            isConnected
                                                ? 'text-green-600'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${
                                                isConnected
                                                    ? 'bg-green-500'
                                                    : 'bg-slate-300'
                                            }`}
                                        />
                                        {isConnected
                                            ? 'Connecté'
                                            : 'Déconnecté'}
                                    </span>
                                    {isConnected && (
                                        <button
                                            type="button"
                                            onClick={handleRestart}
                                            disabled={isRestarting}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <RefreshCw
                                                className={`h-3.5 w-3.5 ${isRestarting ? 'animate-spin' : ''}`}
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Qualité
                                </span>
                                <span
                                    className={`text-xs font-medium ${ql.color}`}
                                >
                                    {ql.text}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Messages aujourd'hui
                                </span>
                                <span className="font-medium">
                                    {stats.messages_today}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Dernière activité
                                </span>
                                <span className="text-xs">
                                    {formatRelative(stats.last_activity)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Actions rapides
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        'https://web.whatsapp.com',
                                        '_blank',
                                    )
                                }
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                            >
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1 text-left">
                                    Ouvrir WhatsApp Web
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </button>
                            {!isConnected && (
                                <button
                                    type="button"
                                    onClick={handleFetchQr}
                                    disabled={isLoadingQr}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                >
                                    <QrCode className="h-4 w-4 text-muted-foreground" />
                                    <span className="flex-1 text-left">
                                        Reconnecter (QR Code)
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        &gt;
                                    </span>
                                </button>
                            )}
                            {onNavigateToTest && (
                                <button
                                    type="button"
                                    onClick={onNavigateToTest}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                                >
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="flex-1 text-left">
                                        Tester l'envoi d'un message
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleDisconnect}
                                disabled={isLoadingQr}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-red-50 transition-colors text-red-600"
                            >
                                <PlugZap className="h-4 w-4" />
                                <span className="flex-1 text-left">
                                    Déconnecter l'instance
                                </span>
                                <span className="text-red-400 text-xs">
                                    &gt;
                                </span>
                            </button>
                        </CardContent>
                    </Card>

                    {/* Coming Soon */}
                         {/*<Card>
                            <CardContent className="pt-5 pb-4">
                                <p className="text-xs text-muted-foreground mb-3">
                                    Instagram, Messenger, Telegram et plus encore.
                                </p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                                        <Instagram className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                                        <MessageCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4 text-white"
                                            fill="currentColor"
                                        >
                                            <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.127.033.397-.034.62-.102.337-1.33 5.6-1.88 7.446-.232.78-.34.862-.482.874-.2.017-.352-.12-.453-.212-.066-.06-1.03-1.04-1.98-1.95-.29-.278-.516-.421-.098-.82.547-.523 1.12-1.094 1.6-1.574.556-.56.403-.672-.087-.238a380.467 380.467 0 01-2.178 1.78c-.414.337-.74.395-1.125.198-.336-.172-.654-.352-.976-.543-.39-.232-.397-.257-.157-.53.153-.174 1.017-1.002 1.833-1.73.603-.537.862-.614 1.138-.46.195.11 1.09.73 1.09.73.15.09.31.07.434.02.01-.004.47-.183.47-.183.16-.064.3-.034.397.086.068.085.057.198.047.227-.005.013-.008.027-.008.041 0 .026-.005.051-.014.074-.034.088-.3.997-.524 1.73-.12.393-.243.8-.36 1.18.008.024.013.05.013.076 0 .034-.006.067-.017.099-.02.06-.06.12-.11.156-.04.028-.086.044-.134.044l-.003.004c-.06.003-.158-.015-.248-.066-.073-.041-1.312-.87-1.73-1.15-.5-.335-.36-.65-.068-.832.282-.176 1.68-1.23 2.457-1.586.274-.126.5-.188.563-.204z" />
                                        </svg>
                                    </div>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40">
                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs gap-1.5"
                                    onClick={() =>
                                        window.open(
                                            'mailto:support@example.com?subject=Intéressé par les nouveaux canaux',
                                            '_blank',
                                        )
                                    }
                                >
                                    Me prévenir
                                </Button>
                            </CardContent>
                        </Card>*/}
                </div>
            )}
        </div>
    );
}
