import { Link, router } from '@inertiajs/react';
import { CreditCard, Crown, LogOut, Settings, Shield, SlidersHorizontal } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { logout } from '@/routes';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { t } = useTranslation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        href="/settings/profile"
                        className="block w-full cursor-pointer"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 size-4" />
                        {t('settings.userMenu.accountSettings')}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/account/billing"
                        className="block w-full cursor-pointer"
                        prefetch
                        onClick={cleanup}
                    >
                        <CreditCard className="mr-2 size-4" />
                        {t('settings.userMenu.billing')}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/account/subscriptions"
                        className="block w-full cursor-pointer"
                        onClick={cleanup}
                    >
                        <Crown className="mr-2 size-4" />
                        {t('settings.userMenu.subscriptions')}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/settings/two-factor"
                        className="block w-full cursor-pointer"
                        prefetch
                        onClick={cleanup}
                    >
                        <Shield className="mr-2 size-4" />
                        {t('settings.userMenu.security')}
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href="/settings/appearance"
                        className="block w-full cursor-pointer"
                        prefetch
                        onClick={cleanup}
                    >
                        <SlidersHorizontal className="mr-2 size-4" />
                        {t('settings.userMenu.preferences')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 size-4" />
                    {t('settings.userMenu.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}
