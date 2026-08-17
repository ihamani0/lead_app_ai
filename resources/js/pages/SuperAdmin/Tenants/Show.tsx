import { useForm, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import SuperAdminLayout from '@/layouts/super-admin-layout';
import admin from '@/routes/admin';

type ShowProps = SharedPageProps & {
    tenant: {
        id: string;
        name: string;
        slug: string;
        plan: {
            id: number;
            slug: string;
            name: string;
            max_teams: number | null;
            max_members: number | null;
            max_leads: number | null;
            max_agents: number | null;
            max_instances: number | null;
            max_storage_mb: number | null;
        } | null;
        is_active: boolean;
        credit_millicents: number;
        dollar_limit: number;
        is_low_credit: boolean;
        llm_model_id: string | null;
        llm_model?: {
            id: string;
            name: string;
            display_name: string;
        } | null;
        users: Array<{ id: string; name: string; email: string; role: string }>;
    };
    daily_usage?: Array<{
        date: string;
        total_tokens_used: number;
        input_tokens_used: number;
        output_tokens_used: number;
        input_cost_millicents: number;
        output_cost_millicents: number;
        total_cost_millicents: number;
        millicents_recharged: number;
        transaction_count: number;
    }>;
    transactions?: Array<{
        id: string;
        date: string;
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
        input_cost_millicents: number;
        output_cost_millicents: number;
        total_cost_millicents: number;
        type: string;
        reference_type: string | null;
        created_at: string;
    }>;
    available_models: Array<{
        id: string;
        name: string;
        display_name: string;
    }>;
    plans: Array<{
        id: number;
        name: string;
        slug: string;
        max_teams: number | null;
        max_members: number | null;
        max_leads: number | null;
        max_agents: number | null;
        max_instances: number | null;
        max_storage_mb: number | null;
        features: Record<string, boolean>;
        is_default: boolean;
    }>;
    subscription?: {
        id: number;
        provider: string;
        status: string;
        plan: { slug: string; name: string };
    } | null;
};

export default function Show({
    tenant,
    daily_usage,
    transactions,
    available_models,
    plans,
    subscription,
}: ShowProps) {
    const { t } = useTranslation();
    const [changePlanOpen, setChangePlanOpen] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<string>(
        String(tenant.plan?.id ?? ''),
    );

    const creditForm = useForm({
        type: 'purchase',
        dollar_amount: '',
        description: '',
    });

    const modelForm = useForm({
        llm_model_id: tenant.llm_model_id ?? '',
    });

    const handleChangePlan = () => {
        router.post(
            admin.tenant.changePlan(tenant.id).url,
            { plan_id: Number(selectedPlanId) },
            {
                onSuccess: () => setChangePlanOpen(false),
            },
        );
    };

    const selectedPlan = plans.find(
        (p) => String(p.id) === selectedPlanId,
    );

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (millicents: number): string => {
        return `$${(millicents / 100_000).toFixed(2)}`;
    };

    const handleAddCredit = (e: React.SubmitEvent) => {
        e.preventDefault();
        creditForm.post(admin.tenant.addDollars(tenant.id).url, {
            onSuccess: () => creditForm.reset(),
        });
    };

    const handleUpdateModel = (e: React.SubmitEvent) => {
        e.preventDefault();
        modelForm.post(admin.tenant.updateModel(tenant.id).url, {
            onSuccess: () => {},
        });
    };

    return (
        <SuperAdminLayout>
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{tenant.name}</h1>
                    <p className="text-muted-foreground">{tenant.slug}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tenant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'superAdmin.tenants.show.sections.information',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.name',
                                        )}
                                    </p>
                                    <p className="text-lg">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.slug',
                                        )}
                                    </p>
                                    <p className="text-lg">{tenant.slug}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.plan',
                                        )}
                                    </p>
                                    <p className="text-lg capitalize">
                                        {tenant.plan?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.status',
                                        )}
                                    </p>
                                    <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                            tenant.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {tenant.is_active
                                            ? t(
                                                  'superAdmin.tenants.list.status.active',
                                              )
                                            : t(
                                                  'superAdmin.tenants.list.status.inactive',
                                              )}
                                    </span>
                                </div>
                            </div>

                            {/* Credit Balance */}
                            <div
                                className={`rounded-lg p-4 ${
                                    tenant.is_low_credit
                                        ? 'border border-red-200 bg-red-50'
                                        : 'bg-muted'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {tenant.is_low_credit ? (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    )}
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.creditBalance',
                                        )}
                                    </p>
                                </div>
                                <p className="text-3xl font-bold">
                                    $
                                    {(
                                        (tenant.credit_millicents || 0) /
                                        100_000
                                    ).toFixed(2)}
                                </p>
                                {tenant.is_low_credit && (
                                    <p className="text-sm text-red-600">
                                        {t(
                                            'superAdmin.tenants.show.messages.belowThreshold',
                                            {
                                                amount: (
                                                    (tenant.dollar_limit || 0) /
                                                    100_000
                                                ).toFixed(2),
                                            },
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Model Selection */}
                            <form
                                onSubmit={handleUpdateModel}
                                className="space-y-2"
                            >
                                <Label>
                                    {t(
                                        'superAdmin.tenants.show.labels.aiModel',
                                    )}
                                </Label>
                                <Select
                                    value={modelForm.data.llm_model_id}
                                    onValueChange={(value) =>
                                        modelForm.setData('llm_model_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                'superAdmin.tenants.show.placeholders.selectModel',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">
                                            {t(
                                                'superAdmin.tenants.show.options.defaultModel',
                                            )}
                                        </SelectItem>
                                        {available_models.map((model) => (
                                            <SelectItem
                                                key={model.id}
                                                value={model.id}
                                            >
                                                {model.display_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    disabled={modelForm.processing}
                                >
                                    {t(
                                        'superAdmin.tenants.show.buttons.update_model',
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Add Credit */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'superAdmin.tenants.show.sections.add_credit',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleAddCredit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="type">
                                        {t(
                                            'superAdmin.tenants.show.labels.transactionType',
                                        )}
                                    </Label>
                                    <Select
                                        value={creditForm.data.type}
                                        onValueChange={(value) =>
                                            creditForm.setData('type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'superAdmin.tenants.show.placeholders.selectType',
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="purchase">
                                                {t(
                                                    'superAdmin.tenants.show.options.purchase',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="bonus">
                                                {t(
                                                    'superAdmin.tenants.show.options.bonus',
                                                )}
                                            </SelectItem>
                                            <SelectItem value="adjustment">
                                                {t(
                                                    'superAdmin.tenants.show.options.adjustment',
                                                )}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dollar_amount">
                                        {t(
                                            'superAdmin.tenants.show.labels.dollarAmount',
                                        )}
                                    </Label>
                                    <Input
                                        id="dollar_amount"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={creditForm.data.dollar_amount}
                                        onChange={(e) =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'superAdmin.tenants.show.placeholders.dollarAmount',
                                        )}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        {t(
                                            'superAdmin.tenants.show.labels.description',
                                        )}
                                    </Label>
                                    <Input
                                        id="description"
                                        value={creditForm.data.description}
                                        onChange={(e) =>
                                            creditForm.setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder={t(
                                            'superAdmin.tenants.show.placeholders.description',
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={
                                        creditForm.processing ||
                                        !creditForm.data.dollar_amount
                                    }
                                >
                                    {creditForm.processing
                                        ? t(
                                              'superAdmin.tenants.show.buttons.adding',
                                          )
                                        : t(
                                              'superAdmin.tenants.show.buttons.add_credit',
                                          )}
                                </Button>
                            </form>

                            <Separator className="my-4" />

                            <div className="rounded-lg bg-muted p-3 text-sm">
                                <p className="font-medium">
                                    {t(
                                        'superAdmin.tenants.show.labels.quickAdd',
                                    )}
                                </p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                '10',
                                            )
                                        }
                                    >
                                        $10
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                '25',
                                            )
                                        }
                                    >
                                        $25
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                '50',
                                            )
                                        }
                                    >
                                        $50
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            creditForm.setData(
                                                'dollar_amount',
                                                '100',
                                            )
                                        }
                                    >
                                        $100
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t(
                                    'superAdmin.tenants.show.sections.plan',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.labels.currentPlan',
                                        )}
                                    </p>
                                    <p className="text-xl font-bold capitalize">
                                        {tenant.plan?.name ?? '—'}
                                    </p>
                                </div>
                                <Badge variant="secondary">
                                    {subscription?.provider ?? 'manual'}
                                </Badge>
                            </div>

                            {subscription && (
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        'superAdmin.tenants.show.labels.subscriptionStatus',
                                    )}{' '}
                                    <span className="font-medium capitalize">
                                        {subscription.status}
                                    </span>
                                </p>
                            )}

                            <Separator />

                            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_teams ?? '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxTeams',
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_members ?? '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxMembers',
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_leads ?? '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxLeads',
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_agents ?? '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxAgents',
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_instances ?? '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxInstances',
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-muted p-2">
                                    <p className="text-lg font-bold">
                                        {tenant.plan?.max_storage_mb != null
                                            ? tenant.plan.max_storage_mb >= 1024
                                                ? `${(tenant.plan.max_storage_mb / 1024).toFixed(1)} GB`
                                                : `${tenant.plan.max_storage_mb} MB`
                                            : '∞'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'superAdmin.plans.labels.maxStorage',
                                        )}
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => {
                                    setSelectedPlanId(
                                        String(tenant.plan?.id ?? ''),
                                    );
                                    setChangePlanOpen(true);
                                }}
                            >
                                {t(
                                    'superAdmin.tenants.show.buttons.changePlan',
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Change Plan Dialog */}
                    <AlertDialog
                        open={changePlanOpen}
                        onOpenChange={setChangePlanOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {t(
                                        'superAdmin.tenants.show.dialogs.changePlan.title',
                                    )}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t(
                                        'superAdmin.tenants.show.dialogs.changePlan.description',
                                    )}
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="space-y-4">
                                <Select
                                    value={selectedPlanId}
                                    onValueChange={setSelectedPlanId}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={t(
                                                'superAdmin.tenants.show.placeholders.selectPlan',
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {plans.map((plan) => (
                                            <SelectItem
                                                key={plan.id}
                                                value={String(plan.id)}
                                            >
                                                {plan.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {selectedPlan && selectedPlan.id !== Number(tenant.plan?.id) && (
                                    <div className="rounded-lg border p-3 text-sm">
                                        <p className="mb-2 font-medium">
                                            {selectedPlan.name}{' '}
                                            {t(
                                                'superAdmin.tenants.show.dialogs.changePlan.limits',
                                            )}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_teams ?? '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxTeams')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_members ?? '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxMembers')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_leads ?? '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxLeads')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_agents ?? '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxAgents')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_instances ?? '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxInstances')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">
                                                    {selectedPlan.max_storage_mb != null
                                                        ? selectedPlan.max_storage_mb >= 1024
                                                            ? `${(selectedPlan.max_storage_mb / 1024).toFixed(1)} GB`
                                                            : `${selectedPlan.max_storage_mb} MB`
                                                        : '∞'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('superAdmin.plans.labels.maxStorage')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    {t('superAdmin.tenants.show.buttons.cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleChangePlan}>
                                    {t(
                                        'superAdmin.tenants.show.buttons.apply',
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Users */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {t('superAdmin.tenants.show.users.title', {
                                    count: tenant.users.length,
                                })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {tenant.users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : user.role === 'manager'
                                                      ? 'bg-purple-100 text-purple-800'
                                                      : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                                {tenant.users.length === 0 && (
                                    <p className="text-center text-muted-foreground">
                                        {t(
                                            'superAdmin.tenants.show.users.empty',
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Usage Chart */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'superAdmin.tenants.show.charts.dailyTokenUsage',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {daily_usage && daily_usage.length > 0 ? (
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                            toolbar: { show: false },
                                        },
                                        xaxis: {
                                            categories: daily_usage.map((d) =>
                                                new Date(
                                                    d.date,
                                                ).toLocaleDateString(),
                                            ),
                                        },
                                        yaxis: {
                                            title: {
                                                text: t(
                                                    'superAdmin.tenants.show.charts.yAxisLabel',
                                                ),
                                            },
                                        },
                                        colors: ['#3b82f6', '#10b981'],
                                        legend: { position: 'top' },
                                    }}
                                    series={[
                                        {
                                            name: t(
                                                'superAdmin.tenants.show.charts.inputTokens',
                                            ),
                                            data: daily_usage.map(
                                                (d) => d.input_tokens_used,
                                            ),
                                        },
                                        {
                                            name: t(
                                                'superAdmin.tenants.show.charts.outputTokens',
                                            ),
                                            data: daily_usage.map(
                                                (d) => d.output_tokens_used,
                                            ),
                                        },
                                    ]}
                                    type="bar"
                                    height={300}
                                />
                            ) : (
                                <p className="text-muted-foreground">
                                    {t('superAdmin.tenants.show.charts.empty')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Daily Usage Table */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'superAdmin.tenants.show.tables.daily_usage.title',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {daily_usage && daily_usage.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.date',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.input',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.output',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.total',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.cost',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.daily_usage.headers.recharged',
                                                )}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {daily_usage.map((day) => (
                                            <TableRow key={day.date}>
                                                <TableCell>
                                                    {new Date(
                                                        day.date,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(
                                                        day.input_tokens_used,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(
                                                        day.output_tokens_used,
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatNumber(
                                                        day.total_tokens_used,
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-red-600">
                                                    {day.total_cost_millicents /
                                                        100000}
                                                </TableCell>
                                                <TableCell className="text-green-600">
                                                    {day.millicents_recharged >
                                                    0
                                                        ? formatCurrency(
                                                              day.millicents_recharged,
                                                          )
                                                        : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">
                                    {t(
                                        'superAdmin.tenants.show.tables.daily_usage.empty',
                                    )}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Per-Transaction History */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'superAdmin.tenants.show.tables.transactions.title',
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions && transactions.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.date',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.type',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.input',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.output',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.total',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.cost',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'superAdmin.tenants.show.tables.transactions.headers.reference',
                                                )}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx) => (
                                            <TableRow key={tx.id}>
                                                <TableCell>
                                                    {new Date(
                                                        tx.created_at,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            tx.type ===
                                                            'deduction'
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }
                                                    >
                                                        {tx.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(
                                                        tx.input_tokens,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatNumber(
                                                        tx.output_tokens,
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatNumber(
                                                        tx.total_tokens,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {tx.total_cost_millicents /
                                                        100000}
                                                </TableCell>
                                                <TableCell>
                                                    {tx.reference_type ??
                                                        t(
                                                            'superAdmin.tenants.show.tables.transactions.na',
                                                        )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">
                                    {t(
                                        'superAdmin.tenants.show.tables.transactions.empty',
                                    )}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
