'use client';

import { QrCode, Settings, MessageCircle, Check } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const steps = [
    {
        number: 1,
        title: 'Connect WhatsApp',
        description:
            'Scan the QR code to connect your WhatsApp Business account. Your account will be securely linked to our platform in seconds.',
        icon: QrCode,
    },
    {
        number: 2,
        title: 'Configure AI Agent',
        description:
            'Set up your AI agent with custom prompts, knowledge base, and automation rules. Tailor it to match your business needs.',
        icon: Settings,
    },
    {
        number: 3,
        title: 'Automate Conversations',
        description:
            'Your AI agent is now live! It will automatically handle customer inquiries, qualify leads, and provide 24/7 support.',
        icon: MessageCircle,
    },
];

// Animated QR Code with shimmer loading
const QRCodeMockup = () => (
    <div className="relative mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                    <svg
                        className="h-6 w-6 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </div>
                <div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        WhatsApp Business
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Scan to connect
                    </div>
                </div>
            </div>

            {/* QR Code with shimmer loading */}
            <div className="mb-4 rounded-xl bg-white p-4 dark:bg-neutral-800">
                <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-700">
                    {/* Shimmer effect */}
                    <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/20" />

                    {/* QR Pattern */}
                    <div className="grid h-full w-full grid-cols-8 gap-0.5 p-2">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'aspect-square rounded-sm',
                                    // QR-like pattern (position-based)
                                    (i < 8 && i % 8 < 3) || // Top-left corner
                                        (i >= 56 && i % 8 < 3) || // Bottom-left corner
                                        (i >= 8 && i < 16 && i % 8 >= 5) || // Top-right corner
                                        Math.random() > 0.5
                                        ? 'bg-neutral-900 dark:bg-neutral-300'
                                        : 'bg-transparent',
                                )}
                            />
                        ))}
                    </div>

                    {/* Scanning line animation */}
                    <div className="animate-scan absolute inset-x-0 top-0 h-1 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>
            </div>
            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Open WhatsApp on your phone and scan the code
            </p>
        </div>
    </div>
);

