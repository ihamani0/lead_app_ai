import { router } from '@inertiajs/react';
import { Shield, Plus, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import agents from '@/routes/agents';

import type { AgentConfig, EvolutionInstance } from '@/types';

interface AgentWithRelations extends AgentConfig {
    instance?: EvolutionInstance | null;
    knowledge_bases_count?: number;
    knowledgeBases?: Array<{
        id: string;
        name: string;
        status: string;
        created_at: string;
    }>;
}

interface Props {
    agent: AgentWithRelations;
}

export default function AgentBlockList({ agent }: Props) {
    const { t } = useTranslation();
    const [newPhone, setNewPhone] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const blocklist = agent.settings?.blocklist || [];

    const cleanPhoneNumber = (phone: string): string => {
        return phone.replace(/\D/g, '');
    };

    const isValidPhone = (phone: string): boolean => {
        const cleaned = cleanPhoneNumber(phone);
        return cleaned.length >= 10 && cleaned.length <= 15;
    };

    const handleAddPhone = () => {
        if (!isValidPhone(newPhone)) return;

        setIsSaving(true);
        const updatedBlocklist = [...blocklist, cleanPhoneNumber(newPhone)];

        router.patch(
            agents.updateSettings(agent.id).url,
            { settings: { blocklist: updatedBlocklist } },
            {
                onFinish: () => {
                    setIsSaving(false);
                    setNewPhone('');
                },
            },
        );
    };

    const handleRemovePhone = (phone: string) => {
        setIsSaving(true);
        const updatedBlocklist = blocklist.filter((p) => p !== phone);

        router.patch(
            agents.updateSettings(agent.id).url,
            { settings: { blocklist: updatedBlocklist } },
            { onFinish: () => setIsSaving(false) },
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {t('agents.config.blocklist')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.blocklistDesc')}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('agents.config.blockedNumbers')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add new number */}
                    <div className="flex gap-2">
                        <Input
                            type="tel"
                            placeholder={t('agents.config.phonePlaceholder')}
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleAddPhone}
                            disabled={!isValidPhone(newPhone) || isSaving}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            {t('agents.config.add')}
                        </Button>
                    </div>

                    {/* Blocklist table */}
                    {blocklist.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        {t('agents.config.phoneNumber')}
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        {t('agents.config.actions')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blocklist.map((phone) => (
                                    <TableRow key={phone}>
                                        <TableCell className="font-mono">
                                            +{phone}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemovePhone(phone)
                                                }
                                                disabled={isSaving}
                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            <Shield className="mx-auto mb-2 h-8 w-8 opacity-50" />
                            <p>{t('agents.config.noBlocked')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info
            <Card>
                <CardHeader>
                    <CardTitle>{t('agents.config.blocklistInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{t('agents.config.blocklistTip1')}</p>
                    <p>{t('agents.config.blocklistTip2')}</p>
                </CardContent>
            </Card> */}
        </div>
    );
}
