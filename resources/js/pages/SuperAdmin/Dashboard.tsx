import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { BarChart3, Users, Activity, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import type { Tenant } from '@/types';
import type { PageProps } from '@/types';

type DashboardProps = PageProps & {
    stats: {
        total_tenants: number;
        active_tenants: number;
        inactive_tenants: number;
        total_users: number;
        total_tokens: number;
        tenants_with_low_tokens: number;
    };
    plan_distribution: Record<string, number>;
    recent_tenants: (Tenant & { users_count: number })[];
    token_rate: number;
};

export default function Dashboard({
    stats,
    plan_distribution,
    recent_tenants,
    token_rate,
}: DashboardProps) {
    const { t } = useTranslation();

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getPlanBadgeVariant = (plan: string) => {
        switch (plan) {
            case 'enterprise':
                return 'default';
            case 'pro':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <div className="container mx-auto space-y-6 py-6">
                <div>
                    <h1 className="text-2xl font-bold">{t('super_admin.dashboard.title', 'Super Admin Dashboard')}</h1>
                    <p className="text-muted-foreground">
                        {t('super_admin.dashboard.subtitle', 'System overview and tenant management')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.total_tenants', 'Total Tenants')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(stats.total_tenants)}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_tenants} {t('super_admin.dashboard.stats.active', 'active')},{' '}
                                {stats.inactive_tenants} {t('super_admin.dashboard.stats.inactive', 'inactive')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.total_users', 'Total Users')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(stats.total_users)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.total_tokens', 'Total Tokens')}
                            </CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(stats.total_tokens)}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('super_admin.dashboard.stats.token_rate', 'Rate')}: $1 = {formatNumber(token_rate)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.low_tokens', 'Low Token Alerts')}
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {formatNumber(stats.tenants_with_low_tokens)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('super_admin.dashboard.stats.tenants_below', 'tenants below 10K tokens')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.plan_distribution', 'Plan Distribution')}
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Object.entries(plan_distribution).map(([plan, count]) => (
                                    <div key={plan} className="flex items-center justify-between">
                                        <Badge variant={getPlanBadgeVariant(plan)} className="capitalize">
                                            {plan}
                                        </Badge>
                                        <span className="text-sm font-medium">{formatNumber(count)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('super_admin.dashboard.stats.quick_actions', 'Quick Actions')}
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button asChild className="w-full" variant="outline" size="sm">
                                <Link href="/super-admin/tenants">
                                    {t('super_admin.dashboard.actions.manage_tenants', 'Manage Tenants')}
                                </Link>
                            </Button>
                            <Button asChild className="w-full" variant="outline" size="sm">
                                <Link href="/super-admin/plans">
                                    {t('super_admin.dashboard.actions.manage_plans', 'Manage Plans')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Tenants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('super_admin.dashboard.recent_tenants', 'Recent Tenants')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('super_admin.dashboard.table.name', 'Name')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.slug', 'Slug')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.plan', 'Plan')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.status', 'Status')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.users', 'Users')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.tokens', 'Token Balance')}</TableHead>
                                    <TableHead>{t('super_admin.dashboard.table.actions', 'Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recent_tenants.map((tenant) => (
                                    <TableRow key={tenant.id}>
                                        <TableCell className="font-medium">{tenant.name}</TableCell>
                                        <TableCell>{tenant.slug}</TableCell>
                                        <TableCell>
                                            <Badge variant={getPlanBadgeVariant(tenant.plan)} className="capitalize">
                                                {tenant.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    tenant.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {tenant.is_active
                                                    ? t('super_admin.dashboard.status.active', 'Active')
                                                    : t('super_admin.dashboard.status.inactive', 'Inactive')}
                                            </span>
                                        </TableCell>
                                        <TableCell>{tenant.users_count || 0}</TableCell>
                                        <TableCell>
                                            <span className="font-mono">{formatNumber(tenant.token_balance || 0)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/super-admin/tenants/${tenant.slug}`}>
                                                    {t('super_admin.dashboard.actions.manage', 'Manage')}
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {recent_tenants.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                                            {t('super_admin.dashboard.no_tenants', 'No tenants found.')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
