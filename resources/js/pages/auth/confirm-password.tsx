import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import confirmPassword from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const form = useForm({
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(confirmPassword.store.url(), {
            onSuccess: () => form.reset(),
        });
    };

    return (
        <AuthLayout
            title="Confirm your password"
            description="This is a secure area of the application. Please confirm your password before continuing."
        >
            <Head title="Confirm password" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        autoFocus
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                        disabled={form.processing}
                    />

                    <InputError message={form.errors.password} />
                </div>

                <div className="flex items-center">
                    <Button
                        className="w-full"
                        disabled={form.processing}
                        data-test="confirm-password-button"
                    >
                        {form.processing && <Spinner />}
                        Confirm password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
