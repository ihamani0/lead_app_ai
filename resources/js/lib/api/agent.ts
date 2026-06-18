import axios from 'axios';
import workspaces from '@/routes/workspaces';

export const agentApi = {
    fetchQr: (slug: string, agentId: string) =>
        axios.post(workspaces.agents.qr({ slug, agent: agentId }).url),

    disconnect: (slug: string, agentId: string) =>
        axios.post(workspaces.agents.disconnect({ slug, agent: agentId }).url),

    restart: (slug: string, agentId: string) =>
        axios.put(workspaces.agents.restart({ slug, agent: agentId }).url),

    createInstance: (
        slug: string,
        agentId: string,
        data: {
            instance_name: string;
            display_name?: string;
            phone_number?: string;
        },
    ) =>
        axios.post(
            workspaces.agents.createInstance({ slug, agent: agentId }).url,
            data,
        ),
};
