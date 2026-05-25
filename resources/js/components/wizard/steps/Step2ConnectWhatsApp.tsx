import { useEcho } from '@laravel/echo-react';
import axios from 'axios';
import { Loader2, QrCode, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { EvolutionInstance } from '@/types';
import type { WizardFormData } from '@/types/wizard';

interface Step2ConnectWhatsAppProps {
    formData: WizardFormData;
    setFormData: (data: WizardFormData | ((prev: WizardFormData) => WizardFormData)) => void;
    onNext: () => void;
}

export function Step2ConnectWhatsApp({
    formData,
    setFormData,
    onNext,
}: Step2ConnectWhatsAppProps) {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isLoadingQr, setIsLoadingQr] = useState(false);
    const [isWaitingForQr, setIsWaitingForQr] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);

    const instance = formData.instance;
    const channel = instance ? `instance.${instance.instance_name}` : '';

    useEcho(channel, ['QrCodeUpdated', 'InstanceConnectionUpdated'], (e) => {
        if (e.qrCode) {
            setQrCode(e.qrCode as string);
            setIsLoadingQr(false);
            setIsWaitingForQr(false);
            setQrError(null);
        }

        if (e.instance) {
            const newInstance = e.instance as EvolutionInstance;
            const newStatus = newInstance.status;

            setFormData((prev: WizardFormData) => ({
                ...prev,
                instance: newInstance,
                connectionStatus: newStatus,
            }));

            if (newStatus === 'connecting') {
                setQrCode(null);
            }

            if (newStatus === 'connected') {
                setQrCode(null);
                setIsWaitingForQr(false);
                setTimeout(() => onNext(), 1000);
            }
        }
    });

    const handleFetchQr = useCallback(async () => {
        if (!instance) return;

        setIsLoadingQr(true);
        setIsWaitingForQr(true);
        setQrCode(null);
        setQrError(null);

        try {
            await axios.post(
                workspaces.wizard.qr({ slug: activeWorkspace.slug }).url,
                { instance_id: instance.instance_name },
            );
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const body = error.response.data as { error?: string };
                setQrError(body.error || t('wizard.step2.error_qr'));
            } else {
                setQrError(t('wizard.step2.error_qr'));
            }
            setIsWaitingForQr(false);
        }
    }, [instance, activeWorkspace.slug, t]);

    if (!instance) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">{t('wizard.step2.no_instance')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('wizard.step2.title')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('wizard.step2.description')}
                </p>
            </div>

            {qrError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {qrError}
                </div>
            )}

            <div className="rounded-lg border bg-muted/50 p-6">
                <div className="flex flex-col items-center gap-6">
                    {!qrCode && !isWaitingForQr && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-muted p-6">
                                <QrCode className="h-16 w-16 text-muted-foreground" />
                            </div>
                            <Button
                                size="lg"
                                onClick={handleFetchQr}
                                disabled={isLoadingQr}
                                className="gap-2"
                            >
                                {isLoadingQr ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        {t('wizard.step2.generating')}
                                    </>
                                ) : (
                                    <>
                                        <QrCode className="h-5 w-5" />
                                        {t('wizard.step2.generate_qr')}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {isWaitingForQr && !qrCode && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <p className="text-center text-muted-foreground">
                                {t('wizard.step2.generating_qr')}
                            </p>
                        </div>
                    )}

                    {qrCode && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-lg bg-white p-4 shadow-lg">
                                <QRCodeSVG
                                    value={qrCode}
                                    size={240}
                                    level="H"
                                    includeMargin
                                />
                            </div>
                            <Badge variant="outline" className="animate-pulse gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                {t('wizard.step2.waiting_scan')}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleFetchQr}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                {t('wizard.step2.refresh_qr')}
                            </Button>
                        </div>
                    )}

                    {formData.connectionStatus === 'connected' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-emerald-100 p-6 dark:bg-emerald-900/30">
                                <QrCode className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-center font-medium text-emerald-600 dark:text-emerald-400">
                                {t('wizard.step2.connected')}
                            </p>
                            <p className="text-center text-sm text-muted-foreground">
                                {t('wizard.step2.proceeding')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
                <h3 className="mb-2 font-medium">{t('wizard.step2.how_to_title')}</h3>
                <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                        <span className="font-medium">1.</span>
                        {t('wizard.step2.step1')}
                    </li>
                    <li className="flex gap-2">
                        <span className="font-medium">2.</span>
                        {t('wizard.step2.step2')}
                    </li>
                    <li className="flex gap-2">
                        <span className="font-medium">3.</span>
                        {t('wizard.step2.step3')}
                    </li>
                </ol>
            </div>
        </div>
    );
}
