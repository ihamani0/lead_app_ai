import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import GoogleLoginButton from '@/components/auth/google-login-button';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { login, register, terms, privacy } from '@/routes';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(register().url, {
            onSuccess: () => {
                form.reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AuthSplitLayout
            title="Create your account"
            description={
                <>
                    Already have an account?{' '}
                    <Link
                        href={login()}
                        className="font-medium text-[#4C3BCF] underline underline-offset-2 hover:text-[#3B2EAD]"
                    >
                        Sign in here
                    </Link>
                </>
            }
            brandPosition="right"
        >
            <Head title="Register" />

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="sr-only">
                        Full name
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        autoFocus
                        autoComplete="name"
                        placeholder="Your full name"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        disabled={form.processing}
                        className="h-12 rounded-[10px] border-[#E2E2E7] bg-[#F7F7F8] pl-4 text-[15px] text-[#0F0F10] placeholder:text-[#6B6B80] focus:bg-white focus:ring-[3px] focus:ring-[#4C3BCF]/12"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="sr-only">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        disabled={form.processing}
                        className="h-12 rounded-[10px] border-[#E2E2E7] bg-[#F7F7F8] pl-4 text-[15px] text-[#0F0F10] placeholder:text-[#6B6B80] focus:bg-white focus:ring-[3px] focus:ring-[#4C3BCF]/12"
                    />
                    <InputError message={form.errors.email} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" className="sr-only">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete="new-password"
                            placeholder="Create a password"
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                            disabled={form.processing}
                            className="h-12 rounded-[10px] border-[#E2E2E7] bg-[#F7F7F8] pr-11 pl-4 text-[15px] text-[#0F0F10] placeholder:text-[#6B6B80] focus:bg-white focus:ring-[3px] focus:ring-[#4C3BCF]/12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6B6B80] hover:text-[#0F0F10]"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={form.errors.password} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password_confirmation" className="sr-only">
                        Confirm password
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        required
                        autoComplete="new-password"
                        placeholder="Confirm password"
                        value={form.data.password_confirmation}
                        onChange={(e) =>
                            form.setData(
                                'password_confirmation',
                                e.target.value,
                            )
                        }
                        disabled={form.processing}
                        className="h-12 rounded-[10px] border-[#E2E2E7] bg-[#F7F7F8] pl-4 text-[15px] text-[#0F0F10] placeholder:text-[#6B6B80] focus:bg-white focus:ring-[3px] focus:ring-[#4C3BCF]/12"
                    />
                    <InputError message={form.errors.password_confirmation} />
                </div>

                <Button
                    type="submit"
                    disabled={form.processing}
                    className="h-12 w-full rounded-[10px] bg-[#0F0F10] text-[15px] font-bold text-white hover:bg-[#0F0F10]/90"
                >
                    Create Account
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E2E2E7]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-[#6B6B80]">or</span>
                </div>
            </div>

            <GoogleLoginButton label="Sign up with Google" />

            <p className="mt-6 text-center text-xs text-[#6B6B80]">
                By creating an account, you agree to our{' '}
                <Link
                    href={terms()}
                    className="font-medium text-[#4C3BCF] underline underline-offset-2 hover:text-[#3B2EAD]"
                >
                    Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                    href={privacy()}
                    className="font-medium text-[#4C3BCF] underline underline-offset-2 hover:text-[#3B2EAD]"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </AuthSplitLayout>
    );
}
