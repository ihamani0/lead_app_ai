import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import GoogleLoginButton from '@/components/auth/google-login-button';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { register } from '@/routes';
import login from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        form.post(login.store.url(), {
            onSuccess: () => {
                form.reset('password');
            },
        });
    };

    return (
        <AuthSplitLayout
            title="Welcome Back!"
            description={
                <>
                    Don&apos;t have an account?{' '}
                    {canRegister ? (
                        <Link
                            href={register()}
                            className="font-medium text-[#4C3BCF] underline underline-offset-2 hover:text-[#3B2EAD]"
                        >
                            Create a new account now
                        </Link>
                    ) : (
                        'Create a new account now'
                    )}
                </>
            }
            brandPosition="left"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-6 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <Label htmlFor="email" className="sr-only">
                        Email address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        autoFocus
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
                            name="password"
                            required
                            autoComplete="current-password"
                            placeholder="Password"
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

                <div className="flex items-center gap-2">
                    <Checkbox
                        id="remember"
                        name="remember"
                        checked={form.data.remember}
                        onCheckedChange={(checked) =>
                            form.setData('remember', checked as boolean)
                        }
                        disabled={form.processing}
                    />
                    <Label
                        htmlFor="remember"
                        className="text-sm text-[#6B6B80]"
                    >
                        Remember me
                    </Label>
                </div>

                <Button
                    type="submit"
                    disabled={form.processing}
                    className="h-12 w-full rounded-[10px] bg-[#0F0F10] text-[15px] font-bold text-white hover:bg-[#0F0F10]/90"
                >
                    Login Now
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

            <GoogleLoginButton label="Login with Google" />

            {canResetPassword && (
                <p className="mt-6 text-center text-sm text-[#6B6B80]">
                    Forgot password?{' '}
                    <Link
                        href={request()}
                        className="font-medium text-[#4C3BCF] underline underline-offset-2 hover:text-[#3B2EAD]"
                    >
                        Click here
                    </Link>
                </p>
            )}
        </AuthSplitLayout>
    );
}
