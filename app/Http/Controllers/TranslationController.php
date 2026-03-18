<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class TranslationController extends Controller
{
    /**
     * Serve translation JSON files.
     */
    public function show(string $locale)
    {
        $allowedLocales = ['en', 'fr'];

        if (! in_array($locale, $allowedLocales)) {
            abort(404);
        }

        $cacheKey = "translations.{$locale}";

        $translations = Cache::remember($cacheKey, 86400, function () use ($locale) {
            return $this->loadTranslations($locale);
        });

        $version = $this->getVersion($locale);

        return response()->json($translations)
            ->header('Cache-Control', 'public, max-age=86400')
            ->header('ETag', $version)
            ->header('Vary', 'Accept-Language');
    }

    /**
     * Load all translation files for a locale.
     */
    protected function loadTranslations(string $locale): array
    {
        $translations = [];
        $langPath = resource_path("js/lang/{$locale}");

        if (! File::exists($langPath)) {
            return $translations;
        }

        $files = File::files($langPath);

        foreach ($files as $file) {
            if ($file->getExtension() === 'json') {
                $filename = $file->getFilenameWithoutExtension();
                $content = File::get($file->getPathname());
                $data = json_decode($content, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    foreach ($data as $key => $value) {
                        $translations[$filename.'.'.$key] = $value;
                    }
                }
            }
        }

        return $translations;
    }

    /**
     * Clear translation cache (for development).
     */
    public function refresh(Request $request)
    {
        foreach (['en', 'fr'] as $locale) {
            Cache::forget("translations.{$locale}");
            Cache::forget("translations.{$locale}.version"); // 👈 also bust version cache
        }

        return response()->json(['status' => 'cache cleared']);
    }

    public function getVersion(string $locale): string
    {
        return Cache::remember("translations.{$locale}.version", 86400, function () use ($locale) {
            $langPath = resource_path("js/lang/{$locale}");

            if (! File::exists($langPath)) {
                return 'v0';
            }

            // Hash all file contents combined — changes if ANY file changes
            $hash = collect(File::files($langPath))
                ->filter(fn ($f) => $f->getExtension() === 'json')
                ->map(fn ($f) => md5_file($f->getPathname()))
                ->join('');

            return substr(md5($hash), 0, 8);
        });
    }
}
