import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { StepIndicator } from '@/components/wizard/StepIndicator';
import { StepNavigation } from '@/components/wizard/StepNavigation';
import { Step1CreateInstance } from '@/components/wizard/steps/Step1CreateInstance';
import { Step2ConnectWhatsApp } from '@/components/wizard/steps/Step2ConnectWhatsApp';
import { Step3ConfigureAgent } from '@/components/wizard/steps/Step3ConfigureAgent';
import { Step4KnowledgeBase } from '@/components/wizard/steps/Step4KnowledgeBase';
import { useActiveWorkspace } from '@/hooks/use-active-workspace';
import { useTranslation } from '@/hooks/use-translation';
import workspaces from '@/routes/workspaces';

import type { WizardStep, WizardFormData } from '@/types/wizard';

interface StepItem {
    number: number;
    title: string;
    icon: string;
}

const initialFormData: WizardFormData = {
    instance_name: '',
    display_name: '',
    phone_number: '',
    instance: null,
    qrCode: null,
    connectionStatus: 'disconnected',
    agent_name: '',
    languages: ['en'],
    primary_objective: 'answer_questions',
    tone: 'professional',
    google_maps_url: '',
    calendar_url: '',
    additional_info: '',
    prompt: '',
    knowledge_files: [],
};

export default function WizardIndex() {
    const activeWorkspace = useActiveWorkspace()!;
    const { t } = useTranslation();

    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [formData, setFormData] = useState<WizardFormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wizardError, setWizardError] = useState<string | null>(null);

    const steps: StepItem[] = [
        { number: 1, title: t('wizard.steps.create_instance'), icon: 'smartphone' },
        { number: 2, title: t('wizard.steps.connect_whatsapp'), icon: 'qr-code' },
        { number: 3, title: t('wizard.steps.configure_agent'), icon: 'bot' },
        { number: 4, title: t('wizard.steps.knowledge_base'), icon: 'database' },
    ];

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep((currentStep + 1) as WizardStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as WizardStep);
        }
    };

    const handleSkip = () => {
        if (currentStep === 4) {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        setWizardError(null);

        if (!formData.instance) {
            setWizardError(t('wizard.step2.no_instance'));
            return;
        }

        if (!formData.agent_name) {
            setWizardError(t('wizard.step3.agent_name_required'));
            return;
        }

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('instance_id', formData.instance.id);
        formDataToSend.append('agent_name', formData.agent_name);
        formData.languages.forEach((lang) => formDataToSend.append('languages[]', lang));
        formDataToSend.append('primary_objective', formData.primary_objective);
        formDataToSend.append('tone', formData.tone);
        if (formData.google_maps_url) formDataToSend.append('google_maps_url', formData.google_maps_url);
        if (formData.calendar_url) formDataToSend.append('calendar_url', formData.calendar_url);
        if (formData.additional_info) formDataToSend.append('additional_info', formData.additional_info);
        if (formData.prompt) formDataToSend.append('prompt', formData.prompt);
        formData.knowledge_files.forEach((file) => {
            formDataToSend.append('knowledge_files[]', file);
        });

        localStorage.setItem('wizard_welcome_dismissed', 'true');

        router.post(
            workspaces.wizard.complete({ slug: activeWorkspace.slug }).url,
            formDataToSend,
            {
                forceFormData: true,
                onError: (errors) => {
                    setWizardError(Object.values(errors).join(', '));
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1CreateInstance
                        formData={formData}
                        setFormData={setFormData}
                        onNext={handleNext}
                    />
                );
            case 2:
                return (
                    <Step2ConnectWhatsApp
                        formData={formData}
                        setFormData={setFormData}
                        onNext={handleNext}
                    />
                );
            case 3:
                return (
                    <Step3ConfigureAgent
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            case 4:
                return (
                    <Step4KnowledgeBase
                        formData={formData}
                        setFormData={setFormData}
                        onNext={handleComplete}
                        onSkip={handleSkip}
                        isSubmitting={isSubmitting}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title={t('wizard.title')} />

            <div className="border-b bg-card">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.get(
                                    workspaces.agents.index({
                                        slug: activeWorkspace.slug,
                                    }).url,
                                )
                            }
                        >
                            ← {t('wizard.back_to_agents')}
                        </Button>
                    </div>
                    <h1 className="text-lg font-semibold">{t('wizard.title')}</h1>
                    <div className="w-24" />
                </div>
            </div>

            <div className="border-b bg-card">
                <div className="mx-auto max-w-5xl px-4 py-6">
                    <StepIndicator steps={steps} currentStep={currentStep} />
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8">
                <Card>
                    <CardContent className="p-6">{renderStep()}</CardContent>
                </Card>
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-8">
                <StepNavigation
                    currentStep={currentStep}
                    onBack={handleBack}
                    onNext={currentStep === 4 ? handleComplete : handleNext}
                    onSkip={currentStep === 4 ? handleSkip : undefined}
                    isSubmitting={isSubmitting}
                    error={wizardError}
                    canProceed={
                        currentStep === 1
                            ? !!formData.instance
                            : currentStep === 2
                              ? formData.connectionStatus === 'connected'
                              : currentStep === 3
                                ? !!formData.agent_name
                                : true
                    }
                />
            </div>
        </div>
    );
}
