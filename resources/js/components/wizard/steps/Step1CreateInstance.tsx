import axios from 'axios';
import { Loader2, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';
import type { EvolutionInstance } from '@/types';
import type { WizardFormData } from '@/types/wizard';

interface Step1CreateInstanceProps {
    formData: WizardFormData;
    setFormData: (data: WizardFormData | ((prev: WizardFormData) => WizardFormData)) => void;
    onNext: () => void;
}

export function Step1CreateInstance({
    formData,
    setFormData,
    onNext,
}: Step1CreateInstanceProps) {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [instanceName, setInstanceName] = useState(formData.instance_name);
    const [displayName, setDisplayName] = useState(formData.display_name);
    const [phoneNumber, setPhoneNumber] = useState(formData.phone_number);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setProcessing(true);

        axios
            .post(
                workspaces.wizard.instance({ slug: activeWorkspace.slug }).url,
                {
                    instance_name: instanceName,
                    display_name: displayName,
                    phone_number: phoneNumber,
                },
            )
            .then((response) => {
                const { success, instance } = response.data as {
                    success: boolean;
                    instance: EvolutionInstance;
                };
                if (success) {
                    setFormData((prev: WizardFormData) => ({
                        ...prev,
                        instance_name: instanceName,
                        display_name: displayName,
                        phone_number: phoneNumber,
                        instance,
                    }));
                    onNext();
                }
            })
            .catch((error) => {
                if (error.response) {
                    const body = error.response.data as { error?: string };
                    setError(body.error || t('wizard.step1.error_create'));
                } else {
                    setError(t('wizard.step1.error_create'));
                }
            })
            .finally(() => setProcessing(false));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">{t('wizard.step1.title')}</h2>
                <p className="mt-2 text-muted-foreground">
                    {t('wizard.step1.description')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="instance_name">
                        {t('wizard.step1.instance_name')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="instance_name"
                        placeholder={t('wizard.step1.instance_name_placeholder')}
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                        required
                        disabled={processing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="display_name">{t('wizard.step1.display_name')}</Label>
                    <Input
                        id="display_name"
                        placeholder={t('wizard.step1.display_name_placeholder')}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={processing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone_number">{t('wizard.step1.phone_number')}</Label>
                    <Input
                        id="phone_number"
                        placeholder={t('wizard.step1.phone_placeholder')}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={processing}
                    />
                    <p className="text-xs text-muted-foreground">
                        {t('wizard.step1.phone_hint')}
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={processing} className="gap-2">
                        {processing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('wizard.step1.creating')}
                            </>
                        ) : (
                            <>
                                <Smartphone className="h-4 w-4" />
                                {t('wizard.step1.create_button')}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
