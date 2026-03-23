// components/ConnectingStatus.tsx
import { Loader2, RefreshCw, AlertCircle, Clock, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ConnectingStatusProps {
    instanceName: string;
    onRestart: (e: React.MouseEvent) => void;
    onAutoRestart: () => void;
    isRestarting: boolean;
    elapsedTime?: number;
    isReconnect: boolean;
    isWaitingForQr: boolean;
}

export function ConnectingStatus({
    instanceName,
    onRestart,
    onAutoRestart,
    isRestarting,
    elapsedTime = 0,
    isReconnect,
    isWaitingForQr,
}: ConnectingStatusProps) {
    const [countdown, setCountdown] = useState(10);

    // Format elapsed time
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Determine if it's taking too long (over 30 seconds)
    const isStuck = elapsedTime > 30;

    // Auto-restart logic for reconnect after 3 seconds
    useEffect(() => {
        if (isReconnect && !isRestarting && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (isReconnect && countdown === 0 && !isRestarting) {
            onAutoRestart();
            setCountdown(10); // Reset for next time
        }
    }, [isReconnect, isRestarting, countdown, onAutoRestart]);

    // Waiting for QR (first connection) - show spinner
    if (isWaitingForQr) {
        return (
            <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                <Card
                    className={cn(
                        'relative overflow-hidden border-0 shadow-2xl',
                        'bg-linear-to-br from-blue-50 via-white to-indigo-50',
                        'dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20',
                    )}
                >
                    {/* Animated background pulse */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-full animate-[spin_6s_linear_infinite] opacity-20">
                            <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0_340deg,blue-400_360deg)]" />
                        </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

                    <CardContent className="relative p-8 md:p-12">
                        <div className="flex flex-col items-center text-center">
                            {/* Animated Icon Container */}
                            <div className="relative mb-8">
                                {/* Outer rotating ring */}
                                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                                    <div className="h-32 w-32 rounded-full border-4 border-dashed border-blue-300/50 dark:border-blue-700/30" />
                                </div>

                                {/* Middle pulsing ring */}
                                <div className="absolute inset-2 animate-pulse">
                                    <div className="h-28 w-28 rounded-full border-2 border-blue-400/30 dark:border-blue-600/20" />
                                </div>

                                {/* Inner spinning loader */}
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-slate-800">
                                    <QrCode
                                        className={cn(
                                            'h-12 w-12 text-blue-500',
                                            'animate-pulse',
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Status Text */}
                            <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Generating QR Code
                            </h2>

                            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                                Please wait while we generate the QR code for{' '}
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {instanceName}
                                </span>
                                . This usually takes a few moments...
                            </p>

                            {/* Loading indicator */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 dark:bg-blue-900/20">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        Processing
                                    </span>
                                </div>
                            </div>

                            {/* Technical details */}
                            <div className="mt-8 text-xs text-slate-400 dark:text-slate-600">
                                Instance:{' '}
                                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
                                    {instanceName}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Reconnect mode (sleep/disconnect) - show countdown + auto-restart
    if (isReconnect) {
        return (
            <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                <Card
                    className={cn(
                        'relative overflow-hidden border-0 shadow-2xl',
                        'bg-linear-to-br from-amber-50 via-white to-orange-50',
                        'dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20',
                    )}
                >
                    {/* Animated background pulse */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-full animate-[spin_4s_linear_infinite] opacity-20">
                            <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0_340deg,amber-400_360deg)]" />
                        </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

                    <CardContent className="relative p-8 md:p-12">
                        <div className="flex flex-col items-center text-center">
                            {/* Animated Icon Container */}
                            <div className="relative mb-8">
                                {/* Outer rotating ring */}
                                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                                    <div className="h-32 w-32 rounded-full border-4 border-dashed border-amber-300/50 dark:border-amber-700/30" />
                                </div>

                                {/* Middle pulsing ring */}
                                <div className="absolute inset-2 animate-pulse">
                                    <div className="h-28 w-28 rounded-full border-2 border-amber-400/30 dark:border-amber-600/20" />
                                </div>

                                {/* Inner spinning loader */}
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-slate-800">
                                    <Loader2
                                        className={cn(
                                            'h-12 w-12 text-amber-500',
                                            isRestarting
                                                ? 'animate-spin'
                                                : 'animate-spin',
                                        )}
                                    />
                                </div>

                                {/* Connection dots */}
                                <div className="absolute top-1/2 -right-4 flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:150ms]" />
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:300ms]" />
                                </div>
                            </div>

                            {/* Status Text */}
                            <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Reconnecting
                            </h2>

                            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                                Connection lost. Attempting to reconnect to{' '}
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    {instanceName}
                                </span>
                                ...
                            </p>

                            {/* Countdown */}
                            {!isRestarting && (
                                <div className="mb-6 flex items-center gap-6">
                                    <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-900/20">
                                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                            Auto-restart in {countdown}s
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Warning if taking too long */}
                            {isStuck && (
                                <div className="mb-6 flex max-w-md items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                            Connection is taking longer than
                                            usual
                                        </p>
                                        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                                            This might indicate a network issue
                                            or WhatsApp Web session expiration.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Button
                                    onClick={onRestart}
                                    disabled={isRestarting}
                                    className={cn(
                                        'group relative overflow-hidden bg-linear-to-r from-amber-500 to-orange-500',
                                        'px-8 py-6 text-base font-bold text-white shadow-lg shadow-amber-500/25',
                                        'transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30',
                                        'hover:scale-105 active:scale-95',
                                        'disabled:cursor-not-allowed disabled:opacity-60',
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isRestarting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Restarting...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                                                Restart Now
                                            </>
                                        )}
                                    </span>
                                </Button>
                            </div>

                            {/* Technical details */}
                            <div className="mt-8 text-xs text-slate-400 dark:text-slate-600">
                                Instance:{' '}
                                <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
                                    {instanceName}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Default: First connection (show connecting without auto-restart)
    return (
        <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
            <Card
                className={cn(
                    'relative overflow-hidden border-0 shadow-2xl',
                    'bg-linear-to-br from-amber-50 via-white to-orange-50',
                    'dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20',
                )}
            >
                {/* Animated background pulse */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-full animate-[spin_4s_linear_infinite] opacity-20">
                        <div className="h-full w-full bg-[conic-gradient(from_0deg,transparent_0_340deg,amber-400_360deg)]" />
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

                <CardContent className="relative p-8 md:p-12">
                    <div className="flex flex-col items-center text-center">
                        {/* Animated Icon Container */}
                        <div className="relative mb-8">
                            {/* Outer rotating ring */}
                            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                                <div className="h-32 w-32 rounded-full border-4 border-dashed border-amber-300/50 dark:border-amber-700/30" />
                            </div>

                            {/* Middle pulsing ring */}
                            <div className="absolute inset-2 animate-pulse">
                                <div className="h-28 w-28 rounded-full border-2 border-amber-400/30 dark:border-amber-600/20" />
                            </div>

                            {/* Inner spinning loader */}
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-slate-800">
                                <Loader2
                                    className={cn(
                                        'h-12 w-12 text-amber-500',
                                        isRestarting
                                            ? 'animate-spin'
                                            : 'animate-spin',
                                    )}
                                />
                            </div>

                            {/* Connection dots */}
                            <div className="absolute top-1/2 -right-4 flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:150ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:300ms]" />
                            </div>
                        </div>

                        {/* Status Text */}
                        <h2 className="mb-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Establishing Connection
                        </h2>

                        <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                            WhatsApp is connecting to{' '}
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {instanceName}
                            </span>
                            . Scan the QR code to complete connection...
                        </p>

                        {/* Progress indicators */}
                        <div className="mb-8 flex items-center gap-6">
                            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
                                <Clock className="h-4 w-4 text-slate-500" />
                                <span className="font-mono text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {timeDisplay}
                                </span>
                            </div>
                        </div>

                        {/* Warning if taking too long */}
                        {isStuck && (
                            <div className="mb-6 flex max-w-md items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        Connection is taking longer than usual
                                    </p>
                                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                                        This might indicate a network issue or
                                        WhatsApp Web session expiration. Try
                                        restarting the instance.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                onClick={onRestart}
                                disabled={isRestarting}
                                className={cn(
                                    'group relative overflow-hidden bg-linear-to-r from-amber-500 to-orange-500',
                                    'px-8 py-6 text-base font-bold text-white shadow-lg shadow-amber-500/25',
                                    'transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30',
                                    'hover:scale-105 active:scale-95',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isRestarting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Restarting...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
                                            Restart Connection
                                        </>
                                    )}
                                </span>
                                {/* Button shine effect */}
                                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                            </Button>
                        </div>

                        {/* Technical details */}
                        <div className="mt-8 text-xs text-slate-400 dark:text-slate-600">
                            Instance:{' '}
                            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono dark:bg-slate-800">
                                {instanceName}
                            </code>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
