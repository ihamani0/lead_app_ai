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

        'user_added_to_team' => 'Utilisateur ajouté au workspace avec succès',
        'invitation_sent' => 'Invitation envoyée avec succès',
        'invitation_removed' => 'Invitation annulée avec succès.',
        'joined_team' => 'Vous avez rejoint le workspace !',
        'member_role_updated' => 'Rôle du membre mis à jour avec succès.',
        'member_removed' => 'Membre retiré du workspace.',
        'role_created' => 'Rôle créé avec succès.',
        'role_updated' => 'Rôle mis à jour avec succès.',
        'role_deleted' => 'Rôle supprimé avec succès.',
        'workspace_created' => 'Workspace créé avec succès.',
        'workspace_updated' => 'Workspace mis à jour avec succès.',
        'workspace_deleted' => 'Workspace supprimé avec succès.',

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
        'user_exist' => 'le utilisateure est deja exsist',

        'user_already_exist' => 'Un compte avec ce mail existe deja. Veuillez vous connecter pour accepter linvitation',
        'role_not_found' => 'Role non trouve',
        'user_not_found' => 'User non trouve',
        'cross_tenant_invite_not_allowed' => 'Vous ne pouvez pas inviter des utilisateurs d\'un autre locataire.',
        'user_already_member' => 'Cet utilisateur est déjà membre.',
        'user_not_member' => "Cet utilisateur n'est pas membre de ce workspace.",
        'invitation_already_accepted' => 'Cette invitation a déjà été acceptée.',
        'invitation_expired' => 'Cette invitation a expiré.',
        'cannot_remove_owner' => 'Impossible de supprimer le propriétaire du workspace.',
        'cannot_delete_owner_role' => 'Impossible de supprimer le rôle propriétaire.',
        'invitation_accept_failed' => 'Échec de l\'acceptation de l\'invitation : :message',

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
