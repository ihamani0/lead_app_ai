import { Link } from '@inertiajs/react';
import {
    PlusCircle,
    RefreshCw,
    Users,
    Activity,
    AlertTriangle,
    DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

type DashboardProps = SharedPageProps & {
    stats: {
        total_tenants: number;
        active_tenants: number;
        tenants_with_low_credit: number;
        avg_daily_cost: number;
        total_dollars_recharged: number;
    };
    plan_distribution: Record<string, number>;
    top_consumers: Array<{
        tenant: { name: string; id: string };
        total: number;
    }>;
    recent_tenants: Array<{
        id: string;
        name: string;
        plan: string;
        is_active: boolean;
    }>;
};

export default function Dashboard({
    stats,
    plan_distribution,
    top_consumers,
    recent_tenants,
}: DashboardProps) {
    const { t } = useTranslation();
    const [openRouterCredits, setOpenRouterCredits] = useState<{
        total_credits: number;
        total_usage: number;
    } | null>(null);
    const [loadingCredits, setLoadingCredits] = useState(false);

    const fetchOpenRouterCredits = async () => {
        setLoadingCredits(true);
        try {
            const response = await fetch('/super-admin/openrouter/credits');
            const data = await response.json();
            if (data.total_credits !== undefined) {
                setOpenRouterCredits(data);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setLoadingCredits(false);
        }
    };

    return (
        <AppLayout>
            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Super Admin Dashboard
                </h1>

                <div className="w-full mb-3">
                    {/* OpenRouter Credits Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl">
                                OpenRouter Credit
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchOpenRouterCredits}
                                disabled={loadingCredits}
                            >
                                <RefreshCw
                                    className={`mr-2 h-4 w-4 ${loadingCredits ? 'animate-spin' : ''}`}
                                />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {openRouterCredits ? (
                                <div className="space-y-1">
                                    <p className="text-4xl font-bold text-green-600">
                                        $
                                        {openRouterCredits.total_credits.toFixed(
                                            2,
                                        )}
                                    </p>
                                    <p className="text-base text-muted-foreground">
                                        Used: $
                                        {openRouterCredits.total_usage.toFixed(
                                            2,
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Click refresh to load
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title={t('superAdmin.dashboard.totalTenants')}
                        value={stats.total_tenants}
                        icon={Users}
                        color="blue"
                    />
                    <SummaryCard
                        title={t('superAdmin.dashboard.activeTenants')}
                        value={stats.active_tenants}
                        icon={Activity}
                        color="emerald"
                    />
                    <SummaryCard
                        title={t('superAdmin.dashboard.lowCreditTenants')}
                        value={stats.tenants_with_low_credit}
                        icon={AlertTriangle}
                        color="destructive"
                    />
                    <SummaryCard
                        title={t('superAdmin.dashboard.avgDailyCost')}
                        value={`$${(stats.avg_daily_cost / 100_000).toFixed(2)}`}
                        icon={DollarSign}
                        color="purple"
                    />
                    <SummaryCard
                        title={t('superAdmin.dashboard.dollarsRecharged')}
                        value={`$${((stats.total_dollars_recharged ?? 0) / 100_000).toFixed(2)}`}
                        icon={PlusCircle}
                        color="blue"
                    />
                </div>

                {/* Plan Distribution & Top Consumers */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {Object.entries(plan_distribution).map(
                                ([plan, count]) => (
                                    <div
                                        key={plan}
                                        className="flex justify-between border-b py-2"
                                    >
                                        <span className="capitalize">
                                            {plan}
                                        </span>
                                        <span className="font-medium">
                                            {count}
                                        </span>
                                    </div>
                                ),
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Consumers (Last 30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {top_consumers.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={
                                        admin.tenant.show(item.tenant?.id).url
                                    }
                                    className="flex justify-between border-b py-2 hover:text-blue-600"
                                >
                                    <span>
                                        {item.tenant?.name ?? 'Unknown'}
                                    </span>
                                    <span className="font-medium">
                                        ${((item.total ?? 0) / 100000)}
                                    </span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tenants */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Tenants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recent_tenants.map((tenant) => (
                                    <Link
                                        key={tenant.id}
                                        href={admin.tenant.show(tenant?.id).url}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted"
                                    >
                                        <span className="font-medium">
                                            {tenant.name}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm capitalize">
                                                {tenant.plan}
                                            </span>
                                            <span
                                                className={
                                                    tenant.is_active
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                }
                                            >
                                                {tenant.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
