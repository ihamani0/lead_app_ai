import { Head, useForm } from '@inertiajs/react';
import { Mail, ChevronRight } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const form = useForm({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(send().url);
    };

    return (
        <AuthLayout
            title="Verify your email"
            description="Please verify your email address by clicking the link we just sent you."
        >
            <Head title="Email verification" />

            <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-48 rounded-full bg-[#4C3BCF]/[0.04] blur-3xl" />
                </div>

                <div className="relative space-y-8">
                    {status === 'verification-link-sent' && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center shadow-xs">
                            <p className="text-sm font-medium text-emerald-800">
                                A new verification link has been sent to your
                                email address.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#4C3BCF] to-[#6B5AE0] shadow-lg shadow-[#4C3BCF]/20 ring-1 ring-[#4C3BCF]/10">
                            <Mail className="size-7 text-white" />
                        </div>
                        <p className="mt-2 text-center text-sm leading-relaxed text-[#6B6B80]">
                            We sent a verification link to your email. Check your
                            inbox and click the link to activate your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-12 w-full rounded-xl bg-[#0F0F10] text-[15px] font-bold text-white shadow-md shadow-black/5 transition-all duration-200 hover:bg-[#0F0F10]/90 hover:shadow-lg hover:shadow-black/10 active:scale-[0.98]"
                        >
                            {form.processing ? (
                                <span className="flex items-center gap-2">
                                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Sending...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Resend verification email
                                    <ChevronRight className="size-4" />
                                </span>
                            )}
                        </Button>

                        <div className="text-center">
                            <TextLink
                                href={logout()}
                                className="text-sm text-[#6B6B80] hover:text-[#0F0F10]"
                            >
                                Log out
                            </TextLink>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
