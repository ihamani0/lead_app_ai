# AGENTS.md - Developer Guide for This Project

## Project Overview

This is a Laravel 12 + React 19 (Inertia.js) SaaS application. It uses:

- **Backend**: PHP 8.2+, Laravel 12, SQLite for testing
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Radix UI components
- **Build**: Vite 7
- **Testing**: PHPUnit (PHP), no JS tests currently

---

## Build / Lint / Test Commands

### PHP (Laravel)

| Command                  | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `composer run test`      | Run lint + tests                                     |
| `composer run test:lint` | Run Pint linter in test mode                         |
| `composer run lint`      | Run Pint linter only                                 |
| `composer run dev`       | Full dev server (PHP + Vite + Queue + Reverb + Logs) |
| `composer run start`     | Simple dev server (PHP + Vite)                       |
| `composer run setup`     | Initial project setup                                |

**Running a single PHP test:**

```bash
# Single test file
php artisan test tests/Feature/DashboardTest.php

# Single test method
php artisan test --filter=test_guests_are_redirected_to_the_login_page
```

### JavaScript/TypeScript

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run build`        | Build frontend assets        |
| `npm run dev`          | Start Vite dev server        |
| `npm run lint`         | Run ESLint with auto-fix     |
| `npm run format`       | Run Prettier with auto-fix   |
| `npm run format:check` | Check Prettier formatting    |
| `npm run types`        | Run TypeScript type checking |

**Running a single test:** (No JS test framework currently configured)

---

## Code Style Guidelines

### PHP

- **Formatter**: Laravel Pint (preset: `laravel`)
- **Run**: `composer run lint` or `pint`
- **Config**: `pint.json` (uses Laravel preset)

### JavaScript/TypeScript

- **Formatter**: Prettier (tabWidth: 4, singleQuote, semi)
- **Linter**: ESLint with TypeScript support
- **Config**: `eslint.config.js`, `.prettierrc`, `tsconfig.json`

**Run formatting:**

```bash
npm run format     # Auto-fix
npm run lint       # ESLint fix
composer run lint  # PHP lint
```

---

## Import Conventions

### TypeScript/React

Use explicit type imports with `import type`:

```typescript
import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
```

Import order (enforced by ESLint):

1. Built-in (node)
2. External (npm packages)
3. Internal (`@/` alias maps to `resources/js/*`)
4. Parent/Sibling/Index imports

Example:

```typescript
import { useState } from 'react';
import type { FC } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLeadStore } from '@/stores/leadStore';

import { LeadCard } from './LeadCard';
```

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
- **No implicit any**: Enabled - always type your variables
- **JSX**: Use `react-jsx` (automatic JSX runtime)
- **Path alias**: Use `@/` for `resources/js/`

```typescript
// Good
import type { FC } from 'react';
import type { Lead } from '@/types';

// Avoid
import { Lead } from '@/types'; // unless Lead has runtime values
```

---

## Naming Conventions

### TypeScript/React

- **Components**: PascalCase (`LeadCard.tsx`, `UserMenu.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLeadStore.ts`, `useFlash.ts`)
- **Utils**: camelCase (`leadHelper.tsx`, `mediaHelpers.ts`)
- **Types**: PascalCase (`Lead.ts`, `NavigationItem.ts`)
- **Files with components**: Include component name (`button.tsx`, `card.tsx`)

### PHP

- **Classes**: PascalCase (`LeadController`, `User`)
- **Methods**: camelCase (`index()`, `show()`, `updateLead()`)
- **Variables**: camelCase (`$lead`, `$tenantId`)
- **Database columns**: snake_case (`tenant_id`, `created_at`)

---

## Error Handling

### PHP/Laravel

```php
// Controller example
public function show(Request $request, $id)
{
    $lead = Lead::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
    return Inertia::render('Leads/Show', ['lead' => $lead]);
}

// Use try-catch for complex operations
try {
    $instance->save();
} catch (\Exception $e) {
    return back()->with('error', 'Failed to save instance.');
}
```

### React/TypeScript

```typescript
// Use proper error states
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

- Use functional components with explicit return types for complex components
- Use `type FC<T> = React.FC<T>` for typed props
- Keep components in `resources/js/components/`
- Page components in `resources/js/pages/`
- UI primitives in `resources/js/components/ui/`

```typescript
import type { FC } from 'react';

interface LeadCardProps {
    lead: Lead;
    onEdit?: () => void;
}

export const LeadCard: FC<LeadCardProps> = ({ lead, onEdit }) => {
    return (
        <Card>
            <CardHeader>{lead.name}</CardHeader>
        </Card>
    );
};
```

### Tailwind CSS

- Use `cn()` utility for conditional classes (combines clsx + tailwind-merge)
- Follow Prettier's tailwind plugin formatting

```typescript
import { cn } from '@/lib/utils';

<Button className={cn(
    "base-styles",
    isActive && "active-styles"
)} />
```

---

## Testing Conventions

### PHP Tests (PHPUnit)

- Tests go in `tests/Feature/` and `tests/Unit/`
- Use `RefreshDatabase` trait for database tests
- Follow naming: `TestNameTest.php`

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

| Path                       | Description             |
| -------------------------- | ----------------------- |
| `resources/js/`            | Frontend source         |
| `resources/js/components/` | React components        |
| `resources/js/pages/`      | Inertia page components |
| `resources/js/lib/`        | Utilities               |
| `resources/js/hooks/`      | Custom React hooks      |
| `app/Http/Controllers/`    | Laravel controllers     |
| `app/Models/`              | Eloquent models         |
| `tests/`                   | PHPUnit tests           |
| `database/migrations/`     | Migrations              |

---

## Development Workflow

1. **Start dev server**: `composer run dev` or `composer run start`
2. **Make changes** to PHP or JS
3. **Run linting**:
    ```bash
    composer run lint  # PHP
    npm run lint      # JS/TS
    ```
4. **Run tests**: `composer run test`
5. **Build for production**: `npm run build`

---

## Key Dependencies

- Laravel 12, PHP 8.2+
- React 19, Inertia.js React adapter
- Tailwind CSS 4
- Radix UI (via @radix-ui/react-\*)
- Laravel Fortify (auth), Sanctum (API), Reverb (websockets)
- Spatie Medialibrary
