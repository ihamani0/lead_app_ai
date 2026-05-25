import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { useTranslation } from '@/hooks/use-translation';
import SettingsLayout from '@/layouts/settings/layout';
import WorkspaceLayout from '@/layouts/workspace-layout';

export default function Appearance() {
    const { t } = useTranslation();

    return (
        <WorkspaceLayout title={t('settings.appearance.title')}>
            <h1 className="sr-only">{t('settings.appearance.title')}</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t('settings.appearance.heading')}
                        description={t('settings.appearance.headingDescription')}
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </WorkspaceLayout>
    );
}
