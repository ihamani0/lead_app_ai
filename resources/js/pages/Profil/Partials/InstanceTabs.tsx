import { motion } from 'framer-motion';
import type { EvolutionInstance } from '@/types';
import { InstanceSettings } from './InstanceSettings';

interface Props {
    instance: EvolutionInstance;
}

export function InstanceTabs({ instance }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <InstanceSettings
                instanceName={instance.instance_name}
                phoneNumber={instance.phone_number}
                connectedAt={instance.connected_at}
                agentConfig={instance.agent_config}
            />
        </motion.div>
    );
}
