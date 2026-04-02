import { History, MessageCircle, Clock, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';

interface Props {
    agent: {
        id: string;
        name: string | null;
    };
}

export default function AgentConversationLogs({ agent: _agent }: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {t('agents.config.logs')}
                </h2>
                <p className="text-muted-foreground">
                    {t('agents.config.logsDesc')}
                </p>
            </div>

            {/* Placeholder for future implementation */}
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="mb-4 rounded-full bg-slate-100 p-6">
                        <History className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                        {t('agents.config.comingSoon')}
                    </h3>
                    <p className="max-w-md text-center text-muted-foreground">
                        {t('agents.config.logsPlaceholder')}
                    </p>
                    <div className="mt-8 grid gap-4 text-center text-sm text-muted-foreground md:grid-cols-3">
                        <div className="rounded-lg border p-4">
                            <MessageCircle className="mx-auto mb-2 h-6 w-6" />
                            <p className="font-medium">Conversation History</p>
                            <p className="text-xs">View all chats</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <Clock className="mx-auto mb-2 h-6 w-6" />
                            <p className="font-medium">Response Times</p>
                            <p className="text-xs">Performance metrics</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <Search className="mx-auto mb-2 h-6 w-6" />
                            <p className="font-medium">Search & Filter</p>
                            <p className="text-xs">
                                Find specific conversations
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
