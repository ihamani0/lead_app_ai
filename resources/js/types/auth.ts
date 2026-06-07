import type { ToursData } from "./tour";

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    is_super_admin: boolean;
    has_password: boolean;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    welcome_dismissed_at: string | null;
    [key: string]: unknown;
    tenant: {
        name: string;
        slug: string;
        plan: string;
        is_low_credit: boolean;
        credit: number;
    };

};

export type Auth = {
    user: User;
    tours: ToursData;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
