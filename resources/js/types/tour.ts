import type { Step } from 'react-joyride';

export interface TourProgress {
    completed: boolean;
    completed_steps: string[];
    skipped_at: string | null;
}
export interface ToursData {
    [tourName: string]: TourProgress;
}
export interface TourConfig {
    name: string;
    route: string;
    steps: Step[];
}