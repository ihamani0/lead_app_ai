import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import SettingsLayout from '@/layouts/settings/layout';
import WorkspaceLayout from '@/layouts/workspace-layout';
import userPassword from '@/routes/user-password';

type Props = {
    requiresCurrentPassword?: boolean;
};

export default function Password({ requiresCurrentPassword = true }: Props) {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(userPassword.update.url(), {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
            onSuccess: () => {
                form.reset(
                    'password',
                    'password_confirmation',
                    'current_password',
                );
            },
        });
    };

    return (
        <WorkspaceLayout title={t('settings.password.title')}>
            <h1 className="sr-only">{t('settings.password.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.password.heading')}
                        description={t('settings.password.headingDescription')}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {requiresCurrentPassword && (
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    {t('settings.password.current')}
                                </Label>

                                <Input
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    placeholder={t('settings.password.currentPlaceholder')}
                                    value={form.data.current_password}
                                    onChange={(e) =>
                                        form.setData(
                                            'current_password',
                                            e.target.value,
                                        )
                                    }
                                    disabled={form.processing}
                                />

                                <InputError
                                    message={form.errors.current_password}
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('settings.password.new')}
                            </Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                name="password"
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={t('settings.password.newPlaceholder')}
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData('password', e.target.value)
                                }
                                disabled={form.processing}
                            />

                            <InputError message={form.errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t('settings.password.confirm')}
                            </Label>

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={t('settings.password.confirmPlaceholder')}
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                disabled={form.processing}
                            />

                            <InputError
                                message={form.errors.password_confirmation}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={form.processing}
                                data-test="update-password-button"
                            >
                                {t('settings.password.save')}
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    {t('settings.password.saved')}
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </WorkspaceLayout>
    );
}
