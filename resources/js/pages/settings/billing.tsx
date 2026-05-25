import { Head, usePage } from '@inertiajs/react';
import { Clock, CreditCard, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import WorkspaceLayout from '@/layouts/workspace-layout';

type SharedPageProps = {
    auth: {
        user: {
            tenant: {
                name: string;
                plan: string;
                credit: number;
                is_low_credit: boolean;
            };
        };
    };
};

export default function Billing() {
    const { t } = useTranslation();
    const { auth } = usePage<SharedPageProps>().props;
    const { tenant } = auth.user;
    const isLowCredit = tenant.is_low_credit;

    const getPlanName = (plan: string): string => {
        const planNames: Record<string, string> = {
            starter: 'Starter',
            pro: 'Professional',
            enterprise: 'Enterprise',
        };
        return planNames[plan] ?? plan ?? 'Free';
    };

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

                <div className="space-y-6">
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
                                            {getPlanName(tenant.plan)}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] font-semibold uppercase"
                                        >
                                            {t('settings.billing.active')}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {tenant.name}
                                    </p>
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
                                        {t('settings.billing.comingSoonDescription')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="size-4" />
                                    <span>
                                        {t('settings.billing.estimatedArrival')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
