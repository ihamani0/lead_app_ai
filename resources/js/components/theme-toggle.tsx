'use client';

import { Moon, Sun, Monitor } from 'lucide-react';


import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="xs" className="gap-2">
                    <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => updateAppearance('light')}
                    className={appearance === 'light' ? 'bg-accent' : ''}
                >
                    <Sun className="mr-2" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('dark')}
                    className={appearance === 'dark' ? 'bg-accent' : ''}
                >
                    <Moon className="mr-2" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateAppearance('system')}
                    className={appearance === 'system' ? 'bg-accent' : ''}
                >
                    <Monitor className="mr-2" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
