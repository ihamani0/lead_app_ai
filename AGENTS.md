# AGENTS.md - Developer Guide for This Project

## Project Overview

Laravel 12 + React 19 (Inertia.js) SaaS application.

- **Backend**: PHP 8.2+, Laravel 12, SQLite for testing
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI
- **Testing**: PHPUnit (PHP)

---

## Build / Lint / Test Commands

### PHP (Laravel)

| Command              | Description                                          |
| -------------------- | ---------------------------------------------------- |
| `composer run test`  | Run lint + tests                                     |
| `composer run lint`  | Run Pint linter only                                 |
| `composer run dev`   | Full dev server (PHP + Vite + Queue + Reverb + Logs) |
| `composer run start` | Simple dev server (PHP + Vite)                       |

**Running a single PHP test:**

```bash
php artisan test tests/Feature/DashboardTest.php
php artisan test --filter=test_guests_are_redirected_to_the_login_page
```

### JavaScript/TypeScript

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `npm run build`  | Build frontend assets        |
| `npm run dev`    | Start Vite dev server        |
| `npm run lint`   | Run ESLint with auto-fix     |
| `npm run format` | Run Prettier with auto-fix   |
| `npm run types`  | Run TypeScript type checking |

---

## Code Style

### PHP

- **Formatter**: Laravel Pint (preset: `laravel`)
- **Run**: `composer run lint` or `pint`

### JavaScript/TypeScript

- **Formatter**: Prettier (tabWidth: 4, singleQuote, semi)
- **Linter**: ESLint with TypeScript support
- **Config**: `eslint.config.js`, `.prettierrc`, `tsconfig.json`

---

## Import Conventions

### TypeScript/React

Use explicit type imports:

```typescript
import type { FC } from 'react';
import type { Lead } from '@/types';
import { type ClassValue, clsx } from 'clsx';
```

Import order (enforced by ESLint):

1. Built-in (node) → 2. External (npm) → 3. Internal (`@/`) → 4. Relative

### PHP

Laravel convention with imports at top of file:

```php
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;
```

---

## TypeScript Guidelines

- **Strict mode**: Enabled in `tsconfig.json`
- **Type imports**: Always use `import type { ... }` for types
- **No implicit any**: Enabled
- **Path alias**: Use `@/` for `resources/js/`

---

## Naming Conventions

### TypeScript/React

- **Components**: PascalCase (`LeadCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLeadStore.ts`)
- **Utils**: camelCase (`leadHelper.ts`)
- **Types**: PascalCase (`Lead.ts`)

### PHP

- **Classes**: PascalCase (`LeadController`)
- **Methods**: camelCase (`index()`, `show()`)
- **Variables**: camelCase (`$lead`)
- **Database columns**: snake_case (`tenant_id`)

---

## Error Handling

### PHP/Laravel

```php
public function show(Request $request, $id)
{
    $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
    return Inertia::render('Leads/Show', ['lead' => $lead]);
}

try {
    $instance->save();
} catch (\Exception $e) {
    return back()->with('error', 'Failed to save instance.');
}
```

### React/TypeScript

```typescript
const [error, setError] = useState<string | null>(null);

const handleSubmit = async () => {
    try {
        await post('/api/leads', data);
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
    }
};
```

---

## Component Patterns

### React Components

- Use functional components with `type FC<T>` for typed props
- Components: `resources/js/components/`
- Pages: `resources/js/pages/`
- UI primitives: `resources/js/components/ui/`

```typescript
import type { FC } from 'react';

interface LeadCardProps {
    lead: Lead;
    onEdit?: () => void;
}

export const LeadCard: FC<LeadCardProps> = ({ lead, onEdit }) => {
    return <Card>{lead.name}</Card>;
};
```

### Tailwind CSS

Use `cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<Button className={cn("base", isActive && "active")} />
```

---

## Testing Conventions

### PHP Tests (PHPUnit)

- Tests in `tests/Feature/` and `tests/Unit/`
- Use `RefreshDatabase` trait for database tests
- Naming: `TestNameTest.php`

```php
class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }
}
```

---

## Common Paths

| Path                       | Description         |
| -------------------------- | ------------------- |
| `resources/js/`            | Frontend source     |
| `resources/js/components/` | React components    |
| `resources/js/pages/`      | Inertia pages       |
| `app/Http/Controllers/`    | Laravel controllers |
| `app/Models/`              | Eloquent models     |
| `tests/`                   | PHPUnit tests       |
| `database/migrations/`     | Migrations          |

---

## Development Workflow

1. Start: `composer run dev` or `composer run start`
2. Make changes
3. Run linting: `composer run lint` + `npm run lint`
4. Run tests: `composer run test`
5. Build: `npm run build`

[logs] │ Instance issam-issam-A6Na updated to connected │
[logs] └────────────────────────────────── POST: /webhooks/evolution • Auth ID: guest ┘
[server] 2026-03-16 13:21:05 /webhooks/evolution ........................ ~ 500.68ms
[queue] 2026-03-16 12:21:07 App\Events\InstanceConnectionUpdated ........... RUNNING
[queue] 2026-03-16 12:21:07 App\Events\InstanceConnectionUpdated ..... 128.91ms DONE
[logs] ┌ 12:21:10 INFO ───────────────────────────────────────────────────────────────┐
[logs] │ Evolution Webhook: │
[logs] └ POST: /webhooks/evolution • Auth ID: guest • event: connection.update • instance: issam-issam-A6Na • data: array ( 'instance' => 'issam-issam-A6Na', 'state' => 'connecting', 'statusReason' => 200, ) • destination: http://172.18.0.1:8000/webhooks/evolution • date_time: 2026-03-16T09:10:35.194Z • server_url: http://localhost:8080 • apikey: NULL ┘
[logs] ┌ 12:21:10 INFO ───────────────────────────────────────────────────────────────┐
[logs] │ Instance issam-issam-A6Na updated to connecting │
[logs] └────────────────────────────────── POST: /webhooks/evolution • Auth ID: guest ┘
[server] 2026-03-16 13:21:10 /webhooks/evolution .............................. ~ 1s
[queue] 2026-03-16 12:21:12 App\Events\InstanceConnectionUpdated ........... RUNNING
[queue] 2026-03-16 12:21:12 App\Events\InstanceConnectionUpdated ...... 78.29ms DONE
