import { useAppearance } from '@/hooks/use-appearance';

export default function AppLogo() {
    const { appearance } = useAppearance();

    return (
        <>
            {/* <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="ml-1 flex-1 justify-center">
                
                    {appearance === 'dark' ? (
                        <img
                            src="/logo-white.png"
                            alt="Logo"
                            className="size-15 fill-current text-white dark:text-black"
                        />
                    ) : (
                        <img
                            src="/logo-black.png"
                            alt="Logo"
                            className="size-15 fill-current text-black dark:text-white"
                        />
                    )}
            </div>
        </>
    );
}
