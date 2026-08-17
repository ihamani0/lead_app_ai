import { Head, router, usePage } from '@inertiajs/react';
import { initializePaddle, type CheckoutOpenOptions, type Paddle } from '@paddle/paddle-js';
import axios from 'axios';
import {
    Ban,
    CreditCard,
    Download,
    FileText,
    Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from '@/hooks/use-translation';
import WorkspaceLayout from '@/layouts/workspace-layout';

type TransactionData = {
    id: number;
    status: string;
    total: string;
    tax: string;
    currency: string;
    billed_at: string | null;
    invoice_url: string;
};

type CreditPackageData = {
    id: number;
    name: string;
    description: string | null;
    price_millicents: number;
    credit_millicents: number;
    has_price: boolean;
};

type BillingPageProps = {
    paddleEnabled: boolean;
    transactions: TransactionData[];
    hasPaymentMethod: boolean;
    creditPackages: CreditPackageData[];
};

const formatPrice = (millicents: number): string => {
    return `$${(millicents / 100_000).toFixed(2)}`;
};

export default function Billing() {
    const { t } = useTranslation();
    const { paddleEnabled, transactions, hasPaymentMethod, creditPackages } =
        usePage<BillingPageProps>().props;
    const { auth } = usePage<{
        auth: {
            user: {
                tenant: {
                    name: string;
                    credit: number;
                    is_low_credit: boolean;
                };
            };
        };
    }>().props;
    const sharedProps = usePage<{
        paddleSandbox: boolean;
        paddleClientToken: string | null;
    }>().props;

    const { tenant } = auth.user;
    const isLowCredit = tenant.is_low_credit;
    const [loading, setLoading] = useState<string | null>(null);
    const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

    useEffect(() => {
        if (!paddleEnabled || paddle) return;

        initializePaddle({
            environment: sharedProps.paddleSandbox ? 'sandbox' : 'production',
            token: sharedProps.paddleClientToken!,
            eventCallback: (event) => {
                if (event.name === 'checkout.completed') {
                    window.location.reload();
                }
            },
        }).then((paddleInstance) => {
            if (paddleInstance) {
                setPaddle(paddleInstance);
            }
        });
    }, [paddleEnabled, sharedProps.paddleSandbox, sharedProps.paddleClientToken, paddle]);

    const handlePortal = useCallback(() => {
        router.post('/billing/portal', {}, {
            preserveState: true,
            onError: () => {},
        });
    }, []);

    const handleCreditCheckout = useCallback(
        async (pkg: CreditPackageData) => {
            setLoading(String(pkg.id));
            try {
                const response = await axios.post<{
                    items?: { priceId: string; quantity: number }[];
                    customer_id?: string | null;
                    custom_data?: Record<string, unknown>;
                    return_url?: string;
                    error?: string;
                }>(`/billing/credit/checkout/${pkg.id}`);
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
                        },
                        customData: data.custom_data ?? {},
                        ...(data.customer_id ? { customer: { id: data.customer_id } } : {}),
                    };
                    if (paddle) {
                        paddle.Checkout.open(options);
                    } else {
                        console.warn('[Billing] Paddle not initialized, falling back to redirect');
                        window.location.href = data.return_url ?? '/account/billing';
                    }
                }
            } catch (e: unknown) {
                console.error('[Billing] Credit checkout error:', e);
                setLoading(null);
            }
        },
        [paddle],
    );

    if (!paddleEnabled) {
        return (
            <WorkspaceLayout title={t('settings.billing.title')}>
                <Head title={t('settings.billing.title')} />

                <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold md:text-3xl">
                            {t('settings.billing.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('settings.billing.description')}
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <CreditCard className="size-5 text-primary" />
                                <CardTitle>
                                    {t('settings.billing.currentPlan')}
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {t('settings.billing.planDescription')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                            {tenant.name}
                                        </span>
                                    </div>
                                </div>

                                {isLowCredit && (
                                    <Badge
                                        variant="destructive"
                                        className="text-[10px]"
                                    >
                                        {t('settings.billing.lowCredit')}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center">
                                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                                    <Sparkles className="size-8 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        {t('settings.billing.comingSoon')}
                                    </h3>
                                    <p className="max-w-sm text-sm text-muted-foreground">
                                        {t(
                                            'settings.billing.comingSoonDescription',
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </WorkspaceLayout>
        );
    }

    return (
        <WorkspaceLayout title={t('settings.billing.title')}>
            <Head title={t('settings.billing.title')} />

            <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        {t('settings.billing.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('settings.billing.description')}
                    </p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="mb-4 text-lg font-semibold">
                            {t('settings.billing.paymentMethod')}
                        </h2>

                        <Card>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t(
                                                'settings.billing.managePaymentMethod',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'settings.billing.paymentMethodDescription',
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handlePortal}
                                    disabled={!hasPaymentMethod}
                                >
                                    {t(
                                        'settings.billing.updatePaymentMethod',
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    {transactions.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-lg font-semibold">
                                {t('settings.billing.billingHistory')}
                            </h2>

                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t(
                                                    'settings.billing.date',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'settings.billing.status',
                                                )}
                                            </TableHead>
                                            <TableHead>
                                                {t(
                                                    'settings.billing.total',
                                                )}
                                            </TableHead>
                                            <TableHead className="text-right">
                                                {t(
                                                    'settings.billing.invoice',
                                                )}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((tx: TransactionData) => (
                                            <TableRow key={tx.id}>
                                                <TableCell className="text-sm">
                                                    {tx.billed_at
                                                        ? new Date(
                                                              tx.billed_at,
                                                          ).toLocaleDateString()
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            tx.status ===
                                                            'completed'
                                                                ? 'secondary'
                                                                : 'outline'
                                                        }
                                                        className="text-[10px]"
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {tx.total}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <a
                                                        href={tx.invoice_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Download className="size-4" />
                                                        </Button>
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </section>
                    )}

                    <section>
                        <h2 className="mb-4 text-lg font-semibold">
                            {t('settings.billing.tokenCredit')}
                        </h2>

                        <Card>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-3">
                                    <FileText className="size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t(
                                                'settings.billing.creditBalance',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'settings.billing.creditDescription',
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">
                                        ${tenant.credit.toFixed(2)}
                                    </p>
                                    {isLowCredit && (
                                        <Badge
                                            variant="destructive"
                                            className="mt-1 text-[10px]"
                                        >
                                            {t('settings.billing.lowCredit')}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {creditPackages.length > 0 && (
                        <section>
                            <h2 className="mb-4 text-lg font-semibold">
                                {t('settings.billing.buyCredits')}
                            </h2>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {creditPackages.map((pkg) => (
                                    <Card
                                        key={pkg.id}
                                        className="flex flex-col"
                                    >
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                {pkg.name}
                                            </CardTitle>
                                            {pkg.description && (
                                                <CardDescription>
                                                    {pkg.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex flex-1 flex-col justify-end gap-4">
                                            <div className="space-y-1">
                                                <p className="text-2xl font-bold">
                                                    {formatPrice(
                                                        pkg.price_millicents,
                                                    )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t(
                                                        'settings.billing.receiveCredit',
                                                    )}{' '}
                                                    {formatPrice(
                                                        pkg.credit_millicents,
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                className="w-full"
                                                onClick={() =>
                                                    handleCreditCheckout(pkg)
                                                }
                                                disabled={
                                                    loading === String(pkg.id) ||
                                                    !paddle ||
                                                    !pkg.has_price
                                                }
                                            >
                                                {loading === String(pkg.id)
                                                    ? t(
                                                          'settings.subscriptions.loading',
                                                      )
                                                    : t(
                                                          'settings.billing.buyButton',
                                                      )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="mb-4 text-lg font-semibold">
                            {t('settings.billing.aboutSubscription')}
                        </h2>

                        <Card>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-3">
                                    <Ban className="size-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t(
                                                'settings.billing.manageSubscription',
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                'settings.billing.manageSubscriptionDescription',
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        router.visit('/account/subscriptions')
                                    }
                                >
                                    {t(
                                        'settings.billing.goToSubscriptions',
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
