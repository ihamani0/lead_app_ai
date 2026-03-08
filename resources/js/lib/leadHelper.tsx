import { Flame, Snowflake, ThermometerSun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export const getTempBadge = (temp: string) => {
    switch (temp?.toUpperCase()) {
        case 'HOT':
            return (
                <Badge className="border-red-200 bg-red-100 text-red-800 hover:bg-red-100">
                    <Flame className="mr-1 h-3 w-3" /> Hot
                </Badge>
            );
        case 'WARM':
            return (
                <Badge className="border-orange-200 bg-orange-100 text-orange-800 hover:bg-orange-100">
                    <ThermometerSun className="mr-1 h-3 w-3" /> Warm
                </Badge>
            );
        case 'COLD':
            return (
                <Badge className="border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Snowflake className="mr-1 h-3 w-3" /> Cold
                </Badge>
            );
        default:
            return <Badge variant="outline">New</Badge>;
    }
};
