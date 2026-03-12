<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenantId = '01kk3xbvtv84esfjx1w9hktv82';

        $items = [

            [
                'category' => 'projet_general',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/piscine.jpeg',
                'caption' => 'Piscine Hills Garden',
            ],
            [
                'category' => 'projet_general',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/WhatsApp%20Image%202026-02-04%20at%201.58.20%20PM.jpeg',
                'caption' => 'Vue du projet Hills Garden',
            ],
            [
                'category' => 'projet_general',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/WhatsApp%20Image%202026-02-04%20at%201.58.20%20PM.jpeg',
                'caption' => 'Hills Garden - Vue générale',
            ],
            [
                'category' => 'projet_general',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/WhatsApp%20Image%202026-02-04%20at%201.58.20%20PM.jpeg',
                'caption' => 'Espaces verts du projet',
            ],
            [
                'category' => 'appartement_iris',
                'type' => 'video',
                'external_url' => 'https://res.cloudinary.com/dobsdkpwl/video/upload/v1770824792/sans_jardin_sd4g31.mp4',
                'caption' => 'Visite appartement IRIS',
            ],
            [
                'category' => 'appartement_iris',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/salon.jpeg',
                'caption' => 'Salon spacieux IRIS',
            ],
            [
                'category' => 'appartement_iris',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/WhatsApp%20Image%202026-02-04%20at%201.58.21%20PM%20(2).jpeg',
                'caption' => 'Cuisine équipée IRIS',
            ],
            [
                'category' => 'appartement_lotus',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/salon.jpeg',
                'caption' => 'Salon LOTUS',
            ],
            [
                'category' => 'appartement_lotus',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/salon.jpeg',
                'caption' => 'Suite parentale LOTUS',
            ],
            [
                'category' => 'appartement_lotus',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/chamber.jpeg',
                'caption' => 'Chambre LOTUS',
            ],
            [
                'category' => 'appartement_lotus',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/balcon.jpeg',
                'caption' => 'Balcon LOTUS',
            ],
            [
                'category' => 'projet_general',
                'type' => 'image',
                'external_url' => 'https://backend.hillsgardenalmaz.ma/aaca57cbc631010bbca9e73b31009b8926e.jpeg',
                'caption' => 'Façade principale',
            ],
            [
                'category' => 'pool',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/piscine.jpeg',
                'caption' => 'Piscine résidence',
            ],
            [
                'category' => 'pool',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/piscine.jpeg',
                'caption' => 'Piscine vue jardin',
            ],
            [
                'category' => 'pool',
                'type' => 'image',
                'external_url' => 'https://itlhwqgkdzvgoprppgne.supabase.co/storage/v1/object/public/Video_hillGarden/piscine.jpeg',
                'caption' => 'Piscine espace détente',
            ],

        ];

        foreach ($items as $item) {
            DB::table('media_assets')->insert([
                'id' => (string) Str::ulid(),
                'tenant_id' => $tenantId,
                'category' => $item['category'],
                'type' => $item['type'],
                'external_url' => $item['external_url'],
                'caption' => $item['caption'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
