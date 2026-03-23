import { Link, router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { LogOut, Moon, Sun } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import type { User } from '@/types';
type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const themeOptions: {
        value: Appearance;
        icon: LucideIcon;
        label: string;
    }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
    ];

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuGroup>
                <div className="px-2 py-1.5">
                    <span className="text-xs text-neutral-500">Theme</span>
                    <div className="mt-1 flex gap-1">
                        {themeOptions.map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => updateAppearance(value)}
                                className={cn(
                                    'flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-sm transition-colors',
                                    appearance === value
                                        ? 'bg-neutral-200 dark:bg-neutral-700/30'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50',
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
