// src/components/dashboard/recent-leads-list.tsx
import { MessageCircle, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export interface RecentLead {
    id: string;
    name: string;
    phone: string;
    status: string;
    temperature: string;
    created_at: string;
    instance?: { instance_name: string };
}

interface RecentLeadsListProps {
    leads: RecentLead[];
}

function getInitials(name: string): string {
    return (
        name
            .split(' ')
            .map((n) => n[0]?.toUpperCase())
            .join('')
            .slice(0, 2) || '??'
    );
}

function formatDate(dateString: string, t: (key: string) => string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('dashboard.time.justNow');
    if (hours < 24) return `${hours}${t('dashboard.time.hoursAgo')}`;
    if (days < 7) return `${days}${t('dashboard.time.daysAgo')}`;
    return date.toLocaleDateString();
}

const statusVariantMap: Record<
    string,
    'default' | 'secondary' | 'outline' | 'destructive'
> = {
    NEW: 'default',
    CONVERTED: 'secondary',
    LOST: 'destructive',
    QUALIFIED: 'secondary',
    CONTACTED: 'outline',
    QUALIFYING: 'outline',
    IN_PROGRESS: 'outline',
};

const temperatureBadgeClass: Record<string, string> = {
    HOT: 'border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10',
    WARM: 'border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10',
    COLD: 'border-cyan-500/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10',
};

export function RecentLeadsList({ leads }: RecentLeadsListProps) {
    const { t, t: td } = useTranslation();

    if (leads.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        {t('dashboard.recentLeads')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                            {t('dashboard.noLeads')}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('dashboard.noLeadsDescription')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    {t('dashboard.recentLeads')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {leads.map((lead) => (
                        <div
                            key={lead.id}
                            className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-slate-950">
                                    <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {getInitials(
                                            lead.name ||
                                                td('dashboard.unknown'),
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-foreground">
                                        {lead.name || td('dashboard.unknown')}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {lead.phone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5">
                                {lead.instance && (
                                    <Badge
                                        variant="outline"
                                        className="hidden text-xs sm:inline-flex"
                                    >
                                        {lead.instance.instance_name}
                                    </Badge>
                                )}
                                <Badge
                                    variant={
                                        statusVariantMap[lead.status] ||
                                        'outline'
                                    }
                                    className="text-xs"
                                >
                                    {t(
                                        `dashboard.status.${lead.status.toLowerCase()}`,
                                    ) || lead.status}
                                </Badge>
                                {lead.temperature && (
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-xs',
                                            temperatureBadgeClass[
                                                lead.temperature
                                            ],
                                        )}
                                    >
                                        {lead.temperature}
                                    </Badge>
                                )}
                                <span className="ml-1 hidden text-xs text-muted-foreground sm:inline">
                                    {formatDate(lead.created_at, t)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
