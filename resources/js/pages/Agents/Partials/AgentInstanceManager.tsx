import { router } from '@inertiajs/react';
import {
    Phone,
    Unlink,
    Link2,
    CheckCircle,
    XCircle,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
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
import { useTranslation } from '@/hooks/use-translation';
import agents from '@/routes/agents';

interface AgentWithRelations {
    id: string;
    name: string | null;
    is_active: boolean;
    instance?: {
        id: string;
        instance_name: string;
        display_name: string | null;
        phone_number: string | null;
        status: string;
    } | null;
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
}

export default function AgentInstanceManager({
    agent,
    availableInstances,
}: Props) {
    const { t } = useTranslation();
    const [selectedInstanceId, setSelectedInstanceId] = useState<string>(
        agent.instance?.id || '',
    );

    const [webhook, setWebhook] = useState<string>('');

    const [isLinking, setIsLinking] = useState(false);
    const [isUnlinking, setIsUnlinking] = useState(false);

    const isLinked = agent.instance !== null;
    const isConnected = isLinked && agent.instance?.status === 'connected';
    const isActive = agent.is_active && isConnected;

    const allInstances =
        isLinked && agent.instance
            ? [agent.instance, ...availableInstances]
            : availableInstances;

    const handleLink = () => {
        if (!selectedInstanceId) return;
        setIsLinking(true);
        router.post(
            agents.linkInstance(agent.id).url,
            { instance_id: selectedInstanceId, webhook_url: webhook },
            { onFinish: () => setIsLinking(false) },
        );
    };

    const handleUnlink = () => {
        if (!confirm(t('agents.config.unlinkConfirm'))) return;
        setIsUnlinking(true);
        router.post(
            agents.unlinkInstance(agent.id).url,
            {},
            { onFinish: () => setIsUnlinking(false) },
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {t('agents.config.instance')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.instanceDesc')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        {t('agents.config.whatsappInstance')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLinked && agent.instance ? (
                        <div className="rounded-lg border p-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">
                                            {agent.instance.display_name ||
                                                agent.instance.instance_name}
                                        </p>
                                        {agent.instance.status ===
                                        'connected' ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : agent.instance.status ===
                                          'connecting' ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-slate-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {agent.instance.phone_number ||
                                            'No phone number'}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                agent.instance.status ===
                                                'connected'
                                                    ? 'bg-green-100 text-green-700'
                                                    : agent.instance.status ===
                                                        'connecting'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {agent.instance.status}
                                        </span>
                                        {isActive && (
                                            <span className="text-xs text-green-600">
                                                • {t('agents.status.running')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUnlink}
                                    disabled={isUnlinking}
                                    className="text-destructive hover:bg-destructive/10"
                                >
                                    <Unlink className="mr-1 h-4 w-4" />
                                    {t('agents.unlink_instance')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {t('agents.config.selectInstance')}
                            </p>
                            <Select
                                value={selectedInstanceId}
                                onValueChange={setSelectedInstanceId}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={t(
                                            'agents.config.chooseInstance',
                                        )}
                                    />
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
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div>
                                <Label>
                                    Url <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={webhook}
                                    onChange={(e) => setWebhook(e.target.value)}
                                    placeholder={
                                        'http://example.com/webhook/trigger'
                                    }
                                />
                            </div>
                            <Button
                                onClick={handleLink}
                                disabled={!selectedInstanceId || isLinking}
                                className="gap-2"
                            >
                                {isLinking ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Link2 className="h-4 w-4" />
                                )}
                                {t('agents.link_instance')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Instance Requirements Info */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>{t('agents.config.requirements')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                        <li>{t('agents.config.req1')}</li>
                        <li>{t('agents.config.req2')}</li>
                        <li>{t('agents.config.req3')}</li>
                    </ul>
                </CardContent>
            </Card> */}
        </div>
    );
}
