import { Check, Smartphone, QrCode, Bot, Image, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    number: number;
    title: string;
    icon: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

const iconMap = {
    'smartphone': Smartphone,
    'qr-code': QrCode,
    'bot': Bot,
    'media': Image,
    'database': Database,
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-between">
            {steps.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                const Icon = iconMap[step.icon as keyof typeof iconMap];

                return (
                    <div key={step.number} className="flex flex-1 items-center">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                                    isCompleted &&
                                        'border-emerald-500 bg-emerald-500 text-white',
                                    isCurrent &&
                                        'border-primary bg-primary text-primary-foreground',
                                    !isCompleted &&
                                        !isCurrent &&
                                        'border-muted bg-muted text-muted-foreground',
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-6 w-6" />
                                ) : (
                                    <Icon className="h-6 w-6" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    'mt-2 text-xs font-medium',
                                    isCompleted && 'text-emerald-600',
                                    isCurrent && 'text-primary',
                                    !isCompleted &&
                                        !isCurrent &&
                                        'text-muted-foreground',
                                )}
                            >
                                {step.title}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="mx-4 flex flex-1 items-center">
                                <div
                                    className={cn(
                                        'h-0.5 flex-1 transition-all duration-300',
                                        isCompleted
                                            ? 'bg-emerald-500'
                                            : 'bg-muted',
                                    )}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
