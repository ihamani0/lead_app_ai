import { Head, useForm } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import WorkspaceLayout from '@/layouts/workspace-layout';
import twoFactor from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const { t } = useTranslation();
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    const enableForm = useForm({});
    const disableForm = useForm({});

    const handleEnable = (e: React.FormEvent) => {
        e.preventDefault();
        enableForm.post(twoFactor.enable.url(), {
            onSuccess: () => setShowSetupModal(true),
        });
    };

    const handleDisable = (e: React.FormEvent) => {
        e.preventDefault();
        disableForm.delete(twoFactor.disable.url());
    };

    return (
        <WorkspaceLayout title={t('settings.twoFactor.title')}>
            <Head title={t('settings.twoFactor.title')} />

            <h1 className="sr-only">{t('settings.twoFactor.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.twoFactor.heading')}
                        description={t('settings.twoFactor.headingDescription')}
                    />
                    {twoFactorEnabled ? (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge variant="default">
                                {t('settings.twoFactor.enabled')}
                            </Badge>
                            <p className="text-muted-foreground">
                                {t('settings.twoFactor.enabledDescription')}
                            </p>

                            <TwoFactorRecoveryCodes
                                recoveryCodesList={recoveryCodesList}
                                fetchRecoveryCodes={fetchRecoveryCodes}
                                errors={errors}
                            />

                            <div className="relative inline">
                                <form onSubmit={handleDisable}>
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={disableForm.processing}
                                    >
                                        <ShieldBan />
                                        {t('settings.twoFactor.disable')}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-start justify-start space-y-4">
                            <Badge variant="destructive">
                                {t('settings.twoFactor.disabled')}
                            </Badge>
                            <p className="text-muted-foreground">
                                {t('settings.twoFactor.disabledDescription')}
                            </p>

                            <div>
                                {hasSetupData ? (
                                    <Button
                                        onClick={() => setShowSetupModal(true)}
                                    >
                                        <ShieldCheck />
                                        {t('settings.twoFactor.continueSetup')}
                                    </Button>
                                ) : (
                                    <form onSubmit={handleEnable}>
                                        <Button
                                            type="submit"
                                            disabled={enableForm.processing}
                                        >
                                            <ShieldCheck />
                                            {t('settings.twoFactor.enable')}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </WorkspaceLayout>
    );
}
