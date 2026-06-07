import type { EvolutionInstance } from './index';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardFormData {
    instance_name: string;
    display_name: string;
    phone_number: string;
    instance: EvolutionInstance | null;
    qrCode: string | null;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    agent_name: string;
    sector: string;
    languages: string[];
    main_objective: string;
    tone: string;
    response_style: string;
    greeting_message: string;
    call_to_action: string;
    max_response_length: string;
    knowledge_mode: string;
    google_maps_url: string;
    calendar_url: string;
    additional_info: string;
    prompt: string;
    knowledge_files: File[];
    media_files: File[];
}

export interface WizardProps {
    availableInstances: EvolutionInstance[];
}

export const SECTORS = [
    { value: 'immobilier', labelKey: 'wizard.sectors.immobilier' },
    { value: 'automobile', labelKey: 'wizard.sectors.automobile' },
    { value: 'assurance', labelKey: 'wizard.sectors.assurance' },
    { value: 'banque', labelKey: 'wizard.sectors.banque' },
    { value: 'sante', labelKey: 'wizard.sectors.sante' },
    { value: 'education', labelKey: 'wizard.sectors.education' },
    { value: 'commerce', labelKey: 'wizard.sectors.commerce' },
    { value: 'voyage', labelKey: 'wizard.sectors.voyage' },
    { value: 'restauration', labelKey: 'wizard.sectors.restauration' },
    { value: 'service', labelKey: 'wizard.sectors.service' },
    { value: 'autre', labelKey: 'wizard.sectors.autre' },
] as const;

export const OBJECTIVES = [
    { value: 'generer_leads', labelKey: 'wizard.objectives.generer_leads' },
    { value: 'support_client', labelKey: 'wizard.objectives.support_client' },
    { value: 'information', labelKey: 'wizard.objectives.information' },
    { value: 'vente', labelKey: 'wizard.objectives.vente' },
    { value: 'qualification', labelKey: 'wizard.objectives.qualification' },
    { value: 'prise_rdv', labelKey: 'wizard.objectives.prise_rdv' },
] as const;

export const TONES = [
    { value: 'professionnel', labelKey: 'wizard.tones.professionnel' },
    { value: 'amical', labelKey: 'wizard.tones.amical' },
    { value: 'formel', labelKey: 'wizard.tones.formel' },
    { value: 'enthousiaste', labelKey: 'wizard.tones.enthousiaste' },
    { value: 'pedagogue', labelKey: 'wizard.tones.pedagogue' },
    { value: 'humoristique', labelKey: 'wizard.tones.humoristique' },
] as const;

export const LANGUAGES = [
    { value: 'francais', labelKey: 'wizard.languages.francais' },
    { value: 'arabe', labelKey: 'wizard.languages.arabe' },
    { value: 'anglais', labelKey: 'wizard.languages.anglais' },
    { value: 'darija', labelKey: 'wizard.languages.darija' },
    { value: 'espagnol', labelKey: 'wizard.languages.espagnol' },
    { value: 'allemand', labelKey: 'wizard.languages.allemand' },
    { value: 'bilingue_fr_ar', labelKey: 'wizard.languages.bilingue_fr_ar' },
    { value: 'bilingue_fr_en', labelKey: 'wizard.languages.bilingue_fr_en' },
] as const;

export const RESPONSE_STYLES = [
    { value: 'concis', labelKey: 'wizard.response_styles.concis' },
    { value: 'detaillee', labelKey: 'wizard.response_styles.detaillee' },
    { value: 'equilibree', labelKey: 'wizard.response_styles.equilibree' },
] as const;

export const CALL_TO_ACTIONS = [
    { value: 'visite', labelKey: 'wizard.call_to_actions.visite' },
    { value: 'devis', labelKey: 'wizard.call_to_actions.devis' },
    { value: 'appel', labelKey: 'wizard.call_to_actions.appel' },
    { value: 'email', labelKey: 'wizard.call_to_actions.email' },
    { value: 'rdv', labelKey: 'wizard.call_to_actions.rdv' },
    { value: 'inscription', labelKey: 'wizard.call_to_actions.inscription' },
] as const;

export const KNOWLEDGE_MODES = [
    { value: 'strict', labelKey: 'wizard.knowledge_modes.strict' },
    { value: 'hybride', labelKey: 'wizard.knowledge_modes.hybride' },
    { value: 'libre', labelKey: 'wizard.knowledge_modes.libre' },
] as const;

export const DEFAULT_WIZARD_FORM: WizardFormData = {
    instance_name: '',
    display_name: '',
    phone_number: '',
    instance: null,
    qrCode: null,
    connectionStatus: 'disconnected',
    agent_name: '',
    sector: '',
    languages: ['francais'],
    main_objective: '',
    tone: 'professionnel',
    response_style: 'equilibree',
    greeting_message: '',
    call_to_action: '',
    max_response_length: '',
    knowledge_mode: 'strict',
    google_maps_url: '',
    calendar_url: '',
    additional_info: '',
    prompt: '',
    knowledge_files: [],
    media_files: [],
};
