import { Transition } from '@headlessui/react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Key, Save, ShieldCheck, Sun, User } from 'lucide-react';
import { useRef, useState } from 'react';
import AppearanceTabs from '@/components/appearance-tabs';
import InputError from '@/components/input-error';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import { edit as editProfile } from '@/routes/profile';
import twoFactor from '@/routes/two-factor';
import userPassword from '@/routes/user-password';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account Settings',
        href: '/account/settings',
    },
];

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            email_verified_at: string | null;
        };
    };
    mustVerifyEmail?: boolean;
    status?: string;
    requiresCurrentPassword?: boolean;
    twoFactorEnabled?: boolean;
    requiresConfirmation?: boolean;
};

export default function AccountSettings() {
    const { t } = useTranslation();
    const page = usePage<PageProps>();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.account.title')} />

            <div className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold md:text-3xl">
                        {t('settings.account.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('settings.account.description')}
                    </p>
                </div>

                <div className="space-y-8">
                    <ProfileSection />
                    <Separator />
                    <PasswordSection
                        requiresCurrentPassword={
                            page.props.requiresCurrentPassword ?? true
                        }
                    />
                    <Separator />
                    <AppearanceSection />
                    <Separator />
                    <TwoFactorSection
                        twoFactorEnabled={page.props.twoFactorEnabled ?? false}
                        requiresConfirmation={
                            page.props.requiresConfirmation ?? false
                        }
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function ProfileSection() {
    const { t } = useTranslation();
    const page = usePage<PageProps>();
    const { auth, mustVerifyEmail, status } = page.props;
    const { user } = auth;

    const form = useForm({
        name: user.name,
        email: user.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(editProfile().url, {
            preserveScroll: true,
        });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="size-5 text-primary" />
                    <CardTitle>{t('settings.account.profile.title')}</CardTitle>
                </div>
                <CardDescription>
                    {t('settings.account.profile.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="settings-name">
                            {t('settings.account.profile.name')}
                        </Label>
                        <Input
                            id="settings-name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            disabled={form.processing}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="settings-email">
                            {t('settings.account.profile.email')}
                        </Label>
                        <Input
                            id="settings-email"
                            type="email"
                            value={form.data.email}
                            onChange={(e) =>
                                form.setData('email', e.target.value)
                            }
                            disabled={form.processing}
                        />
                        <InputError message={form.errors.email} />
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <p className="text-sm text-muted-foreground">
                            {t('settings.account.profile.emailUnverified')}
                        </p>
                    )}

                    {status === 'verification-link-sent' && (
                        <p className="text-sm text-green-600">
                            {t('settings.account.profile.verificationSent')}
                        </p>
                    )}

                    <div className="flex items-center gap-4">
                        <Button disabled={form.processing}>
                            <Save className="mr-2 size-4" />
                            {t('settings.account.profile.save')}
                        </Button>

                        <Transition
                            show={form.recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">
                                {t('settings.account.profile.saved')}
                            </p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function PasswordSection({
    requiresCurrentPassword = true,
}: {
    requiresCurrentPassword?: boolean;
}) {
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
                if (errors.password) passwordInput.current?.focus();
                if (errors.current_password)
                    currentPasswordInput.current?.focus();
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
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Key className="size-5 text-primary" />
                    <CardTitle>{t('settings.account.password.title')}</CardTitle>
                </div>
                <CardDescription>
                    {t('settings.account.password.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {requiresCurrentPassword && (
                        <div className="grid gap-2">
                            <Label htmlFor="settings-current-password">
                                {t('settings.account.password.current')}
                            </Label>
                            <Input
                                id="settings-current-password"
                                ref={currentPasswordInput}
                                type="password"
                                autoComplete="current-password"
                                placeholder={t('settings.account.password.currentPlaceholder')}
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
                        <Label htmlFor="settings-new-password">
                            {t('settings.account.password.new')}
                        </Label>
                        <Input
                            id="settings-new-password"
                            ref={passwordInput}
                            type="password"
                            autoComplete="new-password"
                            placeholder={t('settings.account.password.newPlaceholder')}
                            value={form.data.password}
                            onChange={(e) =>
                                form.setData('password', e.target.value)
                            }
                            disabled={form.processing}
                        />
                        <InputError message={form.errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="settings-confirm-password">
                            {t('settings.account.password.confirm')}
                        </Label>
                        <Input
                            id="settings-confirm-password"
                            type="password"
                            autoComplete="new-password"
                            placeholder={t('settings.account.password.confirmPlaceholder')}
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
                        <Button disabled={form.processing}>
                            <Save className="mr-2 size-4" />
                            {t('settings.account.password.save')}
                        </Button>

                        <Transition
                            show={form.recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">
                                {t('settings.account.password.saved')}
                            </p>
                        </Transition>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function AppearanceSection() {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sun className="size-5 text-primary" />
                    <CardTitle>{t('settings.account.appearance.title')}</CardTitle>
                </div>
                <CardDescription>
                    {t('settings.account.appearance.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AppearanceTabs />
            </CardContent>
        </Card>
    );
}

function TwoFactorSection({
    twoFactorEnabled = false,
    requiresConfirmation = false,
}: {
    twoFactorEnabled?: boolean;
    requiresConfirmation?: boolean;
}) {
    const { t } = useTranslation();

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);
    const enableForm = useForm({});
    const disableForm = useForm({});

    const handleEnable = (e: React.FormEvent) => {
        e.preventDefault();
        enableForm.post(twoFactor.enable.url(), {
            onSuccess: () => setShowSetupModal(true),
        });
    };

    const handleDisable = (e: React.FormEvent) => {
        e.preventDefault();
        disableForm.delete(twoFactor.disable.url());
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    <CardTitle>{t('settings.account.twoFactor.title')}</CardTitle>
                </div>
                <CardDescription>
                    {t('settings.account.twoFactor.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {twoFactorEnabled ? (
                    <div className="flex flex-col items-start gap-4">
                        <Badge variant="default">
                            {t('settings.account.twoFactor.enabled')}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.account.twoFactor.enabledDescription')}
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <form onSubmit={handleDisable}>
                            <Button
                                variant="destructive"
                                type="submit"
                                disabled={disableForm.processing}
                            >
                                {t('settings.account.twoFactor.disable')}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-start gap-4">
                        <Badge variant="destructive">
                            {t('settings.account.twoFactor.disabled')}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                            {t('settings.account.twoFactor.disabledDescription')}
                        </p>

                        {hasSetupData ? (
                            <Button onClick={() => setShowSetupModal(true)}>
                                {t('settings.account.twoFactor.continueSetup')}
                            </Button>
                        ) : (
                            <form onSubmit={handleEnable}>
                                <Button
                                    type="submit"
                                    disabled={enableForm.processing}
                                >
                                    {t('settings.account.twoFactor.enable')}
                                </Button>
                            </form>
                        )}
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </CardContent>
        </Card>
    );
}
