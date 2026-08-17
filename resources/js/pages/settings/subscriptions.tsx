import { Head, router, usePage } from '@inertiajs/react';
import { initializePaddle, type CheckoutOpenOptions, type Paddle } from '@paddle/paddle-js';
import axios from 'axios';
import {
    Ban,
    BarChart3,
    BookOpen,
    Copy,
    CreditCard,
    Database,
    Download,
    Filter,
    FlaskConical,
    HardDrive,
    HelpCircle,
    Image,
    MessageSquare,
    Shield,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import WorkspaceLayout from '@/layouts/workspace-layout';

type PlanData = {
    id: number;
    name: string;
    slug: string;
    price: number;
    price_millicents: number;
    price_yearly: number | null;
    has_yearly: boolean;
    features: string[];
    is_current: boolean;
    max_teams: number | null;
    max_members: number | null;
    max_leads: number | null;
    max_agents: number | null;
    max_instances: number | null;
    max_storage_mb: number | null;
    dollar_limit: number | null;
};

type NextPaymentData = {
    amount: string;
    date: string;
};

type SubscriptionData = {
    id: string;
    plan_id: number;
    provider: string;
    provider_status: string | null;
    status: string;
    interval?: string | null;
    current_period_end?: string | null;
};

type SubscriptionsPageProps = {
    paddleEnabled: boolean;
    plans: PlanData[];
    nextPayment: NextPaymentData | null;
    subscription: SubscriptionData | null;
    graceEndDate: string | null;
};

export default function Subscriptions() {
    const { t } = useTranslation();
    const page = usePage<SubscriptionsPageProps>();
    const {
        paddleEnabled,
        plans,
        nextPayment,
        subscription,
        graceEndDate,
    } = page.props;
    const { auth } = usePage<{
        auth: {
            user: {
                tenant: {
                    name: string;
                    plan: { slug: string; name: string } | null;
                    credit: number;
                    is_low_credit: boolean;
                };
            };
        };
    }>().props;

    const { tenant } = auth.user;
    const sharedProps = usePage<{
        paddleSandbox: boolean;
        paddleClientToken: string | null;
    }>().props;
    const [loading, setLoading] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(
        'monthly',
    );
    const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const featureConfig: Record<string, { icon: React.FC<{ className?: string }>; label: string }> = {
        media_library: { icon: Image, label: t('settings.billing.features.media_library') },
        qualification_lead: { icon: Filter, label: t('settings.billing.features.qualification_lead') },
        faq: { icon: HelpCircle, label: t('settings.billing.features.faq') },
        talk_from_lead: { icon: MessageSquare, label: t('settings.billing.features.talk_from_lead') },
        reports: { icon: BarChart3, label: t('settings.billing.features.reports') },
        knowledge_base: { icon: BookOpen, label: t('settings.billing.features.knowledge_base') },
        lead_export: { icon: Download, label: t('settings.billing.features.lead_export') },
        agent_clone: { icon: Copy, label: t('settings.billing.features.agent_clone') },
        advanced_analytics: { icon: TrendingUp, label: t('settings.billing.features.advanced_analytics') },
        custom_roles: { icon: Shield, label: t('settings.billing.features.custom_roles') },
        test_ia: { icon: FlaskConical, label: t('settings.billing.features.test_ia') },
    };

    const formatStorage = (mb: number): string => {
        return mb >= 1024 ? `${(mb / 1024).toFixed(0)} GB` : `${mb} MB`;
    };

    const formatPlanPrice = (
        plan: PlanData,
        interval: 'monthly' | 'yearly',
    ): string => {
        if (interval === 'yearly' && plan.price_yearly) {
            return `$${plan.price_yearly.toFixed(2)}/year`;
        }
        return plan.price > 0
            ? `$${plan.price.toFixed(2)}/month`
            : t('settings.billing.free');
    };

    const limitConfig: { key: keyof PlanData; icon: React.FC<{ className?: string }>; format: (value: number) => string; labelKey: string }[] = [
        { key: 'max_teams', icon: Users, format: (v) => String(v), labelKey: 'settings.billing.limits.teams' },
        { key: 'max_members', icon: Users, format: (v) => String(v), labelKey: 'settings.billing.limits.members' },
        { key: 'max_leads', icon: Filter, format: (v) => String(v), labelKey: 'settings.billing.limits.leads' },
        { key: 'max_agents', icon: FlaskConical, format: (v) => String(v), labelKey: 'settings.billing.limits.agents' },
        { key: 'max_instances', icon: Database, format: (v) => String(v), labelKey: 'settings.billing.limits.instances' },
        { key: 'max_storage_mb', icon: HardDrive, format: (v) => formatStorage(v), labelKey: 'settings.billing.limits.storage' },
        { key: 'dollar_limit', icon: CreditCard, format: (v) => `$${v}`, labelKey: 'settings.billing.limits.dollar_limit' },
    ];

    const currentPlan = plans.find((p: PlanData) => p.is_current);

    const handleCheckout = useCallback(
        async (plan: PlanData, interval: 'monthly' | 'yearly' = 'monthly') => {
            setLoading(plan.slug);
            try {
                const response = await axios.post<{
                    items?: { priceId: string; quantity: number }[];
                    customer_id?: string | null;
                    custom_data?: Record<string, unknown>;
                    return_url?: string;
                    error?: string;
                }>(`/billing/checkout/${plan.id}`, { interval });
                const data = response.data;
                setLoading(null);

                if (data.items && data.items.length > 0) {
                    const options: CheckoutOpenOptions = {
                        items: data.items,
                        settings: {
                            displayMode: 'overlay',
                            theme: 'light',
                            frameTarget: 'paddle-checkout',
                            frameInitialHeight: 450,
                            frameStyle:
                                'width:100%; min-width:312px; background-color: transparent; border: none; margin: 0; padding: 0;',
                            ...(data.return_url ? { successUrl: data.return_url } : {}),
                        },
                        customData: data.custom_data ?? {},
                        ...(data.customer_id ? { customer: { id: data.customer_id } } : {}),
                    };
                    if (paddle) {
                        console.log('[Subscriptions] Opening Paddle checkout');
                        paddle.Checkout.open(options);
                    } else {
                        console.warn('[Subscriptions] Paddle not initialized, falling back to redirect');
                        window.location.href = data.return_url ?? '/account/subscriptions';
                    }
                }
            } catch (e: unknown) {
                console.error('[Subscriptions] Checkout error:', e);
                if (axios.isAxiosError(e) && e.response?.data?.error) {
                    alert(e.response.data.error);
                }
                setLoading(null);
            }
        },
        [paddle],
    );

    const handleCancelConfirm = useCallback(() => {
        setCancelling(true);
        router.post('/billing/subscription/cancel', {}, {
            preserveState: true,
            onFinish: () => {
                setCancelling(false);
                setCancelOpen(false);
            },
        });
    }, []);

    useEffect(() => {
        if (!paddleEnabled) return;
        if (!sharedProps.paddleClientToken) return;
        console.log('[Subscriptions] Initializing Paddle...', { environment: sharedProps.paddleSandbox ? 'sandbox' : 'production' });
        initializePaddle({
            environment: sharedProps.paddleSandbox ? 'sandbox' : 'production',
            token: sharedProps.paddleClientToken,
        }).then((p) => {
            console.log('[Subscriptions] Paddle initialized:', !!p);
            setPaddle(p);
        });
    }, [paddleEnabled, sharedProps.paddleSandbox, sharedProps.paddleClientToken]);

    if (!paddleEnabled) {
        return (
            <WorkspaceLayout title={t('settings.subscriptions.title')}>
                <Head title={t('settings.subscriptions.title')} />

                <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold md:text-3xl">
                            {t('settings.subscriptions.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('settings.subscriptions.description')}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-5 text-primary" />
                                <CardTitle>
                                    {t('settings.subscriptions.title')}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {t('settings.subscriptions.description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center">
                            <div className="space-y-2">
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    {t('settings.subscriptions.notAvailable')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </WorkspaceLayout>
        );
    }

    return (
        <WorkspaceLayout title={t('settings.subscriptions.title')}>
            <Head title={t('settings.subscriptions.title')} />

            <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        {t('settings.subscriptions.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('settings.subscriptions.description')}
                    </p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">
                            {t('settings.subscriptions.currentPlan')}
                        </h2>

                        <div className="rounded-lg border p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-semibold">
                                            {currentPlan?.name ??
                                                tenant.plan?.name ??
                                                'Free'}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-semibold uppercase"
                                        >
                                            {subscription?.status === 'canceled'
                                                ? t('settings.subscriptions.canceled')
                                                : t('settings.subscriptions.active')}
                                        </Badge>
                                        {subscription?.interval === 'year' && (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-semibold uppercase"
                                            >
                                                {t('settings.subscriptions.yearly')}
                                            </Badge>
                                        )}
                                    </div>
                                    {currentPlan && (
                                        <p className="text-sm text-muted-foreground">
                                            {formatPlanPrice(
                                                currentPlan,
                                                subscription?.interval === 'year'
                                                    ? 'yearly'
                                                    : 'monthly',
                                            )}
                                        </p>
                                    )}
                                    {nextPayment && (
                                        <p className="text-sm text-muted-foreground">
                                            {t('settings.subscriptions.nextPayment')}{' '}
                                            {nextPayment.amount} —{' '}
                                            {new Date(
                                                nextPayment.date,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        {tenant.name}
                                    </p>
                                </div>
                            </div>

                            {subscription?.status === 'canceled' && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {graceEndDate
                                        ? t('settings.subscriptions.gracePeriodWithDate', {
                                              date: new Date(graceEndDate).toLocaleDateString(),
                                          })
                                        : t('settings.subscriptions.gracePeriod')}
                                </p>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {t('settings.subscriptions.availablePlans')}
                            </h2>
                            <div className="inline-flex rounded-md border p-0.5">
                                <button
                                    type="button"
                                    onClick={() => setBillingInterval('monthly')}
                                    className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                        billingInterval === 'monthly'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t('settings.subscriptions.monthly')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBillingInterval('yearly')}
                                    className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                        billingInterval === 'yearly'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t('settings.subscriptions.yearly')}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {plans.map((plan: PlanData) => (
                                <Card
                                    key={plan.id}
                                    className={
                                        plan.is_current
                                            ? 'border-primary'
                                            : ''
                                    }
                                >
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {plan.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {formatPlanPrice(plan, billingInterval)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <ul className="space-y-2">
                                            {(plan.features as string[]).map(
                                                (feature) => {
                                                    const cfg = featureConfig[feature];
                                                    if (!cfg) return null;
                                                    const Icon = cfg.icon;
                                                    return (
                                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                                            <Icon className="size-4 shrink-0 text-primary" />
                                                            <span>{cfg.label}</span>
                                                        </li>
                                                    );
                                                },
                                            )}
                                        </ul>

                                        <div className="border-t pt-4">
                                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                {t('settings.subscriptions.limitsTitle')}
                                            </p>
                                            <ul className="space-y-1.5">
                                                {limitConfig.map(({ key, icon: LimitIcon, format, labelKey }) => {
                                                    const value = plan[key] as number | null;
                                                    if (value === null || value === undefined) return null;
                                                    return (
                                                        <li key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <LimitIcon className="size-3.5 shrink-0" />
                                                            <span>
                                                                {value === 0
                                                                    ? t('settings.subscriptions.unlimited')
                                                                    : format(value)}
                                                                {' '}{t(labelKey)}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>

                                        {plan.is_current ? (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                disabled
                                            >
                                                {t(
                                                    'settings.subscriptions.currentPlanLabel',
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full"
                                                onClick={() =>
                                                    handleCheckout(plan, billingInterval)
                                                }
                                                disabled={
                                                    loading === plan.slug ||
                                                    (billingInterval === 'yearly' && !plan.has_yearly)
                                                }
                                                title={
                                                    billingInterval === 'yearly' && !plan.has_yearly
                                                        ? t('settings.subscriptions.noYearlyPrice')
                                                        : undefined
                                                }
                                            >
                                                {loading === plan.slug
                                                    ? t(
                                                          'settings.subscriptions.loading',
                                                      )
                                                    : billingInterval === 'yearly' && !plan.has_yearly
                                                      ? t(
                                                            'settings.subscriptions.noYearlyPrice',
                                                        )
                                                      : plan.price_millicents >
                                                        0
                                                        ? t(
                                                              'settings.subscriptions.upgrade',
                                                          )
                                                        : t(
                                                              'settings.subscriptions.downgrade',
                                                          )}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {subscription && subscription.status !== 'canceled' && (
                        <section>
                            <h2 className="mb-4 text-lg font-semibold">
                                {t('settings.subscriptions.dangerZone')}
                            </h2>

                            <Card className="border-destructive/50">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-3">
                                        <Ban className="size-5 text-destructive" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {t(
                                                    'settings.subscriptions.cancelSubscription',
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'settings.subscriptions.cancelDescription',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setCancelOpen(true)}
                                    >
                                        {t(
                                            'settings.subscriptions.cancelButton',
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>
            </div>

            <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('settings.subscriptions.cancelDialogTitle')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('settings.subscriptions.cancelDialogDescription')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={cancelling}>
                            {t('settings.subscriptions.cancelDialogKeep')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelConfirm}
                            disabled={cancelling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {cancelling
                                ? t('settings.subscriptions.cancelling')
                                : t('settings.subscriptions.cancelDialogConfirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </WorkspaceLayout>
    );
}
