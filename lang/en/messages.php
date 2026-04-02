<?php

return [

    'success' => [

        'instance_create' => 'Instance created successfully!',
        'instance_restor' => 'Instance restored! Fetch QR code to reconnect.',
        'instance_restarting' => 'Instance restarting...',
        'instance_disconnected' => 'Instance disconnected. You can reconnect anytime.',
        'instance_deleted' => 'Instance deleted. Can be restored later.',
        'instance_force_deleted' => 'Instance permanently removed.',
        'instance_already_disconnected' => 'Instance is already disconnected.',
        'instance_not_deleted' => 'Instance is not deleted.',

        'connected_agent' => 'AI Agent successfully connected!',
        'updated_agent' => 'Agent settings updated successfully!',
        'disconnected_agent' => 'AI Agent disconnected.',

        'lead_udated_manually' => 'Lead updated manually.',

        'document_deleted' => 'Document deleted successfully.',
        'document_uploaded' => 'Document uploaded! AI is processing it.',

        'qualification_triggered' => 'Qualification triggered successfully!',
        'qualification_in_progress' => 'Qualification in progress...',

        'agent_created' => 'Agent created successfully!',

    ],

    'error' => [
        'instance_create' => 'Failed to create instance.',
        'instance_disconnect' => 'Failed to disconnect instance.',
        'instance_destroy' => 'Failed to delete instance.',
        'instance_force_destroy' => 'Force delete failed: :message',
        'instance_restor' => 'Failed to restore instance.',
        'instance_recreate' => 'Failed to recreate in Evolution: :message',

        'no_found_agent' => 'No active agent found.',
        'document_uploaded' => 'Failed to trigger AI ingestion.',

    ],
];
