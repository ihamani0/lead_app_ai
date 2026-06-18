<?php

namespace Database\Seeders;

use App\Models\n8nChatMessage;
use Illuminate\Database\Seeder;

class N8nChatMessageSeeder extends Seeder
{
    public function run(): void
    {
        $agentConfigId = '01ksam5khw746x551zz07dd8yf';

        $conversations = [
            [
                'session_id' => 'seed-test-session-1',
                'messages' => [
                    ['type' => 'human', 'content' => 'Bonjour, quels sont vos horaires d\'ouverture ?'],
                    ['type' => 'ai', 'content' => 'Nous sommes ouverts du lundi au samedi de 8h à 18h, fermés le dimanche.'],
                    ['type' => 'human', 'content' => 'Est-ce que vous faites aussi des projets commerciaux ?'],
                    ['type' => 'ai', 'content' => 'Oui, nous réalisons aussi des projets commerciaux : bureaux, magasins, entrepôts.'],
                ],
            ],
            [
                'session_id' => 'seed-test-session-2',
                'messages' => [
                    ['type' => 'human', 'content' => 'Vous êtes ouverts le samedi ?'],
                    ['type' => 'ai', 'content' => 'Oui, le samedi de 8h à 18h comme les autres jours. Le dimanche nous sommes fermés.'],
                    ['type' => 'human', 'content' => 'Quels types de projets proposez-vous ?'],
                    ['type' => 'ai', 'content' => 'Nous proposons des projets résidentiels (villas, appartements) et commerciaux (bureaux, locaux).'],
                    ['type' => 'human', 'content' => 'Est-ce que vous construisez aussi des piscines ?'],
                    ['type' => 'ai', 'content' => 'Oui, nous concevons et construisons des piscines sur mesure. Comptez 4 à 8 semaines selon la taille.'],
                ],
            ],
            [
                'session_id' => 'seed-test-session-3',
                'messages' => [
                    ['type' => 'human', 'content' => 'Jusqu\'à quelle heure êtes-vous ouvert en semaine ?'],
                    ['type' => 'ai', 'content' => 'En semaine, nous sommes ouverts de 8h à 18h du lundi au samedi.'],
                    ['type' => 'human', 'content' => 'Comment puis-je vous contacter pour un rendez-vous ?'],
                    ['type' => 'ai', 'content' => 'Vous pouvez nous joindre par téléphone, WhatsApp, ou email. Nous répondons sous 24h.'],
                    ['type' => 'human', 'content' => 'Est-ce que je peux obtenir un devis gratuit ?'],
                    ['type' => 'ai', 'content' => 'Oui, les devis sont gratuits. Contactez-nous pour planifier une visite.'],
                ],
            ],
            [
                'session_id' => 'seed-test-session-4',
                'messages' => [
                    ['type' => 'human', 'content' => 'Est-ce que vous avez un numéro de téléphone pour me renseigner ?'],
                    ['type' => 'ai', 'content' => 'Oui, notre standard est joignable au 0550 12 34 56, du lundi au samedi de 8h à 18h.'],
                    ['type' => 'human', 'content' => 'Quels types de projets avez-vous déjà réalisés ?'],
                    ['type' => 'ai', 'content' => 'Nous avons réalisé des villas, des immeubles résidentiels, des bureaux commerciaux et des rénovations complètes.'],
                ],
            ],
            [
                'session_id' => 'seed-test-session-5',
                'messages' => [
                    ['type' => 'human', 'content' => 'Faites-vous des travaux de rénovation ?'],
                    ['type' => 'ai', 'content' => 'Oui, nous faisons des rénovations complètes : cuisine, salle de bain, façades, toiture.'],
                    ['type' => 'human', 'content' => 'Comment on fait pour vous contacter directement ?'],
                    ['type' => 'ai', 'content' => 'Vous pouvez nous appeler au 0550 12 34 56, nous écrire sur WhatsApp, ou passer à l\'agence à Alger.'],
                    ['type' => 'human', 'content' => 'Quels sont les délais de livraison pour une villa ?'],
                    ['type' => 'ai', 'content' => 'Pour une villa, comptez 6 à 12 mois selon la superficie et les finitions.'],
                ],
            ],
        ];

        $now = now();

        foreach ($conversations as $convIndex => $conversation) {
            foreach ($conversation['messages'] as $msgIndex => $msg) {
                $messageData = [
                    'data' => [
                        'content' => $msg['content'],
                        'type' => $msg['type'],
                        'additional_kwargs' => [
                            'agent_config_id' => $agentConfigId,
                        ],
                    ],
                    'type' => $msg['type'],
                ];

                n8nChatMessage::create([
                    'session_id' => $conversation['session_id'],
                    'message' => $messageData,
                    'created_at' => $now->copy()->subMinutes(count($conversation['messages']) * 5 - $msgIndex * 5),
                    'updated_at' => $now,
                ]);
            }
        }

        $this->command->info('Seeded '.count($conversations).' conversations ('.(collect($conversations)->sum(fn ($c) => count($c['messages']))).' messages)');
    }
}
