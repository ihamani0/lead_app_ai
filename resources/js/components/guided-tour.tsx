import type { FC } from 'react';
import { useTour } from '@/hooks/use-tour';
import type { ToursData } from '@/types/tour';
interface GuidedTourProps {
    toursData: ToursData;
    routeName: string;
}
export const GuidedTour: FC<GuidedTourProps> = ({ toursData, routeName }) => {
    const { Tour } = useTour({ toursData, routeName });
    return <>{Tour}</>;
};
