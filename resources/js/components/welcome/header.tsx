import { Link } from '@inertiajs/react'; // Assuming Inertia
import type { TFunction } from 'i18next'; // Update path if needed
import { dashboard, login, register } from '@/routes';
import type { Auth } from '@/types';
import { Button } from '../ui/button';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
    canRegister?: boolean;
    auth: Auth;
    t: TFunction;
}

export const Header = ({ canRegister = true, auth, t }: HeaderProps) => (
    <nav
        style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(255,255,255,.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 40px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
                 
            >
                MYIA
            </span>
        </div>

        <div style={{ display: 'flex', gap: 32 }}>
            {/* Update with your actual translation keys if needed */}
            {['Features', 'Pricing', 'About', 'Showcase'].map((l) => (
                <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    style={{
                        textDecoration: 'none',
                        color: '#444',
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    {l}
                </a>
            ))}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <LanguageSwitcher />

            {auth.user ? (
                <Link
                    href={dashboard()}
                    className="btn-primary"
                    style={{ padding: '9px 20px', fontSize: 14 }}
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link
                        href={login()}
                        style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: '#444',
                            textDecoration: 'none',
                        }}
                    >
                        Log in
                    </Link>
                    {canRegister && (
                        <Button asChild>
                            <Link
                                href={register()}
                                style={{ padding: '9px 20px', fontSize: 14 }}
                            >
                                {t('welcome.buttonStarted', 'Get Started →')}
                            </Link>
                        </Button>
                    )}
                </>
            )}
        </div>
    </nav>
);
