import { Transition } from '@headlessui/react';
import { Link, usePage, useForm } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import SettingsLayout from '@/layouts/settings/layout';
import WorkspaceLayout from '@/layouts/workspace-layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t } = useTranslation();
    const { auth } = usePage().props;

    const form = useForm({
        name: auth.user.name,
        email: auth.user.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(edit().url, {
            preserveScroll: true,
        });
    };

    return (
        <WorkspaceLayout title={t('settings.profile.title')}>
            <h1 className="sr-only">{t('settings.profile.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.profile.heading')}
                        description={t('settings.profile.headingDescription')}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {t('settings.profile.name')}
                            </Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                required
                                autoComplete="name"
                                placeholder={t('settings.profile.namePlaceholder')}
                            />

                            <InputError
                                className="mt-2"
                                message={form.errors.name}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {t('settings.profile.email')}
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                                required
                                autoComplete="username"
                                placeholder={t('settings.profile.emailPlaceholder')}
                            />

                            <InputError
                                className="mt-2"
                                message={form.errors.email}
                            />
                        </div>

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-xs text-muted-foreground md:text-sm">
                                        {t('settings.profile.emailUnverified')}{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            {t('settings.profile.resendVerification')}
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-xs font-medium text-green-600 md:text-sm">
                                            {t('settings.profile.verificationSent')}
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={form.processing}
                                data-test="update-profile-button"
                            >
                                {t('settings.profile.save')}
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-xs text-neutral-600 md:text-sm">
                                    {t('settings.profile.saved')}
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </WorkspaceLayout>
    );
}
