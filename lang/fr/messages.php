<?php

return [

    'success' => [

        'instance_create' => 'Instance créée avec succès !',
        'instance_restor' => 'Instance restaurée ! Récupérez le code QR pour vous reconnecter.',
        'instance_restarting' => 'Redémarrage de l\'instance...',
        'instance_disconnected' => 'Instance déconnectée. Vous pouvez vous reconnecter à tout moment.',
        'instance_deleted' => 'Instance supprimée. Elle peut être restaurée plus tard.',
        'instance_force_deleted' => 'Instance définitivement supprimée.',
        'instance_already_disconnected' => 'L\'instance est déjà déconnectée.',
        'instance_not_deleted' => 'L\'instance n\'est pas supprimée.',

        'connected_agent' => 'Agent IA connecté avec succès !',
        'updated_agent' => 'Paramètres de l\'agent mis à jour avec succès !',
        'disconnected_agent' => 'Agent IA déconnecté.',

        'lead_updated_manually' => 'Prospect mis à jour manuellement.',

        'document_deleted' => 'Document supprimé avec succès.',
        'document_uploaded' => 'Document téléchargé ! L\'IA est en train de le traiter.',

        'qualification_triggered' => 'Qualification déclenchée avec succès !',
        'qualification_in_progress' => 'Qualification en cours...',

        'agent_created' => 'Agent créé avec succès !',

    ],

    'error' => [
        'instance_create' => "Échec de la création de l'instance.",
        'instance_disconnect' => 'Échec de la déconnexion de l\'instance.',
        'instance_destroy' => 'Échec de la suppression de l\'instance.',
        'instance_force_destroy' => 'Échec de la suppression définitive : :message',
        'instance_restor' => 'Échec de la restauration de l\'instance.',
        'instance_recreate' => 'Échec de la recréation dans Evolution : :message',

        'no_found_agent' => 'Aucun agent actif trouvé.',
        'document_uploaded' => 'Échec du déclenchement de l\'ingestion IA.',

    ],

    'super_admin' => [
        'dashboard' => [
            'title' => 'Tableau de bord Super Admin',
            'subtitle' => 'Vue d\'ensemble du système et gestion des tenants',
            'stats' => [
                'total_tenants' => 'Total Tenants',
                'active' => 'actif',
                'inactive' => 'inactif',
                'total_users' => 'Total Utilisateurs',
                'total_tokens' => 'Total Jetons',
                'token_rate' => 'Taux',
                'low_tokens' => 'Alertes jetons faibles',
                'tenants_below' => 'tenants en dessous de 10K jetons',
                'plan_distribution' => 'Distribution des plans',
                'quick_actions' => 'Actions rapides',
            ],
            'recent_tenants' => 'Tenants récents',
            'table' => [
                'name' => 'Nom',
                'slug' => 'Slug',
                'plan' => 'Plan',
                'status' => 'Statut',
                'users' => 'Utilisateurs',
                'tokens' => 'Solde jetons',
                'actions' => 'Actions',
            ],
            'actions' => [
                'manage_tenants' => 'Gérer les tenants',
                'manage_plans' => 'Gérer les plans',
                'manage' => 'Gérer',
            ],
            'status' => [
                'active' => 'Actif',
                'inactive' => 'Inactif',
            ],
            'no_tenants' => 'Aucun tenant trouvé.',
        ],
    ],
];
