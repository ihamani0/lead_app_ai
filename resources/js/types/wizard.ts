import type { EvolutionInstance } from './index';

export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardFormData {
    instance_name: string;
    display_name: string;
    phone_number: string;
    instance: EvolutionInstance | null;
    qrCode: string | null;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    agent_name: string;
    languages: string[];
    primary_objective: string;
    tone: string;
    google_maps_url: string;
    calendar_url: string;
    additional_info: string;
    prompt: string;
    knowledge_files: File[];
}

export interface WizardProps {
    availableInstances: EvolutionInstance[];
}

export const OBJECTIVES = [
    { value: 'answer_questions', labelKey: 'wizard.objectives.answer_questions' },
    { value: 'generate_leads', labelKey: 'wizard.objectives.generate_leads' },
    { value: 'customer_support', labelKey: 'wizard.objectives.customer_support' },
    { value: 'sales_assistant', labelKey: 'wizard.objectives.sales_assistant' },
] as const;

export const TONES = [
    { value: 'professional', labelKey: 'wizard.tones.professional' },
    { value: 'friendly', labelKey: 'wizard.tones.friendly' },
    { value: 'neutral', labelKey: 'wizard.tones.neutral' },
    { value: 'dynamic', labelKey: 'wizard.tones.dynamic' },
] as const;

export const LANGUAGES = [
    { value: 'en', labelKey: 'wizard.languages.en' },
    { value: 'fr', labelKey: 'wizard.languages.fr' },
    { value: 'ar', labelKey: 'wizard.languages.ar' },
    { value: 'es', labelKey: 'wizard.languages.es' },
    { value: 'de', labelKey: 'wizard.languages.de' },
] as const;
