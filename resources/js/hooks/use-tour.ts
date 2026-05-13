import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useJoyride, STATUS } from 'react-joyride';
import { getTourForRoute } from '@/config/tour';
import type { ToursData } from '@/types/tour';

interface UseTourOptions {
    toursData: ToursData;
    routeName: string;
}

export function useTour({ toursData, routeName }: UseTourOptions) {
    const { t, i18n } = useTranslation();
    const tourConfig = getTourForRoute(routeName);
    const tourProgress = tourConfig ? toursData[tourConfig.name] : undefined;

    const shouldRun =
        tourConfig &&
        tourConfig.steps.length > 0 &&
        !tourProgress?.completed &&
        !tourProgress?.skipped_at;

    const [run, setRun] = useState(shouldRun ?? false);

    const translatedSteps = useMemo(() => {
        if (!tourConfig) return [];
        return tourConfig.steps.map((step) => ({
            ...step,
            content: t(step.content as string),
        }));
    }, [tourConfig, t, i18n.language]);

    const handleTourEnd = useCallback(
        (status: string) => {
            if (!tourConfig) return;

            if (status === STATUS.FINISHED) {
                axios
                    .post(`/api/tour/${tourConfig.name}/complete`)
                    .then(() => setRun(false))
                    .catch((error) =>
                        console.error('Failed to complete tour:', error),
                    );
            } else if (status === STATUS.SKIPPED) {
                axios
                    .post(`/api/tour/${tourConfig.name}/skip`)
                    .then(() => setRun(false))
                    .catch((error) =>
                        console.error('Failed to skip tour:', error),
                    );
            }
        },
        [tourConfig],
    );

    const handleStepAfter = useCallback(
        (stepIndex: number, step: { id?: string }) => {
            if (!tourConfig || !step?.id) return;

            axios
                .post(`/api/tour/${tourConfig.name}/step`, {
                    step_id: step.id,
                })
                .catch((error) => console.error('Failed to save step:', error));
        },
        [tourConfig],
    );

    const { Tour, on, state } = useJoyride({
        run,
        steps: translatedSteps,
        continuous: true,
        debug: false,
        options: {
            buttons: ['back', 'close', 'primary', 'skip'],
            showProgress: true,
            primaryColor: '#10b981',
            backgroundColor: '#ffffff',
            textColor: '#1f2937',
            overlayColor: 'rgba(0, 0, 0, 0.5)',
            arrowColor: '#ffffff',
            targetWaitTimeout: 3000,
            scrollOffset: 20,
            scrollToFirstStep: false,
            skipScroll: false,
        },
        onEvent: (data) => {
            console.log('[Joyride Event]', data.type, data.status);

            if (data.type === 'step:after' && data.step?.index !== undefined) {
                handleStepAfter(data.step.index, data.step);
            }

            if (data.type === 'tour:end') {
                handleTourEnd(data.status);
            }
        },
    });

    useEffect(() => {
        console.log('[Tour Debug] routeName:', routeName);
        console.log('[Tour Debug] tourConfig:', tourConfig);
        console.log('[Tour Debug] tourProgress:', tourProgress);
        console.log('[Tour Debug] shouldRun:', shouldRun);
        console.log('[Tour Debug] steps:', translatedSteps.length);
        console.log('[Tour Debug] run state:', run);
        console.log('[Tour Debug] Joyride state:', state);
    }, [
        routeName,
        tourConfig,
        tourProgress,
        shouldRun,
        translatedSteps,
        run,
        state,
    ]);

    useEffect(() => {
        setRun(shouldRun ?? false);
    }, [routeName, shouldRun]);

    return {
        Tour,
        run,
        setRun,
    };
}