// AI Config mockup with shimmer
const AIConfigMockup = () => (
    <div className="relative mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            <div className="mb-6 flex items-center justify-between">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    AI Agent Configuration
                </div>
                <div className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Active
                </div>
            </div>
            {/* Config options */}
            <div className="space-y-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Response Tone
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                            Professional
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <div className="h-full w-3/4 rounded-full bg-linear-to-r from-slate-500 to-slate-600" />
                    </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Knowledge Base
                        </span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                            12 docs
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {['FAQ', 'Products', 'Pricing'].map((tag) => (
                            <span
                                key={tag}
                                className="rounded bg-neutral-200 px-2 py-1 text-xs text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            Automation
                        </span>
                        <div className="flex h-6 w-10 justify-end rounded-full bg-emerald-500 p-1">
                            <div className="h-4 w-4 rounded-full bg-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Chat mockup with animations
const ChatMockup = () => (
    <div className="relative mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
            {/* Chat header */}
            <div className="flex items-center gap-3 bg-emerald-600 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                    <div className="font-semibold text-white">AI Assistant</div>
                    <div className="text-sm text-white/70">Online</div>
                </div>
            </div>
            {/* Messages */}
            <div className="min-h-[200px] space-y-3 bg-neutral-50 p-4 dark:bg-neutral-800/30">
                <div className="animate-message-fade-in flex justify-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 shadow-sm dark:bg-neutral-800">
                        <p className="text-sm text-neutral-900 dark:text-neutral-100">
                            Hello! How can I help you today?
                        </p>
                    </div>
                </div>
                <div
                    className="animate-message-fade-in flex justify-end"
                    style={{ animationDelay: '0.5s' }}
                >
                    <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-500 px-4 py-2">
                        <p className="text-sm text-white">
                            I need information about pricing
                        </p>
                    </div>
                </div>
                <div
                    className="animate-message-fade-in flex justify-start"
                    style={{ animationDelay: '1s' }}
                >
                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-4 py-2 shadow-sm dark:bg-neutral-800">
                        <p className="text-sm text-neutral-900 dark:text-neutral-100">
                            Of course! We offer three plans: Starter at $29/mo,
                            Pro at $79/mo, and Enterprise with custom pricing.
                        </p>
                    </div>
                </div>
                <div
                    className="animate-message-fade-in flex items-center justify-start gap-2"
                    style={{ animationDelay: '1.5s' }}
                >
                    <div className="rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-neutral-800">
                        <div className="flex gap-1">
                            <div
                                className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                style={{ animationDelay: '0ms' }}
                            />
                            <div
                                className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                style={{ animationDelay: '150ms' }}
                            />
                            <div
                                className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                                style={{ animationDelay: '300ms' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const stepMockups = [QRCodeMockup, AIConfigMockup, ChatMockup];

// Add custom styles for animations
const customStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes scan {
    0% { top: 0%; }
    50% { top: 100%; }
    100% { top: 0%; }
  }
  @keyframes message-fade-in {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-shimmer {
    animation: shimmer 1.5s infinite;
  }
  .animate-scan {
    animation: scan 2s ease-in-out infinite;
  }
  .animate-message-fade-in {
    animation: message-fade-in 0.5s ease-out forwards;
    opacity: 0;
  }
`;

export function HowItWorksSection() {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Progress timer - 5 seconds per step
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setActiveStep((currentStep) => (currentStep + 1) % 3);
                    return 0;
                }
                return prev + 2; // 2% every 100ms = 5 seconds for 100%
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Reset progress when manually changing steps
    const handleStepClick = useCallback((index: number) => {
        setActiveStep(index);
        setProgress(0);
    }, []);

    const ActiveMockup = stepMockups[activeStep];

    return (
        <>
            <style>{customStyles}</style>
            <section
                className="bg-background px-4 py-20"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <span className="text-sm font-semibold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                            How It Works
                        </span>
                        <h2 className="mt-4 text-4xl font-bold text-balance text-foreground md:text-5xl">
                            Just 3 steps to get started
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Hover over to pause • Click a step to explore
                        </p>
                    </div>

                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Steps */}
                        <div className="relative">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === activeStep;
                                const isCompleted = index < activeStep;

                                return (
                                    <div
                                        key={step.number}
                                        className={cn(
                                            'relative flex cursor-pointer gap-6 pb-12 transition-all duration-300',
                                            'last:pb-0 hover:translate-x-2',
                                        )}
                                        onClick={() => handleStepClick(index)}
                                    >
                                        {/* Vertical line with progress */}
                                        {index < steps.length - 1 && (
                                            <div className="absolute top-14 left-6 h-[calc(100%-3.5rem)] w-0.5 bg-neutral-200 dark:bg-neutral-700">
                                                {/* Animated progress line */}
                                                {isActive && (
                                                    <div
                                                        className="w-full bg-emerald-500 transition-all duration-100 ease-linear"
                                                        style={{
                                                            height: `${progress}%`,
                                                        }}
                                                    />
                                                )}
                                                {isCompleted && (
                                                    <div className="h-full w-full bg-emerald-500" />
                                                )}
                                            </div>
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                'relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                                                isActive || isCompleted
                                                    ? 'scale-110 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                    : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                                            )}
                                        >
                                            {isCompleted ? (
                                                <Check className="h-5 w-5" />
                                            ) : (
                                                <Icon className="h-5 w-5" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 pt-2">
                                            <h3
                                                className={cn(
                                                    'mb-2 text-xl font-semibold transition-colors duration-300',
                                                    isActive || isCompleted
                                                        ? 'text-foreground'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {step.number}. {step.title}
                                            </h3>
                                            <p
                                                className={cn(
                                                    'text-sm leading-relaxed transition-colors duration-300',
                                                    isActive || isCompleted
                                                        ? 'text-muted-foreground'
                                                        : 'text-muted-foreground/60',
                                                )}
                                            >
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mockup display with animation */}
                        <div className="relative">
                            <div
                                className={cn(
                                    'relative z-10 transition-all duration-500',
                                    'animate-fade-scale-in',
                                )}
                                key={activeStep} // Force re-render on step change
                            >
                                <ActiveMockup />
                            </div>
                            {/* Background glow */}
                            <div className="absolute inset-0 -z-10 opacity-20 blur-3xl">
                                <div className="h-full w-full rounded-full bg-gradient-to-br from-emerald-500 to-blue-500" />
                            </div>

                            {/* Progress indicator */}
                            <div className="mt-6 flex items-center justify-center gap-2">
                                {steps.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleStepClick(index)}
                                        className={cn(
                                            'h-2 rounded-full transition-all duration-300',
                                            index === activeStep
                                                ? 'w-8 bg-emerald-500'
                                                : index < activeStep
                                                  ? 'w-2 bg-emerald-500'
                                                  : 'w-2 bg-neutral-300 dark:bg-neutral-600',
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Time remaining indicator */}
                            <p className="mt-2 text-center text-xs text-muted-foreground">
                                {isPaused
                                    ? '⏸ Paused'
                                    : `Next step in ${Math.ceil((100 - progress) / 2)}s`}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes fade-scale-in {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .animate-fade-scale-in {
                    animation: fade-scale-in 0.5s ease-out forwards;
                }
            `}</style>
        </>
    );
}
