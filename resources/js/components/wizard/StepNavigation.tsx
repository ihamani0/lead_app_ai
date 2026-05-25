import { AlertCircle, ArrowLeft, ArrowRight, Loader2, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface StepNavigationProps {
    currentStep: number;
    onBack: () => void;
    onNext: () => void;
    onSkip?: () => void;
    isSubmitting: boolean;
    canProceed: boolean;
    error?: string | null;
}

export function StepNavigation({
    currentStep,
    onBack,
    onNext,
    onSkip,
    isSubmitting,
    canProceed,
    error,
}: StepNavigationProps) {
    const { t } = useTranslation();
    const isLastStep = currentStep === 4;

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex items-center justify-between gap-4">
            <div>
                {currentStep > 1 && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('wizard.navigation.back')}
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-3">
                {onSkip && (
                    <Button
                        variant="ghost"
                        onClick={onSkip}
                        className="gap-2"
                    >
                        <SkipForward className="h-4 w-4" />
                        {t('wizard.navigation.skip')}
                    </Button>
                )}

                {isLastStep ? (
                    <Button
                        onClick={onNext}
                        disabled={!canProceed || isSubmitting}
                        className="gap-2 bg-primary"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {t('wizard.navigation.creating')}
                            </>
                        ) : (
                            <>
                                {t('wizard.navigation.complete')}
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={onNext}
                        disabled={!canProceed}
                        className="gap-2"
                    >
                        {t('wizard.navigation.next')}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
        </div>
    );
}
