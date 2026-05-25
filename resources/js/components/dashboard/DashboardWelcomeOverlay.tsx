import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bot, MessageCircle, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { Auth } from '@/types/auth';

const STORAGE_KEY = 'wizard_welcome_dismissed';
const EXPIRY_DAYS = 30;

function isExpired(dismissedAt: string | null): boolean {
    if (!dismissedAt) return false;

    const dismissed = new Date(dismissedAt).getTime();
    const now = Date.now();
    const diffDays = (now - dismissed) / (1000 * 60 * 60 * 24);

    return diffDays >= EXPIRY_DAYS;
}

export function DashboardWelcomeOverlay() {
    const { t } = useTranslation();
    const activeWorkspace = useActiveWorkspace()!;
    const { auth } = usePage<{ auth: Auth }>().props;
    const [visible, setVisible] = useState(false);
    const [dismissing, setDismissing] = useState(false);

    useEffect(() => {
        const serverDismissedAt = auth.user?.welcome_dismissed_at ?? null;
        const sessionDismissed = localStorage.getItem(STORAGE_KEY) === 'true';

        if (serverDismissedAt && !isExpired(serverDismissedAt)) {
            return;
        }

        if (sessionDismissed && !serverDismissedAt) {
            return;
        }

        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, [auth.user?.welcome_dismissed_at]);

    const dismiss = () => {
        setDismissing(true);
        localStorage.setItem(STORAGE_KEY, 'true');

        axios
            .post(
                workspaces.wizard.dismissWelcome({ slug: activeWorkspace.slug }).url,
            )
            .then(() => {
                setVisible(false);
                setDismissing(false);
            })
            .catch(() => {
                setVisible(false);
                setDismissing(false);
            });
    };

    const handleDismiss = async () => {
        await dismiss();
    };

    const handleStartSetup = async () => {
        await dismiss();
        router.get(workspaces.wizard.index({ slug: activeWorkspace.slug }).url);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
                <Card className="overflow-hidden border-0 shadow-2xl">
                    <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-8 pb-16 pt-10 text-center text-white">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                            <Bot className="h-10 w-10" />
                        </div>

                        <h1 className="mb-3 text-3xl font-bold tracking-tight">
                            {t('wizard.welcome_overlay.title')}
                        </h1>
                        <p className="mx-auto max-w-md text-lg text-white/80">
                            {t('wizard.welcome_overlay.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-6 bg-card px-8 pb-8 pt-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-4 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <MessageCircle className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                    {t('wizard.welcome_overlay.step1')}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-4 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                    {t('wizard.welcome_overlay.step2')}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-4 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-sm font-medium">
                                    {t('wizard.welcome_overlay.step3')}
                                </span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            {t('wizard.welcome_overlay.description')}
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button
                                size="lg"
                                onClick={handleStartSetup}
                                disabled={dismissing}
                                className="gap-2"
                            >
                                {t('wizard.welcome_overlay.start_setup')}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleDismiss}
                                disabled={dismissing}
                                className="gap-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                {t('wizard.welcome_overlay.go_to_dashboard')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
