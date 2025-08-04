== Project Prompt ==
Generated: 2025-08-04T16:20:08.289Z
Source Directory: /home/evai/my/trip-scheduler
Included Files: 148
Total Size: 299.68 KB
Format: structured
====================

=== Project File Structure ===
├── apps
│   ├── client
│   │   ├── mocks
│   │   │   └── tauri-sql-stub.ts
│   │   ├── service-worker
│   │   │   ├── lib
│   │   │   │   ├── message-handlers.ts
│   │   │   │   └── utils.ts
│   │   │   ├── model
│   │   │   │   └── types.ts
│   │   │   ├── cache-manager.ts
│   │   │   ├── sw.ts
│   │   │   └── tsconfig.json
│   │   ├── src
│   │   │   ├── components
│   │   │   │   ├── 01.kit
│   │   │   │   │   ├── calendar
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── calendar.vue
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── calendar-popover
│   │   │   │   │   │   ├── composables
│   │   │   │   │   │   │   └── use-calendar-popover.ts
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── calendar-popover.vue
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── dialog-with-close
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── dialog-with-close.vue
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── inline-editor
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── inline-editor-wrapper.vue
│   │   │   │   │   │   │   └── inline-editor.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── kit-btn
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── kit-btn.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── skeleton
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── skeleton-wrapper.vue
│   │   │   │   │   │   │   └── skeleton.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── time-field
│   │   │   │   │       ├── ui
│   │   │   │   │       │   ├── index.ts
│   │   │   │   │       │   └── time-field.vue
│   │   │   │   │       └── index.ts
│   │   │   │   ├── 02.shared
│   │   │   │   │   ├── async-state-wrapper
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   └── async-state-wrapper.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── background-effects
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── background-effects.vue
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── error-placeholder
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   └── index.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── sync-indicator
│   │   │   │   │       ├── ui
│   │   │   │   │       │   ├── index.ts
│   │   │   │   │       │   └── sync-indicator.vue
│   │   │   │   │       └── index.ts
│   │   │   │   ├── 04.modules
│   │   │   │   │   ├── root
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── root.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── trip-info
│   │   │   │   │   │   ├── lib
│   │   │   │   │   │   │   └── helpers.ts
│   │   │   │   │   │   ├── models
│   │   │   │   │   │   │   └── types.ts
│   │   │   │   │   │   ├── store
│   │   │   │   │   │   │   └── trip-store.ts
│   │   │   │   │   │   ├── ui
│   │   │   │   │   │   │   ├── controls
│   │   │   │   │   │   │   │   ├── add-day-activity.vue
│   │   │   │   │   │   │   │   ├── days-controls.vue
│   │   │   │   │   │   │   │   ├── days-panel.vue
│   │   │   │   │   │   │   │   └── mode-switcher.vue
│   │   │   │   │   │   │   ├── day-activities
│   │   │   │   │   │   │   │   ├── sections
│   │   │   │   │   │   │   │   │   ├── description-section.vue
│   │   │   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   │   │   └── section-renderer.vue
│   │   │   │   │   │   │   │   ├── item.vue
│   │   │   │   │   │   │   │   └── list.vue
│   │   │   │   │   │   │   ├── day-header
│   │   │   │   │   │   │   │   └── index.vue
│   │   │   │   │   │   │   ├── states
│   │   │   │   │   │   │   │   └── trip-info-skeleton.vue
│   │   │   │   │   │   │   └── trip-info.vue
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   └── trip-list
│   │   │   │   │       ├── composables
│   │   │   │   │       │   └── use-trip-list.ts
│   │   │   │   │       ├── models
│   │   │   │   │       │   └── types.ts
│   │   │   │   │       ├── ui
│   │   │   │   │       │   ├── states
│   │   │   │   │       │   │   ├── trip-list-empty.vue
│   │   │   │   │       │   │   └── trip-list-skeleton.vue
│   │   │   │   │       │   ├── trip-card
│   │   │   │   │       │   │   ├── card-item.vue
│   │   │   │   │       │   │   └── card-skeleton.vue
│   │   │   │   │       │   ├── index.ts
│   │   │   │   │       │   ├── trip-list-content.vue
│   │   │   │   │       │   └── trip-list.vue
│   │   │   │   │       └── index.ts
│   │   │   │   └── 05.layouts
│   │   │   │       ├── default
│   │   │   │       │   ├── ui
│   │   │   │       │   │   ├── footer.vue
│   │   │   │       │   │   ├── header.vue
│   │   │   │       │   │   └── layout.vue
│   │   │   │       │   └── index.ts
│   │   │   │       └── empty
│   │   │   │           ├── ui
│   │   │   │           │   └── layout.vue
│   │   │   │           └── index.ts
│   │   │   ├── pages
│   │   │   │   ├── trip
│   │   │   │   │   ├── [id]
│   │   │   │   │   │   └── index.vue
│   │   │   │   │   └── list.vue
│   │   │   │   ├── not-found.vue
│   │   │   │   └── root.vue
│   │   │   ├── shared
│   │   │   │   ├── composables
│   │   │   │   │   ├── use-database.ts
│   │   │   │   │   ├── use-display.ts
│   │   │   │   │   └── use-sync.ts
│   │   │   │   ├── lib
│   │   │   │   │   └── router.ts
│   │   │   │   ├── services
│   │   │   │   │   ├── database
│   │   │   │   │   │   ├── clients
│   │   │   │   │   │   │   ├── mock.client.ts
│   │   │   │   │   │   │   ├── real.client.ts
│   │   │   │   │   │   │   └── trpc.client.ts
│   │   │   │   │   │   ├── lib
│   │   │   │   │   │   │   └── helpers.ts
│   │   │   │   │   │   ├── model
│   │   │   │   │   │   │   └── types.ts
│   │   │   │   │   │   ├── repositories
│   │   │   │   │   │   │   ├── mock
│   │   │   │   │   │   │   │   ├── day.mock.ts
│   │   │   │   │   │   │   │   ├── day.repository.ts
│   │   │   │   │   │   │   │   ├── trip.mock.ts
│   │   │   │   │   │   │   │   └── trip.repository.ts
│   │   │   │   │   │   │   ├── real
│   │   │   │   │   │   │   │   ├── day.repository.ts
│   │   │   │   │   │   │   │   └── trip.repository.ts
│   │   │   │   │   │   │   └── trpc
│   │   │   │   │   │   │       ├── day.repository.ts
│   │   │   │   │   │   │       └── trip.repository.ts
│   │   │   │   │   │   ├── connection.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── pwa
│   │   │   │   │   │   └── pwa.service.ts
│   │   │   │   │   ├── sync
│   │   │   │   │   │   └── sync.service.ts
│   │   │   │   │   └── trpc
│   │   │   │   │       └── trpc.service.ts
│   │   │   │   ├── store
│   │   │   │   │   └── sync.store.ts
│   │   │   │   └── types
│   │   │   │       ├── dts
│   │   │   │       │   ├── auto-imports.d.ts
│   │   │   │       │   └── env.d.ts
│   │   │   │       ├── models
│   │   │   │       │   ├── activity.ts
│   │   │   │       │   └── trip.ts
│   │   │   │       └── routes.ts
│   │   │   ├── types
│   │   │   │   └── dts
│   │   │   │       └── auto-imports.d.ts
│   │   │   ├── app.vue
│   │   │   └── main.ts
│   │   ├── src-tauri
│   │   │   ├── src
│   │   │   │   ├── cli.rs
│   │   │   │   ├── lib.rs
│   │   │   │   ├── main.rs
│   │   │   │   └── mock.rs
│   │   │   ├── build.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tauri.conf.json
│   │   ├── .eslintrc-auto-import.json
│   │   ├── eslint.config.ts
│   │   ├── package.json
│   │   ├── pwa-assets.config.ts
│   │   ├── tsconfig.json
│   │   └── tsconfig.node.json
│   └── server
│       ├── drizzle
│       │   └── meta
│       │       ├── _journal.json
│       │       ├── 0000_snapshot.json
│       │       └── 0001_snapshot.json
│       ├── src
│       │   ├── db
│       │   │   ├── index.ts
│       │   │   ├── migrate.ts
│       │   │   ├── schema.ts
│       │   │   └── seed.ts
│       │   ├── lib
│       │   │   ├── schemas.ts
│       │   │   └── trpc.ts
│       │   ├── modules
│       │   │   ├── day
│       │   │   │   ├── day.router.ts
│       │   │   │   └── procedures.ts
│       │   │   └── trip
│       │   │       ├── procedures.ts
│       │   │       └── trip.router.ts
│       │   ├── repositories
│       │   │   ├── day.repository.ts
│       │   │   └── trip.repository.ts
│       │   ├── index.ts
│       │   ├── router.ts
│       │   └── server.ts
│       ├── drizzle.config.ts
│       ├── eslint.config.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json
└── README.md
============================

=== File List ===
- apps/client/.eslintrc-auto-import.json (8.52 KB)
- apps/client/eslint.config.ts (0.21 KB)
- apps/client/mocks/tauri-sql-stub.ts (0.82 KB)
- apps/client/package.json (2.44 KB)
- apps/client/pwa-assets.config.ts (0.19 KB)
- apps/client/service-worker/cache-manager.ts (2.08 KB)
- apps/client/service-worker/lib/message-handlers.ts (1.16 KB)
- apps/client/service-worker/lib/utils.ts (5.42 KB)
- apps/client/service-worker/model/types.ts (2.43 KB)
- apps/client/service-worker/sw.ts (5.57 KB)
- apps/client/service-worker/tsconfig.json (0.22 KB)
- apps/client/src-tauri/build.rs (0.04 KB)
- apps/client/src-tauri/Cargo.toml (1.03 KB)
- apps/client/src-tauri/src/cli.rs (3.58 KB)
- apps/client/src-tauri/src/lib.rs (4.10 KB)
- apps/client/src-tauri/src/main.rs (0.18 KB)
- apps/client/src-tauri/src/mock.rs (3.07 KB)
- apps/client/src-tauri/tauri.conf.json (0.82 KB)
- apps/client/src/app.vue (0.84 KB)
- apps/client/src/components/01.kit/calendar-popover/composables/use-calendar-popover.ts (0.41 KB)
- apps/client/src/components/01.kit/calendar-popover/index.ts (0.02 KB)
- apps/client/src/components/01.kit/calendar-popover/ui/calendar-popover.vue (1.81 KB)
- apps/client/src/components/01.kit/calendar-popover/ui/index.ts (0.08 KB)
- apps/client/src/components/01.kit/calendar/index.ts (0.02 KB)
- apps/client/src/components/01.kit/calendar/ui/calendar.vue (4.96 KB)
- apps/client/src/components/01.kit/calendar/ui/index.ts (0.06 KB)
- apps/client/src/components/01.kit/dialog-with-close/index.ts (0.02 KB)
- apps/client/src/components/01.kit/dialog-with-close/ui/dialog-with-close.vue (3.00 KB)
- apps/client/src/components/01.kit/dialog-with-close/ui/index.ts (0.08 KB)
- apps/client/src/components/01.kit/inline-editor/index.ts (0.02 KB)
- apps/client/src/components/01.kit/inline-editor/ui/index.ts (0.15 KB)
- apps/client/src/components/01.kit/inline-editor/ui/inline-editor-wrapper.vue (0.61 KB)
- apps/client/src/components/01.kit/inline-editor/ui/inline-editor.vue (3.31 KB)
- apps/client/src/components/01.kit/kit-btn/index.ts (0.02 KB)
- apps/client/src/components/01.kit/kit-btn/ui/index.ts (0.05 KB)
- apps/client/src/components/01.kit/kit-btn/ui/kit-btn.vue (2.27 KB)
- apps/client/src/components/01.kit/skeleton/index.ts (0.02 KB)
- apps/client/src/components/01.kit/skeleton/ui/index.ts (0.13 KB)
- apps/client/src/components/01.kit/skeleton/ui/skeleton-wrapper.vue (0.92 KB)
- apps/client/src/components/01.kit/skeleton/ui/skeleton.vue (1.56 KB)
- apps/client/src/components/01.kit/time-field/index.ts (0.02 KB)
- apps/client/src/components/01.kit/time-field/ui/index.ts (0.06 KB)
- apps/client/src/components/01.kit/time-field/ui/time-field.vue (1.49 KB)
- apps/client/src/components/02.shared/async-state-wrapper/index.ts (0.09 KB)
- apps/client/src/components/02.shared/async-state-wrapper/ui/async-state-wrapper.vue (1.40 KB)
- apps/client/src/components/02.shared/background-effects/index.ts (0.02 KB)
- apps/client/src/components/02.shared/background-effects/ui/background-effects.vue (1.98 KB)
- apps/client/src/components/02.shared/background-effects/ui/index.ts (0.08 KB)
- apps/client/src/components/02.shared/error-placeholder/index.ts (0.07 KB)
- apps/client/src/components/02.shared/error-placeholder/ui/index.vue (1.65 KB)
- apps/client/src/components/02.shared/sync-indicator/index.ts (0.02 KB)
- apps/client/src/components/02.shared/sync-indicator/ui/index.ts (0.07 KB)
- apps/client/src/components/02.shared/sync-indicator/ui/sync-indicator.vue (8.36 KB)
- apps/client/src/components/04.modules/root/index.ts (0.02 KB)
- apps/client/src/components/04.modules/root/ui/index.ts (0.05 KB)
- apps/client/src/components/04.modules/root/ui/root.vue (3.77 KB)
- apps/client/src/components/04.modules/trip-info/index.ts (0.06 KB)
- apps/client/src/components/04.modules/trip-info/lib/helpers.ts (1.07 KB)
- apps/client/src/components/04.modules/trip-info/models/types.ts (0.22 KB)
- apps/client/src/components/04.modules/trip-info/store/trip-store.ts (10.57 KB)
- apps/client/src/components/04.modules/trip-info/ui/controls/add-day-activity.vue (0.96 KB)
- apps/client/src/components/04.modules/trip-info/ui/controls/days-controls.vue (3.76 KB)
- apps/client/src/components/04.modules/trip-info/ui/controls/days-panel.vue (6.97 KB)
- apps/client/src/components/04.modules/trip-info/ui/controls/mode-switcher.vue (1.24 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-activities/item.vue (8.59 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-activities/list.vue (3.50 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/description-section.vue (1.21 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/index.ts (0.17 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/section-renderer.vue (1.74 KB)
- apps/client/src/components/04.modules/trip-info/ui/day-header/index.vue (2.42 KB)
- apps/client/src/components/04.modules/trip-info/ui/states/trip-info-skeleton.vue (2.35 KB)
- apps/client/src/components/04.modules/trip-info/ui/trip-info.vue (2.11 KB)
- apps/client/src/components/04.modules/trip-list/composables/use-trip-list.ts (0.42 KB)
- apps/client/src/components/04.modules/trip-list/index.ts (0.02 KB)
- apps/client/src/components/04.modules/trip-list/models/types.ts (0.08 KB)
- apps/client/src/components/04.modules/trip-list/ui/index.ts (0.06 KB)
- apps/client/src/components/04.modules/trip-list/ui/states/trip-list-empty.vue (1.41 KB)
- apps/client/src/components/04.modules/trip-list/ui/states/trip-list-skeleton.vue (0.16 KB)
- apps/client/src/components/04.modules/trip-list/ui/trip-card/card-item.vue (10.85 KB)
- apps/client/src/components/04.modules/trip-list/ui/trip-card/card-skeleton.vue (1.96 KB)
- apps/client/src/components/04.modules/trip-list/ui/trip-list-content.vue (0.28 KB)
- apps/client/src/components/04.modules/trip-list/ui/trip-list.vue (0.89 KB)
- apps/client/src/components/05.layouts/default/index.ts (0.06 KB)
- apps/client/src/components/05.layouts/default/ui/footer.vue (1.33 KB)
- apps/client/src/components/05.layouts/default/ui/header.vue (4.00 KB)
- apps/client/src/components/05.layouts/default/ui/layout.vue (0.60 KB)
- apps/client/src/components/05.layouts/empty/index.ts (0.06 KB)
- apps/client/src/components/05.layouts/empty/ui/layout.vue (0.43 KB)
- apps/client/src/main.ts (0.37 KB)
- apps/client/src/pages/not-found.vue (0.08 KB)
- apps/client/src/pages/root.vue (0.45 KB)
- apps/client/src/pages/trip/[id]/index.vue (0.64 KB)
- apps/client/src/pages/trip/list.vue (0.19 KB)
- apps/client/src/shared/composables/use-database.ts (4.38 KB)
- apps/client/src/shared/composables/use-display.ts (3.90 KB)
- apps/client/src/shared/composables/use-sync.ts (2.20 KB)
- apps/client/src/shared/lib/router.ts (1.06 KB)
- apps/client/src/shared/services/database/clients/mock.client.ts (0.85 KB)
- apps/client/src/shared/services/database/clients/real.client.ts (1.33 KB)
- apps/client/src/shared/services/database/clients/trpc.client.ts (1.70 KB)
- apps/client/src/shared/services/database/connection.ts (0.46 KB)
- apps/client/src/shared/services/database/index.ts (1.17 KB)
- apps/client/src/shared/services/database/lib/helpers.ts (0.36 KB)
- apps/client/src/shared/services/database/model/types.ts (0.75 KB)
- apps/client/src/shared/services/database/repositories/mock/day.mock.ts (3.41 KB)
- apps/client/src/shared/services/database/repositories/mock/day.repository.ts (0.37 KB)
- apps/client/src/shared/services/database/repositories/mock/trip.mock.ts (1.86 KB)
- apps/client/src/shared/services/database/repositories/mock/trip.repository.ts (0.45 KB)
- apps/client/src/shared/services/database/repositories/real/day.repository.ts (0.59 KB)
- apps/client/src/shared/services/database/repositories/real/trip.repository.ts (1.03 KB)
- apps/client/src/shared/services/database/repositories/trpc/day.repository.ts (0.74 KB)
- apps/client/src/shared/services/database/repositories/trpc/trip.repository.ts (1.11 KB)
- apps/client/src/shared/services/pwa/pwa.service.ts (1.51 KB)
- apps/client/src/shared/services/sync/sync.service.ts (1.81 KB)
- apps/client/src/shared/services/trpc/trpc.service.ts (0.39 KB)
- apps/client/src/shared/store/sync.store.ts (1.65 KB)
- apps/client/src/shared/types/dts/auto-imports.d.ts (21.20 KB)
- apps/client/src/shared/types/dts/env.d.ts (0.34 KB)
- apps/client/src/shared/types/models/activity.ts (0.75 KB)
- apps/client/src/shared/types/models/trip.ts (2.42 KB)
- apps/client/src/shared/types/routes.ts (0.28 KB)
- apps/client/src/types/dts/auto-imports.d.ts (47.46 KB)
- apps/client/tsconfig.json (0.99 KB)
- apps/client/tsconfig.node.json (0.24 KB)
- apps/server/drizzle.config.ts (0.23 KB)
- apps/server/drizzle/meta/_journal.json (0.34 KB)
- apps/server/drizzle/meta/0000_snapshot.json (5.40 KB)
- apps/server/drizzle/meta/0001_snapshot.json (6.10 KB)
- apps/server/eslint.config.ts (0.09 KB)
- apps/server/package.json (1.52 KB)
- apps/server/src/db/index.ts (0.21 KB)
- apps/server/src/db/migrate.ts (0.25 KB)
- apps/server/src/db/schema.ts (2.11 KB)
- apps/server/src/db/seed.ts (5.29 KB)
- apps/server/src/index.ts (0.91 KB)
- apps/server/src/lib/schemas.ts (1.61 KB)
- apps/server/src/lib/trpc.ts (0.80 KB)
- apps/server/src/modules/day/day.router.ts (0.13 KB)
- apps/server/src/modules/day/procedures.ts (0.38 KB)
- apps/server/src/modules/trip/procedures.ts (1.27 KB)
- apps/server/src/modules/trip/trip.router.ts (0.13 KB)
- apps/server/src/repositories/day.repository.ts (1.65 KB)
- apps/server/src/repositories/trip.repository.ts (2.03 KB)
- apps/server/src/router.ts (0.26 KB)
- apps/server/src/server.ts (0.37 KB)
- apps/server/tsconfig.json (0.80 KB)
- package.json (1.17 KB)
- README.md (7.20 KB)
=================

=== File Contents ===

--- File: apps/client/.eslintrc-auto-import.json ---

{
  "globals": {
    "AppRouteNames": true,
    "AppRoutePaths": true,
    "Component": true,
    "ComponentPublicInstance": true,
    "ComputedRef": true,
    "DirectiveBinding": true,
    "EffectScope": true,
    "ExtractDefaultPropTypes": true,
    "ExtractPropTypes": true,
    "ExtractPublicPropTypes": true,
    "InjectionKey": true,
    "MaybeRef": true,
    "MaybeRefOrGetter": true,
    "PropType": true,
    "Ref": true,
    "Slot": true,
    "Slots": true,
    "UseDatabaseOptions": true,
    "UseDatabaseReturn": true,
    "VNode": true,
    "WritableComputedRef": true,
    "acceptHMRUpdate": true,
    "asyncComputed": true,
    "autoResetRef": true,
    "breakpoints": true,
    "computed": true,
    "computedAsync": true,
    "computedEager": true,
    "computedInject": true,
    "computedWithControl": true,
    "controlledComputed": true,
    "controlledRef": true,
    "createApp": true,
    "createEventHook": true,
    "createGlobalState": true,
    "createInjectionState": true,
    "createPinia": true,
    "createReactiveFn": true,
    "createRef": true,
    "createReusableTemplate": true,
    "createSharedComposable": true,
    "createTemplatePromise": true,
    "createUnrefFn": true,
    "customRef": true,
    "debouncedRef": true,
    "debouncedWatch": true,
    "defineAsyncComponent": true,
    "defineComponent": true,
    "defineStore": true,
    "eagerComputed": true,
    "effectScope": true,
    "extendRef": true,
    "getActivePinia": true,
    "getCurrentInstance": true,
    "getCurrentScope": true,
    "h": true,
    "ignorableWatch": true,
    "inject": true,
    "injectLocal": true,
    "isDefined": true,
    "isProxy": true,
    "isReactive": true,
    "isReadonly": true,
    "isRef": true,
    "makeDestructurable": true,
    "mapActions": true,
    "mapGetters": true,
    "mapState": true,
    "mapStores": true,
    "mapWritableState": true,
    "markRaw": true,
    "nextTick": true,
    "onActivated": true,
    "onBeforeMount": true,
    "onBeforeRouteLeave": true,
    "onBeforeRouteUpdate": true,
    "onBeforeUnmount": true,
    "onBeforeUpdate": true,
    "onClickOutside": true,
    "onDeactivated": true,
    "onElementRemoval": true,
    "onErrorCaptured": true,
    "onKeyStroke": true,
    "onLongPress": true,
    "onMounted": true,
    "onRenderTracked": true,
    "onRenderTriggered": true,
    "onScopeDispose": true,
    "onServerPrefetch": true,
    "onStartTyping": true,
    "onUnmounted": true,
    "onUpdated": true,
    "onWatcherCleanup": true,
    "pausableWatch": true,
    "provide": true,
    "provideLocal": true,
    "reactify": true,
    "reactifyObject": true,
    "reactive": true,
    "reactiveComputed": true,
    "reactiveOmit": true,
    "reactivePick": true,
    "readonly": true,
    "ref": true,
    "refAutoReset": true,
    "refDebounced": true,
    "refDefault": true,
    "refThrottled": true,
    "refWithControl": true,
    "resolveComponent": true,
    "resolveRef": true,
    "resolveUnref": true,
    "router": true,
    "setActivePinia": true,
    "setMapStoreSuffix": true,
    "shallowReactive": true,
    "shallowReadonly": true,
    "shallowRef": true,
    "storeToRefs": true,
    "syncRef": true,
    "syncRefs": true,
    "templateRef": true,
    "throttledRef": true,
    "throttledWatch": true,
    "toRaw": true,
    "toReactive": true,
    "toRef": true,
    "toRefs": true,
    "toValue": true,
    "triggerRef": true,
    "tryOnBeforeMount": true,
    "tryOnBeforeUnmount": true,
    "tryOnMounted": true,
    "tryOnScopeDispose": true,
    "tryOnUnmounted": true,
    "unref": true,
    "unrefElement": true,
    "until": true,
    "useActiveElement": true,
    "useAnimate": true,
    "useArrayDifference": true,
    "useArrayEvery": true,
    "useArrayFilter": true,
    "useArrayFind": true,
    "useArrayFindIndex": true,
    "useArrayFindLast": true,
    "useArrayIncludes": true,
    "useArrayJoin": true,
    "useArrayMap": true,
    "useArrayReduce": true,
    "useArraySome": true,
    "useArrayUnique": true,
    "useAsyncQueue": true,
    "useAsyncState": true,
    "useAttrs": true,
    "useBase64": true,
    "useBattery": true,
    "useBluetooth": true,
    "useBreakpoints": true,
    "useBroadcastChannel": true,
    "useBrowserLocation": true,
    "useCached": true,
    "useClipboard": true,
    "useClipboardItems": true,
    "useCloned": true,
    "useColorMode": true,
    "useConfirmDialog": true,
    "useCountdown": true,
    "useCounter": true,
    "useCssModule": true,
    "useCssVar": true,
    "useCssVars": true,
    "useCurrentElement": true,
    "useCycleList": true,
    "useDark": true,
    "useDatabase": true,
    "useDateFormat": true,
    "useDebounce": true,
    "useDebounceFn": true,
    "useDebouncedRefHistory": true,
    "useDeviceMotion": true,
    "useDeviceOrientation": true,
    "useDevicePixelRatio": true,
    "useDevicesList": true,
    "useDisplay": true,
    "useDisplayMedia": true,
    "useDocumentVisibility": true,
    "useDraggable": true,
    "useDropZone": true,
    "useElementBounding": true,
    "useElementByPoint": true,
    "useElementHover": true,
    "useElementSize": true,
    "useElementVisibility": true,
    "useEventBus": true,
    "useEventListener": true,
    "useEventSource": true,
    "useEyeDropper": true,
    "useFavicon": true,
    "useFetch": true,
    "useFileDialog": true,
    "useFileSystemAccess": true,
    "useFocus": true,
    "useFocusWithin": true,
    "useFps": true,
    "useFullscreen": true,
    "useGamepad": true,
    "useGeolocation": true,
    "useId": true,
    "useIdle": true,
    "useImage": true,
    "useInfiniteScroll": true,
    "useIntersectionObserver": true,
    "useInterval": true,
    "useIntervalFn": true,
    "useKeyModifier": true,
    "useLastChanged": true,
    "useLink": true,
    "useLocalStorage": true,
    "useMagicKeys": true,
    "useManualRefHistory": true,
    "useMediaControls": true,
    "useMediaQuery": true,
    "useMemoize": true,
    "useMemory": true,
    "useModel": true,
    "useMounted": true,
    "useMouse": true,
    "useMouseInElement": true,
    "useMousePressed": true,
    "useMutationObserver": true,
    "useNavigatorLanguage": true,
    "useNetwork": true,
    "useNow": true,
    "useObjectUrl": true,
    "useOffsetPagination": true,
    "useOnline": true,
    "usePageLeave": true,
    "useParallax": true,
    "useParentElement": true,
    "usePerformanceObserver": true,
    "usePermission": true,
    "usePointer": true,
    "usePointerLock": true,
    "usePointerSwipe": true,
    "usePreferredColorScheme": true,
    "usePreferredContrast": true,
    "usePreferredDark": true,
    "usePreferredLanguages": true,
    "usePreferredReducedMotion": true,
    "usePreferredReducedTransparency": true,
    "usePrevious": true,
    "useRafFn": true,
    "useRefHistory": true,
    "useResizeObserver": true,
    "useRoute": true,
    "useRouter": true,
    "useSSRWidth": true,
    "useScreenOrientation": true,
    "useScreenSafeArea": true,
    "useScriptTag": true,
    "useScroll": true,
    "useScrollLock": true,
    "useSessionStorage": true,
    "useShare": true,
    "useSlots": true,
    "useSorted": true,
    "useSpeechRecognition": true,
    "useSpeechSynthesis": true,
    "useStepper": true,
    "useStorage": true,
    "useStorageAsync": true,
    "useStyleTag": true,
    "useSupported": true,
    "useSwipe": true,
    "useSync": true,
    "useTemplateRef": true,
    "useTemplateRefsList": true,
    "useTextDirection": true,
    "useTextSelection": true,
    "useTextareaAutosize": true,
    "useThrottle": true,
    "useThrottleFn": true,
    "useThrottledRefHistory": true,
    "useTimeAgo": true,
    "useTimeout": true,
    "useTimeoutFn": true,
    "useTimeoutPoll": true,
    "useTimestamp": true,
    "useTitle": true,
    "useToNumber": true,
    "useToString": true,
    "useToggle": true,
    "useTransition": true,
    "useUrlSearchParams": true,
    "useUserMedia": true,
    "useVModel": true,
    "useVModels": true,
    "useVibrate": true,
    "useVirtualList": true,
    "useWakeLock": true,
    "useWebNotification": true,
    "useWebSocket": true,
    "useWebWorker": true,
    "useWebWorkerFn": true,
    "useWindowFocus": true,
    "useWindowScroll": true,
    "useWindowSize": true,
    "watch": true,
    "watchArray": true,
    "watchAtMost": true,
    "watchDebounced": true,
    "watchDeep": true,
    "watchEffect": true,
    "watchIgnorable": true,
    "watchImmediate": true,
    "watchOnce": true,
    "watchPausable": true,
    "watchPostEffect": true,
    "watchSyncEffect": true,
    "watchThrottled": true,
    "watchTriggerable": true,
    "watchWithFilter": true,
    "whenever": true
  }
}

--- File: apps/client/eslint.config.ts ---

import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  formatters: true,
  ignores: [
    '**/.vitestcache/**',
    '**/e2e-**/**',
    '**/src-tauri/**',
    'auto-imports.d.ts',
  ],
})

--- File: apps/client/mocks/tauri-sql-stub.ts ---

// Эмулируем экспорт класса Database, но с методами,
// которые либо ничего не делают, либо выбрасывают ошибку.
export default class Database {
  static async load(path: string) {
    console.warn(`[WEB-STUB] Database.load called for ${path}, but this is a web build. Returning a mock.`)
    return new Database()
  }

  async select(query: string, bindings?: unknown[]): Promise<any[]> {
    console.warn(`[WEB-STUB] DB.select called. Not available in web build.`)
    return Promise.resolve([])
  }

  async execute(query: string, bindings?: unknown[]): Promise<{ rowsAffected: number, lastInsertId: number }> {
    console.warn(`[WEB-STUB] DB.execute called. Not available in web build.`)
    return Promise.resolve({ rowsAffected: 0, lastInsertId: 0 })
  }
}

--- File: apps/client/package.json ---

{
  "name": "@xsolare/trip-scheduler-client",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "packageManager": "bun@1.2.19",
  "engines": {
    "bun": ">=1.1.30"
  },
  "scripts": {
    "--------------------------------<      DEV       >--------------------------------": "",
    "dev": "vite --config build/vite.config.tauri.ts",
    "dev:web": "vite --config build/vite.config.web.ts",
    "--------------------------------<      BUILD     >--------------------------------": "",
    "build": "vue-tsc --noEmit && vite build --config build/vite.config.tauri.ts",
    "build:web": "vue-tsc --noEmit && vite build --config build/vite.config.web.ts",
    "preview": "vite preview --config build/vite.config.tauri.ts",
    "preview:web": "vite preview --config build/vite.config.web.ts",
    "tauri": "bunx tauri",
    "tauri:dev": "bunx tauri dev",
    "tauri:build": "bunx tauri build",
    "--------------------------------<   DATABASE    >---------------------------------": "",
    "db:seed": "cd src-tauri && cargo run --bin cli seed",
    "db:reset": "cd src-tauri && cargo run --bin cli reset",
    "--------------------------------< LINT & FORMAT >---------------------------------": "",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "vue-tsc --noEmit",
    "--------------------------------<     UTILS     >---------------------------------": "",
    "generate-pwa-assets": "pwa-assets-generator"
  },
  "dependencies": {
    "@internationalized/date": "^3.8.2",
    "@milkdown/crepe": "^7.15.2",
    "@milkdown/vue": "^7.15.2",
    "@tauri-apps/api": "^2",
    "@tauri-apps/plugin-opener": "^2",
    "@tauri-apps/plugin-sql": "^2.3.0",
    "@trpc/client": "^11.4.3",
    "@vueuse/core": "^13.6.0",
    "pinia": "3.0.3",
    "reka-ui": "^2.4.1",
    "uuid": "^11.1.0",
    "vite-plugin-pwa": "^1.0.2",
    "vue": "^3.5.18",
    "vue-router": "^4.5.1",
    "vuedraggable": "^4.1.0"
  },
  "devDependencies": {
    "@antfu/eslint-config": "5.1.0",
    "@iconify-json/mdi": "^1.2.3",
    "@iconify/vue": "^5.0.0",
    "@types/uuid": "^10.0.0",
    "@types/workbox-sw": "^4.3.7",
    "@vite-pwa/assets-generator": "1.0.0",
    "@vitejs/plugin-vue": "^6.0.1",
    "eslint": "9.32.0",
    "eslint-plugin-format": "1.0.1",
    "jiti": "^2.5.1",
    "sass": "1.89.2",
    "typescript": "5.8.3",
    "unplugin-auto-import": "^19.3.0",
    "unplugin-icons": "^22.2.0",
    "vite": "^7.0.6",
    "vue-tsc": "^3.0.5",
    "workbox-window": "^7.3.0"
  }
}

--- File: apps/client/pwa-assets.config.ts ---

import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset,
  images: [
    'public/trip-scheduler-logo.svg',
  ],
})

--- File: apps/client/service-worker/cache-manager.ts ---

import { API_CACHE_RULES } from './model/types'

/**
 * Отправляет команду в Service Worker для очистки кеша по его имени.
 * @param cacheName Имя кеша для очистки.
 */
function clearCacheByName(cacheName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      console.warn('Service Worker не активен, очистка кеша пропущена.')
      resolve()
      return
    }

    const messageChannel = new MessageChannel()

    messageChannel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_CLEARED' && event.data.payload.success) {
        // eslint-disable-next-line no-console
        console.log(`Кеш "${cacheName}" успешно очищен.`)
        resolve()
      }
      else {
        console.error('Ошибка при очистке кеша из Service Worker:', event.data.payload)
        reject(new Error(event.data.payload?.message || 'Неизвестная ошибка очистки кеша'))
      }
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHE',
      payload: { cacheName },
    }, [messageChannel.port2])
  })
}

/**
 * Очищает все кеши API, которые могут содержать пользовательские данные.
 * Эта функция должна вызываться при выходе пользователя из системы.
 */
export async function clearUserSpecificApiCaches() {
  const dynamicApiCaches = API_CACHE_RULES
    .filter(rule => rule.strategy !== 'CacheFirst')
    .map(rule => rule.cacheName)

  const cachesToClear = [...new Set(dynamicApiCaches)]

  // eslint-disable-next-line no-console
  console.log('Очистка кешей API при выходе:', cachesToClear)

  for (const cacheName of cachesToClear) {
    try {
      await clearCacheByName(cacheName)
    }
    catch (error) {
      console.error(`Не удалось очистить кеш "${cacheName}":`, error)
    }
  }
}

--- File: apps/client/service-worker/lib/message-handlers.ts ---

import type { MessageHandlers } from '../model/types'
import { getCacheInfo } from './utils'

declare let self: ServiceWorkerGlobalScope

const messageHandlers: MessageHandlers = {
  async SKIP_WAITING() {
    await self.skipWaiting()
  },

  async GET_CACHE_INFO(port) {
    try {
      const info = await getCacheInfo()
      port.postMessage({ type: 'CACHE_INFO', payload: info })
    }
    catch {
      port.postMessage({
        type: 'ERROR',
        payload: { message: 'Не удалось получить информацию о кеше' },
      })
    }
  },

  async CLEAR_CACHE(port, payload) {
    if (!payload?.cacheName) {
      port.postMessage({
        type: 'ERROR',
        payload: { message: 'Не указано имя кеша' },
      })
      return
    }

    try {
      const deleted = await caches.delete(payload.cacheName)
      port.postMessage({
        type: 'CACHE_CLEARED',
        payload: { success: deleted, cacheName: payload.cacheName },
      })
    }
    catch {
      port.postMessage({
        type: 'ERROR',
        payload: { message: 'Ошибка при удалении кеша' },
      })
    }
  },
}

export { messageHandlers }

--- File: apps/client/service-worker/lib/utils.ts ---

import type { WorkboxPlugin } from 'workbox-core'
import type { AssetType, CacheInfo } from '../model/types'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'

class AssetAnalyzer {
  private static cache = new Map<string, AssetType>()

  // Паттерны для хешированных файлов (Vite/Nuxt)
  static HASH_PATTERNS = [
    /\.[a-f0-9]{8,}\.(js|css|mjs)$/i, // Vite хеши
    /\.[a-f0-9]{6,12}\.(js|css|mjs)$/i, // Короткие хеши
    /assets\/.*\.[a-f0-9]{8,}\./i, // Assets с хешами
    /\?v=[a-f0-9]{8,}/i, // Query параметры версий
  ]

  // Паттерны для статических библиотек (безопасно кешировать долго)
  static VENDOR_PATTERNS = [
    /node_modules/i,
    /vendor/i,
    /lib/i,
    /cdn\./i,
    /unpkg\.com/i,
    /jsdelivr\.net/i,
  ]

  static isHashedAsset(url: string): boolean {
    return this.HASH_PATTERNS.some(pattern => pattern.test(url))
  }

  static isVendorAsset(url: string): boolean {
    return this.VENDOR_PATTERNS.some(pattern => pattern.test(url))
  }

  static getAssetType(url: string) {
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    let type: 'hashed' | 'vendor' | 'regular' = 'regular'

    if (this.isHashedAsset(url))
      type = 'hashed'
    else if (this.isVendorAsset(url))
      type = 'vendor'

    // Ограничиваем размер кеша
    if (this.cache.size > 1000) {
      this.cache.clear()
    }

    this.cache.set(url, type)
    return type
  }
}

class CacheStrategyFactory {
  static createNetworkFirst(cacheName: string, options: {
    maxEntries: number
    maxAgeSeconds: number
  }) {
    return new NetworkFirst({
      cacheName,
      plugins: [
        createMonitoringPlugin(cacheName),
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({
          maxEntries: options.maxEntries,
          maxAgeSeconds: options.maxAgeSeconds,
        }),
      ],
    })
  }

  static createCacheFirst(cacheName: string, options: {
    maxEntries: number
    maxAgeSeconds: number
    statuses?: number[]
  }) {
    return new CacheFirst({
      cacheName,
      plugins: [
        createMonitoringPlugin(cacheName),
        new CacheableResponsePlugin({
          statuses: options.statuses || [200],
        }),
        new ExpirationPlugin({
          maxEntries: options.maxEntries,
          maxAgeSeconds: options.maxAgeSeconds,
          purgeOnQuotaError: true,
        }),
      ],
    })
  }

  static createStaleWhileRevalidate(cacheName: string, options: {
    maxEntries: number
    maxAgeSeconds: number
  }) {
    return new StaleWhileRevalidate({
      cacheName,
      plugins: [
        createMonitoringPlugin(cacheName),
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({
          maxEntries: options.maxEntries,
          maxAgeSeconds: options.maxAgeSeconds,
        }),
      ],
    })
  }
}

class ServiceWorkerMonitor {
  static trackCacheHit(cacheName: string, url: string) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`🎯 Cache HIT: ${cacheName} - ${url}`)
    }
  }

  static trackCacheMiss(cacheName: string, url: string) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`❌ Cache MISS: ${cacheName} - ${url}`)
    }
  }
}

/**
 * Создает плагин для мониторинга попаданий и промахов в кеш.
 * @param cacheName Имя кеша для логирования.
 */
function createMonitoringPlugin(cacheName: string): WorkboxPlugin {
  return {
    cachedResponseWillBeUsed: async ({ request, cachedResponse }) => {
      if (cachedResponse) {
        ServiceWorkerMonitor.trackCacheHit(cacheName, request.url)
      }
      return cachedResponse
    },
    fetchDidSucceed: async ({ request, response }) => {
      ServiceWorkerMonitor.trackCacheMiss(cacheName, request.url)
      return response
    },
  }
}

async function getCacheInfo(): Promise<CacheInfo[]> {
  try {
    const cacheNames = await caches.keys()
    const info: CacheInfo[] = []

    await Promise.all(
      cacheNames.map(async (name) => {
        try {
          const cache = await caches.open(name)
          const keys = await cache.keys()

          let totalSize = 0
          if (import.meta.env.DEV) {
            const responses = await Promise.all(
              keys.slice(0, 10).map(req => cache.match(req)),
            )
            totalSize = responses.reduce((sum, response) => {
              return sum + (response?.headers.get('content-length')
                ? Number.parseInt(response.headers.get('content-length')!)
                : 0)
            }, 0)
          }

          info.push({
            name,
            size: keys.length,
            urls: keys.slice(0, 5).map(req => req.url),
            totalSize,
          })
        }
        catch (error) {
          console.warn(`Ошибка получения информации о кеше ${name}:`, error)
        }
      }),
    )

    return info
  }
  catch (error) {
    console.error('Ошибка получения информации о кешах:', error)
    return []
  }
}

export {
  AssetAnalyzer,
  CacheStrategyFactory,
  getCacheInfo,
  ServiceWorkerMonitor,
}

--- File: apps/client/service-worker/model/types.ts ---

/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
/// <reference types="@types/workbox-sw" />

type AssetType = 'hashed' | 'vendor' | 'regular'

interface ServiceWorkerMessage {
  type: 'SKIP_WAITING' | 'GET_CACHE_INFO' | 'CLEAR_CACHE'
  payload?: {
    cacheName?: string
  }
}

interface CacheInfo {
  name: string
  size: number
  urls: string[]
  totalSize?: number
}

const CACHE_CONFIG = {
  names: {
    webmanifest: 'trip-scheduler-pwa-webmanifest',
    fonts: 'trip-scheduler-fonts',
    images: 'trip-scheduler-images',
    hashedAssets: 'trip-scheduler-hashed-assets',
    vendorAssets: 'trip-scheduler-vendor-assets',
    regularAssets: 'trip-scheduler-regular-assets',
  },
  durations: {
    images: 365 * 24 * 60 * 60,
    fonts: 365 * 24 * 60 * 60,
    static: {
      hashed: 365 * 24 * 60 * 60,
      vendor: 30 * 24 * 60 * 60,
      regular: 2 * 60 * 60,
    },
    manifests: 7 * 24 * 60 * 60,
  },
  limits: {
    fonts: 30,
    images: 500,
    hashedAssets: 200,
    vendorAssets: 100,
    regularAssets: 50,
    manifests: 100,
  },
} as const

interface ApiCacheRule {
  path: string
  cacheName: string
  strategy: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate'
  maxAgeSeconds: number
  maxEntries: number
}

const API_CACHE_RULES: ApiCacheRule[] = [
  {
    // Правило для списка всех путешествий
    path: '/api/trip/list', 
    cacheName: 'trip-scheduler-api-trips',
    strategy: 'NetworkFirst',
    maxAgeSeconds: 24 * 60 * 60, // Кэшировать на 1 день
    maxEntries: 10,
  },
  {
    // Правило для данных конкретного путешествия (включая дни и активности)
    path: '/api/day/by-trip-id/.*',
    cacheName: 'trip-scheduler-api-days',
    strategy: 'NetworkFirst',
    maxAgeSeconds: 24 * 60 * 60, // Кэшировать на 1 день
    maxEntries: 50,
  },
]

interface MessageHandlers {
  SKIP_WAITING: () => Promise<void>
  GET_CACHE_INFO: (port: MessagePort) => Promise<void>
  CLEAR_CACHE: (port: MessagePort, payload?: { cacheName?: string }) => Promise<void>
}

interface MessageHandlers {
  SKIP_WAITING: () => Promise<void>
  GET_CACHE_INFO: (port: MessagePort) => Promise<void>
  CLEAR_CACHE: (port: MessagePort, payload?: { cacheName?: string }) => Promise<void>
}

export {
  API_CACHE_RULES,
  type AssetType,
  CACHE_CONFIG,
  type CacheInfo,
  type MessageHandlers,
  type ServiceWorkerMessage,
}

--- File: apps/client/service-worker/sw.ts ---

/* eslint-disable no-console */
import type { ServiceWorkerMessage } from './model/types'
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { messageHandlers } from './lib/message-handlers'
import { AssetAnalyzer, CacheStrategyFactory } from './lib/utils'
import { API_CACHE_RULES, CACHE_CONFIG } from './model/types'

declare let self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST || [])

if (import.meta.env.PROD) {
  // WEB APP MANIFEST
  registerRoute(
    ({ request, sameOrigin }) => sameOrigin && request.destination === 'manifest',
    CacheStrategyFactory.createNetworkFirst(
      CACHE_CONFIG.names.webmanifest,
      {
        maxEntries: CACHE_CONFIG.limits.manifests,
        maxAgeSeconds: CACHE_CONFIG.durations.manifests,
      },
    ),
  )

  // FONTS
  registerRoute(
    ({ request }) => request.destination === 'font',
    CacheStrategyFactory.createCacheFirst(
      CACHE_CONFIG.names.fonts,
      {
        maxEntries: CACHE_CONFIG.limits.fonts,
        maxAgeSeconds: CACHE_CONFIG.durations.fonts,
        statuses: [0, 200],
      },
    ),
  )

  // IMAGE
  registerRoute(
    ({ request }) => request.destination === 'image',
    CacheStrategyFactory.createStaleWhileRevalidate(
      CACHE_CONFIG.names.images,
      {
        maxEntries: CACHE_CONFIG.limits.images,
        maxAgeSeconds: CACHE_CONFIG.durations.images,
      },
    ),
  )
}

const hashedAssetsStrategy = CacheStrategyFactory.createCacheFirst(
  CACHE_CONFIG.names.hashedAssets,
  {
    maxEntries: CACHE_CONFIG.limits.hashedAssets,
    maxAgeSeconds: CACHE_CONFIG.durations.static.hashed,
  },
)

const vendorAssetsStrategy = CacheStrategyFactory.createCacheFirst(
  CACHE_CONFIG.names.vendorAssets,
  {
    maxEntries: CACHE_CONFIG.limits.vendorAssets,
    maxAgeSeconds: CACHE_CONFIG.durations.static.vendor,
    statuses: [0, 200],
  },
)

const regularAssetsStrategy = CacheStrategyFactory.createStaleWhileRevalidate(
  CACHE_CONFIG.names.regularAssets,
  {
    maxEntries: CACHE_CONFIG.limits.regularAssets,
    maxAgeSeconds: CACHE_CONFIG.durations.static.regular,
  },
)

// JS/CSS
function isScriptOrStyle({ request, sameOrigin }: { request: Request, sameOrigin: boolean }) {
  return sameOrigin && (request.destination === 'script' || request.destination === 'style')
}

// Маршрут для хешированных ассетов
registerRoute(
  options => isScriptOrStyle(options) && AssetAnalyzer.getAssetType(options.url.href) === 'hashed',
  hashedAssetsStrategy,
)

// Маршрут для вендорных ассетов
registerRoute(
  options => isScriptOrStyle(options) && AssetAnalyzer.getAssetType(options.url.href) === 'vendor',
  vendorAssetsStrategy,
)

// Маршрут для обычных ассетов
registerRoute(
  options => isScriptOrStyle(options) && AssetAnalyzer.getAssetType(options.url.href) === 'regular',
  regularAssetsStrategy,
)

// API
API_CACHE_RULES.forEach((rule) => {
  let strategy

  const options = {
    maxEntries: rule.maxEntries,
    maxAgeSeconds: rule.maxAgeSeconds,
  }

  switch (rule.strategy) {
    case 'CacheFirst':
      strategy = CacheStrategyFactory.createCacheFirst(rule.cacheName, { ...options, statuses: [200] })
      break
    case 'NetworkFirst':
      strategy = CacheStrategyFactory.createNetworkFirst(rule.cacheName, options)
      break
    case 'StaleWhileRevalidate':
      strategy = CacheStrategyFactory.createStaleWhileRevalidate(rule.cacheName, options)
      break
    default:
      throw new Error(`Unknown cache strategy: ${rule.strategy}`)
  }

  registerRoute(
    ({ request, url }) =>
      request.method === 'GET'
      && url.pathname === rule.path,
    strategy,
  )
})

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

let denylist: undefined | RegExp[]
if (import.meta.env.PROD) {
  denylist = [
    /^\/api\//,
    /^\/sw.js$/,
    /^\/manifest-(.*).webmanifest$/,
    /^\/workbox-.*\.js$/,
  ]
}

registerRoute(new NavigationRoute(
  createHandlerBoundToURL('/'),
  {
    allowlist,
    denylist,
  },
))

self.addEventListener('message', async (event) => {
  const { type, payload } = event.data as ServiceWorkerMessage
  const port = event.ports[0]

  if (!port)
    return

  const handler = messageHandlers[type]
  if (handler) {
    try {
      await handler(port, payload)
    }
    catch (error) {
      console.error(`Ошибка при обработке сообщения "${type}":`, error)
      port.postMessage({
        type: 'ERROR',
        payload: { message: `Внутренняя ошибка при обработке: ${type}` },
      })
    }
  }
  else {
    port.postMessage({
      type: 'ERROR',
      payload: { message: `Неизвестный тип сообщения: ${type}` },
    })
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-trip-updates') {
    console.log('🔄 Фоновая синхронизация запущена...')

    // TODO
    // Здесь будет логика отправки сохраненных запросов на сервер
    // event.waitUntil(syncData()); // 'syncData' - функция, которую нужно реализовать
  }
})

if (import.meta.env.DEV) {
  console.log('🔧 Service Worker в режиме разработки')

  self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET') {
      const assetType = AssetAnalyzer.getAssetType(event.request.url)

      console.log(`📥 ${assetType}: ${event.request.url}`)
    }
  })
}

--- File: apps/client/service-worker/tsconfig.json ---

{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "lib": [
      "ESNext",
      "WebWorker",
      "DOM.Iterable"
    ],
    "types": [
      "vite/client"
    ]
  },
  "include": [
    "./"
  ],
  "exclude": []
}

--- File: apps/client/src-tauri/build.rs ---

fn main() {
    tauri_build::build()
}

--- File: apps/client/src-tauri/Cargo.toml ---

[package]
name = "trip_scheduler"
version = "0.1.0"
description = "A Tauri App"
authors = [ "you" ]
edition = "2021"
default-run = "trip_scheduler"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
# The `_lib` suffix may seem redundant but it is necessary
# to make the lib name unique and wouldn't conflict with the bin name.
# This seems to be only an issue on Windows, see https://github.com/rust-lang/cargo/issues/8519
name = "trip_scheduler_lib"
crate-type = [
  "staticlib",
  "cdylib",
  "rlib"
]

[[bin]]
name = "cli"
path = "src/cli.rs"

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-opener = "2"
tauri-plugin-sql = { features = ["sqlite"], version = "2" }
serde = { version = "1", features = [ "derive" ] }
serde_json = "1"
clap = { version = "4.5.10", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
sqlx = { version = "0.8", features = ["sqlite", "runtime-tokio-rustls"] }

--- File: apps/client/src-tauri/src/cli.rs ---

use clap::{Parser, Subcommand};
use trip_scheduler_lib::{mock};
use std::process::Command;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
  #[command(subcommand)]
  command: Commands,
}

#[derive(Subcommand)]
enum Commands {
  Seed,
  Reset,
}
    
#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Seed => {
            if let Err(e) = seed_data().await {
                eprintln!("Error seeding data: {}", e);
            } else {
                println!("Database seeded successfully!");
            }
        }
        Commands::Reset => {
            if let Err(e) = reset_db().await {
                eprintln!("Error resetting database: {}", e);
            } else {
                println!("Database reset successfully!");
            }
        }
    }
}

async fn reset_db() -> Result<(), Box<dyn std::error::Error>> {
    let db_path_str = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
    let db_path = std::path::Path::new(db_path_str);

    if db_path.exists() {
        println!("Removing database file: {}", db_path_str);
        std::fs::remove_file(&db_path)?;
    } else {
        println!("Database file not found, nothing to do.");
    }
    
    Ok(())
}

async fn seed_data() -> Result<(), Box<dyn std::error::Error>> {
    // Create database file and run migrations using sqlite3 command line tool
    let db_path = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
    
    // Create the database with schema
    let migrations = trip_scheduler_lib::get_migrations();
    for migration in migrations {
        let output = Command::new("sqlite3")
            .arg(db_path)
            .arg(&migration.sql)
            .output()?;
            
        if !output.status.success() {
            return Err(format!("Failed to run migration: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
    }

    let plans = mock::get_mock_plans();

    for trip in plans {
        let cities_json = serde_json::to_string(&trip.cities.unwrap_or_default())?;
        let participants_json = serde_json::to_string(&trip.participants.unwrap_or_default())?;
        let tags_json = serde_json::to_string(&trip.tags.unwrap_or_default())?;

        let sql = format!(
            "INSERT INTO trips (id, title, description, image_url, start_date, end_date, days, cities, status, budget, currency, participants, tags, visibility) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}', {}, '{}', '{}', '{}', '{}');",
            trip.id.replace("'", "''"),
            trip.title.replace("'", "''"),
            trip.description.unwrap_or_default().replace("'", "''"),
            trip.image_url.unwrap_or_default().replace("'", "''"),
            trip.start_date.unwrap_or_default().replace("'", "''"),
            trip.end_date.unwrap_or_default().replace("'", "''"),
            trip.days.unwrap_or_default(),
            cities_json.replace("'", "''"),
            trip.status.unwrap_or_default().replace("'", "''"),
            trip.budget.unwrap_or_default(),
            trip.currency.unwrap_or_default().replace("'", "''"),
            participants_json.replace("'", "''"),
            tags_json.replace("'", "''"),
            trip.visibility.unwrap_or_default().replace("'", "''"),
        );

        let output = Command::new("sqlite3")
            .arg(db_path)
            .arg(&sql)
            .output()?;
            
        if !output.status.success() {
            return Err(format!("Failed to insert data: {}", String::from_utf8_lossy(&output.stderr)).into());
        }
    }

    Ok(())
}

--- File: apps/client/src-tauri/src/lib.rs ---

use serde::{Deserialize, Serialize};

// Declare the mock module
pub mod mock;

// Define the ITrip struct that's being used
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ITrip {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub image_url: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub days: Option<i32>,
    pub cities: Option<Vec<String>>,
    pub status: Option<String>,
    pub budget: Option<f64>,
    pub currency: Option<String>,
    pub participants: Option<Vec<String>>,
    pub tags: Option<Vec<String>>,
    pub visibility: Option<String>,
}

// Define a struct for migrations
pub struct Migration {
    pub sql: String,
}

// Add the get_migrations function
pub fn get_migrations() -> Vec<Migration> {
    vec![
        Migration {
            sql: "CREATE TABLE IF NOT EXISTS trips (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                start_date TEXT,
                end_date TEXT,
                days INTEGER,
                cities TEXT,
                status TEXT,
                budget REAL,
                currency TEXT,
                participants TEXT,
                tags TEXT,
                visibility TEXT
            );".to_string(),
        }
    ]
}

#[tauri::command]
async fn seed_mock_data(_app_handle: tauri::AppHandle) -> Result<(), String> {
    use std::process::Command;
    
    let plans = mock::get_mock_plans();
    let db_path = "/home/evai/.config/com.trip-scheduler.app/trip-scheduler.db";
 
    let create_table_sql = "CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        start_date TEXT,
        end_date TEXT,
        days INTEGER,
        cities TEXT,
        status TEXT,
        budget REAL,
        currency TEXT,
        participants TEXT,
        tags TEXT,
        visibility TEXT
    );";
 
    Command::new("sqlite3")
        .arg(db_path)
        .arg(create_table_sql)
        .output()
        .map_err(|e| e.to_string())?;
 
    for trip in plans {
        let cities_json = serde_json::to_string(&trip.cities.unwrap_or_default()).map_err(|e| e.to_string())?;
        let participants_json = serde_json::to_string(&trip.participants.unwrap_or_default()).map_err(|e| e.to_string())?;
        let tags_json = serde_json::to_string(&trip.tags.unwrap_or_default()).map_err(|e| e.to_string())?;
 
        let sql = format!(
            "INSERT OR REPLACE INTO trips (id, title, description, image_url, start_date, end_date, days, cities, status, budget, currency, participants, tags, visibility) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', {}, '{}', '{}', {}, '{}', '{}', '{}', '{}');",
            trip.id.replace("'", "''"),
            trip.title.replace("'", "''"),
            trip.description.unwrap_or_default().replace("'", "''"),
            trip.image_url.unwrap_or_default().replace("'", "''"),
            trip.start_date.unwrap_or_default().replace("'", "''"),
            trip.end_date.unwrap_or_default().replace("'", "''"),
            trip.days.unwrap_or_default(),
            cities_json.replace("'", "''"),
            trip.status.unwrap_or_default().replace("'", "''"),
            trip.budget.unwrap_or_default(),
            trip.currency.unwrap_or_default().replace("'", "''"),
            participants_json.replace("'", "''"),
            tags_json.replace("'", "''"),
            trip.visibility.unwrap_or_default().replace("'", "''"),
        );
 
        Command::new("sqlite3")
            .arg(db_path)
            .arg(&sql)
            .output()
            .map_err(|e| e.to_string())?;
    }
 
    Ok(())
}


// Add the run function
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![seed_mock_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

--- File: apps/client/src-tauri/src/main.rs ---

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    trip_scheduler_lib::run()
}

--- File: apps/client/src-tauri/src/mock.rs ---

use crate::ITrip;

pub fn get_mock_plans() -> Vec<ITrip> {
    vec![
        ITrip {
            id: "1".to_string(),
            title: "Покорение Алтая".to_string(),
            image_url: Some("/images/mock.jpg".to_string()),
            description: Some("Активный отдых и треккинг по живописным горам Алтая. Незабываемые виды и приключения.".to_string()),
            days: Some(10),
            start_date: Some("2025-07-15".to_string()),
            end_date: Some("2025-07-25".to_string()),
            cities: Some(vec!["Горно-Алтайск".to_string(), "Акташ".to_string()]),
            status: Some("completed".to_string()),
            budget: Some(80000.0),
            currency: Some("RUB".to_string()),
            participants: Some(vec!["Алексей".to_string(), "Елена".to_string()]),
            tags: Some(vec!["горы".to_string(), "природа".to_string(), "треккинг".to_string(), "активный отдых".to_string()]),
            visibility: Some("public".to_string()),
        },
        ITrip {
            id: "2".to_string(),
            title: "Неоновый Гонконг".to_string(),
            image_url: Some("/images/mock-2.png".to_string()),
            description: Some("Погружение в атмосферу азиатского мегаполиса: от небоскребов до уличной еды.".to_string()),
            days: Some(7),
            start_date: Some("2025-09-10".to_string()),
            end_date: Some("2025-09-17".to_string()),
            cities: Some(vec!["Гонконг".to_string()]),
            status: Some("planned".to_string()),
            budget: Some(1500.0),
            currency: Some("USD".to_string()),
            participants: Some(vec!["Максим".to_string()]),
            tags: Some(vec!["город".to_string(), "культура".to_string(), "еда".to_string(), "Азия".to_string()]),
            visibility: Some("private".to_string()),
        },
        ITrip {
            id: "3".to_string(),
            title: "Путешествие в Японию".to_string(),
            image_url: Some("/images/mock.jpg".to_string()),
            description: Some("Весеннее путешествие в страну восходящего солнца во время цветения сакуры.".to_string()),
            days: Some(14),
            start_date: Some("2026-03-25".to_string()),
            end_date: Some("2026-04-08".to_string()),
            cities: Some(vec!["Токио".to_string(), "Киото".to_string(), "Осака".to_string()]),
            status: Some("draft".to_string()),
            budget: Some(3500.0),
            currency: Some("USD".to_string()),
            participants: Some(vec!["Анна".to_string(), "Дмитрий".to_string()]),
            tags: Some(vec!["Япония".to_string(), "сакура".to_string(), "весна".to_string(), "культура".to_string()]),
            visibility: Some("private".to_string()),
        },
    ]
}

--- File: apps/client/src-tauri/tauri.conf.json ---

{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "trip-scheduler",
  "version": "0.1.0",
  "identifier": "com.trip-scheduler.app",
  "build": {
    "beforeDevCommand": "bun run dev",
    "beforeBuildCommand": "bun run build",
    "devUrl": "http://localhost:1420",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "trip-scheduler",
        "width": 800,
        "height": 600
      }
    ],
    "security": {
      "csp": null
    }
  },
  "plugins": {
    "sql": {
      "preload": [
        "sqlite:trip-scheduler.db"
      ]
    }
  },
  "bundle": {
    "active": true,
    "targets": [
      "deb",
      "appimage"
    ],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}

--- File: apps/client/src/app.vue ---

<script setup>
import { DefaultLayout } from '~/components/05.layouts/default'
import { EmptyLayout } from '~/components/05.layouts/empty'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

import '~/assets/scss/global.scss'
import '~/assets/scss/atomic.scss'
import '~/assets/scss/normalize.scss'
import '~/assets/scss/fonts.scss'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'empty')
const transition = computed(() => route.meta.transition || 'smooth-appear')

const layouts = {
  default: DefaultLayout,
  empty: EmptyLayout,
}
</script>

<template>
  <component :is="layouts[layout]">
    <router-view v-slot="{ Component }">
      <transition :name="transition" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

--- File: apps/client/src/components/01.kit/calendar-popover/composables/use-calendar-popover.ts ---

function useCalendarPopover() {
  const isOpen = ref(false)

  const openCalendar = () => {
    isOpen.value = true
  }

  const closeCalendar = () => {
    isOpen.value = false
  }

  const handleDateSelect = <T>(date: T, callback?: (date: T) => void) => {
    callback?.(date)
    closeCalendar()
  }

  return {
    isOpen,
    openCalendar,
    closeCalendar,
    handleDateSelect,
  }
}

export { useCalendarPopover }

--- File: apps/client/src/components/01.kit/calendar-popover/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/calendar-popover/ui/calendar-popover.vue ---

<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { Calendar } from '~/components/01.kit/calendar'
import { useCalendarPopover } from '../composables/use-calendar-popover'

interface Props {
  disabled?: boolean

}

defineProps<Props>()

const model = defineModel<CalendarDate | null>({ required: true })
const { isOpen, handleDateSelect } = useCalendarPopover()

function handleUpdateValue(value: CalendarDate | null) {
  handleDateSelect(value, v => model.value = v)
}
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger
      as-child
      class="date-picker-trigger"
      :disabled="disabled"
    >
      <slot />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        align="start"
        class="date-picker-content"
        :avoid-collisions="true"
        :collision-padding="4"
      >
        <Calendar
          :model-value="model"
          @update:model-value="handleUpdateValue"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped lang="scss">
:deep(.date-picker-content) {
  border-radius: 8px;
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 8px;

  &[data-side='top'] {
    animation-name: slideUp;
  }
  &[data-side='bottom'] {
    animation-name: slideDown;
  }
}
.date-picker-trigger {
  cursor: pointer;
}
</style>

<style>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

--- File: apps/client/src/components/01.kit/calendar-popover/ui/index.ts ---

import CalendarPopover from './calendar-popover.vue'

export { CalendarPopover }

--- File: apps/client/src/components/01.kit/calendar/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/calendar/ui/calendar.vue ---

<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { Icon } from '@iconify/vue'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'

const locale = 'ru-RU'

const model = defineModel<CalendarDate | null>({ required: true })
</script>

<template>
  <CalendarRoot
    v-if="model"
    v-slot="{ weekDays, grid }"
    v-model="model"
    class="calendar"
    fixed-weeks
    :locale="locale"
  >
    <CalendarHeader class="calendarHeader">
      <CalendarPrev class="calendarNavButton">
        <Icon
          icon="mdi:chevron-left"
          class="icon"
        />
      </CalendarPrev>
      <CalendarHeading class="calendarHeading" />
      <CalendarNext class="calendarNavButton">
        <Icon
          icon="mdi:chevron-right"
          class="icon"
        />
      </CalendarNext>
    </CalendarHeader>
    <div class="calendarWrapper">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="calendarGrid"
      >
        <CalendarGridHead>
          <CalendarGridRow class="calendarGridRow">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="calendarHeadCell"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody class="calendarGridWrapper">
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="calendarGridRow"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="calendarCell"
            >
              <CalendarCellTrigger
                v-if="weekDate.month === month.value.month"
                :day="weekDate"
                :month="month.value"
                class="calendarCellTrigger"
              />
              <div
                v-else
                class="calendarCellEmpty"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

<style lang="scss" scoped>
.icon {
  width: 1.5rem;
  height: 1.5rem;
}

.calendar {
  border: 1px solid var(--border-primary-color);
  background-color: var(--bg-secondary-color);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 16px;
  border-radius: 8px;
  width: 300px;
}

.calendarHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendarNavButton {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  color: var(--fg-primary-color);
  background-color: transparent;
  cursor: pointer;
  border-radius: 0.375rem;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: var(--bg-action-hover-color);
    color: var(--bg-primary-color);
  }
}

.calendarHeading {
  font-weight: 400;
  color: var(--fg-primary-color);
}

.calendarWrapper {
  display: flex;
  padding-top: 1rem;
  flex-direction: column;

  @include media-up(sm) {
    flex-direction: row;
  }
}

.calendarGrid {
  width: 100%;
  user-select: none;
  border-collapse: collapse;

  & + & {
    @include media-up(sm) {
      margin-left: 1rem;
    }
    @include media-down(sm) {
      margin-top: 1.5rem;
    }
  }
}

.calendarGridRow {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;

  & + & {
    margin-top: 0.25rem;
  }
}

.calendarHeadCell {
  font-size: 1rem;
  color: var(--fg-secondary-color);
  font-weight: 400;
  text-align: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-secondary-color);
}

.calendarCell {
  position: relative;
  text-align: center;
}

.calendarCellEmpty {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.calendarCellTrigger {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  border: 1px solid transparent;
  outline: none;
  font-size: 1rem;
  font-weight: 400;
  color: var(--fg-primary-color);
  background-color: transparent;
  border-radius: 0.375rem;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &:focus {
    box-shadow: 0 0 0 2px var(--border-accent-color);
  }

  &[data-disabled] {
    cursor: default;
    color: var(--fg-muted-color);
  }

  &[data-selected] {
    background-color: var(--bg-accent-color);
    color: var(--fg-accent-color);
    font-weight: 400;
  }

  &[data-today] {
    border-color: var(--border-accent-color);
  }
}
</style>

--- File: apps/client/src/components/01.kit/calendar/ui/index.ts ---

import Calendar from './calendar.vue'

export { Calendar }

--- File: apps/client/src/components/01.kit/dialog-with-close/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/dialog-with-close/ui/dialog-with-close.vue ---

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { computed } from 'vue'

interface Props {
  maxWidth?: number
  title?: string
}

const { maxWidth = 700, title } = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })

const maxWidthPx = computed(() => `${maxWidth}px`)
</script>

<template>
  <DialogRoot v-model:open="visible">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay" />
      <DialogContent
        class="dialog-content-wrapper"
        :style="{ maxWidth: maxWidthPx }"
        @pointer-down-outside="(event) => {
          const originalEvent = event.detail.originalEvent
          const target = originalEvent.target as HTMLElement
          if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight)
            event.preventDefault()
        }"
      >
        <div class="dialog-header">
          <DialogTitle class="dialog-title">
            {{ title }}
          </DialogTitle>
          <DialogClose as-child>
            <button class="close-button">
              <Icon icon="mdi:close" />
            </button>
          </DialogClose>
        </div>
        <div class="dialog-body">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
  z-index: 1000;
  animation: overlay-show 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

.dialog-content-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-primary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 90vw;
  padding: 16px;
  animation: content-show 150ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:focus {
    outline: none;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--fg-primary-color);
}

.close-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-accent-color);
  }
}

.dialog-body {
  flex-grow: 1;
  overflow-y: auto;
}

@keyframes overlay-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes content-show {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>

--- File: apps/client/src/components/01.kit/dialog-with-close/ui/index.ts ---

import DialogWithClose from './dialog-with-close.vue'

export { DialogWithClose }

--- File: apps/client/src/components/01.kit/inline-editor/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/inline-editor/ui/index.ts ---

import InlineEditorWrapper from './inline-editor-wrapper.vue'
import InlineEditor from './inline-editor.vue'

export { InlineEditor, InlineEditorWrapper }

--- File: apps/client/src/components/01.kit/inline-editor/ui/inline-editor-wrapper.vue ---

<script setup lang="ts">
import type { CrepeFeature } from '@milkdown/crepe'
import { MilkdownProvider } from '@milkdown/vue'
import { InlineEditor } from '~/components/01.kit/inline-editor'

interface Props {
  disabled?: boolean
  placeholder?: string
  features?: Partial<Record<CrepeFeature, boolean>>
}

// eslint-disable-next-line unused-imports/no-unused-vars
const props = defineProps<Props>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div>
    <MilkdownProvider>
      <InlineEditor
        v-model="model"
        :="props"
      />
    </MilkdownProvider>
  </div>
</template>

--- File: apps/client/src/components/01.kit/inline-editor/ui/inline-editor.vue ---

<script setup lang="ts">
import type { CrepeFeature } from '@milkdown/crepe'
import { Crepe } from '@milkdown/crepe'
import { editorViewOptionsCtx } from '@milkdown/kit/core'
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener'
import { Milkdown, useEditor } from '@milkdown/vue'
import '@milkdown/crepe/theme/common/style.css'

interface Props {
  disabled?: boolean
  placeholder?: string
  features?: Partial<Record<CrepeFeature, boolean>>
}

const props = defineProps<Props>()
const markdown = defineModel<string>({ required: true })

if (markdown.value === undefined) {
  markdown.value = ``
}

useEditor((root) => {
  const crepe = new Crepe({
    root,
    defaultValue: markdown.value,
    featureConfigs: {
      [Crepe.Feature.Placeholder]: {
        text: props.placeholder || 'Начните вводить текст...',
      },

    },
    features: {
      ...props.features,
      [Crepe.Feature.Latex]: false,
    },
  })

  crepe.editor
    .config((ctx) => {
      ctx.update(editorViewOptionsCtx, prev => ({
        ...prev,
        editable: () => !props.disabled,
      }))

      const listenerValue = ctx.get(listenerCtx)
      listenerValue.markdownUpdated((_, md) => {
        markdown.value = md
      })
    })
    .use(listener)

  crepe.on((crepeListener) => {
    crepeListener.markdownUpdated((md) => {
      // eslint-disable-next-line no-console
      console.log('Markdown updated:', md)
    })

    crepeListener.updated(() => {
      // eslint-disable-next-line no-console
      console.log('Document updated')
    })

    crepeListener.focus(() => {
      // eslint-disable-next-line no-console
      console.log('Editor focused')
    })

    crepeListener.blur(() => {
      // eslint-disable-next-line no-console
      console.log('Editor blurred')
    })
  })

  return crepe
})
</script>

<template>
  <div :class="{ 'milkdown-disabled': disabled, 'has-content': !!markdown }">
    <Milkdown />
  </div>
</template>

<style lang="scss" scoped>
.milkdown-disabled {
  opacity: 0.7;
  pointer-events: none;
}

.has-content :deep(.crepe-placeholder) {
  opacity: 0;
}

:deep() {
  .milkdown {
    > div {
      padding: 8px;
    }
    em {
      color: var(--fg-accent-color);
    }
    code {
      color: var(--fg-secondary-color);
      background: var(--bg-tertiary-color);
    }
    p {
      margin: 0;
      padding: 0;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    em,
    code {
      font-family: 'Rubik';
    }
    blockquote {
      padding-left: 16px;
    }
    .list-item {
      gap: 2px;
    }
    .label-wrapper {
      height: auto !important;
    }
    .ordered,
    .bullet {
      padding: 0 !important;
      height: auto !important;
      font-weight: 500;
      color: var(--fg-tertiary-color);

      > svg {
        fill: var(--fg-secondary-color) !important;
      }
    }
    .milkdown-code-block {
      padding: 0;
      .cm-line {
        color: var(--fg-secondary-color);
      }
    }
  }
  .milkdown-block-handle {
    z-index: 100;
    padding: 4px !important;

    .operation-item {
      background-color: var(--bg-secondary-color);
      border: 1px solid var(--border-secondary-color);
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &:last-of-type {
        display: none !important;
      }
    }
  }
}
</style>

--- File: apps/client/src/components/01.kit/kit-btn/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/kit-btn/ui/index.ts ---

export { default as KitBtn } from './kit-btn.vue'

--- File: apps/client/src/components/01.kit/kit-btn/ui/kit-btn.vue ---

<script setup lang="ts">
interface Props {
  variant?: 'solid' | 'outlined'
  color?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  color: 'primary',
  disabled: false,
})

const componentClasses = computed(() => [
  'kit-btn',
  `kit-btn--${props.variant}`,
  `kit-btn--color-${props.color}`,
])
</script>

<template>
  <button
    :class="componentClasses"
    :disabled="props.disabled"
    type="button"
  >
    <span class="kit-btn__content">
      <slot />
    </span>
  </button>
</template>

<style scoped lang="scss">
.kit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.1s ease;

  & * {
    pointer-events: none;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--solid {
    &.kit-btn--color-primary {
      background-color: var(--fg-accent-color);
      color: #fff;

      &:not(:disabled):hover {
        background-color: var(--bg-action-hover-color);
      }
    }
    &.kit-btn--color-secondary {
      background-color: var(--bg-tertiary-color);
      color: var(--fg-primary-color);

      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
      }
    }
    transition: all 0.2s ease-in-out;
  }

  &--outlined {
    background-color: transparent;

    &.kit-btn--color-primary {
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);

      &:not(:disabled):hover {
        background-color: rgba(var(--fg-accent-color-rgb), 0.1);
      }
    }
    &.kit-btn--color-secondary {
      border-color: var(--border-secondary-color);
      color: var(--fg-secondary-color);
      &:not(:disabled):hover {
        background-color: var(--bg-hover-color);
        border-color: var(--border-primary-color);
      }
    }
    transition: all 0.2s ease-in-out;
  }
}

.kit-btn__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

--- File: apps/client/src/components/01.kit/skeleton/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/skeleton/ui/index.ts ---

import SkeletonWrapper from './skeleton-wrapper.vue'
import Skeleton from './skeleton.vue'

export { Skeleton, SkeletonWrapper }

--- File: apps/client/src/components/01.kit/skeleton/ui/skeleton-wrapper.vue ---

<script setup lang="ts">
interface Props {
  loading: boolean
}

defineProps<Props>()
</script>

<template>
  <Transition name="skeleton-fade" mode="out-in">
    <!-- Если загрузка, показываем слот для скелетонов -->
    <div v-if="loading" key="skeleton">
      <slot name="skeleton" />
    </div>

    <!-- Иначе показываем контент по умолчанию -->
    <div v-else key="content">
      <slot />
    </div>
  </Transition>
</template>

<style>
/*
  Стили для Transition должны быть глобальными или не-scoped,
  чтобы Vue мог их правильно применять к элементам, которые входят и выходят из DOM.
*/
.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}

.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>

--- File: apps/client/src/components/01.kit/skeleton/ui/skeleton.vue ---

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'wave'
  width?: string | number
  height?: string | number
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: undefined,
  width: '100%',
  height: '1.2em',
  borderRadius: '4px',
})

const style = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  borderRadius: props.borderRadius,
}))
</script>

<template>
  <div
    class="p-skeleton"
    :class="{ 'p-skeleton--wave': props.type === 'wave' }"
    :style="style"
  >
    <!-- Невидимый контент для сохранения высоты строки -->
    ‌
  </div>
</template>

<style scoped>
.p-skeleton {
  color: transparent;
  display: block;
  user-select: none;
  background: var(--bg-disabled-color, #e0e0e0);
}

.p-skeleton * {
  visibility: hidden;
}

.p-skeleton--wave {
  position: relative;
  overflow: hidden;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
}

.p-skeleton--wave::after {
  animation: wave 1.5s linear 0s infinite;
  background: linear-gradient(90deg, transparent, var(--bg-overlay-dark-color, rgba(0, 0, 0, 0.08)), transparent);
  content: '';
  position: absolute;
  transform: translate3d(-100%, 0, 0);
  will-change: transform;
  inset: 0;
}

@keyframes wave {
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  60% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>

--- File: apps/client/src/components/01.kit/time-field/index.ts ---

export * from './ui'

--- File: apps/client/src/components/01.kit/time-field/ui/index.ts ---

import TimeField from './time-field.vue'

export { TimeField }

--- File: apps/client/src/components/01.kit/time-field/ui/time-field.vue ---

<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { TimeFieldInput, TimeFieldRoot } from 'reka-ui'

interface Props {
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  hourCycle?: '12' | '24'
}

withDefaults(defineProps<Props>(), {
  placeholder: '--:--',
  hourCycle: '24',
})

const model = defineModel<Time | null | undefined>({ required: true })
</script>

<template>
  <div class="time-field-wrapper">
    <TimeFieldRoot
      id="time-field"
      v-slot="{ segments }"
      v-model="model"
      granularity="minute"
      :disabled="disabled"
      :readonly="readonly"
      class="time-field"
      :hour-cycle="24"
      part="dayPeriod"
    >
      <template
        v-for="item in segments"
        :key="item.part"
      >
        <TimeFieldInput
          v-if="item.part === 'literal'"
          :part="item.part"
        >
          {{ item.value }}
        </TimeFieldInput>
        <TimeFieldInput
          v-else
          :part="item.part"
        >
          {{ item.value }}
        </TimeFieldInput>
      </template>
    </TimeFieldRoot>
  </div>
</template>

<style scoped lang="scss">
.time-field-wrapper {
  display: flex;
  flex-direction: column;
}

.time-field {
  display: flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 4px;
  border-width: 1px;
  text-align: center;
  background-color: var(--bg-tertiary-color);
  user-select: none;

  .TimeFieldLiteral {
    &:last-of-type {
      display: none;
    }
  }
}
</style>

--- File: apps/client/src/components/02.shared/async-state-wrapper/index.ts ---

import AsyncStateWrapper from './ui/async-state-wrapper.vue'

export { AsyncStateWrapper }

--- File: apps/client/src/components/02.shared/async-state-wrapper/ui/async-state-wrapper.vue ---

<script setup lang="ts" generic="T">
import type { Ref } from 'vue'
import { SkeletonWrapper } from '~/components/01.kit/skeleton'
import { ErrorPlaceholder } from '~/components/02.shared/error-placeholder'

withDefaults(defineProps<{
  loading?: boolean
  error?: unknown | null | Ref<unknown | null>
  data?: T | null
  retryHandler?: () => void | Promise<void> | Promise<unknown>
  transition?: string
}>(), {
  loading: false,
  data: null,
  retryHandler: undefined,
  transition: 'none',
})
</script>

<template>
  <SkeletonWrapper
    :loading="loading"
    class="async-state-wrapper"
    :name="transition"
  >
    <template #skeleton>
      <slot v-if="loading" name="loading">
        <div>Загрузка...</div>
      </slot>
    </template>
    <template #default>
      <slot
        v-if="error"
        name="error"
        :error="error"
        :retry="retryHandler"
      >
        <ErrorPlaceholder
          image-src="/images/smth-wrong.png"
          title="Что-то пошло не так"
          message="Произошла ошибка при загрузке данных"
          action-text="Попробовать снова"
          @action="retryHandler"
        />
      </slot>

      <slot
        v-else-if="data"
        name="success"
        :data="data"
        :retry="retryHandler"
      />

      <slot v-else name="empty" />
    </template>
  </SkeletonWrapper>
</template>

--- File: apps/client/src/components/02.shared/background-effects/index.ts ---

export * from './ui'

--- File: apps/client/src/components/02.shared/background-effects/ui/background-effects.vue ---

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const travelIcons = [
  'mdi:airplane',
  'mdi:map-marker-outline',
  'mdi:compass-outline',
  'mdi:wallet-travel',
  'mdi:camera-outline',
  'mdi:food-fork-drink',
  'mdi:bed',
  'mdi:car',
  'mdi:train',
  'mdi:beach',
  'mdi:mountain-uphill',
  'mdi:ticket-confirmation-outline',
  'mdi:passport',
  'mdi:briefcase-outline',
  'mdi:earth',
  'mdi:sun-compass',
  'mdi:sunglasses',
  'mdi:ship-wheel',
  'mdi:flag-variant-outline',
]

function getRandomIcon() {
  return travelIcons[Math.floor(Math.random() * travelIcons.length)]
}

const symbols = Array.from({ length: 40 }, () => ({
  icon: getRandomIcon(),
  top: Math.random() * 100,
  left: Math.random() * 100,
  delay: Math.random() * 1,
  duration: 10 + Math.random() * 15,
  size: 1 + Math.random() * 0.8,
}))
</script>

<template>
  <div class="background-effects">
    <div
      v-for="(symbol, index) in symbols"
      :key="index"
      class="symbol"
      :style="{
        top: `${symbol.top}%`,
        left: `${symbol.left}%`,
        animationDelay: `${symbol.delay}s`,
        animationDuration: `${symbol.duration}s`,
        fontSize: `${symbol.size}rem`,
      }"
    >
      <Icon :icon="symbol.icon" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(to center, var(--bg-primary-color), var(--bg-tertiary-color));
  z-index: -1;

  .symbol {
    position: absolute;
    color: var(--fg-secondary-color);
    animation: floatEffect linear infinite;
    user-select: none;
    opacity: 0;
  }
}

@keyframes floatEffect {
  0% {
    opacity: 0;
    transform: translateY(20px) rotate(0deg);
  }
  5%,
  95% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
    transform: translateY(-40px) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-80px) rotate(360deg);
  }
}
</style>

--- File: apps/client/src/components/02.shared/background-effects/ui/index.ts ---

import BackgroundEffects from './background-effects.vue'

export { BackgroundEffects }

--- File: apps/client/src/components/02.shared/error-placeholder/index.ts ---

import ErrorPlaceholder from './ui/index.vue'

export { ErrorPlaceholder }

--- File: apps/client/src/components/02.shared/error-placeholder/ui/index.vue ---

<script setup lang="ts">
import { KitBtn } from '~/components/01.kit/kit-btn'

interface Props {
  title?: string
  message?: string
  imageSrc?: string
  actionText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Что-то пошло не так',
  message: 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
  imageSrc: '/images/smth-wrong.png',
  actionText: '',
})

const emit = defineEmits<{ (e: 'action'): void }>()
</script>

<template>
  <div class="error-placeholder">
    <img
      :src="imageSrc"
      class="image"
      alt=""
      height="180"
      aria-hidden="true"
    >
    <h1 class="title">
      {{ title }}
    </h1>
    <p v-if="message" class="description">
      {{ message }}
    </p>
    <KitBtn
      v-if="actionText"
      variant="outlined"
      color="secondary"
      class="action"
      @click="emit('action')"
    >
      {{ actionText }}
    </KitBtn>
  </div>
</template>

<style scoped lang="scss">
.error-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  padding: 16px;
}

.image {
  user-select: none;
  pointer-events: none;
  margin-bottom: 16px;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-top: 8px;
  color: var(--fg-primary-color);
}

.description {
  margin-top: 12px;
  font-size: 1rem;
  color: var(--fg-secondary-color);
  max-width: 370px;
  line-height: 1.5;
  letter-spacing: 0%;
  text-align: center;
}

.action {
  margin: 24px 0;
  min-width: 220px;

  &:deep(.kit-btn__content) {
    color: var(--fg-accent-color);
  }
}
</style>

--- File: apps/client/src/components/02.shared/sync-indicator/index.ts ---

export * from './ui'

--- File: apps/client/src/components/02.shared/sync-indicator/ui/index.ts ---

import SyncIndicator from './sync-indicator.vue'

export { SyncIndicator }

--- File: apps/client/src/components/02.shared/sync-indicator/ui/sync-indicator.vue ---

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useSyncStore } from '~/shared/store/sync.store'

const syncStore = useSyncStore()
const isOpen = ref(false)

const syncStatusConfig = computed(() => {
  switch (syncStore.status) {
    case 'syncing':
      return {
        icon: 'mdi:sync',
        color: 'var(--color-info)',
        label: 'Синхронизация...',
        spin: true,
      }
    case 'success':
      return {
        icon: 'mdi:check-circle',
        color: 'var(--color-success)',
        label: 'Синхронизировано',
        spin: false,
      }
    case 'error':
      return {
        icon: 'mdi:alert-circle',
        color: 'var(--color-error)',
        label: 'Ошибка синхронизации',
        spin: false,
      }
    case 'offline':
      return {
        icon: 'mdi:wifi-off',
        color: 'var(--color-warning)',
        label: 'Оффлайн режим',
        spin: false,
      }
    default:
      return {
        icon: 'mdi:sync',
        color: 'var(--color-muted)',
        label: 'Ожидание синхронизации',
        spin: false,
      }
  }
})

const formatLastSync = computed(() => {
  if (!syncStore.lastSyncTime)
    return 'Никогда'

  const now = new Date()
  const lastSync = new Date(syncStore.lastSyncTime)
  const diffMs = now.getTime() - lastSync.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1)
    return 'Только что'
  if (diffMinutes < 60)
    return `${diffMinutes} мин назад`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24)
    return `${diffHours} ч назад`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} дн назад`
})

async function handleForceSync() {
  await syncStore.forceSync()
  isOpen.value = false
}

function handleToggleAutoSync() {
  syncStore.toggleAutoSync()
}

async function handleClearCache() {
  await syncStore.clearCache()
  isOpen.value = false
}
</script>

<template>
  <DropdownMenuRoot v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <button class="sync-trigger">
        <Icon
          :icon="syncStatusConfig.icon"
          class="sync-icon" :class="[{ spinning: syncStatusConfig.spin }]"
          :style="{ color: syncStatusConfig.color }"
        />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent class="sync-dropdown" align="end" :side-offset="16">
        <!-- Статус синхронизации -->
        <div class="sync-status">
          <div class="status-header">
            <Icon
              :icon="syncStatusConfig.icon"
              class="status-icon" :class="[{ spinning: syncStatusConfig.spin }]"
              :style="{ color: syncStatusConfig.color }"
            />
            <div class="status-info">
              <div class="status-label">
                {{ syncStatusConfig.label }}
              </div>
              <div class="status-time">
                {{ formatLastSync }}
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Статистика -->
        <div class="sync-stats">
          <div class="stat-item">
            <Icon icon="mdi:database-sync" class="stat-icon" />
            <span>Несинхронизированно: {{ syncStore.pendingCount }}</span>
          </div>
          <div class="stat-item">
            <Icon icon="mdi:cloud-check" class="stat-icon" />
            <span>В облаке: {{ syncStore.cloudCount }}</span>
          </div>
        </div>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Действия -->
        <DropdownMenuItem
          class="sync-action"
          :disabled="syncStore.status === 'syncing'"
          @click="handleForceSync"
        >
          <Icon icon="mdi:refresh" class="action-icon" />
          <span>Принудительная синхронизация</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          class="sync-action"
          @click="handleToggleAutoSync"
        >
          <Icon
            :icon="syncStore.autoSyncEnabled ? 'mdi:pause' : 'mdi:play'"
            class="action-icon"
          />
          <span>
            {{ syncStore.autoSyncEnabled ? 'Приостановить' : 'Возобновить' }} авто-синхронизацию
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="dropdown-separator" />

        <!-- Опасные действия -->
        <DropdownMenuItem
          class="sync-action danger"
          @click="handleClearCache"
        >
          <Icon icon="mdi:delete-sweep" class="action-icon" />
          <span>Очистить локальный кэш</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss" scoped>
.sync-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &:active {
    transform: scale(0.95);
  }
}

.sync-icon {
  font-size: 16px;
  transition: transform 0.2s ease;

  &.spinning {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.sync-dropdown) {
  min-width: 280px;
  padding: 8px;
  background: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;

  &[data-side='top'] {
    animation: slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='right'] {
    animation: slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='bottom'] {
    animation: slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  &[data-side='left'] {
    animation: slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.sync-status {
  padding: 8px;

  .status-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .status-icon {
    font-size: 20px;
    margin-top: 2px;

    &.spinning {
      animation: spin 1s linear infinite;
    }
  }

  .status-info {
    flex: 1;
  }

  .status-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--fg-primary-color);
    line-height: 1.4;
  }

  .status-time {
    font-size: 12px;
    color: var(--fg-muted-color);
    margin-top: 2px;
  }
}

.sync-stats {
  padding: 4px 8px;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-size: 13px;
    color: var(--fg-secondary-color);

    .stat-icon {
      font-size: 14px;
      color: var(--fg-muted-color);
    }
  }
}

.sync-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--fg-primary-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
  outline: none;

  &[data-highlighted] {
    background-color: var(--bg-hover-color);
  }

  &[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &.danger {
    color: #dc2626;

    &[data-highlighted] {
      background-color: var(--bg-error-color);
    }
  }

  .action-icon {
    font-size: 14px;
  }
}

.dropdown-separator {
  height: 1px;
  background-color: var(--border-secondary-color);
  margin: 4px 0;
}

// Анимации появления
@keyframes slideUpAndFade {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRightAndFade {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDownAndFade {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeftAndFade {
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

--- File: apps/client/src/components/04.modules/root/index.ts ---

export * from './ui'

--- File: apps/client/src/components/04.modules/root/ui/index.ts ---

import Root from './root.vue'

export { Root }

--- File: apps/client/src/components/04.modules/root/ui/root.vue ---

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMouse, useWindowSize } from '@vueuse/core'
import { KitBtn } from '~/components/01.kit/kit-btn'

const router = useRouter()

function goToTrips() {
  router.push(AppRoutePaths.Trip.List)
}

const cardRef = ref<HTMLElement | null>(null)
const transformStyle = ref('')

const { x, y } = useMouse({ touch: false })
const { width, height } = useWindowSize()

const cardTransform = computed(() => {
  if (!cardRef.value)
    return ''

  const maxRotate = 8
  const perspective = 1000

  const rotateX = ((y.value / height.value) * 2 - 1) * maxRotate * -1
  const rotateY = ((x.value / width.value) * 2 - 1) * maxRotate

  return `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
})

function onMouseLeave() {
  transformStyle.value = ''
}
function onMouseMove() {
  transformStyle.value = cardTransform.value
}
</script>

<template>
  <div class="root-page" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <div ref="cardRef" class="glass-card" :style="{ transform: transformStyle }">
      <div class="logo-accent">
        <Icon icon="mdi:map-marker-path" />
      </div>
      <h1 class="title">
        Trip Scheduler
      </h1>
      <p class="subtitle">
        Ваш умный помощник для создания идеальных маршрутов, организации планов и незабываемых впечатлений.
      </p>
      <KitBtn
        class="cta-button"
        @click="goToTrips"
      >
        <Icon icon="mdi:compass-rose" />
        К моим путешествиям
      </KitBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.root-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  padding: 16px;
  animation: fadeIn 0.8s ease-out forwards;
}

.glass-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px;
  border-radius: 24px;
  background-color: rgba(var(--bg-secondary-color-rgb), 0.5);
  border: 1px solid rgba(var(--border-secondary-color-rgb), 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  max-width: 600px;
}

.logo-accent {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-accent-color);
  font-size: 4rem;
  margin-bottom: 24px;
  animation: float 4s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(var(--fg-accent-color-rgb), 0.5);
}

.title {
  font-size: 2.75rem;
  font-weight: 700;
  color: var(--fg-primary-color);
  margin: 0 0 16px 0;
  line-height: 48px;
  letter-spacing: -1px;
  background: linear-gradient(90deg, var(--fg-accent-color), #5e72e4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--fg-secondary-color);
  max-width: 450px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.cta-button {
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(var(--fg-accent-color-rgb), 0.2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--fg-accent-color-rgb), 0.3);
  }

  :deep(.kit-btn__content) {
    font-size: 1.25rem;
    gap: 12px;
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/index.ts ---

import TripInfo from './ui/trip-info.vue'

export { TripInfo }

--- File: apps/client/src/components/04.modules/trip-info/lib/helpers.ts ---

import type { IActivity } from '../models/types'
import { EActivityTag } from '../models/types'

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function getActivityDuration(activity: IActivity): number {
  return timeToMinutes(activity.endTime) - timeToMinutes(activity.startTime)
}

export const activityTagIcons: Record<EActivityTag, string> = {
  [EActivityTag.TRANSPORT]: 'mdi-car',
  [EActivityTag.WALK]: 'mdi-walk',
  [EActivityTag.FOOD]: 'mdi-food',
  [EActivityTag.ATTRACTION]: 'mdi-camera',
  [EActivityTag.RELAX]: 'mdi-bed',
}

export const activityTagColors: Record<EActivityTag, string> = {
  [EActivityTag.TRANSPORT]: '#e3f2fd',
  [EActivityTag.WALK]: '#e8f5e9',
  [EActivityTag.FOOD]: '#fff8e1',
  [EActivityTag.ATTRACTION]: '#f3e5f5',
  [EActivityTag.RELAX]: '#e0f2f1',
}

--- File: apps/client/src/components/04.modules/trip-info/models/types.ts ---

import type { Activity, Day } from '~/shared/types/models/activity'
import { ActivityTag } from '~/shared/types/models/activity'

export type IActivity = Activity
export type IDay = Day
export { ActivityTag as EActivityTag }

--- File: apps/client/src/components/04.modules/trip-info/store/trip-store.ts ---

import type { IActivity, IDay } from '../models/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useDatabase } from '~/shared/composables/use-database'
import { timeToMinutes } from '../lib/helpers'

/**
 * Стор для управления состоянием информации о конкретном путешествии,
 * включая его дни и активности.
 */
export const useTripStore = defineStore('tripInfo', () => {
  // --- STATE ---

  const days = ref<IDay[]>([])
  const currentTripId = ref<string | null>(null)
  const currentDayId = ref<string | null>(null)
  const fetchStatus = ref<'idle' | 'pending' | 'success' | 'error'>('idle')
  const fetchError = ref<unknown | null>(null)

  // UI State
  const isDaysPanelOpen = ref<boolean>(false)
  const isDaysPanelPinned = ref<boolean>(false)
  const interactionMode = ref<'view' | 'edit'>('edit')

  // --- GETTERS ---

  const isLoading = computed(() => fetchStatus.value === 'pending')
  const isViewMode = computed(() => interactionMode.value === 'view')
  const getAllDays = computed((): IDay[] => days.value)
  const getSelectedDay = computed((): IDay | null => {
    if (!currentDayId.value)
      return null
    return days.value.find(day => day.id === currentDayId.value) ?? null
  })
  const getActivitiesForSelectedDay = computed((): IActivity[] => {
    return getSelectedDay.value?.activities
      .slice()
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)) ?? []
  })

  // --- PRIVATE HELPERS ---

  function findDayAndIndex(dayId: string) {
    const dayIndex = days.value.findIndex(d => d.id === dayId)
    if (dayIndex === -1) {
      console.warn(`День с ID "${dayId}" не найден.`)
      return null
    }
    return { day: days.value[dayIndex], index: dayIndex }
  }

  // --- ACTIONS ---

  /**
   * Открывает панель дней.
   */
  function openDaysPanel() {
    isDaysPanelOpen.value = true
  }

  /**
   * Закрывает панель дней.
   */
  function closeDaysPanel() {
    isDaysPanelOpen.value = false
  }

  /**
   * Переключает состояние закрепления панели.
   */
  function toggleDaysPanelPinned() {
    isDaysPanelPinned.value = !isDaysPanelPinned.value
  }

  /**
   * Устанавливает режим взаимодействия.
   */
  function setInteractionMode(mode: 'view' | 'edit') {
    interactionMode.value = mode
  }

  /**
   * Загружает дни для указанного путешествия.
   */
  async function fetchDaysForTrip(tripId: string) {
    currentTripId.value = tripId
    fetchStatus.value = 'pending'
    fetchError.value = null

    await useDatabase({
      immediate: true,
      fn: db => db.days.getByTripId(tripId),
      onSuccess: (result) => {
        const sortedDays = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        days.value = sortedDays
        currentDayId.value = sortedDays.length > 0 ? sortedDays[0].id : null
        fetchStatus.value = 'success'
      },
      onError: (error) => {
        days.value = []
        currentDayId.value = null
        fetchError.value = error
        fetchStatus.value = 'error'
        console.error(`Ошибка при загрузке дней для путешествия ${tripId}:`, error)
      },
    })
  }

  /**
   * Устанавливает текущий выбранный день.
   */
  function setCurrentDay(dayId: string): void {
    currentDayId.value = dayId
  }

  /**
   * Обновляет детали дня с оптимистичным UI и откатом при ошибке.
   */
  async function updateDayDetails(dayId: string, details: { title?: string, description?: string, date?: string }) {
    const result = findDayAndIndex(dayId)
    if (!result)
      return

    const { index } = result
    const originalDay = { ...days.value[index] }

    // 1. Оптимистичное обновление
    days.value[index] = { ...originalDay, ...details }

    // Если была изменена дата, пересортируем массив дней
    if (details.date)
      days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // 2. Асинхронная операция с обработчиками
    // await useDatabase({
    //   immediate: true,
    //   key: `update-day-${dayId}`,
    //   fn: db => db.days.update(dayId, details), // Предполагаем, что метод .update существует
    //   onSuccess: () => {
    //     // console.log('День успешно обновлен.');
    //   },
    //   onError: (error) => {
    //     // 3. Откат изменений при ошибке
    //     days.value[index] = originalDay
    //     // Если была изменена дата, нужно снова отсортировать
    //     if (details.date) {
    //        days.value.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    //     }
    //     console.error('Не удалось обновить день. Изменения отменены.', error)
    //     // Рекомендуется показать пользователю уведомление об ошибке
    //   },
    // })
  }

  /**
   * Добавляет новую активность в день.
   */
  async function addActivity(dayId: string, activity: Omit<IActivity, 'id'>) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const tempId = `temp-activity-${Date.now()}`
    const newActivity: IActivity = { ...activity, id: tempId }

    // Оптимистичное добавление
    day.activities.push(newActivity)

    // await useDatabase({
    //   immediate: true,
    //   key: `add-activity-${activity.id}`,
    //   fn: db => db.activities.create(dayId, activity), // Предполагаем, что метод .create существует
    //   onError: (error) => {
    //     day.activities.pop() // Откат
    //     console.error('Не удалось добавить активность.', error)
    //     // Показать уведомление пользователю
    //   },
    // })
  }

  /**
   * Удаляет активность из дня.
   */
  async function removeActivity(dayId: string, activityId: string) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const index = day.activities.findIndex(a => a.id === activityId)
    if (index === -1)
      return null

    // const removedActivity = day.activities.splice(index, 1)[0] // Оптимистичное удаление

    // await useDatabase({
    //   immediate: true,
    //   key: `remove-activity-${activityId}`,
    //   fn: db => db.activities.delete(activityId), // Предполагаем, что метод .delete существует
    //   onError: (error) => {
    //     day.activities.splice(index, 0, removedActivity) // Откат
    //     console.error('Не удалось удалить активность.', error)
    //     // Показать уведомление пользователю
    //   },
    // })
  }

  /**
   * Обновляет данные существующей активности.
   */
  async function updateActivity(dayId: string, updatedActivity: IActivity) {
    const day = days.value.find(d => d.id === dayId)
    if (!day)
      return

    const activityIndex = day.activities.findIndex(a => a.id === updatedActivity.id)
    if (activityIndex === -1)
      return

    // ... (логика проверки на пересечение) ...

    // Оптимистичное обновление
    day.activities[activityIndex] = updatedActivity

    // const originalActivity = day.activities[activityIndex]

    // await useDatabase({
    //   immediate: true,
    //   key: `update-activity-${updatedActivity.id}`,
    //   fn: db => db.activities.update(updatedActivity.id, updatedActivity),
    //   onError: (error) => {
    //     day.activities[activityIndex] = originalActivity // Откат
    //     console.error('Не удалось обновить активность.', error)
    //   },
    // })
  }

  /**
   * Добавляет новый день в путешествие.
   */
  async function addNewDay() {
    if (!currentTripId.value)
      return
    const lastDay = days.value[days.value.length - 1]
    const newDate = lastDay ? new Date(lastDay.date) : new Date()
    if (lastDay)
      newDate.setDate(newDate.getDate() + 1)

    const newDay: Omit<IDay, 'id'> = {
      tripId: currentTripId.value,
      title: `День ${days.value.length + 1}`,
      description: '',
      date: newDate.toISOString(),
      activities: [],
    }

    // Временный ID для оптимистичного UI
    const tempId = `temp-day-${Date.now()}`
    const dayWithTempId: IDay = { ...newDay, id: tempId }
    days.value.push(dayWithTempId)
    currentDayId.value = tempId

    // await useDatabase({
    //   immediate: true,
    //   key: `add-day-${tempId}`,
    //   fn: db => db.days.create(newDay),
    //   onSuccess: (createdDay) => {
    //     // Заменяем временный день на настоящий из БД
    //     const dayIndex = days.value.findIndex(d => d.id === tempId)
    //     if (dayIndex !== -1) {
    //       days.value[dayIndex] = createdDay
    //       currentDayId.value = createdDay.id
    //     }
    //   },
    //   onError: (error) => {
    //     // Откат
    //     days.value = days.value.filter(d => d.id !== tempId)
    //     console.error('Не удалось создать день.', error)
    //   },
    // })
  }

  /**
   * Изменяет порядок активностей в дне.
   */
  function reorderActivities(dayId: string, newOrder: IActivity[]): void {
    const result = findDayAndIndex(dayId)
    if (!result)
      return

    result.day.activities = newOrder
    // При необходимости можно добавить сохранение порядка на бэкенд
  }

  return {
    // State
    days,
    currentTripId,
    currentDayId,
    fetchStatus,
    fetchError,
    isDaysPanelOpen,
    isDaysPanelPinned,
    interactionMode,

    // Getters
    isLoading,
    getAllDays,
    getSelectedDay,
    getActivitiesForSelectedDay,
    isViewMode,

    // Actions
    openDaysPanel,
    closeDaysPanel,
    toggleDaysPanelPinned,
    addNewDay,
    fetchDaysForTrip,
    setCurrentDay,
    updateDayDetails,
    addActivity,
    removeActivity,
    updateActivity,
    reorderActivities,
    setInteractionMode,
  }
})

--- File: apps/client/src/components/04.modules/trip-info/ui/controls/add-day-activity.vue ---

<script setup lang="ts">
import { Icon } from '@iconify/vue'

const emit = defineEmits(['add'])
</script>

<template>
  <div class="add-day-activity">
    <button class="add-button" @click="emit('add')">
      <Icon icon="mdi:plus" />
      <span>Добавить активность</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.add-day-activity {
  margin: 32px 0;
  display: flex;
  justify-content: center;

  .add-button {
    width: 100%;
    padding: 12px;
    background-color: transparent;
    border: 2px dashed var(--border-secondary-color);
    color: var(--fg-secondary-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 1rem;
    font-weight: 500;

    &:hover {
      background-color: var(--bg-hover-color);
      border-color: var(--fg-accent-color);
      color: var(--fg-accent-color);
    }
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/controls/days-controls.vue ---

<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { Icon } from '@iconify/vue'
import { parseDate } from '@internationalized/date'
import { CalendarPopover } from '~/components/01.kit/calendar-popover'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import DaysPanel from './days-panel.vue'
import ModeSwitcher from './mode-switcher.vue'

const tripStore = useTripStore()
const { getAllDays, getSelectedDay, isDaysPanelPinned, isDaysPanelOpen, isViewMode } = storeToRefs(tripStore)
const { setCurrentDay, addNewDay, updateDayDetails } = tripStore

const selectedCalendarDate = computed<CalendarDate | null>({
  get: () => {
    return getSelectedDay.value ? parseDate(getSelectedDay.value.date.split('T')[0]) : null
  },
  set: (newDate) => {
    if (!newDate || !getSelectedDay.value)
      return

    const currentDay = getSelectedDay.value
    const originalDate = currentDay.date
    const newDateString = newDate.toString() // 'YYYY-MM-DD'

    // Не делать ничего, если дата не изменилась
    if (originalDate.startsWith(newDateString))
      return

    const newIsoDate = new Date(newDateString).toISOString()

    // Ищем, не занята ли новая дата другим днем
    const occupiedDay = getAllDays.value.find(
      day => day.date.startsWith(newDateString) && day.id !== currentDay.id,
    )

    if (occupiedDay) {
      // Дата занята, меняем даты местами
      updateDayDetails(occupiedDay.id, { date: originalDate })
      updateDayDetails(currentDay.id, { date: newIsoDate })
    }
    else {
      // Дата свободна, просто обновляем текущий день
      updateDayDetails(currentDay.id, { date: newIsoDate })
    }
  },
})
</script>

<template>
  <div class="controls">
    <div class="left-controls">
      <button
        v-if="!isDaysPanelPinned"
        class="menu-btn" title="Открыть меню дней"
        @click="isDaysPanelOpen = !isDaysPanelOpen"
      >
        <Icon icon="mdi:menu" />
      </button>

      <CalendarPopover v-model="selectedCalendarDate" :disabled="isViewMode">
        <div class="current-day-info" role="button" :class="{ disabled: isViewMode }">
          <h3 v-if="getSelectedDay">
            {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) }}
          </h3>
          <span v-if="getSelectedDay">
            {{ new Date(getSelectedDay.date).toLocaleDateString('ru-RU', { weekday: 'long' }) }}
          </span>
        </div>
      </CalendarPopover>
    </div>
    <div class="spacer" />
    <ModeSwitcher />

    <DaysPanel
      :is-open="isDaysPanelOpen"
      :days="getAllDays"
      :selected-day-id="getSelectedDay?.id"
      @close="isDaysPanelOpen = false"
      @select-day="setCurrentDay"
      @add-new-day="addNewDay"
    />
  </div>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}
.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.spacer {
  flex-grow: 1;
}

.menu-btn {
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
  }
}

.current-day-info {
  cursor: pointer;
  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
  }
  span {
    color: var(--fg-secondary-color);
    text-transform: capitalize;
  }
  &.disabled {
    cursor: default;
    opacity: 0.7;
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/controls/days-panel.vue ---

<script setup lang="ts">
import type { Day } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { useDisplay } from '~/shared/composables/use-display'

interface Props {
  days: Day[]
  selectedDayId?: string
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectDay', dayId: string): void
  (e: 'addNewDay'): void
  (e: 'close'): void
}>()

const tripStore = useTripStore()
const { mdAndDown } = useDisplay()

const { isDaysPanelPinned, isViewMode } = storeToRefs(tripStore)
const { toggleDaysPanelPinned } = tripStore

function onSelectDay(dayId: string) {
  emit('selectDay', dayId)
  if (!isDaysPanelPinned.value)
    emit('close')
}

function getShortWeekday(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase()
}
</script>

<template>
  <!-- Затемняющий фон (только для всплывающей панели) -->
  <div
    v-if="(isOpen && !isDaysPanelPinned) || (isOpen && mdAndDown)"
    class="backdrop"
    @click="$emit('close')"
  />

  <!-- Сама панель -->
  <aside class="panel" :class="{ open: isOpen, pinned: !mdAndDown && isDaysPanelPinned }">
    <header class="panel-header">
      <h2>Дни путешествия</h2>
      <div class="header-buttons">
        <button
          v-if="!mdAndDown"
          class="pin-btn"
          :title="isDaysPanelPinned ? 'Открепить панель' : 'Закрепить панель'"
          @click="toggleDaysPanelPinned"
        >
          <Icon :icon="isDaysPanelPinned ? 'mdi:pin-off' : 'mdi:pin'" />
        </button>
        <button class="close-btn" title="Закрыть" @click="$emit('close')">
          <Icon icon="mdi:close" />
        </button>
      </div>
    </header>

    <div class="panel-content">
      <ul class="days-list">
        <li v-for="(day, index) in days" :key="day.id">
          <button
            class="day-item"
            :class="{ active: selectedDayId === day.id }"
            @click="onSelectDay(day.id)"
          >
            <!-- Левая часть: Номер и Название -->
            <div class="day-item-main">
              <span class="day-number">{{ index + 1 }}</span>
              <span class="day-title">{{ day.title || `День ${index + 1}` }}</span>
            </div>

            <!-- Правая часть: Дата и Бейдж дня недели -->
            <div class="day-item-meta">
              <span class="day-date">{{ new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }}</span>
              <span class="day-weekday-badge">{{ getShortWeekday(day.date) }}</span>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <footer v-if="!isViewMode" class="panel-footer">
      <button class="add-day-btn" @click="$emit('addNewDay')">
        <Icon icon="mdi:plus" />
        <span>Добавить новый день</span>
      </button>
    </footer>
  </aside>
</template>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 100%;
  background-color: var(--bg-primary-color);
  z-index: 1000;
  transform: translateX(-100%);
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  opacity: 0;

  &.open {
    opacity: 1;
    transform: translateX(0);
    box-shadow: 4px 0px 15px var(--color-background-content);
  }

  &.pinned {
    position: fixed;
    transform: none;
    top: 44px;
    height: calc(100% - 44px - 47px);
    opacity: 1;
    box-shadow: none;
    border-right: 1px solid var(--border-secondary-color);

    .close-btn {
      display: none;
    }
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-secondary-color);
  flex-shrink: 0;

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-btn,
.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--fg-secondary-color);
  font-size: 1.1rem;
  line-height: 1;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--fg-primary-color);
  }
}

.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.days-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.day-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 10px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
  }

  &-main {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex-shrink: 1;
  }

  .day-number {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    background-color: var(--bg-secondary-color);
    color: var(--fg-secondary-color);
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .day-title {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--fg-primary-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .day-date {
    font-weight: 400;
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    white-space: nowrap;
  }

  .day-weekday-badge {
    background-color: var(--bg-secondary-color);
    color: var(--fg-secondary-color);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
  }

  &.active {
    background-color: var(--bg-accent-color-translucent);

    .day-number {
      background-color: var(--fg-accent-color);
      color: white;
    }
    .day-title {
      color: var(--fg-accent-color);
      font-weight: 600;
    }
    .day-date,
    .day-weekday-badge {
      color: var(--fg-accent-color);
    }
    .day-weekday-badge {
      background-color: var(--bg-accent-color-translucent-heavy, rgba(0, 122, 255, 0.2));
    }
  }
}

.panel-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-secondary-color);
  flex-shrink: 0;
}

.add-day-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border-secondary-color);
  background-color: transparent;
  color: var(--fg-secondary-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/controls/mode-switcher.vue ---

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'

const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

const buttonConfig = computed(() => {
  if (isViewMode.value) {
    return {
      icon: 'mdi:pencil-outline',
      title: 'Перейти в режим редактирования',
    }
  }
  return {
    icon: 'mdi:eye-outline',
    title: 'Перейти в режим просмотра',
  }
})

function toggleMode() {
  tripStore.setInteractionMode(isViewMode.value ? 'edit' : 'view')
}
</script>

<template>
  <button class="mode-button" :title="buttonConfig.title" @click="toggleMode">
    <Icon :icon="buttonConfig.icon" />
  </button>
</template>

<style scoped lang="scss">
.mode-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-secondary-color);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--fg-secondary-color);
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    background-color: var(--bg-hover-color);
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/day-activities/item.vue ---

<script setup lang="ts">
import type { Activity, ActivitySection, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { Time } from '@internationalized/date'
import { onClickOutside } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { TimeField } from '~/components/01.kit/time-field'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { ActivitySectionType } from '~/shared/types/models/activity'
import { ActivitySectionRenderer } from './sections'

interface ActivityItemProps {
  activity: Activity
}

const props = defineProps<ActivityItemProps>()
const emit = defineEmits(['update', 'delete'])

const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

const isTimeEditing = ref(false)
const timeEditorRef = ref<HTMLElement | null>(null)

const editingStartTime = shallowRef<Time | null>(null)
const editingEndTime = shallowRef<Time | null>(null)

function updateActivity(newActivityData: Partial<Activity>) {
  emit('update', { ...props.activity, ...newActivityData })
}

// function deleteActivity() {
//   emit('delete', props.activity.id)
// }

function parseTime(timeStr: string): Time {
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Time(hour, minute)
}

function editTime() {
  if (isViewMode.value)
    return

  isTimeEditing.value = true
  editingStartTime.value = parseTime(props.activity.startTime)
  editingEndTime.value = parseTime(props.activity.endTime)
}

function saveTimeChanges() {
  if (!isTimeEditing.value)
    return

  const newStartTime = `${editingStartTime.value?.hour.toString().padStart(2, '0')}:${editingStartTime.value?.minute.toString().padStart(2, '0')}`
  const newEndTime = `${editingEndTime.value?.hour.toString().padStart(2, '0')}:${editingEndTime.value?.minute.toString().padStart(2, '0')}`

  updateActivity({ startTime: newStartTime, endTime: newEndTime })
  isTimeEditing.value = false
}

function cancelTimeEditing() {
  isTimeEditing.value = false
}

const activityTitle = computed({
  get: () => props.activity.title,
  set: newTitle => updateActivity({ title: newTitle }),
})

onClickOutside(timeEditorRef, saveTimeChanges)

function updateSection(sectionIndex: number, newSectionData: ActivitySection) {
  const newSections = [...(props.activity.sections || [])]
  newSections[sectionIndex] = newSectionData
  updateActivity({ sections: newSections })
}

function addSection(type: ActivitySectionType) {
  if (type === ActivitySectionType.DESCRIPTION) {
    const newSection: ActivitySectionText = {
      id: uuidv4(),
      type: ActivitySectionType.DESCRIPTION,
      text: '',
    }
    const newSections = [...(props.activity.sections || []), newSection]
    updateActivity({ sections: newSections })
  }
}

function deleteSection(sectionIndex: number) {
  const newSections = [...(props.activity.sections || [])]
  newSections.splice(sectionIndex, 1)
  updateActivity({ sections: newSections })
}
</script>

<template>
  <div class="activity-item" :class="{ 'view-mode': isViewMode }">
    <div v-if="!isViewMode" class="drag-handle" />

    <div class="activity-header">
      <div class="activity-time">
        <!-- Режим редактирования -->
        <div
          v-if="isTimeEditing"
          ref="timeEditorRef"
          class="time-editor"
          @keydown.esc.prevent="cancelTimeEditing"
        >
          <TimeField
            v-if="editingStartTime"
            v-model="editingStartTime"
          />
          <span class="time-separator">-</span>
          <TimeField
            v-if="editingEndTime"
            v-model="editingEndTime"
          />
        </div>

        <!-- Режим отображения -->
        <div v-else class="time-display" @click="editTime">
          {{ activity.startTime }} - {{ activity.endTime }}
        </div>
      </div>
    </div>

    <div class="activity-title">
      <Icon icon="mdi:chevron-right" />
      <InlineEditorWrapper
        v-model="activityTitle"
        placeholder="Описание активности"
        :disabled="isViewMode"
        class="activity-title-editor"
        :features="{ 'block-edit': false }"
      />
    </div>

    <div class="activity-sections">
      <div v-if="activity.sections && activity.sections.length > 0" class="sections-list">
        <ActivitySectionRenderer
          v-for="(section, index) in activity.sections"
          :key="section.id"
          :section="section"
          @update:section="newSectionData => updateSection(index, newSectionData)"
          @delete:section="deleteSection(index)"
        />
      </div>
      <div v-if="!isViewMode" class="add-section-controls">
        <KitBtn
          variant="outlined"
          color="secondary"
          @click="addSection(ActivitySectionType.DESCRIPTION)"
        >
          <Icon icon="mdi:text-box-plus-outline" />
          Добавить заметку
        </KitBtn>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.activity-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
  margin: 32px 0;

  &.view-mode {
    .time-display {
      cursor: default;
      &:hover {
        background-color: transparent;
      }
    }
    &:hover {
      .activity-header .activity-time::before {
        color: var(--fg-secondary-color);
      }
      &::before {
        background-color: var(--border-secondary-color);
      }
    }
  }
  &:hover {
    .activity-header {
      .activity-time {
        width: 140px;

        &::before {
          opacity: 1;
          color: var(--fg-accent-color);
        }
      }
    }

    &::before {
      background-color: var(--fg-accent-color);
    }
  }

  .drag-handle {
    position: absolute;
    left: -19px;
    width: 18px;
    top: 50%;
    height: 100%;
    transform: translateY(-50%);
    cursor: grab;
    padding: 8px;

    &:active {
      cursor: grabbing;
    }
  }

  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .activity-time {
      position: relative;
      line-height: normal;
      font-weight: 600;
      color: var(--fg-accent-color);
      padding: 4px;

      &::before {
        position: absolute;
        left: -15px;
        top: 6px;
        content: '✦';
        color: var(--fg-accent-color);
        font-size: 0.8rem;
        color: var(--fg-secondary-color);
        opacity: 0.5;
        transition:
          color 0.2s ease,
          opacity 0.2s ease;
      }
      .time-display {
        cursor: pointer;
        padding: 2px 4px;
        margin: -2px -4px;
        border-radius: 4px;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--bg-hover-color);
        }
      }

      .time-editor {
        display: flex;
        align-items: center;
        gap: 4px;

        .time-separator {
          color: var(--fg-secondary-color);
          padding: 0 2px;
        }
      }
    }
  }

  .activity-title {
    display: flex;
    margin-top: 4px;
    gap: 4px;
    color: var(--fg-primary-color);

    .iconify {
      height: 24px;
      opacity: 0.5;
      color: var(--fg-secondary-color);
    }

    &-editor {
      width: 100%;

      :deep(.milkdown) {
        color: var(--fg-primary-color);
        line-height: 24px;

        * {
          font-weight: 500;
          font-size: 1.1rem;
        }

        > div {
          flex-grow: 1;
          margin: 0;
          padding: 0;
        }
      }
    }
  }

  .activity-sections {
    margin-top: 12px;
    padding-left: 8px;
  }

  .sections-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;

    &:has(:nth-child(2)) {
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        bottom: 10px;
        right: 4%;
        width: 8px;
        background-color: var(--bg-primary-color);
        transition: background-color 0.2s ease;
        border-left: 3px solid var(--border-secondary-color);
        border-right: 3px solid var(--border-secondary-color);
      }
    }
  }

  .add-section-controls {
    :deep(.kit-btn) {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }
  }

  &::before {
    position: absolute;
    left: -10px;
    top: 30px;
    content: '';
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    height: calc(100% - 30px);
    width: 2px;
    background-color: var(--border-secondary-color);
    transition: background-color 0.2s ease;
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/day-activities/list.vue ---

<script setup lang="ts">
import type { IActivity } from '~/components/04.modules/trip-info//models/types'
import draggable from 'vuedraggable'
import { minutesToTime, timeToMinutes } from '~/components/04.modules/trip-info//lib/helpers'
import { EActivityTag } from '~/components/04.modules/trip-info/models/types'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import ActivityItem from './item.vue'

const tripStore = useTripStore()
const { getActivitiesForSelectedDay, getSelectedDay, isViewMode } = storeToRefs(tripStore)
const { reorderActivities, updateActivity, removeActivity, addActivity } = tripStore

const draggableActivities = computed({
  get: () => getActivitiesForSelectedDay.value,
  set: (newOrder: IActivity[]) => {
    if (getSelectedDay.value)
      reorderActivities(getSelectedDay.value.id, newOrder)
  },
})

function onUpdateActivity(updatedActivity: IActivity) {
  if (getSelectedDay.value)
    updateActivity(getSelectedDay.value.id, updatedActivity)
}

function onDeleteActivity(activityId: string) {
  if (getSelectedDay.value)
    removeActivity(getSelectedDay.value.id, activityId)
}

defineExpose({
  handleAddNewActivity: () => {
    if (!getSelectedDay.value)
      return

    const lastActivity = getActivitiesForSelectedDay.value.at(-1)
    const startTimeMinutes = lastActivity ? timeToMinutes(lastActivity.endTime) + 15 : 9 * 60 // 9:00
    const endTimeMinutes = startTimeMinutes + 60

    const newActivity: Omit<IActivity, 'id'> = {
      title: 'Новая активность',
      startTime: minutesToTime(startTimeMinutes),
      endTime: minutesToTime(endTimeMinutes),
      tag: EActivityTag.ATTRACTION,
      sections: [],
    }
    addActivity(getSelectedDay.value.id, newActivity)
  },
})
</script>

<template>
  <div class="day-activities">
    <div class="activities-container">
      <draggable
        v-model="draggableActivities"
        ghost-class="ghost-activity"
        chosen-class="chosen-activity"
        animation="300"
        item-key="id"
        handle=".drag-handle"
        :disabled="isViewMode"
        class="draggable-area"
      >
        <template #item="{ element: activity }">
          <ActivityItem
            :activity="activity"
            @update="onUpdateActivity"
            @delete="onDeleteActivity"
          />
        </template>
      </draggable>

      <div v-if="getActivitiesForSelectedDay.length === 0" class="empty-state">
        <p>На этот день нет запланированных активностей</p>
        <button v-if="!isViewMode" class="g-button" @click="$emit('add')">
          Добавить активность
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.day-activities {
  .activities-container {
    width: 100%;
    position: relative;
    min-height: 100px;

    .draggable-area {
      min-height: 1px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      border: 2px dashed var(--border-secondary-color);
      border-radius: 8px;
      margin-top: 20px;
      text-align: center;

      p {
        margin-bottom: 20px;
        color: var(--fg-secondary-color);
      }
    }
  }
}

.ghost-activity {
  opacity: 0.5;
  background: var(--bg-secondary-color);
  border-radius: 6px;
  > div {
    visibility: hidden;
  }
}

.chosen-activity {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
  z-index: 10;
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/description-section.vue ---

<script setup lang="ts">
import type { ActivitySectionText } from '~/shared/types/models/activity'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTripStore } from '../../../store/trip-store'

interface Props {
  section: ActivitySectionText
}

const props = defineProps<Props>()
const emit = defineEmits(['update:section'])
const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

const sectionModel = computed({
  get: () => props.section.text,
  set: (newText) => {
    emit('update:section', { ...props.section, text: newText })
  },
})
</script>

<template>
  <div class="description-section">
    <InlineEditorWrapper
      v-model="sectionModel"
      :disabled="isViewMode"
      placeholder="Добавьте заметку или описание..."
      class="section-editor"
    />
  </div>
</template>

<style scoped lang="scss">
.description-section {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 4px;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--border-primary-color);
  }
}
.section-editor :deep(.milkdown) > div {
  padding: 8px;
  min-height: 30px;
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/index.ts ---

import DescriptionSection from './description-section.vue'
import ActivitySectionRenderer from './section-renderer.vue'

export { ActivitySectionRenderer, DescriptionSection }

--- File: apps/client/src/components/04.modules/trip-info/ui/day-activities/sections/section-renderer.vue ---

<script setup lang="ts">
import type { ActivitySection, ActivitySectionText } from '~/shared/types/models/activity'
import { Icon } from '@iconify/vue'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { ActivitySectionType } from '~/shared/types/models/activity'
import DescriptionSection from './description-section.vue'

interface Props {
  section: ActivitySection
}
defineProps<Props>()
const emit = defineEmits(['update:section', 'delete:section'])
const tripStore = useTripStore()
const { isViewMode } = storeToRefs(tripStore)

function onUpdate(data: ActivitySection) {
  emit('update:section', data)
}
</script>

<template>
  <div class="activity-section-renderer">
    <DescriptionSection
      v-if="section.type === ActivitySectionType.DESCRIPTION"
      :section="section as ActivitySectionText"
      @update:section="onUpdate"
    />

    <button
      v-if="!isViewMode"
      class="delete-btn"
      title="Удалить секцию"
      @click="emit('delete:section')"
    >
      <Icon icon="mdi:close" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.activity-section-renderer {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-primary-color);
  }
}

.activity-section-renderer:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/day-header/index.vue ---

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { InlineEditorWrapper } from '~/components/01.kit/inline-editor'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'

const tripStore = useTripStore()
const { getSelectedDay: selectedDay, isViewMode } = storeToRefs(tripStore)

function updateDayDetails(details: { title?: string, description?: string }) {
  if (selectedDay.value) {
    tripStore.updateDayDetails(selectedDay.value.id, details)
  }
}
</script>

<template>
  <div v-if="selectedDay" class="day-header">
    <InlineEditorWrapper
      :model-value="selectedDay.title"
      placeholder="Название дня..."
      :disabled="isViewMode"
      :features="{ 'block-edit': false }"
      class="day-title"
      @update:model-value="newTitle => updateDayDetails({ title: newTitle })"
    />
    <InlineEditorWrapper
      :model-value="selectedDay.description || ''"
      :disabled="isViewMode"
      placeholder="Добавьте описание..."
      :features="{ 'block-edit': false }"
      class="day-description"
      @update:model-value="newDesc => updateDayDetails({ description: newDesc })"
    />
  </div>
</template>

<style scoped lang="scss">
.day-header {
  position: relative;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: 4px 4px 16px 16px;
  padding: 32px;
  margin-bottom: 32px;
  margin-top: 16px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--fg-accent-color), transparent);
    opacity: 0.7;
  }
}

.day-title,
.day-description {
  width: 100%;

  :deep(.milkdown) {
    > div {
      padding: 8px 12px;
      margin: -8px -12px;
      border-radius: 12px;
      cursor: text;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: var(--bg-hover-color);
      }
    }
  }
}

.day-title {
  margin-bottom: 1rem;

  :deep() {
    .ProseMirror {
      h1,
      p {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--fg-primary-color);
        line-height: 1.2;
        letter-spacing: -0.025em;
        margin: 0;
      }
    }
  }
}

.day-description {
  :deep() {
    .ProseMirror p {
      color: var(--fg-secondary-color);
      line-height: 1.7;
      font-size: 0.9rem;
      margin: 0;
    }
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/states/trip-info-skeleton.vue ---

<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="trip-info-skeleton">
    <div class="days-controls-skeleton">
      <Skeleton v-for="i in 5" :key="i" width="36px" height="36px" border-radius="50%" type="wave" />
      <div class="spacer" />
      <Skeleton width="36px" height="36px" border-radius="8px" type="wave" />
    </div>

    <div class="divider-skeleton">
      <Skeleton width="80px" height="12px" border-radius="4px" type="wave" />
    </div>

    <div class="day-header-skeleton">
      <Skeleton width="60%" height="32px" border-radius="6px" type="wave" style="margin-bottom: 12px;" />
      <Skeleton width="85%" height="18px" border-radius="6px" type="wave" />
      <Skeleton width="75%" height="18px" border-radius="6px" type="wave" />
    </div>

    <div class="divider-skeleton">
      <Skeleton width="120px" height="12px" border-radius="4px" type="wave" />
    </div>

    <div class="activities-list-skeleton">
      <div v-for="i in 3" :key="i" class="activity-item-skeleton">
        <Skeleton width="120px" height="20px" border-radius="4px" type="wave" />
        <div class="activity-content-skeleton">
          <Skeleton width="90%" height="40px" border-radius="6px" type="wave" />
        </div>
      </div>
    </div>

    <Skeleton width="100%" height="52px" border-radius="8px" type="wave" style="margin-top: 16px;" />
  </div>
</template>

<style scoped lang="scss">
.trip-info-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 100%;
}

.days-controls-skeleton {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 0;

  .spacer {
    flex-grow: 1;
  }
}

.divider-skeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px 0;
}

.day-header-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-primary-color);
}

.activities-list-skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.activity-item-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-content-skeleton {
  padding: 12px;
  background-color: var(--bg-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-primary-color);
  min-height: 60px;
}
</style>

--- File: apps/client/src/components/04.modules/trip-info/ui/trip-info.vue ---

<script setup lang="ts">
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useTripStore } from '../store/trip-store'
import AddDayActivity from './controls/add-day-activity.vue'
import DaysControls from './controls/days-controls.vue'
import DayActivitiesList from './day-activities/list.vue'
import DayHeader from './day-header/index.vue'
import TripInfoSkeleton from './states/trip-info-skeleton.vue'

const tripStore = useTripStore()
const route = useRoute()

const {
  days,
  isLoading,
  fetchError,
  getActivitiesForSelectedDay,
  isViewMode,
} = storeToRefs(tripStore)

const tripId = computed(() => route.params.id as string)

const dayActivitiesListRef = ref<InstanceType<typeof DayActivitiesList> | null>(null)

function handleAddNewDay() {
  tripStore.addNewDay()
}

function handleAddNewActivity() {
  dayActivitiesListRef.value?.handleAddNewActivity()
}

onMounted(() => {
  if (tripId.value)
    tripStore.fetchDaysForTrip(tripId.value)
})
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading"
    :error="fetchError"
    :data="days"
    :retry-handler="() => tripStore.fetchDaysForTrip(tripId)"
    class="trip-info-wrapper"
  >
    <template #loading>
      <TripInfoSkeleton />
    </template>

    <template #success>
      <div class="trip-info">
        <DaysControls />

        <div class="divider">
          о дне
        </div>

        <DayHeader />

        <div class="divider">
          маршрут
        </div>

        <DayActivitiesList
          ref="dayActivitiesListRef"
          @add="handleAddNewActivity"
        />

        <AddDayActivity
          v-if="getActivitiesForSelectedDay.length && !isViewMode"
          @add="handleAddNewActivity"
        />
      </div>
    </template>

    <template #empty>
      <div class="trip-content-empty">
        <p>Пока не создано ни одного дня для вашего путешествия.</p>
        <button class="g-button-primary" @click="handleAddNewDay">
          Создать первый день
        </button>
      </div>
    </template>
  </AsyncStateWrapper>
</template>

--- File: apps/client/src/components/04.modules/trip-list/composables/use-trip-list.ts ---

import type { ITrip } from '../models/types'

export function useTripList() {
  const {
    data: trips,
    status: fetchStatus,
    error: fetchError,
    execute: fetchTrips,
  } = useDatabase<ITrip[]>({
    initialData: [],
    immediate: true,
    fn: db => db.trips.getAll(),
  })

  const isLoading = computed(() => fetchStatus.value === 'pending')

  return {
    trips,
    isLoading,
    fetchError,
    fetchTrips,
  }
}

--- File: apps/client/src/components/04.modules/trip-list/index.ts ---

export * from './ui'

--- File: apps/client/src/components/04.modules/trip-list/models/types.ts ---

import type { Trip } from '~/shared/types/models/trip'

export type ITrip = Trip

--- File: apps/client/src/components/04.modules/trip-list/ui/index.ts ---

import TripList from './trip-list.vue'

export { TripList }

--- File: apps/client/src/components/04.modules/trip-list/ui/states/trip-list-empty.vue ---

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
</script>

<template>
  <div class="state-container">
    <div class="content">
      <Icon
        icon="mdi:package-variant-closed-remove"
        class="image"
        width="150"
        height="150"
      />
      <h3 class="title">
        Путешествий пока нет
      </h3>
      <p class="message">
        Самое время запланировать ваше следующее приключение!
      </p>
      <KitBtn>
        <Icon icon="mdi:plus" />
        Создать путешествие
      </KitBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.state-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
  color: var(--fg-secondary-color);
  width: 100%;
  border: 2px dashed var(--border-secondary-color);
  border-radius: 12px;
  margin-top: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.image {
  opacity: 0.7;
  margin-bottom: 16px;
  color: var(--fg-secondary-color);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--fg-primary-color);
  margin: 0;
}

.message {
  font-size: 1rem;
  color: var(--fg-secondary-color);
  margin: 0 0 8px;
  max-width: 320px;
  line-height: 1.5;
}
</style>

--- File: apps/client/src/components/04.modules/trip-list/ui/states/trip-list-skeleton.vue ---

<script setup lang="ts">
import TripCardSkeleton from '../trip-card/card-skeleton.vue'
</script>

<template>
  <TripCardSkeleton v-for="i in 3" :key="i" />
</template>

--- File: apps/client/src/components/04.modules/trip-list/ui/trip-card/card-item.vue ---

<script setup lang="ts">
import type { ITrip } from '../../models/types'
import { Icon } from '@iconify/vue'

type Props = ITrip

const props = withDefaults(defineProps<Props>(), {
  participants: () => [],
  tags: () => [],
  visibility: 'private',
})

const router = useRouter()

function goTo() {
  router.push(AppRoutePaths.Trip.Info(`${props.id}`))
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const avatarColorNames = ['blue', 'orange', 'green', 'red', 'purple', 'cyan']

function getAvatarClass(name: string): string {
  const index = name.length % avatarColorNames.length
  return `avatar--${avatarColorNames[index]}`
}
// --- КОНЕЦ ИЗМЕНЕНИЯ 1 ---

// Форматирование дат
const formattedDates = computed(() => {
  const start = new Date(props.startDate)
  const end = new Date(props.endDate)

  const formatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
  })

  if (start.getFullYear() === end.getFullYear()) {
    return `${formatter.format(start)} - ${formatter.format(end)} ${start.getFullYear()}`
  }
  else {
    return `${formatter.format(start)} ${start.getFullYear()} - ${formatter.format(end)} ${end.getFullYear()}`
  }
})

// Информация о статусе
const statusInfo = computed(() => {
  switch (props.status) {
    case 'completed':
      return { text: 'Завершено', class: 'completed', icon: 'mdi:check-circle-outline' }
    case 'in-progress':
      return { text: 'В процессе', class: 'in-progress', icon: 'mdi:airplane-takeoff' }
    case 'planned':
      return { text: 'Запланировано', class: 'planned', icon: 'mdi:calendar-check-outline' }
    default:
      return { text: 'Черновик', class: 'draft', icon: 'mdi:pencil-circle-outline' }
  }
})

// Форматирование бюджета
const formattedBudget = computed(() => {
  if (!props.budget || !props.currency)
    return null
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: props.currency,
    minimumFractionDigits: 0,
  }).format(props.budget)
})

// Иконка для приватности
const visibilityIcon = computed(() => {
  switch (props.visibility) {
    case 'public':
      return { icon: 'mdi:earth', title: 'Публичное путешествие' }
    case 'shared':
      return { icon: 'mdi:account-multiple-outline', title: 'Доступно по ссылке' }
    default:
      return { icon: 'mdi:lock-outline', title: 'Приватное путешествие' }
  }
})
</script>

<template>
  <div class="travel-card-wrapper">
    <div class="travel-card" @click="goTo">
      <div class="card-image-container">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="title"
          class="card-image"
        >
        <div v-else class="card-no-image">
          <Icon icon="mdi:map-legend" />
        </div>
        <div class="image-overlay" />
        <div class="card-header">
          <span class="card-status" :class="[statusInfo.class]">
            <Icon :icon="statusInfo.icon" />
            {{ statusInfo.text }}
          </span>
        </div>

        <h3 class="card-title">
          {{ title }}
        </h3>

        <span class="card-visibility" :title="visibilityIcon.title">
          <Icon :icon="visibilityIcon.icon" />
        </span>

        <div class="card-actions">
          <button class="action-btn" title="Редактировать" @click.stop>
            <Icon icon="mdi:pencil-outline" />
          </button>
          <button class="action-btn" title="Поделиться" @click.stop>
            <Icon icon="mdi:share-variant-outline" />
          </button>
          <button class="action-btn" title="Еще" @click.stop>
            <Icon icon="mdi:dots-vertical" />
          </button>
        </div>
      </div>

      <div class="card-content">
        <div class="card-meta">
          <div class="meta-item">
            <Icon icon="mdi:calendar-month-outline" />
            <span>{{ formattedDates }}</span>
          </div>
          <div class="meta-item">
            <Icon icon="mdi:map-marker-outline" />
            <span>{{ cities.join(', ') }}</span>
          </div>
          <div v-if="formattedBudget" class="meta-item">
            <Icon icon="mdi:wallet-outline" />
            <span>{{ formattedBudget }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div v-if="participants.length" class="card-participants">
            <div
              v-for="participant in participants.slice(0, 3)"
              :key="participant"
              class="avatar"
              :class="getAvatarClass(participant)"
            >
              <span>{{ getInitials(participant) }}</span>
            </div>
            <div v-if="participants.length > 3" class="avatar avatar--more">
              <span>+{{ participants.length - 3 }}</span>
            </div>
          </div>
          <div v-if="tags?.length" class="card-tags">
            <span v-for="tag in tags.slice(0, 2)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color'; // Импортируем модуль color для использования color.mix

$avatar-base-colors: (
  'blue': #096dd9,
  'orange': #d48806,
  'green': #389e0d,
  'red': #d9363e,
  'purple': #722ed1,
  'cyan': #08979c,
);

// Миксин для генерации стилей аватара
@mixin generate-avatar-colors($base-color) {
  color: $base-color;
  // Используем современный синтаксис color.mix для устранения предупреждения
  background-color: color.mix(white, $base-color, 90%);
}

.travel-card-wrapper {
  padding: 8px;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: var(--bg-secondary-color);
  }
}

.travel-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--bg-secondary-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 1px solid transparent;

  .travel-card-wrapper:hover & {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    border-color: var(--border-secondary-color);
  }
}

.card-image-container {
  position: relative;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 16px;
  box-sizing: border-box;

  .card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .travel-card-wrapper:hover .card-image {
    transform: scale(1.05);
  }

  .card-no-image {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    font-size: 56px;
    opacity: 0.5;
  }

  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 1;
  }
}

.card-header {
  position: relative;
  display: flex;
  z-index: 2;
}

.card-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);

  &.completed {
    background-color: rgba(27, 131, 89, 0.7);
  }
  &.in-progress {
    background-color: rgba(5, 122, 255, 0.7);
  }
  &.planned {
    background-color: rgba(224, 117, 0, 0.7);
  }
  &.draft {
    background-color: rgba(108, 117, 125, 0.7);
  }
}

.card-visibility {
  position: absolute;
  bottom: 12px;
  right: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.card-title {
  position: relative;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 40px 0 0;
  z-index: 2;
  line-height: 1.2;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.card-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  z-index: 3;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  .travel-card-wrapper:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: rgba(255, 255, 255, 0.85);
    color: var(--fg-primary-color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;

    &:hover {
      background-color: #fff;
      transform: scale(1.1);
      color: var(--fg-accent-color);
    }
  }
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--fg-secondary-color);
    font-size: 0.9rem;

    .iconify {
      font-size: 1.25rem;
      color: var(--fg-tertiary-color);
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary-color);
}

.card-participants {
  display: flex;
  align-items: center;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    border: 2px solid var(--bg-secondary-color);
    margin-left: -8px;

    // Генерируем классы-модификаторы для каждого цвета
    @each $name, $color in $avatar-base-colors {
      &--#{$name} {
        @include generate-avatar-colors($color);
      }
    }

    &:first-child {
      margin-left: 0;
    }

    &--more {
      color: var(--fg-secondary-color);
      background-color: var(--bg-tertiary-color);
    }
  }
}

.card-tags {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;

  .tag {
    background-color: var(--bg-tertiary-color);
    color: var(--fg-secondary-color);
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>

--- File: apps/client/src/components/04.modules/trip-list/ui/trip-card/card-skeleton.vue ---

<script setup lang="ts">
import { Skeleton } from '~/components/01.kit/skeleton'
</script>

<template>
  <div class="travel-card-wrapper">
    <div class="travel-card">
      <div class="card-image-container">
        <Skeleton height="200px" width="100%" border-radius="0" />
      </div>
      <div class="card-content">
        <div class="card-meta">
          <Skeleton width="70%" height="24px" class="mb-4" />
          <Skeleton width="50%" height="18px" />
          <Skeleton width="60%" height="18px" />
          <Skeleton width="40%" height="18px" />
        </div>
        <div class="card-footer">
          <div class="card-participants-skeleton">
            <Skeleton width="32px" height="32px" border-radius="50%" />
            <Skeleton width="32px" height="32px" border-radius="50%" style="margin-left: -12px" />
          </div>
          <div class="card-tags-skeleton">
            <Skeleton width="70px" height="26px" border-radius="16px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.travel-card-wrapper {
  padding: 8px;
  border-radius: 20px;
}

.travel-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: var(--bg-secondary-color);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid var(--border-primary-color);
}

.card-image-container {
  height: 200px;
  width: 100%;
  background-color: var(--bg-tertiary-color);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary-color);
}

.card-participants-skeleton,
.card-tags-skeleton {
  display: flex;
  align-items: center;
}

.mb-4 {
  margin-bottom: 4px;
}
</style>

--- File: apps/client/src/components/04.modules/trip-list/ui/trip-list-content.vue ---

<script setup lang="ts">
import type { ITrip } from '../models/types'
import TripCard from './trip-card/card-item.vue'

interface Props {
  trips: ITrip[]
}

defineProps<Props>()
</script>

<template>
  <TripCard
    v-for="trip in trips"
    :key="trip.id"
    :="trip"
  />
</template>

--- File: apps/client/src/components/04.modules/trip-list/ui/trip-list.vue ---

<script setup lang="ts">
import { AsyncStateWrapper } from '~/components/02.shared/async-state-wrapper'
import { useTripList } from '../composables/use-trip-list'

import TripListEmpty from './states/trip-list-empty.vue'
import TripListSkeleton from './states/trip-list-skeleton.vue'
import TripListContent from './trip-list-content.vue'

const { trips, isLoading, fetchError, fetchTrips } = useTripList()

const displayData = computed(() => (trips.value && trips.value.length > 0) ? trips.value : null)
</script>

<template>
  <AsyncStateWrapper
    :loading="isLoading"
    :error="fetchError"
    :data="displayData"
    :retry-handler="fetchTrips"
  >
    <template #loading>
      <TripListSkeleton />
    </template>

    <template #success="{ data }">
      <TripListContent :trips="data" />
    </template>

    <template #empty>
      <TripListEmpty />
    </template>
  </AsyncStateWrapper>
</template>

--- File: apps/client/src/components/05.layouts/default/index.ts ---

export { default as DefaultLayout } from './ui/layout.vue'

--- File: apps/client/src/components/05.layouts/default/ui/footer.vue ---

<script lang="ts" setup>

</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <span class="copyright">© 2025 TripScheduler</span>
      <div class="spacer" />

      <div class="links">
        <a href="/about" target="_blank" rel="noopener noreferrer" class="p-link">
          <i class="pi pi-info-circle" style="font-size: 0.875rem; color: var(--fg-primary-color)" />
        </a>

        <a href="https://github.com/injurka/chinisik" target="_blank" rel="noopener noreferrer" class="p-link">
          <i class="pi pi-github" style="font-size: 0.875rem; color: var(--fg-primary-color)" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: var(--bg-secondary-color);
  border-top: 1px solid var(--border-secondary-color);
  display: flex;
  justify-content: center;
  padding: 1rem;

  .copyright {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .links {
    display: flex;
    gap: 8px;

    .p-link {
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .spacer {
    flex: 1 1 auto;
  }

  &-content {
    display: flex;
    align-items: center;
    max-width: 1200px;
    width: 100%;
    color: var(--fg-primary-color);
  }
}
</style>

--- File: apps/client/src/components/05.layouts/default/ui/header.vue ---

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { SyncIndicator } from '~/components/02.shared/sync-indicator'
import { AppRoutePaths } from '~/shared/types/routes'

const headerEl = ref<HTMLElement>()
const router = useRouter()
</script>

<template>
  <header
    ref="headerEl"
    class="header glass"
  >
    <div class="header-content">
      <!-- Навигационная часть с логотипом -->
      <div class="header-nav" @click="router.push(AppRoutePaths.Root)">
        <div class="logo">
          <!-- Иконка логотипа стала меньше -->
          <Icon class="logo-icon" icon="mdi:map-marker-path" style="font-size: 24px;" />
          <span class="logo-text">Trip Scheduler</span>
        </div>
      </div>

      <!-- Центральный заполнитель -->
      <div class="header-center" />

      <!-- Утилиты: синхронизация и профиль -->
      <div class="header-utils">
        <SyncIndicator />
        <div class="vr" />

        <div class="profile">
          <div class="profile-img">
            <!-- Размер иконки профиля скорректирован -->
            <Icon
              icon="mdi:face-man-profile"
              style="font-size: 32px;"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.glass {
  --filter-glass3d: blur(12px) brightness(1) saturate(1.5);
  --color-glass3d: hsla(180, 6%, 87%, 0.3);
  --noise-glass3d: url('../../../../assets/images/egg-shell.png');

  position: relative;
  z-index: 4;
}

.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 3;
  -webkit-backdrop-filter: var(--filter-glass3d);
  backdrop-filter: var(--filter-glass3d);
  background-color: var(--color-glass3d);
  background-image: var(--noise-glass3d);
  background-size: 100px;
  background-repeat: repeat;
}

.glass::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 5;
  box-shadow:
    inset 2px 2px 1px -3px hsl(205 20% 90% / 0.8),
    inset 4px 4px 2px -6px hsl(205 20% 90% / 0.3),
    inset 1.5px 1.5px 1.5px -0.75px hsl(205 20% 90% / 0.15),
    inset 1.5px 1.5px 0.25px hsl(205 20% 90% / 0.03),
    inset 0 0 0.25px 0.5px hsl(205 20% 90% / 0.03);
}

.glass > * {
  position: relative;
  z-index: 6;
}

.header {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid var(--border-primary-color);
  height: 44px;
  width: 100%;
  z-index: 100;
  transition:
    background-color 0.3s ease,
    backdrop-filter 0.3s ease;
  background-color: rgb(var(--bg-header-color));

  &.glass {
    background-color: transparent;
  }

  &-content {
    max-width: 1200px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    font-family: 'Rubik';
    padding: 0 12px;
  }

  &-nav {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &-text {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1;
      }
    }
  }

  &-center {
    flex: 1;
  }

  &-utils {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile {
    display: flex;
    align-items: center;
    justify-content: center;

    &-img {
      border-radius: 50%;
      border: 1px solid var(--border-primary-color);
      overflow: hidden;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s ease-in-out;

      &:hover {
        border-color: var(--border-accent-color);
      }
    }
  }

  .vr {
    margin: 0;
    height: 20px;
    width: 1px;
    background-color: var(--border-primary-color);
  }
}
</style>

--- File: apps/client/src/components/05.layouts/default/ui/layout.vue ---

<script lang="ts" setup>
import { BackgroundEffects } from '~/components/02.shared/background-effects'
import Footer from './footer.vue'
import Header from './header.vue'
</script>

<template>
  <!-- eslint-disable vue/no-multiple-template-root -->
  <Header />

  <main class="main">
    <div class="main-content">
      <slot />
    </div>

    <BackgroundEffects />

    <Footer />
  </main>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.main-content {
  height: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>

--- File: apps/client/src/components/05.layouts/empty/index.ts ---

export { default as EmptyLayout } from './ui/layout.vue'

--- File: apps/client/src/components/05.layouts/empty/ui/layout.vue ---

<script lang="ts" setup>
import { BackgroundEffects } from '~/components/02.shared/background-effects'
</script>

<template>
  <main class="main">
    <div class="main-content">
      <slot />
    </div>

    <BackgroundEffects />
  </main>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.main-content {
  height: 100%;
  display: flex;
  flex: 1;
}
</style>

--- File: apps/client/src/main.ts ---

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import router from '~/shared/lib/router'
import { initializePwaUpdater } from '~/shared/services/pwa/pwa.service'

import app from './app.vue'

const pinia = createPinia()
const appInstance = createApp(app)

appInstance.use(router)
appInstance.use(pinia)

appInstance.mount('#app')

initializePwaUpdater()

--- File: apps/client/src/pages/not-found.vue ---

<script setup lang="ts" />

<template>
  <div>404</div>
</template>

<style />

--- File: apps/client/src/pages/root.vue ---

<script setup lang="ts">
import { Root } from '~/components/04.modules/root'
</script>

<template>
  <section class="root-wrapper">
    <Root />
  </section>
</template>

<style lang="scss" scoped>
.root-wrapper {
  @include default-font();

  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
  max-width: 1000px;
  min-height: 100%;
  width: 100%;
  margin: 0 auto;

  @include media-down(sm) {
    padding: 4px;
  }
}
</style>

--- File: apps/client/src/pages/trip/[id]/index.vue ---

<script setup lang="ts">
import { TripInfo } from '~/components/04.modules/trip-info'
import { useTripStore } from '~/components/04.modules/trip-info/store/trip-store'
import { useDisplay } from '~/shared/composables/use-display'

const tripStore = useTripStore()
const { isDaysPanelPinned } = storeToRefs(tripStore)
const { mdAndDown } = useDisplay()
</script>

<template>
  <section class="content-wrapper" :class="{ isPanelPinned: isDaysPanelPinned && !mdAndDown }">
    <TripInfo />
  </section>
</template>

<style lang="scss" scoped>
.content-wrapper {
  &.isPanelPinned {
    @media (max-width: 1800px) {
      margin-left: 400px;
    }
  }
}
</style>

--- File: apps/client/src/pages/trip/list.vue ---

<script setup lang="ts">
import { TripList } from '~/components/04.modules/trip-list/index'
</script>

<template>
  <section class="content-wrapper">
    <TripList />
  </section>
</template>

--- File: apps/client/src/shared/composables/use-database.ts ---

import type { ComputedRef, Ref } from 'vue'
import type { IDatabaseClient } from '~/shared/services/database/model/types'
import databaseServicePromise from '~/shared/services/database'

/** Возможные статусы асинхронной операции */
type DatabaseStatus = 'idle' | 'pending' | 'success' | 'error'

/** Тип для функции, выполняющей запрос к БД */
type DatabaseFn<T> = (db: IDatabaseClient) => Promise<T>

/** Опции для composable `useDatabase` */
export interface UseDatabaseOptions<T> {
  /** Функция, выполняющая асинхронную операцию с базой данных. */
  fn: DatabaseFn<T>

  /**
   * Уникальный ключ для операции. Используется для логгирования ошибок.
   * @optional
   */
  key?: string

  /**
   * Следует ли выполнять операцию немедленно при инициализации.
   * @default true
   */
  immediate?: boolean

  /**
   * Начальное значение для `data` до первого выполнения.
   * @default null
   */
  initialData?: T | null

  /**
   * Коллбэк, который вызывается при успешном завершении операции.
   * @param result - Результат выполнения `fn`.
   */
  onSuccess?: (result: T) => void

  /**
   * Коллбэк, который вызывается при ошибке во время операции.
   * @param error - Перехваченная ошибка.
   */
  onError?: (error: unknown) => void
}

/** Возвращаемое значение из `useDatabase` */
export interface UseDatabaseReturn<T> {
  /** Реактивная переменная, хранящая данные, полученные от `fn`. */
  data: Ref<T | null>

  /** Текущий статус операции ('idle', 'pending', 'success', 'error'). */
  status: Ref<DatabaseStatus>

  /** Реактивная переменная, хранящая ошибку, если она произошла. */
  error: Ref<unknown | null>

  /** Computed-свойство, `true` если операция в процессе выполнения. */
  isPending: ComputedRef<boolean>

  /** Computed-свойство, `true` если операция завершена (успешно или с ошибкой). */
  isFinished: ComputedRef<boolean>

  /**
   * Функция для ручного запуска (или повторного запуска) операции.
   * Возвращает Promise с результатом.
   */
  execute: () => Promise<{ data: T | null, error: unknown | null }>
}

/**
 * Реактивный composable для безопасного выполнения операций с базой данных.
 * Управляет состоянием (данные, загрузка, ошибка) и предоставляет
 * инструменты для взаимодействия с ним.
 *
 * @param options - Объект с параметрами операции.
 * @returns Объект с реактивными переменными и функцией `execute`.
 */
export function useDatabase<T>(
  options: UseDatabaseOptions<T>,
): UseDatabaseReturn<T> {
  const {
    fn,
    key,
    immediate = true,
    initialData = null,
    onSuccess,
    onError,
  } = options

  const data = ref<T | null>(initialData)
  const status = ref<DatabaseStatus>('idle')
  const error = ref<unknown | null>(null)

  const isPending = computed(() => status.value === 'pending')
  const isFinished = computed(() => status.value === 'success' || status.value === 'error')

  const execute = async () => {
    status.value = 'pending'
    error.value = null

    try {
      const dbService = await databaseServicePromise
      const result = await fn(dbService)

      data.value = result
      status.value = 'success'
      onSuccess?.(result)

      return { data: result, error: null }
    }
    catch (e) {
      error.value = e
      status.value = 'error'
      const errorKey = key ? ` (key: ${key})` : ''
      console.error(`[useDatabase Error]${errorKey}:`, e)
      onError?.(e)

      return { data: null, error: e }
    }
  }

  if (immediate) {
    execute()
  }

  return {
    data: data as Ref<T | null>,
    status,
    error,
    isPending,
    isFinished,
    execute,
  }
}

--- File: apps/client/src/shared/composables/use-display.ts ---

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}

/**
 * @description Реактивный composable для отслеживания размеров экрана.
 * Предоставляет информацию о текущем брейкпоинте и удобные флаги.
 *
 * @example
 * const { mobile, smAndUp, name } = useDisplay();
 *
 * if (smAndUp.value) {
 *   // Логика для экранов от 600px и выше
 * }
 *
 * console.log(name.value) // -> 'lg'
 */
export function useDisplay() {
  // Состояние для хранения ширины окна.
  // Инициализируем нулем для безопасности на сервере, где `window` недоступен.
  const width = ref(0)

  // Функция обновления ширины
  const updateWidth = () => {
    // Проверяем, что код выполняется в браузере
    if (typeof window !== 'undefined') {
      width.value = window.innerWidth
    }
  }

  // Жизненные циклы Vue
  onMounted(() => {
    // Устанавливаем начальное значение при монтировании компонента
    updateWidth()
    // Добавляем слушатель события resize
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    // Удаляем слушатель при размонтировании для предотвращения утечек памяти
    window.removeEventListener('resize', updateWidth)
  })

  // --- Вычисляемые свойства (Computed Properties) ---

  // Имя текущего брейкпоинта (e.g., 'xs', 'sm', 'md')
  const name = computed(() => {
    const screenWidth = width.value
    if (screenWidth < breakpoints.sm)
      return 'xs'
    if (screenWidth < breakpoints.md)
      return 'sm'
    if (screenWidth < breakpoints.lg)
      return 'md'
    if (screenWidth < breakpoints.xl)
      return 'lg'
    if (screenWidth < breakpoints.xxl)
      return 'xl'
    return 'xxl'
  })

  // --- Основные флаги для конкретных диапазонов ---

  const xs = computed(() => width.value < breakpoints.sm)
  const sm = computed(() => width.value >= breakpoints.sm && width.value < breakpoints.md)
  const md = computed(() => width.value >= breakpoints.md && width.value < breakpoints.lg)
  const lg = computed(() => width.value >= breakpoints.lg && width.value < breakpoints.xl)
  const xl = computed(() => width.value >= breakpoints.xl && width.value < breakpoints.xxl)
  const xxl = computed(() => width.value >= breakpoints.xxl)

  // Флаг для мобильных устройств (самый частый кейс)
  const mobile = computed(() => width.value < breakpoints.md) // xs и sm

  // --- Флаги "И ВЫШЕ" (And Up) ---

  const smAndUp = computed(() => width.value >= breakpoints.sm)
  const mdAndUp = computed(() => width.value >= breakpoints.md)
  const lgAndUp = computed(() => width.value >= breakpoints.lg)
  const xlAndUp = computed(() => width.value >= breakpoints.xl)

  // --- Флаги "И НИЖЕ" (And Down) ---

  const smAndDown = computed(() => width.value < breakpoints.md)
  const mdAndDown = computed(() => width.value < breakpoints.lg)
  const lgAndDown = computed(() => width.value < breakpoints.xl)
  const xlAndDown = computed(() => width.value < breakpoints.xxl)

  // Возвращаем публичный API хука
  return {
    // Состояние
    width,
    // Имя брейкпоинта
    name,
    // Флаги диапазонов
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    // Удобный флаг для мобильных
    mobile,
    // Флаги "И ВЫШЕ"
    smAndUp,
    mdAndUp,
    lgAndUp,
    xlAndUp,
    // Флаги "И НИЖЕ"
    smAndDown,
    mdAndDown,
    lgAndDown,
    xlAndDown,
  }
}

--- File: apps/client/src/shared/composables/use-sync.ts ---

import { SyncManager } from '~/shared/services/sync/sync.service'

const syncManager = new SyncManager({
  apiEndpoint: 'https://your-api.com/api', // TODO
  apiKey: 'your-api-key', // TODO
  userId: 'current-user-id', // TODO
})

export function useSync() {
  const isOnline = ref(navigator.onLine)
  const isSyncing = ref(false)
  const syncStatus = ref<{
    isOnline: boolean
    unsyncedChanges: number
    lastSyncTime?: string
  }>({
    isOnline: navigator.onLine,
    unsyncedChanges: 0,
  })

  // Обновление статуса синхронизации
  const updateSyncStatus = async () => {
    // TODO
  }

  // Обновление статуса подключения
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    updateSyncStatus()
  }

  // Ручная синхронизация
  const manualSync = async () => {
    if (isSyncing.value) {
      return { success: false, message: 'Синхронизация уже выполняется' }
    }

    isSyncing.value = true

    // TODO

    return { success: true, message: 'Синхронизация успешно выполнена' }
  }

  // Экспорт данных для бэкапа
  const exportData = async (): Promise<Blob> => {
    const data = await syncManager.exportAllData()
    const jsonString = JSON.stringify(data, null, 2)

    return new Blob([jsonString], { type: 'application/json' })
  }

  // Инициализация
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    updateSyncStatus()

    const syncInterval = setInterval(async () => {
      if (isOnline.value && !isSyncing.value && syncStatus.value.unsyncedChanges > 0) {
        await syncManager.syncToServer()
        await updateSyncStatus()
      }
    }, 5 * 60 * 1000)

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(syncInterval)
    })
  })

  return {
    isOnline: readonly(isOnline),
    isSyncing: readonly(isSyncing),
    syncStatus: readonly(syncStatus),
    manualSync,
    exportData,
    updateSyncStatus,
  }
}

--- File: apps/client/src/shared/lib/router.ts ---

import type { Router, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import { AppRouteNames, AppRoutePaths } from '~/shared/types/routes'

const TripInfo = () => import('~/pages/trip/[id]/index.vue')
const TripList = () => import('~/pages/trip/list.vue')

const NotFound = () => import('~/pages/not-found.vue')
const Root = () => import('~/pages/root.vue')

const routes: RouteRecordRaw[] = [
  {
    path: AppRoutePaths.Root,
    name: AppRouteNames.Root,
    component: Root,
  },
  {
    path: AppRoutePaths.Trip.List,
    name: AppRouteNames.TripList,
    component: TripList,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.Trip.Info(':id'),
    name: AppRouteNames.TripInfo,
    component: TripInfo,
    meta: {
      layout: 'default',
    },
  },
  {
    path: AppRoutePaths.NotFound,
    name: AppRouteNames.NotFound,
    component: NotFound,
    meta: {
      layout: 'default',
    },
  },
]

const router: Router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router

--- File: apps/client/src/shared/services/database/clients/mock.client.ts ---

import type { IDatabaseClient, IDayRepository, ITripRepository } from '../model/types'
import { DayRepository } from '../repositories/mock/day.repository'
import { TripRepository } from '../repositories/mock/trip.repository'

class MockDatabaseClient implements IDatabaseClient {
  trips!: ITripRepository
  days!: IDayRepository

  async initDb(): Promise<this> {
    this.trips = new TripRepository()
    this.days = new DayRepository()

    return this
  }

  async getUnsyncedChanges(): Promise<any[]> {
    // В моке синхронизация не предполагается
    return Promise.resolve([])
  }

  async markAsSynced(): Promise<void> {
    // В моке ничего не помечаем
    return Promise.resolve()
  }

  async testConnection(): Promise<boolean> {
    return Promise.resolve(true)
  }
}

export { MockDatabaseClient }

--- File: apps/client/src/shared/services/database/clients/real.client.ts ---

import type Database from '@tauri-apps/plugin-sql'
import type { IDatabaseClient } from '../model/types.ts'
import { getDb } from '../connection.ts'
import { DayRepository } from '../repositories/real/day.repository.ts'
import { TripRepository } from '../repositories/real/trip.repository.ts'

class RealDatabaseClient implements IDatabaseClient {
  db!: Database

  trips!: TripRepository
  days!: DayRepository

  async initDb(): Promise<this> {
    this.db = await getDb()

    this.trips = new TripRepository(this.db)
    this.days = new DayRepository(this.db)

    return this
  }

  async getUnsyncedChanges(): Promise<Array<{
    id: number
    tableName: string
    recordId: string
    operation: string
    timestamp: string
  }>> {
    return this.db.select('SELECT * FROM sync_log WHERE synced = 0 ORDER BY timestamp ASC') || []
  }

  async markAsSynced(logIds: number[]): Promise<void> {
    if (logIds.length === 0)
      return

    const placeholders = logIds.map(() => '?').join(',')
    await this.db.execute(`UPDATE sync_log SET synced = 1 WHERE id IN (${placeholders})`, logIds)
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.db.select('SELECT 1')
      return true
    }
    catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  }
}

export { RealDatabaseClient }

--- File: apps/client/src/shared/services/database/clients/trpc.client.ts ---

import type { IDatabaseClient, IDayRepository, ITripRepository } from '../model/types'
import { DayRepository } from '../repositories/trpc/day.repository'
import { TripRepository } from '../repositories/trpc/trip.repository'

/**
 * Клиент базы данных, работающий через tRPC.
 * Взаимодействует с удаленным API вместо локальной базы данных.
 */
class TRPCDatabaseClient implements IDatabaseClient {
  trips: ITripRepository = new TripRepository()
  days: IDayRepository = new DayRepository()

  /**
   * Инициализация клиента. Для tRPC не требуется специальных действий.
   */
  async initDb(): Promise<this> {
    return this
  }

  /**
   * В режиме tRPC нет локальных несинхронизированных изменений.
   */
  async getUnsyncedChanges(): Promise<any[]> {
    return Promise.resolve([])
  }

  /**
   * В режиме tRPC все операции уже синхронизированы.
   */
  async markAsSynced(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Проверяет доступность сервера.
   * Возвращает true, если сервер доступен, иначе false.
   */
  async testConnection(): Promise<boolean> {
    try {
      // Можно было бы выполнить легковесный запрос для проверки, но для простоты
      // возвращаем true. Ошибки сети будут перехвачены при реальных вызовах.
      return true
    }
    catch {
      return false
    }
  }
}

export { TRPCDatabaseClient }

--- File: apps/client/src/shared/services/database/connection.ts ---

import Database from '@tauri-apps/plugin-sql'

let dbInstance: Database | null = null

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance
  }

  try {
    dbInstance = await Database.load('sqlite:trip-scheduler.db')
    // eslint-disable-next-line no-console
    console.log('Database connected successfully')
    return dbInstance
  }
  catch (error) {
    console.error('Failed to load database:', error)
    throw error
  }
}

--- File: apps/client/src/shared/services/database/index.ts ---

/* eslint-disable no-console */
/* eslint-disable import/no-mutable-exports */
import type { IDatabaseClient } from './model/types'

function getEnvVar(name: string): string {
  return import.meta.env ? import.meta.env[name] : ''
}

let databaseServicePromise: Promise<IDatabaseClient>

const isTauri = (window as any).__TAURI__ !== undefined

if (isTauri) {
  // --- ЛОГИКА ДЛЯ TAURI ---
  console.log('DB Service: Using RealDatabaseClient for Tauri build.')

  databaseServicePromise = import('./clients/real.client').then(
    ({ RealDatabaseClient }) => new RealDatabaseClient().initDb(),
  )
}
else {
  // --- ЛОGIКА ДЛЯ WEB ---
  const isMockMode = getEnvVar('VITE_APP_MOCK_MODE') === 'true'

  if (isMockMode) {
    console.log('DB Service: Web build is using MOCK client.')
    databaseServicePromise = import('./clients/mock.client').then(
      ({ MockDatabaseClient }) => new MockDatabaseClient().initDb(),
    )
  }
  else {
    console.log('DB Service: Web build is using TRPC client.')
    databaseServicePromise = import('./clients/trpc.client').then(
      ({ TRPCDatabaseClient }) => new TRPCDatabaseClient().initDb(),
    )
  }
}

export default databaseServicePromise

--- File: apps/client/src/shared/services/database/lib/helpers.ts ---

import { getDb } from '../connection'

async function logOperation(tableName: string, recordId: string, operation: 'CREATE' | 'UPDATE' | 'DELETE'): Promise<void> {
  const db = await getDb()

  await db.execute(
    'INSERT INTO sync_log (table_name, record_id, operation) VALUES ($1, $2, $3)',
    [tableName, recordId, operation],
  )
}

export { logOperation }

--- File: apps/client/src/shared/services/database/model/types.ts ---

import type { Day } from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'

export interface ITripRepository {
  getAll: () => Promise<Trip[]>
  getById: (id: string) => Promise<Trip | null>
}

export interface IDayRepository {
  getByTripId: (tripId: string) => Promise<Day[]>
}

// Интерфейс для всей базы данных
export interface IDatabaseClient {
  trips: ITripRepository
  days: IDayRepository

  initDb: () => Promise<this>

  // Методы синхронизации
  getUnsyncedChanges: () => Promise<any[]>
  markAsSynced: (logIds: number[]) => Promise<void>
  testConnection: () => Promise<boolean>
}

// Режимы работы
export enum DatabaseMode {
  REAL = 'real',
  MOCK = 'mock',
}

--- File: apps/client/src/shared/services/database/repositories/mock/day.mock.ts ---

import type { Day } from '~/shared/types/models/activity'
import { v4 as uuidv4 } from 'uuid'
import { ActivitySectionType } from '~/shared/types/models/activity'

export const MOCK_DAYS = [
  {
    id: uuidv4(),
    tripId: '1', // Связь с путешествием "Покорение Алтая"
    date: '2025-07-15',
    title: 'День 1 - Прибытие в Чжанцзяцзе',
    description: 'Ваш первый день в Чжанцзяцзе будет посвящен прибытию и акклиматизации. В отличие от старого плана, вы прибываете вечером и останавливаетесь в самом городе, а не в курортном районе Улинъюань. Это стратегически верное решение, так как ваша первая цель — гора Тяньмэнь, фуникулер на которую стартует прямо из города.&#x20;\n\n<br />\n\nДень пройдет в спокойном темпе. После быстрого трансфера из аэропорта и заселения в отель основной задачей будет найти место для позднего ужина. Это даст вам первое представление о жизни южного китайского города. Главная цель — комфортно разместиться и набраться сил перед завтрашним восхождением к "Небесным Вратам".\n',
    activities: [
      {
        id: uuidv4(),
        startTime: '00:00',
        endTime: '19:00',
        title: 'Прибытие в Международный аэропорт Чжанцзяцзе-Хэхуа (*DYG*)',
        sections: [{
          id: uuidv4(),
          type: ActivitySectionType.DESCRIPTION,
          text: '*   _Примечание:_ Вы прилетаете внутренним рейсом из Гуанчжоу. Все пограничные и транзитные формальности уже пройдены в аэропорту Гуанчжоу. В Чжанцзяцзе вам останется только получить багаж.',
        }],
      },
      {
        id: uuidv4(),
        startTime: '18:00',
        endTime: '19:30',
        title: 'Ужин с традиционной алтайской кухней',
        sections: [],
      },
    ],
  },
  {
    id: uuidv4(),
    tripId: '1', // Связь с путешествием "Покорение Алтая"
    date: '2025-07-16',
    title: 'Начало треккинга',
    description: 'Сегодня начинается активная часть нашего путешествия. Мы отправимся к подножию горы Белуха.',
    activities: [
      {
        id: uuidv4(),
        startTime: '09:00',
        endTime: '13:00',
        title: 'Треккинг к первой стоянке',
        sections: [],
      },
      {
        id: uuidv4(),
        startTime: '13:00',
        endTime: '14:00',
        title: 'Обед на природе',
        sections: [],
      },
    ],
  },
  {
    id: uuidv4(),
    tripId: '2', // Связь с путешествием "Неоновый Гонконг"
    date: '2025-09-10',
    title: 'Прибытие и Пик Виктория',
    activities: [],
  },
] as Day[]

--- File: apps/client/src/shared/services/database/repositories/mock/day.repository.ts ---

import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { MOCK_DAYS } from './day.mock'

class DayRepository implements IDayRepository {
  async getByTripId(tripId: string): Promise<Day[]> {
    const days = MOCK_DAYS.filter(d => d.tripId === tripId)
    return Promise.resolve(days)
  }
}

export { DayRepository }

--- File: apps/client/src/shared/services/database/repositories/mock/trip.mock.ts ---

import type { Trip } from '~/shared/types/models/trip'

export const MOCK_TRIPS: Trip[] = [
  {
    id: '1',
    title: 'Покорение Алтая',
    imageUrl: '/images/mock.jpg',
    description: 'Активный отдых и треккинг по живописным горам Алтая. Незабываемые виды и приключения.',
    days: 10,
    startDate: '2025-07-15',
    endDate: '2025-07-25',
    cities: ['Горно-Алтайск', 'Акташ'],
    status: 'completed',
    budget: 80000,
    currency: 'RUB',
    participants: ['Алексей', 'Елена'],
    tags: ['горы', 'природа', 'треккинг', 'активный отдых'],
    visibility: 'public',
  },
  {
    id: '2',
    title: 'Неоновый Гонконг',
    imageUrl: '/images/mock-2.png',
    description: 'Погружение в атмосферу азиатского мегаполиса: от небоскребов до уличной еды.',
    days: 7,
    startDate: '2025-09-10',
    endDate: '2025-09-17',
    cities: ['Гонконг'],
    status: 'planned',
    budget: 1500,
    currency: 'USD',
    participants: ['Максим'],
    tags: ['город', 'культура', 'еда', 'Азия'],
    visibility: 'private',
  },
  {
    id: '3',
    title: 'Путешествие в Японию',
    imageUrl: '/images/mock.jpg',
    description: 'Весеннее путешествие в страну восходящего солнца во время цветения сакуры.',
    days: 14,
    startDate: '2026-03-25',
    endDate: '2026-04-08',
    cities: ['Токио', 'Киото', 'Осака'],
    status: 'draft',
    budget: 3500,
    currency: 'USD',
    participants: ['Анна', 'Дмитрий'],
    tags: ['Япония', 'сакура', 'весна', 'культура'],
    visibility: 'private',
  },
]

--- File: apps/client/src/shared/services/database/repositories/mock/trip.repository.ts ---

import type { ITripRepository } from '../../model/types'
import type { Trip } from '~/shared/types/models/trip'
import { MOCK_TRIPS } from './trip.mock'

class TripRepository implements ITripRepository {
  async getAll(): Promise<Trip[]> {
    return Promise.resolve(MOCK_TRIPS)
  }

  async getById(id: string): Promise<Trip | null> {
    const trip = MOCK_TRIPS.find(t => t.id === id) || null
    return Promise.resolve(trip)
  }
}

export { TripRepository }

--- File: apps/client/src/shared/services/database/repositories/real/day.repository.ts ---

import type Database from '@tauri-apps/plugin-sql'
import type { IDayRepository } from '~/shared/services/database/model/types'
import type { Day } from '~/shared/types/models/activity'

class DayRepository implements IDayRepository {
  constructor(private db: Database) { }

  async getByTripId(tripId: string): Promise<Day[]> {
    const results = await this.db.select<any[]>(
      'SELECT * FROM days WHERE trip_id = $1 ORDER BY date ASC',
      [tripId],
    )

    return results.map(day => ({
      ...day,
      activities: JSON.parse(day.activities || '[]'),
    }))
  }
}

export { DayRepository }

--- File: apps/client/src/shared/services/database/repositories/real/trip.repository.ts ---

import type Database from '@tauri-apps/plugin-sql'
import type { ITripRepository } from '~/shared/services/database/model/types'
import type { Trip } from '~/shared/types/models/trip'

class TripRepository implements ITripRepository {
  constructor(private db: Database) {

  }

  async getAll(): Promise<Trip[]> {
    const results = await this.db.select<any[]>('SELECT * FROM trips ORDER BY start_date DESC')

    return results.map(trip => ({
      ...trip,
      cities: JSON.parse(trip.cities || '[]'),
      participants: JSON.parse(trip.participants || '[]'),
      tags: JSON.parse(trip.tags || '[]'),
    }))
  }

  async getById(id: string): Promise<Trip | null> {
    const result = await this.db.select<any[]>('SELECT * FROM trips WHERE id = $1', [id])

    if (result.length === 0)
      return null
    const trip = result[0]

    return {
      ...trip,
      cities: JSON.parse(trip.cities || '[]'),
      participants: JSON.parse(trip.participants || '[]'),
      tags: JSON.parse(trip.tags || '[]'),
    }
  }
}

export { TripRepository }

--- File: apps/client/src/shared/services/database/repositories/trpc/day.repository.ts ---

import type { IDayRepository } from '../../model/types'
import type { Day } from '~/shared/types/models/activity'
import { trpc } from '~/shared/services/trpc/trpc.service'

/**
 * Реализация репозитория для Дней (Days), использующая tRPC.
 */
class DayRepository implements IDayRepository {
  /**
   * Получает все дни для конкретного путешествия.
   * @param tripId - Уникальный идентификатор путешествия.
   * @returns Promise<Day[]> - Массив дней.
   */
  async getByTripId(tripId: string): Promise<Day[]> {
    const result = await trpc.day.getByTripId.query({ tripId })

    return result as Day[]
  }
}

export { DayRepository }

--- File: apps/client/src/shared/services/database/repositories/trpc/trip.repository.ts ---

import type { ITripRepository } from '../../model/types'
import type { Trip } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/trpc.service'

/**
 * Реализация репозитория для Путешествий (Trips), использующая tRPC для взаимодействия с сервером.
 */
class TripRepository implements ITripRepository {
  /**
   * Получает все путешествия с сервера.
   * @returns Promise<Trip[]> - Массив путешествий.
   */
  async getAll(): Promise<Trip[]> {
    const result = await trpc.trip.list.query()

    return result as Trip[]
  }

  /**
   * Получает одно путешествие по его ID.
   * @param id - Уникальный идентификатор путешествия.
   * @returns Promise<Trip | null> - Объект путешествия или null, если не найдено.
   */
  async getById(id: string): Promise<Trip | null> {
    const result = await trpc.trip.byId.query({ id })

    return result as Trip | null
  }
}

export { TripRepository }

--- File: apps/client/src/shared/services/pwa/pwa.service.ts ---

/* eslint-disable no-console */
/**
 * Инициализирует периодическую проверку обновлений Service Worker.
 */
export async function initializePwaUpdater(): Promise<void> {
  if ((window as any)?.__TAURI__ || import.meta.env.VITE_DISABLE_PWA) {
    console.log('PWA updater is disabled.')
    return
  }

  if (import.meta.env.DEV || !('serviceWorker' in navigator)) {
    return
  }

  try {
    const pwaModule = await import(/* @vite-ignore */ 'virtual:pwa-register').catch(() => null)

    if (!pwaModule) {
      console.log('PWA module not available, skipping PWA initialization.')
      return
    }

    const { registerSW } = pwaModule
    const intervalMS = 60 * 1 * 1000 // 1 минута

    registerSW({
      onRegisteredSW(swUrl, r) {
        if (r) {
          setInterval(async () => {
            if (r.installing || !navigator)
              return
            if (('connection' in navigator) && !navigator.onLine)
              return

            const resp = await fetch(swUrl, {
              cache: 'no-store',
              headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
              },
            })

            if (resp?.status === 200) {
              await r.update()
            }
          }, intervalMS)
        }
      },
      onRegisterError(error) {
        console.error('Error during Service Worker registration:', error)
      },
    })
  }
  catch (e) {
    console.error('Failed to initialize PWA updater:', e)
  }
}

--- File: apps/client/src/shared/services/sync/sync.service.ts ---

interface SyncConfig {
  apiEndpoint: string
  apiKey?: string
  userId?: string
}

class SyncManager {
  private config: SyncConfig
  private isOnline = navigator.onLine

  constructor(config: SyncConfig) {
    this.config = config
    this.setupOnlineListener()
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true
      // eslint-disable-next-line no-console
      console.log('Соединение восстановлено. Попытка синхронизации...')
      this.syncToServer()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      // eslint-disable-next-line no-console
      console.log('Соединение потеряно. Синхронизация приостановлена.')
    })
  }

  // Отправка локальных изменений на сервер
  async syncToServer() {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }
    // eslint-disable-next-line no-console
    console.log('config', this.config)

    // TODO
  }

  // Получение изменений с сервера
  async syncFromServer() {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }

    // TODO
  }

  // Полная двусторонняя синхронизация
  async fullSync() {
    if (!this.isOnline) {
      return { success: false, error: 'Нет подключения к интернету' }
    }

    // TODO
  }

  // Экспорт всех данных для бэкапа
  async exportAllData() {
    // TODO
  }

  // Получение статуса синхронизации
  async getSyncStatus() {
    // TODO
  }
}

export { SyncManager }

--- File: apps/client/src/shared/services/trpc/trpc.service.ts ---

// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
// @ts-expect-error - другой проект
import type { AppRouter } from '@xsolare/trip-scheduler-server/router'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_APP_TRPC_URL,
    }),
  ],
})

--- File: apps/client/src/shared/store/sync.store.ts ---

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline'

interface SyncState {
  status: SyncStatus
  lastSyncTime: string | null
  pendingCount: number
  cloudCount: number
  autoSyncEnabled: boolean
  wifiOnlySync: boolean
  error: string | null
}

export const useSyncStore = defineStore('sync', {
  state: (): SyncState => ({
    status: 'idle',
    lastSyncTime: null,
    pendingCount: 0,
    cloudCount: 0,
    autoSyncEnabled: true,
    wifiOnlySync: false,
    error: null,
  }),

  actions: {
    async forceSync() {
      this.status = 'syncing'
      this.error = null

      try {
        // TODO
        // Имитация синхронизации
        await new Promise(resolve => setTimeout(resolve, 2000))

        this.status = 'success'
        this.lastSyncTime = new Date().toISOString()
        this.pendingCount = 0
        this.cloudCount += this.pendingCount

        // Автоматически сбрасываем статус через 3 секунды
        setTimeout(() => {
          if (this.status === 'success') {
            this.status = 'idle'
          }
        }, 3000)
      }
      catch (error) {
        this.status = 'error'
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка'
      }
    },

    toggleAutoSync() {
      this.autoSyncEnabled = !this.autoSyncEnabled
    },

    async clearCache() {
      this.pendingCount = 0
      this.lastSyncTime = null
      this.status = 'idle'
    },

    setOfflineMode(offline: boolean) {
      this.status = offline ? 'offline' : 'idle'
    },

    incrementPendingCount() {
      this.pendingCount++
    },
  },
})

--- File: apps/client/src/shared/types/dts/auto-imports.d.ts ---

/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
// biome-ignore lint: disable
export {}
declare global {
  const AppRouteNames: typeof import('../routes')['AppRouteNames']
  const AppRoutePaths: typeof import('../routes')['AppRoutePaths']
  const EffectScope: typeof import('vue')['EffectScope']
  const PrimeVueConfig: typeof import('../../shared/lib/primevue-theme')['PrimeVueConfig']
  const acceptHMRUpdate: typeof import('pinia')['acceptHMRUpdate']
  const addActivity: typeof import('../../lib/db')['addActivity']
  const asyncComputed: typeof import('@vueuse/core')['asyncComputed']
  const autoResetRef: typeof import('@vueuse/core')['autoResetRef']
  const computed: typeof import('vue')['computed']
  const computedAsync: typeof import('@vueuse/core')['computedAsync']
  const computedEager: typeof import('@vueuse/core')['computedEager']
  const computedInject: typeof import('@vueuse/core')['computedInject']
  const computedWithControl: typeof import('@vueuse/core')['computedWithControl']
  const controlledComputed: typeof import('@vueuse/core')['controlledComputed']
  const controlledRef: typeof import('@vueuse/core')['controlledRef']
  const createApp: typeof import('vue')['createApp']
  const createEventHook: typeof import('@vueuse/core')['createEventHook']
  const createGlobalState: typeof import('@vueuse/core')['createGlobalState']
  const createInjectionState: typeof import('@vueuse/core')['createInjectionState']
  const createPinia: typeof import('pinia')['createPinia']
  const createReactiveFn: typeof import('@vueuse/core')['createReactiveFn']
  const createRef: typeof import('@vueuse/core')['createRef']
  const createReusableTemplate: typeof import('@vueuse/core')['createReusableTemplate']
  const createSharedComposable: typeof import('@vueuse/core')['createSharedComposable']
  const createTemplatePromise: typeof import('@vueuse/core')['createTemplatePromise']
  const createUnrefFn: typeof import('@vueuse/core')['createUnrefFn']
  const customRef: typeof import('vue')['customRef']
  const debouncedRef: typeof import('@vueuse/core')['debouncedRef']
  const debouncedWatch: typeof import('@vueuse/core')['debouncedWatch']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const defineStore: typeof import('pinia')['defineStore']
  const eagerComputed: typeof import('@vueuse/core')['eagerComputed']
  const effectScope: typeof import('vue')['effectScope']
  const extendRef: typeof import('@vueuse/core')['extendRef']
  const getActivePinia: typeof import('pinia')['getActivePinia']
  const getActivitiesForDay: typeof import('../../lib/db')['getActivitiesForDay']
  const getAllTrips: typeof import('../../lib/db')['getAllTrips']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getDaysForTrip: typeof import('../../lib/db')['getDaysForTrip']
  const h: typeof import('vue')['h']
  const ignorableWatch: typeof import('@vueuse/core')['ignorableWatch']
  const inject: typeof import('vue')['inject']
  const injectLocal: typeof import('@vueuse/core')['injectLocal']
  const isDefined: typeof import('@vueuse/core')['isDefined']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const makeDestructurable: typeof import('@vueuse/core')['makeDestructurable']
  const mapActions: typeof import('pinia')['mapActions']
  const mapGetters: typeof import('pinia')['mapGetters']
  const mapState: typeof import('pinia')['mapState']
  const mapStores: typeof import('pinia')['mapStores']
  const mapWritableState: typeof import('pinia')['mapWritableState']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeRouteLeave: typeof import('vue-router')['onBeforeRouteLeave']
  const onBeforeRouteUpdate: typeof import('vue-router')['onBeforeRouteUpdate']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onClickOutside: typeof import('@vueuse/core')['onClickOutside']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onElementRemoval: typeof import('@vueuse/core')['onElementRemoval']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onKeyStroke: typeof import('@vueuse/core')['onKeyStroke']
  const onLongPress: typeof import('@vueuse/core')['onLongPress']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onStartTyping: typeof import('@vueuse/core')['onStartTyping']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const onWatcherCleanup: typeof import('vue')['onWatcherCleanup']
  const pausableWatch: typeof import('@vueuse/core')['pausableWatch']
  const provide: typeof import('vue')['provide']
  const provideLocal: typeof import('@vueuse/core')['provideLocal']
  const reactify: typeof import('@vueuse/core')['reactify']
  const reactifyObject: typeof import('@vueuse/core')['reactifyObject']
  const reactive: typeof import('vue')['reactive']
  const reactiveComputed: typeof import('@vueuse/core')['reactiveComputed']
  const reactiveOmit: typeof import('@vueuse/core')['reactiveOmit']
  const reactivePick: typeof import('@vueuse/core')['reactivePick']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const refAutoReset: typeof import('@vueuse/core')['refAutoReset']
  const refDebounced: typeof import('@vueuse/core')['refDebounced']
  const refDefault: typeof import('@vueuse/core')['refDefault']
  const refThrottled: typeof import('@vueuse/core')['refThrottled']
  const refWithControl: typeof import('@vueuse/core')['refWithControl']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const resolveRef: typeof import('@vueuse/core')['resolveRef']
  const resolveUnref: typeof import('@vueuse/core')['resolveUnref']
  const router: typeof import('../../lib/router')['default']
  const setActivePinia: typeof import('pinia')['setActivePinia']
  const setMapStoreSuffix: typeof import('pinia')['setMapStoreSuffix']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const storeToRefs: typeof import('pinia')['storeToRefs']
  const syncRef: typeof import('@vueuse/core')['syncRef']
  const syncRefs: typeof import('@vueuse/core')['syncRefs']
  const templateRef: typeof import('@vueuse/core')['templateRef']
  const throttledRef: typeof import('@vueuse/core')['throttledRef']
  const throttledWatch: typeof import('@vueuse/core')['throttledWatch']
  const toRaw: typeof import('vue')['toRaw']
  const toReactive: typeof import('@vueuse/core')['toReactive']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const toValue: typeof import('vue')['toValue']
  const triggerRef: typeof import('vue')['triggerRef']
  const tryOnBeforeMount: typeof import('@vueuse/core')['tryOnBeforeMount']
  const tryOnBeforeUnmount: typeof import('@vueuse/core')['tryOnBeforeUnmount']
  const tryOnMounted: typeof import('@vueuse/core')['tryOnMounted']
  const tryOnScopeDispose: typeof import('@vueuse/core')['tryOnScopeDispose']
  const tryOnUnmounted: typeof import('@vueuse/core')['tryOnUnmounted']
  const unref: typeof import('vue')['unref']
  const unrefElement: typeof import('@vueuse/core')['unrefElement']
  const until: typeof import('@vueuse/core')['until']
  const updateActivity: typeof import('../../lib/db')['updateActivity']
  const updateActivityInDb: typeof import('../../lib/db')['updateActivityInDb']
  const updateActivityTitle: typeof import('../../lib/db')['updateActivityTitle']
  const useActiveElement: typeof import('@vueuse/core')['useActiveElement']
  const useAnimate: typeof import('@vueuse/core')['useAnimate']
  const useArrayDifference: typeof import('@vueuse/core')['useArrayDifference']
  const useArrayEvery: typeof import('@vueuse/core')['useArrayEvery']
  const useArrayFilter: typeof import('@vueuse/core')['useArrayFilter']
  const useArrayFind: typeof import('@vueuse/core')['useArrayFind']
  const useArrayFindIndex: typeof import('@vueuse/core')['useArrayFindIndex']
  const useArrayFindLast: typeof import('@vueuse/core')['useArrayFindLast']
  const useArrayIncludes: typeof import('@vueuse/core')['useArrayIncludes']
  const useArrayJoin: typeof import('@vueuse/core')['useArrayJoin']
  const useArrayMap: typeof import('@vueuse/core')['useArrayMap']
  const useArrayReduce: typeof import('@vueuse/core')['useArrayReduce']
  const useArraySome: typeof import('@vueuse/core')['useArraySome']
  const useArrayUnique: typeof import('@vueuse/core')['useArrayUnique']
  const useAsyncQueue: typeof import('@vueuse/core')['useAsyncQueue']
  const useAsyncState: typeof import('@vueuse/core')['useAsyncState']
  const useAttrs: typeof import('vue')['useAttrs']
  const useBase64: typeof import('@vueuse/core')['useBase64']
  const useBattery: typeof import('@vueuse/core')['useBattery']
  const useBluetooth: typeof import('@vueuse/core')['useBluetooth']
  const useBreakpoints: typeof import('@vueuse/core')['useBreakpoints']
  const useBroadcastChannel: typeof import('@vueuse/core')['useBroadcastChannel']
  const useBrowserLocation: typeof import('@vueuse/core')['useBrowserLocation']
  const useCached: typeof import('@vueuse/core')['useCached']
  const useClipboard: typeof import('@vueuse/core')['useClipboard']
  const useClipboardItems: typeof import('@vueuse/core')['useClipboardItems']
  const useCloned: typeof import('@vueuse/core')['useCloned']
  const useColorMode: typeof import('@vueuse/core')['useColorMode']
  const useConfirmDialog: typeof import('@vueuse/core')['useConfirmDialog']
  const useCountdown: typeof import('@vueuse/core')['useCountdown']
  const useCounter: typeof import('@vueuse/core')['useCounter']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVar: typeof import('@vueuse/core')['useCssVar']
  const useCssVars: typeof import('vue')['useCssVars']
  const useCurrentElement: typeof import('@vueuse/core')['useCurrentElement']
  const useCycleList: typeof import('@vueuse/core')['useCycleList']
  const useDark: typeof import('@vueuse/core')['useDark']
  const useDateFormat: typeof import('@vueuse/core')['useDateFormat']
  const useDebounce: typeof import('@vueuse/core')['useDebounce']
  const useDebounceFn: typeof import('@vueuse/core')['useDebounceFn']
  const useDebouncedRefHistory: typeof import('@vueuse/core')['useDebouncedRefHistory']
  const useDeviceMotion: typeof import('@vueuse/core')['useDeviceMotion']
  const useDeviceOrientation: typeof import('@vueuse/core')['useDeviceOrientation']
  const useDevicePixelRatio: typeof import('@vueuse/core')['useDevicePixelRatio']
  const useDevicesList: typeof import('@vueuse/core')['useDevicesList']
  const useDisplayMedia: typeof import('@vueuse/core')['useDisplayMedia']
  const useDocumentVisibility: typeof import('@vueuse/core')['useDocumentVisibility']
  const useDraggable: typeof import('@vueuse/core')['useDraggable']
  const useDropZone: typeof import('@vueuse/core')['useDropZone']
  const useElementBounding: typeof import('@vueuse/core')['useElementBounding']
  const useElementByPoint: typeof import('@vueuse/core')['useElementByPoint']
  const useElementHover: typeof import('@vueuse/core')['useElementHover']
  const useElementSize: typeof import('@vueuse/core')['useElementSize']
  const useElementVisibility: typeof import('@vueuse/core')['useElementVisibility']
  const useEventBus: typeof import('@vueuse/core')['useEventBus']
  const useEventListener: typeof import('@vueuse/core')['useEventListener']
  const useEventSource: typeof import('@vueuse/core')['useEventSource']
  const useEyeDropper: typeof import('@vueuse/core')['useEyeDropper']
  const useFavicon: typeof import('@vueuse/core')['useFavicon']
  const useFetch: typeof import('@vueuse/core')['useFetch']
  const useFileDialog: typeof import('@vueuse/core')['useFileDialog']
  const useFileSystemAccess: typeof import('@vueuse/core')['useFileSystemAccess']
  const useFocus: typeof import('@vueuse/core')['useFocus']
  const useFocusWithin: typeof import('@vueuse/core')['useFocusWithin']
  const useFps: typeof import('@vueuse/core')['useFps']
  const useFullscreen: typeof import('@vueuse/core')['useFullscreen']
  const useGamepad: typeof import('@vueuse/core')['useGamepad']
  const useGeolocation: typeof import('@vueuse/core')['useGeolocation']
  const useId: typeof import('vue')['useId']
  const useIdle: typeof import('@vueuse/core')['useIdle']
  const useImage: typeof import('@vueuse/core')['useImage']
  const useInfiniteScroll: typeof import('@vueuse/core')['useInfiniteScroll']
  const useIntersectionObserver: typeof import('@vueuse/core')['useIntersectionObserver']
  const useInterval: typeof import('@vueuse/core')['useInterval']
  const useIntervalFn: typeof import('@vueuse/core')['useIntervalFn']
  const useKeyModifier: typeof import('@vueuse/core')['useKeyModifier']
  const useLastChanged: typeof import('@vueuse/core')['useLastChanged']
  const useLink: typeof import('vue-router')['useLink']
  const useLocalStorage: typeof import('@vueuse/core')['useLocalStorage']
  const useMagicKeys: typeof import('@vueuse/core')['useMagicKeys']
  const useManualRefHistory: typeof import('@vueuse/core')['useManualRefHistory']
  const useMediaControls: typeof import('@vueuse/core')['useMediaControls']
  const useMediaQuery: typeof import('@vueuse/core')['useMediaQuery']
  const useMemoize: typeof import('@vueuse/core')['useMemoize']
  const useMemory: typeof import('@vueuse/core')['useMemory']
  const useModel: typeof import('vue')['useModel']
  const useMounted: typeof import('@vueuse/core')['useMounted']
  const useMouse: typeof import('@vueuse/core')['useMouse']
  const useMouseInElement: typeof import('@vueuse/core')['useMouseInElement']
  const useMousePressed: typeof import('@vueuse/core')['useMousePressed']
  const useMutationObserver: typeof import('@vueuse/core')['useMutationObserver']
  const useNavigatorLanguage: typeof import('@vueuse/core')['useNavigatorLanguage']
  const useNetwork: typeof import('@vueuse/core')['useNetwork']
  const useNow: typeof import('@vueuse/core')['useNow']
  const useObjectUrl: typeof import('@vueuse/core')['useObjectUrl']
  const useOffsetPagination: typeof import('@vueuse/core')['useOffsetPagination']
  const useOnline: typeof import('@vueuse/core')['useOnline']
  const usePageLeave: typeof import('@vueuse/core')['usePageLeave']
  const useParallax: typeof import('@vueuse/core')['useParallax']
  const useParentElement: typeof import('@vueuse/core')['useParentElement']
  const usePerformanceObserver: typeof import('@vueuse/core')['usePerformanceObserver']
  const usePermission: typeof import('@vueuse/core')['usePermission']
  const usePointer: typeof import('@vueuse/core')['usePointer']
  const usePointerLock: typeof import('@vueuse/core')['usePointerLock']
  const usePointerSwipe: typeof import('@vueuse/core')['usePointerSwipe']
  const usePreferredColorScheme: typeof import('@vueuse/core')['usePreferredColorScheme']
  const usePreferredContrast: typeof import('@vueuse/core')['usePreferredContrast']
  const usePreferredDark: typeof import('@vueuse/core')['usePreferredDark']
  const usePreferredLanguages: typeof import('@vueuse/core')['usePreferredLanguages']
  const usePreferredReducedMotion: typeof import('@vueuse/core')['usePreferredReducedMotion']
  const usePreferredReducedTransparency: typeof import('@vueuse/core')['usePreferredReducedTransparency']
  const usePrevious: typeof import('@vueuse/core')['usePrevious']
  const useRafFn: typeof import('@vueuse/core')['useRafFn']
  const useRefHistory: typeof import('@vueuse/core')['useRefHistory']
  const useResizeObserver: typeof import('@vueuse/core')['useResizeObserver']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useSSRWidth: typeof import('@vueuse/core')['useSSRWidth']
  const useScreenOrientation: typeof import('@vueuse/core')['useScreenOrientation']
  const useScreenSafeArea: typeof import('@vueuse/core')['useScreenSafeArea']
  const useScriptTag: typeof import('@vueuse/core')['useScriptTag']
  const useScroll: typeof import('@vueuse/core')['useScroll']
  const useScrollLock: typeof import('@vueuse/core')['useScrollLock']
  const useSessionStorage: typeof import('@vueuse/core')['useSessionStorage']
  const useShare: typeof import('@vueuse/core')['useShare']
  const useSlots: typeof import('vue')['useSlots']
  const useSorted: typeof import('@vueuse/core')['useSorted']
  const useSpeechRecognition: typeof import('@vueuse/core')['useSpeechRecognition']
  const useSpeechSynthesis: typeof import('@vueuse/core')['useSpeechSynthesis']
  const useStepper: typeof import('@vueuse/core')['useStepper']
  const useStorage: typeof import('@vueuse/core')['useStorage']
  const useStorageAsync: typeof import('@vueuse/core')['useStorageAsync']
  const useStyleTag: typeof import('@vueuse/core')['useStyleTag']
  const useSupported: typeof import('@vueuse/core')['useSupported']
  const useSwipe: typeof import('@vueuse/core')['useSwipe']
  const useTemplateRef: typeof import('vue')['useTemplateRef']
  const useTemplateRefsList: typeof import('@vueuse/core')['useTemplateRefsList']
  const useTextDirection: typeof import('@vueuse/core')['useTextDirection']
  const useTextSelection: typeof import('@vueuse/core')['useTextSelection']
  const useTextareaAutosize: typeof import('@vueuse/core')['useTextareaAutosize']
  const useThrottle: typeof import('@vueuse/core')['useThrottle']
  const useThrottleFn: typeof import('@vueuse/core')['useThrottleFn']
  const useThrottledRefHistory: typeof import('@vueuse/core')['useThrottledRefHistory']
  const useTimeAgo: typeof import('@vueuse/core')['useTimeAgo']
  const useTimeout: typeof import('@vueuse/core')['useTimeout']
  const useTimeoutFn: typeof import('@vueuse/core')['useTimeoutFn']
  const useTimeoutPoll: typeof import('@vueuse/core')['useTimeoutPoll']
  const useTimestamp: typeof import('@vueuse/core')['useTimestamp']
  const useTitle: typeof import('@vueuse/core')['useTitle']
  const useToNumber: typeof import('@vueuse/core')['useToNumber']
  const useToString: typeof import('@vueuse/core')['useToString']
  const useToggle: typeof import('@vueuse/core')['useToggle']
  const useTransition: typeof import('@vueuse/core')['useTransition']
  const useUrlSearchParams: typeof import('@vueuse/core')['useUrlSearchParams']
  const useUserMedia: typeof import('@vueuse/core')['useUserMedia']
  const useVModel: typeof import('@vueuse/core')['useVModel']
  const useVModels: typeof import('@vueuse/core')['useVModels']
  const useVibrate: typeof import('@vueuse/core')['useVibrate']
  const useVirtualList: typeof import('@vueuse/core')['useVirtualList']
  const useWakeLock: typeof import('@vueuse/core')['useWakeLock']
  const useWebNotification: typeof import('@vueuse/core')['useWebNotification']
  const useWebSocket: typeof import('@vueuse/core')['useWebSocket']
  const useWebWorker: typeof import('@vueuse/core')['useWebWorker']
  const useWebWorkerFn: typeof import('@vueuse/core')['useWebWorkerFn']
  const useWindowFocus: typeof import('@vueuse/core')['useWindowFocus']
  const useWindowScroll: typeof import('@vueuse/core')['useWindowScroll']
  const useWindowSize: typeof import('@vueuse/core')['useWindowSize']
  const watch: typeof import('vue')['watch']
  const watchArray: typeof import('@vueuse/core')['watchArray']
  const watchAtMost: typeof import('@vueuse/core')['watchAtMost']
  const watchDebounced: typeof import('@vueuse/core')['watchDebounced']
  const watchDeep: typeof import('@vueuse/core')['watchDeep']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchIgnorable: typeof import('@vueuse/core')['watchIgnorable']
  const watchImmediate: typeof import('@vueuse/core')['watchImmediate']
  const watchOnce: typeof import('@vueuse/core')['watchOnce']
  const watchPausable: typeof import('@vueuse/core')['watchPausable']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
  const watchThrottled: typeof import('@vueuse/core')['watchThrottled']
  const watchTriggerable: typeof import('@vueuse/core')['watchTriggerable']
  const watchWithFilter: typeof import('@vueuse/core')['watchWithFilter']
  const whenever: typeof import('@vueuse/core')['whenever']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Component, Slot, Slots, ComponentPublicInstance, ComputedRef, DirectiveBinding, ExtractDefaultPropTypes, ExtractPropTypes, ExtractPublicPropTypes, InjectionKey, PropType, Ref, MaybeRef, MaybeRefOrGetter, VNode, WritableComputedRef } from 'vue'
  import('vue')
  // @ts-ignore
  export type { AppRouteNames } from '../../shared/types/routes'
  import('../routes')
}

--- File: apps/client/src/shared/types/dts/env.d.ts ---

/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_MOCK_MODE: string
  readonly VITE_APP_TRPC_MODE: string
  readonly VITE_APP_TRPC_URL: string
}

--- File: apps/client/src/shared/types/models/activity.ts ---

export enum ActivityTag {
  TRANSPORT = 'transport',
  WALK = 'walk',
  FOOD = 'food',
  ATTRACTION = 'attraction',
  RELAX = 'relax',
}

export enum ActivitySectionType {
  DESCRIPTION = 'description',
}

export interface ActivitySection {
  id: string
  type: ActivitySectionType
  //
  tag?: ActivityTag
  startTime?: string
  endTime?: string
}

export interface ActivitySectionText extends ActivitySection {
  text: string
}

type ActivitySections = (ActivitySection)[]

export interface Activity {
  id: string
  title: string
  startTime: string
  endTime: string
  //
  sections?: ActivitySections
  tag?: ActivityTag

}

export interface Day {
  id: string
  tripId: string
  date: string
  title: string
  description?: string
  activities: Activity[]
}

--- File: apps/client/src/shared/types/models/trip.ts ---

export interface Trip {
  id: string
  title: string
  imageUrl?: string
  days: number
  startDate: string
  endDate: string
  cities: string[]

  /**
   * Краткое описание или заметка о путешествии.
   * @example 'Романтическое путешествие по Италии'
   */
  description?: string

  /**
   * Статус плана путешествия, чтобы понимать его текущее состояние.
   * @example 'planned', 'in-progress', 'completed', 'draft'
   */
  status?: 'draft' | 'planned' | 'in-progress' | 'completed'

  /**
   * Общий предполагаемый бюджет поездки.
   */
  budget?: number

  /**
   * Валюта бюджета.
   * @example 'RUB', 'USD', 'EUR'
   */
  currency?: string

  /**
   * Список участников путешествия.
   * @example ['Иван', 'Мария']
   */
  participants?: string[]

  /**
   * Теги для категоризации и быстрого поиска.
   * @example ['горы', 'море', 'гастротур']
   */
  tags?: string[]

  /**
   * Уровень приватности, если в будущем планируется делиться планами.
   */
  visibility?: 'private' | 'public' | 'shared'

  /**
   * Уровень сложности или насыщенности поездки.
   * Помогает понять, насколько активным и требовательным будет путешествие.
   * @example 'easy' // Расслабленный отдых, 'hard' // Насыщенный поход в горы
   */
  difficulty?: 'easy' | 'medium' | 'hard'

  /**
   * Рекомендуемый или фактический сезон для данного путешествия.
   * Полезно для фильтрации и планирования.
   */
  season?: 'spring' | 'summer' | 'autumn' | 'winter'

  /**
   * Дата и время создания записи о путешествии в формате ISO.
   * Устанавливается один раз при создании.
   * @example '2025-07-31T10:00:00.000Z'
   */
  createdAt?: string

  /**
   * Дата и время последнего обновления записи.
   * Обновляется при каждом изменении плана.
   * @example '2025-08-01T12:30:00.000Z'
   */
  updatedAt?: string
}

--- File: apps/client/src/shared/types/routes.ts ---

export enum AppRouteNames {
  Root = 'root',

  NotFound = 'not-found',

  TripInfo = 'trip-unfo',
  TripList = 'trip-list',
}

export const AppRoutePaths = {
  Root: '/',

  NotFound: '/:catchAll(.*)?',

  Trip: {
    List: `/trips`,
    Info: (id: string) => `/trip/${id}`,
  },
}

--- File: apps/client/src/types/dts/auto-imports.d.ts ---

/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
// biome-ignore lint: disable
export {}
declare global {
  const AppRouteNames: typeof import('../../shared/types/routes')['AppRouteNames']
  const AppRoutePaths: typeof import('../../shared/types/routes')['AppRoutePaths']
  const EffectScope: typeof import('vue')['EffectScope']
  const SyncManager: typeof import('../../shared/lib/sync')['SyncManager']
  const acceptHMRUpdate: typeof import('pinia')['acceptHMRUpdate']
  const asyncComputed: typeof import('@vueuse/core')['asyncComputed']
  const autoResetRef: typeof import('@vueuse/core')['autoResetRef']
  const breakpoints: typeof import('../../shared/composables/use-display')['breakpoints']
  const computed: typeof import('vue')['computed']
  const computedAsync: typeof import('@vueuse/core')['computedAsync']
  const computedEager: typeof import('@vueuse/core')['computedEager']
  const computedInject: typeof import('@vueuse/core')['computedInject']
  const computedWithControl: typeof import('@vueuse/core')['computedWithControl']
  const controlledComputed: typeof import('@vueuse/core')['controlledComputed']
  const controlledRef: typeof import('@vueuse/core')['controlledRef']
  const createActivity: typeof import('../../shared/lib/db')['createActivity']
  const createApp: typeof import('vue')['createApp']
  const createDay: typeof import('../../shared/lib/db')['createDay']
  const createEventHook: typeof import('@vueuse/core')['createEventHook']
  const createGlobalState: typeof import('@vueuse/core')['createGlobalState']
  const createInjectionState: typeof import('@vueuse/core')['createInjectionState']
  const createPinia: typeof import('pinia')['createPinia']
  const createReactiveFn: typeof import('@vueuse/core')['createReactiveFn']
  const createRef: typeof import('@vueuse/core')['createRef']
  const createReusableTemplate: typeof import('@vueuse/core')['createReusableTemplate']
  const createSharedComposable: typeof import('@vueuse/core')['createSharedComposable']
  const createTemplatePromise: typeof import('@vueuse/core')['createTemplatePromise']
  const createTrip: typeof import('../../shared/lib/db')['createTrip']
  const createUnrefFn: typeof import('@vueuse/core')['createUnrefFn']
  const customRef: typeof import('vue')['customRef']
  const debouncedRef: typeof import('@vueuse/core')['debouncedRef']
  const debouncedWatch: typeof import('@vueuse/core')['debouncedWatch']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const defineStore: typeof import('pinia')['defineStore']
  const deleteActivity: typeof import('../../shared/lib/db')['deleteActivity']
  const eagerComputed: typeof import('@vueuse/core')['eagerComputed']
  const effectScope: typeof import('vue')['effectScope']
  const extendRef: typeof import('@vueuse/core')['extendRef']
  const getActivePinia: typeof import('pinia')['getActivePinia']
  const getActivitiesForDay: typeof import('../../shared/lib/db')['getActivitiesForDay']
  const getAllTrips: typeof import('../../shared/lib/db')['getAllTrips']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getDaysForTrip: typeof import('../../shared/lib/db')['getDaysForTrip']
  const getUnsyncedChanges: typeof import('../../shared/lib/db')['getUnsyncedChanges']
  const h: typeof import('vue')['h']
  const ignorableWatch: typeof import('@vueuse/core')['ignorableWatch']
  const inject: typeof import('vue')['inject']
  const injectLocal: typeof import('@vueuse/core')['injectLocal']
  const isDefined: typeof import('@vueuse/core')['isDefined']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const makeDestructurable: typeof import('@vueuse/core')['makeDestructurable']
  const mapActions: typeof import('pinia')['mapActions']
  const mapGetters: typeof import('pinia')['mapGetters']
  const mapState: typeof import('pinia')['mapState']
  const mapStores: typeof import('pinia')['mapStores']
  const mapWritableState: typeof import('pinia')['mapWritableState']
  const markAsSynced: typeof import('../../shared/lib/db')['markAsSynced']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeRouteLeave: typeof import('vue-router')['onBeforeRouteLeave']
  const onBeforeRouteUpdate: typeof import('vue-router')['onBeforeRouteUpdate']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onClickOutside: typeof import('@vueuse/core')['onClickOutside']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onElementRemoval: typeof import('@vueuse/core')['onElementRemoval']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onKeyStroke: typeof import('@vueuse/core')['onKeyStroke']
  const onLongPress: typeof import('@vueuse/core')['onLongPress']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onStartTyping: typeof import('@vueuse/core')['onStartTyping']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const onWatcherCleanup: typeof import('vue')['onWatcherCleanup']
  const pausableWatch: typeof import('@vueuse/core')['pausableWatch']
  const provide: typeof import('vue')['provide']
  const provideLocal: typeof import('@vueuse/core')['provideLocal']
  const reactify: typeof import('@vueuse/core')['reactify']
  const reactifyObject: typeof import('@vueuse/core')['reactifyObject']
  const reactive: typeof import('vue')['reactive']
  const reactiveComputed: typeof import('@vueuse/core')['reactiveComputed']
  const reactiveOmit: typeof import('@vueuse/core')['reactiveOmit']
  const reactivePick: typeof import('@vueuse/core')['reactivePick']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const refAutoReset: typeof import('@vueuse/core')['refAutoReset']
  const refDebounced: typeof import('@vueuse/core')['refDebounced']
  const refDefault: typeof import('@vueuse/core')['refDefault']
  const refThrottled: typeof import('@vueuse/core')['refThrottled']
  const refWithControl: typeof import('@vueuse/core')['refWithControl']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const resolveRef: typeof import('@vueuse/core')['resolveRef']
  const resolveUnref: typeof import('@vueuse/core')['resolveUnref']
  const router: typeof import('../../shared/lib/router')['default']
  const setActivePinia: typeof import('pinia')['setActivePinia']
  const setMapStoreSuffix: typeof import('pinia')['setMapStoreSuffix']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const storeToRefs: typeof import('pinia')['storeToRefs']
  const syncRef: typeof import('@vueuse/core')['syncRef']
  const syncRefs: typeof import('@vueuse/core')['syncRefs']
  const templateRef: typeof import('@vueuse/core')['templateRef']
  const testDbConnection: typeof import('../../shared/lib/db')['testDbConnection']
  const throttledRef: typeof import('@vueuse/core')['throttledRef']
  const throttledWatch: typeof import('@vueuse/core')['throttledWatch']
  const toRaw: typeof import('vue')['toRaw']
  const toReactive: typeof import('@vueuse/core')['toReactive']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const toValue: typeof import('vue')['toValue']
  const triggerRef: typeof import('vue')['triggerRef']
  const tryOnBeforeMount: typeof import('@vueuse/core')['tryOnBeforeMount']
  const tryOnBeforeUnmount: typeof import('@vueuse/core')['tryOnBeforeUnmount']
  const tryOnMounted: typeof import('@vueuse/core')['tryOnMounted']
  const tryOnScopeDispose: typeof import('@vueuse/core')['tryOnScopeDispose']
  const tryOnUnmounted: typeof import('@vueuse/core')['tryOnUnmounted']
  const unref: typeof import('vue')['unref']
  const unrefElement: typeof import('@vueuse/core')['unrefElement']
  const until: typeof import('@vueuse/core')['until']
  const updateActivity: typeof import('../../shared/lib/db')['updateActivity']
  const updateTrip: typeof import('../../shared/lib/db')['updateTrip']
  const useActiveElement: typeof import('@vueuse/core')['useActiveElement']
  const useAnimate: typeof import('@vueuse/core')['useAnimate']
  const useArrayDifference: typeof import('@vueuse/core')['useArrayDifference']
  const useArrayEvery: typeof import('@vueuse/core')['useArrayEvery']
  const useArrayFilter: typeof import('@vueuse/core')['useArrayFilter']
  const useArrayFind: typeof import('@vueuse/core')['useArrayFind']
  const useArrayFindIndex: typeof import('@vueuse/core')['useArrayFindIndex']
  const useArrayFindLast: typeof import('@vueuse/core')['useArrayFindLast']
  const useArrayIncludes: typeof import('@vueuse/core')['useArrayIncludes']
  const useArrayJoin: typeof import('@vueuse/core')['useArrayJoin']
  const useArrayMap: typeof import('@vueuse/core')['useArrayMap']
  const useArrayReduce: typeof import('@vueuse/core')['useArrayReduce']
  const useArraySome: typeof import('@vueuse/core')['useArraySome']
  const useArrayUnique: typeof import('@vueuse/core')['useArrayUnique']
  const useAsyncQueue: typeof import('@vueuse/core')['useAsyncQueue']
  const useAsyncState: typeof import('@vueuse/core')['useAsyncState']
  const useAttrs: typeof import('vue')['useAttrs']
  const useBase64: typeof import('@vueuse/core')['useBase64']
  const useBattery: typeof import('@vueuse/core')['useBattery']
  const useBluetooth: typeof import('@vueuse/core')['useBluetooth']
  const useBreakpoints: typeof import('@vueuse/core')['useBreakpoints']
  const useBroadcastChannel: typeof import('@vueuse/core')['useBroadcastChannel']
  const useBrowserLocation: typeof import('@vueuse/core')['useBrowserLocation']
  const useCached: typeof import('@vueuse/core')['useCached']
  const useClipboard: typeof import('@vueuse/core')['useClipboard']
  const useClipboardItems: typeof import('@vueuse/core')['useClipboardItems']
  const useCloned: typeof import('@vueuse/core')['useCloned']
  const useColorMode: typeof import('@vueuse/core')['useColorMode']
  const useConfirmDialog: typeof import('@vueuse/core')['useConfirmDialog']
  const useCountdown: typeof import('@vueuse/core')['useCountdown']
  const useCounter: typeof import('@vueuse/core')['useCounter']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVar: typeof import('@vueuse/core')['useCssVar']
  const useCssVars: typeof import('vue')['useCssVars']
  const useCurrentElement: typeof import('@vueuse/core')['useCurrentElement']
  const useCycleList: typeof import('@vueuse/core')['useCycleList']
  const useDark: typeof import('@vueuse/core')['useDark']
  const useDatabase: typeof import('../../shared/composables/use-database')['useDatabase']
  const useDateFormat: typeof import('@vueuse/core')['useDateFormat']
  const useDebounce: typeof import('@vueuse/core')['useDebounce']
  const useDebounceFn: typeof import('@vueuse/core')['useDebounceFn']
  const useDebouncedRefHistory: typeof import('@vueuse/core')['useDebouncedRefHistory']
  const useDeviceMotion: typeof import('@vueuse/core')['useDeviceMotion']
  const useDeviceOrientation: typeof import('@vueuse/core')['useDeviceOrientation']
  const useDevicePixelRatio: typeof import('@vueuse/core')['useDevicePixelRatio']
  const useDevicesList: typeof import('@vueuse/core')['useDevicesList']
  const useDisplay: typeof import('../../shared/composables/use-display')['useDisplay']
  const useDisplayMedia: typeof import('@vueuse/core')['useDisplayMedia']
  const useDocumentVisibility: typeof import('@vueuse/core')['useDocumentVisibility']
  const useDraggable: typeof import('@vueuse/core')['useDraggable']
  const useDropZone: typeof import('@vueuse/core')['useDropZone']
  const useElementBounding: typeof import('@vueuse/core')['useElementBounding']
  const useElementByPoint: typeof import('@vueuse/core')['useElementByPoint']
  const useElementHover: typeof import('@vueuse/core')['useElementHover']
  const useElementSize: typeof import('@vueuse/core')['useElementSize']
  const useElementVisibility: typeof import('@vueuse/core')['useElementVisibility']
  const useEventBus: typeof import('@vueuse/core')['useEventBus']
  const useEventListener: typeof import('@vueuse/core')['useEventListener']
  const useEventSource: typeof import('@vueuse/core')['useEventSource']
  const useEyeDropper: typeof import('@vueuse/core')['useEyeDropper']
  const useFavicon: typeof import('@vueuse/core')['useFavicon']
  const useFetch: typeof import('@vueuse/core')['useFetch']
  const useFileDialog: typeof import('@vueuse/core')['useFileDialog']
  const useFileSystemAccess: typeof import('@vueuse/core')['useFileSystemAccess']
  const useFocus: typeof import('@vueuse/core')['useFocus']
  const useFocusWithin: typeof import('@vueuse/core')['useFocusWithin']
  const useFps: typeof import('@vueuse/core')['useFps']
  const useFullscreen: typeof import('@vueuse/core')['useFullscreen']
  const useGamepad: typeof import('@vueuse/core')['useGamepad']
  const useGeolocation: typeof import('@vueuse/core')['useGeolocation']
  const useId: typeof import('vue')['useId']
  const useIdle: typeof import('@vueuse/core')['useIdle']
  const useImage: typeof import('@vueuse/core')['useImage']
  const useInfiniteScroll: typeof import('@vueuse/core')['useInfiniteScroll']
  const useIntersectionObserver: typeof import('@vueuse/core')['useIntersectionObserver']
  const useInterval: typeof import('@vueuse/core')['useInterval']
  const useIntervalFn: typeof import('@vueuse/core')['useIntervalFn']
  const useKeyModifier: typeof import('@vueuse/core')['useKeyModifier']
  const useLastChanged: typeof import('@vueuse/core')['useLastChanged']
  const useLink: typeof import('vue-router')['useLink']
  const useLocalStorage: typeof import('@vueuse/core')['useLocalStorage']
  const useMagicKeys: typeof import('@vueuse/core')['useMagicKeys']
  const useManualRefHistory: typeof import('@vueuse/core')['useManualRefHistory']
  const useMediaControls: typeof import('@vueuse/core')['useMediaControls']
  const useMediaQuery: typeof import('@vueuse/core')['useMediaQuery']
  const useMemoize: typeof import('@vueuse/core')['useMemoize']
  const useMemory: typeof import('@vueuse/core')['useMemory']
  const useModel: typeof import('vue')['useModel']
  const useMounted: typeof import('@vueuse/core')['useMounted']
  const useMouse: typeof import('@vueuse/core')['useMouse']
  const useMouseInElement: typeof import('@vueuse/core')['useMouseInElement']
  const useMousePressed: typeof import('@vueuse/core')['useMousePressed']
  const useMutationObserver: typeof import('@vueuse/core')['useMutationObserver']
  const useNavigatorLanguage: typeof import('@vueuse/core')['useNavigatorLanguage']
  const useNetwork: typeof import('@vueuse/core')['useNetwork']
  const useNow: typeof import('@vueuse/core')['useNow']
  const useObjectUrl: typeof import('@vueuse/core')['useObjectUrl']
  const useOffsetPagination: typeof import('@vueuse/core')['useOffsetPagination']
  const useOnline: typeof import('@vueuse/core')['useOnline']
  const usePageLeave: typeof import('@vueuse/core')['usePageLeave']
  const useParallax: typeof import('@vueuse/core')['useParallax']
  const useParentElement: typeof import('@vueuse/core')['useParentElement']
  const usePerformanceObserver: typeof import('@vueuse/core')['usePerformanceObserver']
  const usePermission: typeof import('@vueuse/core')['usePermission']
  const usePointer: typeof import('@vueuse/core')['usePointer']
  const usePointerLock: typeof import('@vueuse/core')['usePointerLock']
  const usePointerSwipe: typeof import('@vueuse/core')['usePointerSwipe']
  const usePreferredColorScheme: typeof import('@vueuse/core')['usePreferredColorScheme']
  const usePreferredContrast: typeof import('@vueuse/core')['usePreferredContrast']
  const usePreferredDark: typeof import('@vueuse/core')['usePreferredDark']
  const usePreferredLanguages: typeof import('@vueuse/core')['usePreferredLanguages']
  const usePreferredReducedMotion: typeof import('@vueuse/core')['usePreferredReducedMotion']
  const usePreferredReducedTransparency: typeof import('@vueuse/core')['usePreferredReducedTransparency']
  const usePrevious: typeof import('@vueuse/core')['usePrevious']
  const useRafFn: typeof import('@vueuse/core')['useRafFn']
  const useRefHistory: typeof import('@vueuse/core')['useRefHistory']
  const useResizeObserver: typeof import('@vueuse/core')['useResizeObserver']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useSSRWidth: typeof import('@vueuse/core')['useSSRWidth']
  const useScreenOrientation: typeof import('@vueuse/core')['useScreenOrientation']
  const useScreenSafeArea: typeof import('@vueuse/core')['useScreenSafeArea']
  const useScriptTag: typeof import('@vueuse/core')['useScriptTag']
  const useScroll: typeof import('@vueuse/core')['useScroll']
  const useScrollLock: typeof import('@vueuse/core')['useScrollLock']
  const useSessionStorage: typeof import('@vueuse/core')['useSessionStorage']
  const useShare: typeof import('@vueuse/core')['useShare']
  const useSlots: typeof import('vue')['useSlots']
  const useSorted: typeof import('@vueuse/core')['useSorted']
  const useSpeechRecognition: typeof import('@vueuse/core')['useSpeechRecognition']
  const useSpeechSynthesis: typeof import('@vueuse/core')['useSpeechSynthesis']
  const useStepper: typeof import('@vueuse/core')['useStepper']
  const useStorage: typeof import('@vueuse/core')['useStorage']
  const useStorageAsync: typeof import('@vueuse/core')['useStorageAsync']
  const useStyleTag: typeof import('@vueuse/core')['useStyleTag']
  const useSupported: typeof import('@vueuse/core')['useSupported']
  const useSwipe: typeof import('@vueuse/core')['useSwipe']
  const useSync: typeof import('../../shared/composables/use-sync')['useSync']
  const useTemplateRef: typeof import('vue')['useTemplateRef']
  const useTemplateRefsList: typeof import('@vueuse/core')['useTemplateRefsList']
  const useTextDirection: typeof import('@vueuse/core')['useTextDirection']
  const useTextSelection: typeof import('@vueuse/core')['useTextSelection']
  const useTextareaAutosize: typeof import('@vueuse/core')['useTextareaAutosize']
  const useThrottle: typeof import('@vueuse/core')['useThrottle']
  const useThrottleFn: typeof import('@vueuse/core')['useThrottleFn']
  const useThrottledRefHistory: typeof import('@vueuse/core')['useThrottledRefHistory']
  const useTimeAgo: typeof import('@vueuse/core')['useTimeAgo']
  const useTimeout: typeof import('@vueuse/core')['useTimeout']
  const useTimeoutFn: typeof import('@vueuse/core')['useTimeoutFn']
  const useTimeoutPoll: typeof import('@vueuse/core')['useTimeoutPoll']
  const useTimestamp: typeof import('@vueuse/core')['useTimestamp']
  const useTitle: typeof import('@vueuse/core')['useTitle']
  const useToNumber: typeof import('@vueuse/core')['useToNumber']
  const useToString: typeof import('@vueuse/core')['useToString']
  const useToggle: typeof import('@vueuse/core')['useToggle']
  const useTransition: typeof import('@vueuse/core')['useTransition']
  const useUrlSearchParams: typeof import('@vueuse/core')['useUrlSearchParams']
  const useUserMedia: typeof import('@vueuse/core')['useUserMedia']
  const useVModel: typeof import('@vueuse/core')['useVModel']
  const useVModels: typeof import('@vueuse/core')['useVModels']
  const useVibrate: typeof import('@vueuse/core')['useVibrate']
  const useVirtualList: typeof import('@vueuse/core')['useVirtualList']
  const useWakeLock: typeof import('@vueuse/core')['useWakeLock']
  const useWebNotification: typeof import('@vueuse/core')['useWebNotification']
  const useWebSocket: typeof import('@vueuse/core')['useWebSocket']
  const useWebWorker: typeof import('@vueuse/core')['useWebWorker']
  const useWebWorkerFn: typeof import('@vueuse/core')['useWebWorkerFn']
  const useWindowFocus: typeof import('@vueuse/core')['useWindowFocus']
  const useWindowScroll: typeof import('@vueuse/core')['useWindowScroll']
  const useWindowSize: typeof import('@vueuse/core')['useWindowSize']
  const watch: typeof import('vue')['watch']
  const watchArray: typeof import('@vueuse/core')['watchArray']
  const watchAtMost: typeof import('@vueuse/core')['watchAtMost']
  const watchDebounced: typeof import('@vueuse/core')['watchDebounced']
  const watchDeep: typeof import('@vueuse/core')['watchDeep']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchIgnorable: typeof import('@vueuse/core')['watchIgnorable']
  const watchImmediate: typeof import('@vueuse/core')['watchImmediate']
  const watchOnce: typeof import('@vueuse/core')['watchOnce']
  const watchPausable: typeof import('@vueuse/core')['watchPausable']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
  const watchThrottled: typeof import('@vueuse/core')['watchThrottled']
  const watchTriggerable: typeof import('@vueuse/core')['watchTriggerable']
  const watchWithFilter: typeof import('@vueuse/core')['watchWithFilter']
  const whenever: typeof import('@vueuse/core')['whenever']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Component, Slot, Slots, ComponentPublicInstance, ComputedRef, DirectiveBinding, ExtractDefaultPropTypes, ExtractPropTypes, ExtractPublicPropTypes, InjectionKey, PropType, Ref, MaybeRef, MaybeRefOrGetter, VNode, WritableComputedRef } from 'vue'
  import('vue')
  // @ts-ignore
  export type { AppRouteNames } from '../../shared/types/routes'
  import('../../shared/types/routes')
  // @ts-ignore
  export type { UseDatabaseOptions, UseDatabaseReturn } from '../../shared/composables/use-database'
  import('../../shared/composables/use-database')
}

// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface GlobalComponents {}
  interface ComponentCustomProperties {
    readonly AppRouteNames: UnwrapRef<typeof import('../../shared/types/routes')['AppRouteNames']>
    readonly AppRoutePaths: UnwrapRef<typeof import('../../shared/types/routes')['AppRoutePaths']>
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly acceptHMRUpdate: UnwrapRef<typeof import('pinia')['acceptHMRUpdate']>
    readonly asyncComputed: UnwrapRef<typeof import('@vueuse/core')['asyncComputed']>
    readonly autoResetRef: UnwrapRef<typeof import('@vueuse/core')['autoResetRef']>
    readonly breakpoints: UnwrapRef<typeof import('../../shared/composables/use-display')['breakpoints']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly computedAsync: UnwrapRef<typeof import('@vueuse/core')['computedAsync']>
    readonly computedEager: UnwrapRef<typeof import('@vueuse/core')['computedEager']>
    readonly computedInject: UnwrapRef<typeof import('@vueuse/core')['computedInject']>
    readonly computedWithControl: UnwrapRef<typeof import('@vueuse/core')['computedWithControl']>
    readonly controlledComputed: UnwrapRef<typeof import('@vueuse/core')['controlledComputed']>
    readonly controlledRef: UnwrapRef<typeof import('@vueuse/core')['controlledRef']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly createEventHook: UnwrapRef<typeof import('@vueuse/core')['createEventHook']>
    readonly createGlobalState: UnwrapRef<typeof import('@vueuse/core')['createGlobalState']>
    readonly createInjectionState: UnwrapRef<typeof import('@vueuse/core')['createInjectionState']>
    readonly createPinia: UnwrapRef<typeof import('pinia')['createPinia']>
    readonly createReactiveFn: UnwrapRef<typeof import('@vueuse/core')['createReactiveFn']>
    readonly createRef: UnwrapRef<typeof import('@vueuse/core')['createRef']>
    readonly createReusableTemplate: UnwrapRef<typeof import('@vueuse/core')['createReusableTemplate']>
    readonly createSharedComposable: UnwrapRef<typeof import('@vueuse/core')['createSharedComposable']>
    readonly createTemplatePromise: UnwrapRef<typeof import('@vueuse/core')['createTemplatePromise']>
    readonly createUnrefFn: UnwrapRef<typeof import('@vueuse/core')['createUnrefFn']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly debouncedRef: UnwrapRef<typeof import('@vueuse/core')['debouncedRef']>
    readonly debouncedWatch: UnwrapRef<typeof import('@vueuse/core')['debouncedWatch']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly defineStore: UnwrapRef<typeof import('pinia')['defineStore']>
    readonly eagerComputed: UnwrapRef<typeof import('@vueuse/core')['eagerComputed']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly extendRef: UnwrapRef<typeof import('@vueuse/core')['extendRef']>
    readonly getActivePinia: UnwrapRef<typeof import('pinia')['getActivePinia']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly ignorableWatch: UnwrapRef<typeof import('@vueuse/core')['ignorableWatch']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly injectLocal: UnwrapRef<typeof import('@vueuse/core')['injectLocal']>
    readonly isDefined: UnwrapRef<typeof import('@vueuse/core')['isDefined']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly makeDestructurable: UnwrapRef<typeof import('@vueuse/core')['makeDestructurable']>
    readonly mapActions: UnwrapRef<typeof import('pinia')['mapActions']>
    readonly mapGetters: UnwrapRef<typeof import('pinia')['mapGetters']>
    readonly mapState: UnwrapRef<typeof import('pinia')['mapState']>
    readonly mapStores: UnwrapRef<typeof import('pinia')['mapStores']>
    readonly mapWritableState: UnwrapRef<typeof import('pinia')['mapWritableState']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeRouteLeave: UnwrapRef<typeof import('vue-router')['onBeforeRouteLeave']>
    readonly onBeforeRouteUpdate: UnwrapRef<typeof import('vue-router')['onBeforeRouteUpdate']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onClickOutside: UnwrapRef<typeof import('@vueuse/core')['onClickOutside']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onElementRemoval: UnwrapRef<typeof import('@vueuse/core')['onElementRemoval']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onKeyStroke: UnwrapRef<typeof import('@vueuse/core')['onKeyStroke']>
    readonly onLongPress: UnwrapRef<typeof import('@vueuse/core')['onLongPress']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onStartTyping: UnwrapRef<typeof import('@vueuse/core')['onStartTyping']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly onWatcherCleanup: UnwrapRef<typeof import('vue')['onWatcherCleanup']>
    readonly pausableWatch: UnwrapRef<typeof import('@vueuse/core')['pausableWatch']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly provideLocal: UnwrapRef<typeof import('@vueuse/core')['provideLocal']>
    readonly reactify: UnwrapRef<typeof import('@vueuse/core')['reactify']>
    readonly reactifyObject: UnwrapRef<typeof import('@vueuse/core')['reactifyObject']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly reactiveComputed: UnwrapRef<typeof import('@vueuse/core')['reactiveComputed']>
    readonly reactiveOmit: UnwrapRef<typeof import('@vueuse/core')['reactiveOmit']>
    readonly reactivePick: UnwrapRef<typeof import('@vueuse/core')['reactivePick']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly refAutoReset: UnwrapRef<typeof import('@vueuse/core')['refAutoReset']>
    readonly refDebounced: UnwrapRef<typeof import('@vueuse/core')['refDebounced']>
    readonly refDefault: UnwrapRef<typeof import('@vueuse/core')['refDefault']>
    readonly refThrottled: UnwrapRef<typeof import('@vueuse/core')['refThrottled']>
    readonly refWithControl: UnwrapRef<typeof import('@vueuse/core')['refWithControl']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly resolveRef: UnwrapRef<typeof import('@vueuse/core')['resolveRef']>
    readonly resolveUnref: UnwrapRef<typeof import('@vueuse/core')['resolveUnref']>
    readonly router: UnwrapRef<typeof import('../../shared/lib/router')['default']>
    readonly setActivePinia: UnwrapRef<typeof import('pinia')['setActivePinia']>
    readonly setMapStoreSuffix: UnwrapRef<typeof import('pinia')['setMapStoreSuffix']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly storeToRefs: UnwrapRef<typeof import('pinia')['storeToRefs']>
    readonly syncRef: UnwrapRef<typeof import('@vueuse/core')['syncRef']>
    readonly syncRefs: UnwrapRef<typeof import('@vueuse/core')['syncRefs']>
    readonly templateRef: UnwrapRef<typeof import('@vueuse/core')['templateRef']>
    readonly throttledRef: UnwrapRef<typeof import('@vueuse/core')['throttledRef']>
    readonly throttledWatch: UnwrapRef<typeof import('@vueuse/core')['throttledWatch']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toReactive: UnwrapRef<typeof import('@vueuse/core')['toReactive']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly tryOnBeforeMount: UnwrapRef<typeof import('@vueuse/core')['tryOnBeforeMount']>
    readonly tryOnBeforeUnmount: UnwrapRef<typeof import('@vueuse/core')['tryOnBeforeUnmount']>
    readonly tryOnMounted: UnwrapRef<typeof import('@vueuse/core')['tryOnMounted']>
    readonly tryOnScopeDispose: UnwrapRef<typeof import('@vueuse/core')['tryOnScopeDispose']>
    readonly tryOnUnmounted: UnwrapRef<typeof import('@vueuse/core')['tryOnUnmounted']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly unrefElement: UnwrapRef<typeof import('@vueuse/core')['unrefElement']>
    readonly until: UnwrapRef<typeof import('@vueuse/core')['until']>
    readonly useActiveElement: UnwrapRef<typeof import('@vueuse/core')['useActiveElement']>
    readonly useAnimate: UnwrapRef<typeof import('@vueuse/core')['useAnimate']>
    readonly useArrayDifference: UnwrapRef<typeof import('@vueuse/core')['useArrayDifference']>
    readonly useArrayEvery: UnwrapRef<typeof import('@vueuse/core')['useArrayEvery']>
    readonly useArrayFilter: UnwrapRef<typeof import('@vueuse/core')['useArrayFilter']>
    readonly useArrayFind: UnwrapRef<typeof import('@vueuse/core')['useArrayFind']>
    readonly useArrayFindIndex: UnwrapRef<typeof import('@vueuse/core')['useArrayFindIndex']>
    readonly useArrayFindLast: UnwrapRef<typeof import('@vueuse/core')['useArrayFindLast']>
    readonly useArrayIncludes: UnwrapRef<typeof import('@vueuse/core')['useArrayIncludes']>
    readonly useArrayJoin: UnwrapRef<typeof import('@vueuse/core')['useArrayJoin']>
    readonly useArrayMap: UnwrapRef<typeof import('@vueuse/core')['useArrayMap']>
    readonly useArrayReduce: UnwrapRef<typeof import('@vueuse/core')['useArrayReduce']>
    readonly useArraySome: UnwrapRef<typeof import('@vueuse/core')['useArraySome']>
    readonly useArrayUnique: UnwrapRef<typeof import('@vueuse/core')['useArrayUnique']>
    readonly useAsyncQueue: UnwrapRef<typeof import('@vueuse/core')['useAsyncQueue']>
    readonly useAsyncState: UnwrapRef<typeof import('@vueuse/core')['useAsyncState']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useBase64: UnwrapRef<typeof import('@vueuse/core')['useBase64']>
    readonly useBattery: UnwrapRef<typeof import('@vueuse/core')['useBattery']>
    readonly useBluetooth: UnwrapRef<typeof import('@vueuse/core')['useBluetooth']>
    readonly useBreakpoints: UnwrapRef<typeof import('@vueuse/core')['useBreakpoints']>
    readonly useBroadcastChannel: UnwrapRef<typeof import('@vueuse/core')['useBroadcastChannel']>
    readonly useBrowserLocation: UnwrapRef<typeof import('@vueuse/core')['useBrowserLocation']>
    readonly useCached: UnwrapRef<typeof import('@vueuse/core')['useCached']>
    readonly useClipboard: UnwrapRef<typeof import('@vueuse/core')['useClipboard']>
    readonly useClipboardItems: UnwrapRef<typeof import('@vueuse/core')['useClipboardItems']>
    readonly useCloned: UnwrapRef<typeof import('@vueuse/core')['useCloned']>
    readonly useColorMode: UnwrapRef<typeof import('@vueuse/core')['useColorMode']>
    readonly useConfirmDialog: UnwrapRef<typeof import('@vueuse/core')['useConfirmDialog']>
    readonly useCountdown: UnwrapRef<typeof import('@vueuse/core')['useCountdown']>
    readonly useCounter: UnwrapRef<typeof import('@vueuse/core')['useCounter']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVar: UnwrapRef<typeof import('@vueuse/core')['useCssVar']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useCurrentElement: UnwrapRef<typeof import('@vueuse/core')['useCurrentElement']>
    readonly useCycleList: UnwrapRef<typeof import('@vueuse/core')['useCycleList']>
    readonly useDark: UnwrapRef<typeof import('@vueuse/core')['useDark']>
    readonly useDatabase: UnwrapRef<typeof import('../../shared/composables/use-database')['useDatabase']>
    readonly useDateFormat: UnwrapRef<typeof import('@vueuse/core')['useDateFormat']>
    readonly useDebounce: UnwrapRef<typeof import('@vueuse/core')['useDebounce']>
    readonly useDebounceFn: UnwrapRef<typeof import('@vueuse/core')['useDebounceFn']>
    readonly useDebouncedRefHistory: UnwrapRef<typeof import('@vueuse/core')['useDebouncedRefHistory']>
    readonly useDeviceMotion: UnwrapRef<typeof import('@vueuse/core')['useDeviceMotion']>
    readonly useDeviceOrientation: UnwrapRef<typeof import('@vueuse/core')['useDeviceOrientation']>
    readonly useDevicePixelRatio: UnwrapRef<typeof import('@vueuse/core')['useDevicePixelRatio']>
    readonly useDevicesList: UnwrapRef<typeof import('@vueuse/core')['useDevicesList']>
    readonly useDisplay: UnwrapRef<typeof import('../../shared/composables/use-display')['useDisplay']>
    readonly useDisplayMedia: UnwrapRef<typeof import('@vueuse/core')['useDisplayMedia']>
    readonly useDocumentVisibility: UnwrapRef<typeof import('@vueuse/core')['useDocumentVisibility']>
    readonly useDraggable: UnwrapRef<typeof import('@vueuse/core')['useDraggable']>
    readonly useDropZone: UnwrapRef<typeof import('@vueuse/core')['useDropZone']>
    readonly useElementBounding: UnwrapRef<typeof import('@vueuse/core')['useElementBounding']>
    readonly useElementByPoint: UnwrapRef<typeof import('@vueuse/core')['useElementByPoint']>
    readonly useElementHover: UnwrapRef<typeof import('@vueuse/core')['useElementHover']>
    readonly useElementSize: UnwrapRef<typeof import('@vueuse/core')['useElementSize']>
    readonly useElementVisibility: UnwrapRef<typeof import('@vueuse/core')['useElementVisibility']>
    readonly useEventBus: UnwrapRef<typeof import('@vueuse/core')['useEventBus']>
    readonly useEventListener: UnwrapRef<typeof import('@vueuse/core')['useEventListener']>
    readonly useEventSource: UnwrapRef<typeof import('@vueuse/core')['useEventSource']>
    readonly useEyeDropper: UnwrapRef<typeof import('@vueuse/core')['useEyeDropper']>
    readonly useFavicon: UnwrapRef<typeof import('@vueuse/core')['useFavicon']>
    readonly useFetch: UnwrapRef<typeof import('@vueuse/core')['useFetch']>
    readonly useFileDialog: UnwrapRef<typeof import('@vueuse/core')['useFileDialog']>
    readonly useFileSystemAccess: UnwrapRef<typeof import('@vueuse/core')['useFileSystemAccess']>
    readonly useFocus: UnwrapRef<typeof import('@vueuse/core')['useFocus']>
    readonly useFocusWithin: UnwrapRef<typeof import('@vueuse/core')['useFocusWithin']>
    readonly useFps: UnwrapRef<typeof import('@vueuse/core')['useFps']>
    readonly useFullscreen: UnwrapRef<typeof import('@vueuse/core')['useFullscreen']>
    readonly useGamepad: UnwrapRef<typeof import('@vueuse/core')['useGamepad']>
    readonly useGeolocation: UnwrapRef<typeof import('@vueuse/core')['useGeolocation']>
    readonly useId: UnwrapRef<typeof import('vue')['useId']>
    readonly useIdle: UnwrapRef<typeof import('@vueuse/core')['useIdle']>
    readonly useImage: UnwrapRef<typeof import('@vueuse/core')['useImage']>
    readonly useInfiniteScroll: UnwrapRef<typeof import('@vueuse/core')['useInfiniteScroll']>
    readonly useIntersectionObserver: UnwrapRef<typeof import('@vueuse/core')['useIntersectionObserver']>
    readonly useInterval: UnwrapRef<typeof import('@vueuse/core')['useInterval']>
    readonly useIntervalFn: UnwrapRef<typeof import('@vueuse/core')['useIntervalFn']>
    readonly useKeyModifier: UnwrapRef<typeof import('@vueuse/core')['useKeyModifier']>
    readonly useLastChanged: UnwrapRef<typeof import('@vueuse/core')['useLastChanged']>
    readonly useLink: UnwrapRef<typeof import('vue-router')['useLink']>
    readonly useLocalStorage: UnwrapRef<typeof import('@vueuse/core')['useLocalStorage']>
    readonly useMagicKeys: UnwrapRef<typeof import('@vueuse/core')['useMagicKeys']>
    readonly useManualRefHistory: UnwrapRef<typeof import('@vueuse/core')['useManualRefHistory']>
    readonly useMediaControls: UnwrapRef<typeof import('@vueuse/core')['useMediaControls']>
    readonly useMediaQuery: UnwrapRef<typeof import('@vueuse/core')['useMediaQuery']>
    readonly useMemoize: UnwrapRef<typeof import('@vueuse/core')['useMemoize']>
    readonly useMemory: UnwrapRef<typeof import('@vueuse/core')['useMemory']>
    readonly useModel: UnwrapRef<typeof import('vue')['useModel']>
    readonly useMounted: UnwrapRef<typeof import('@vueuse/core')['useMounted']>
    readonly useMouse: UnwrapRef<typeof import('@vueuse/core')['useMouse']>
    readonly useMouseInElement: UnwrapRef<typeof import('@vueuse/core')['useMouseInElement']>
    readonly useMousePressed: UnwrapRef<typeof import('@vueuse/core')['useMousePressed']>
    readonly useMutationObserver: UnwrapRef<typeof import('@vueuse/core')['useMutationObserver']>
    readonly useNavigatorLanguage: UnwrapRef<typeof import('@vueuse/core')['useNavigatorLanguage']>
    readonly useNetwork: UnwrapRef<typeof import('@vueuse/core')['useNetwork']>
    readonly useNow: UnwrapRef<typeof import('@vueuse/core')['useNow']>
    readonly useObjectUrl: UnwrapRef<typeof import('@vueuse/core')['useObjectUrl']>
    readonly useOffsetPagination: UnwrapRef<typeof import('@vueuse/core')['useOffsetPagination']>
    readonly useOnline: UnwrapRef<typeof import('@vueuse/core')['useOnline']>
    readonly usePageLeave: UnwrapRef<typeof import('@vueuse/core')['usePageLeave']>
    readonly useParallax: UnwrapRef<typeof import('@vueuse/core')['useParallax']>
    readonly useParentElement: UnwrapRef<typeof import('@vueuse/core')['useParentElement']>
    readonly usePerformanceObserver: UnwrapRef<typeof import('@vueuse/core')['usePerformanceObserver']>
    readonly usePermission: UnwrapRef<typeof import('@vueuse/core')['usePermission']>
    readonly usePointer: UnwrapRef<typeof import('@vueuse/core')['usePointer']>
    readonly usePointerLock: UnwrapRef<typeof import('@vueuse/core')['usePointerLock']>
    readonly usePointerSwipe: UnwrapRef<typeof import('@vueuse/core')['usePointerSwipe']>
    readonly usePreferredColorScheme: UnwrapRef<typeof import('@vueuse/core')['usePreferredColorScheme']>
    readonly usePreferredContrast: UnwrapRef<typeof import('@vueuse/core')['usePreferredContrast']>
    readonly usePreferredDark: UnwrapRef<typeof import('@vueuse/core')['usePreferredDark']>
    readonly usePreferredLanguages: UnwrapRef<typeof import('@vueuse/core')['usePreferredLanguages']>
    readonly usePreferredReducedMotion: UnwrapRef<typeof import('@vueuse/core')['usePreferredReducedMotion']>
    readonly usePreferredReducedTransparency: UnwrapRef<typeof import('@vueuse/core')['usePreferredReducedTransparency']>
    readonly usePrevious: UnwrapRef<typeof import('@vueuse/core')['usePrevious']>
    readonly useRafFn: UnwrapRef<typeof import('@vueuse/core')['useRafFn']>
    readonly useRefHistory: UnwrapRef<typeof import('@vueuse/core')['useRefHistory']>
    readonly useResizeObserver: UnwrapRef<typeof import('@vueuse/core')['useResizeObserver']>
    readonly useRoute: UnwrapRef<typeof import('vue-router')['useRoute']>
    readonly useRouter: UnwrapRef<typeof import('vue-router')['useRouter']>
    readonly useSSRWidth: UnwrapRef<typeof import('@vueuse/core')['useSSRWidth']>
    readonly useScreenOrientation: UnwrapRef<typeof import('@vueuse/core')['useScreenOrientation']>
    readonly useScreenSafeArea: UnwrapRef<typeof import('@vueuse/core')['useScreenSafeArea']>
    readonly useScriptTag: UnwrapRef<typeof import('@vueuse/core')['useScriptTag']>
    readonly useScroll: UnwrapRef<typeof import('@vueuse/core')['useScroll']>
    readonly useScrollLock: UnwrapRef<typeof import('@vueuse/core')['useScrollLock']>
    readonly useSessionStorage: UnwrapRef<typeof import('@vueuse/core')['useSessionStorage']>
    readonly useShare: UnwrapRef<typeof import('@vueuse/core')['useShare']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useSorted: UnwrapRef<typeof import('@vueuse/core')['useSorted']>
    readonly useSpeechRecognition: UnwrapRef<typeof import('@vueuse/core')['useSpeechRecognition']>
    readonly useSpeechSynthesis: UnwrapRef<typeof import('@vueuse/core')['useSpeechSynthesis']>
    readonly useStepper: UnwrapRef<typeof import('@vueuse/core')['useStepper']>
    readonly useStorage: UnwrapRef<typeof import('@vueuse/core')['useStorage']>
    readonly useStorageAsync: UnwrapRef<typeof import('@vueuse/core')['useStorageAsync']>
    readonly useStyleTag: UnwrapRef<typeof import('@vueuse/core')['useStyleTag']>
    readonly useSupported: UnwrapRef<typeof import('@vueuse/core')['useSupported']>
    readonly useSwipe: UnwrapRef<typeof import('@vueuse/core')['useSwipe']>
    readonly useSync: UnwrapRef<typeof import('../../shared/composables/use-sync')['useSync']>
    readonly useTemplateRef: UnwrapRef<typeof import('vue')['useTemplateRef']>
    readonly useTemplateRefsList: UnwrapRef<typeof import('@vueuse/core')['useTemplateRefsList']>
    readonly useTextDirection: UnwrapRef<typeof import('@vueuse/core')['useTextDirection']>
    readonly useTextSelection: UnwrapRef<typeof import('@vueuse/core')['useTextSelection']>
    readonly useTextareaAutosize: UnwrapRef<typeof import('@vueuse/core')['useTextareaAutosize']>
    readonly useThrottle: UnwrapRef<typeof import('@vueuse/core')['useThrottle']>
    readonly useThrottleFn: UnwrapRef<typeof import('@vueuse/core')['useThrottleFn']>
    readonly useThrottledRefHistory: UnwrapRef<typeof import('@vueuse/core')['useThrottledRefHistory']>
    readonly useTimeAgo: UnwrapRef<typeof import('@vueuse/core')['useTimeAgo']>
    readonly useTimeout: UnwrapRef<typeof import('@vueuse/core')['useTimeout']>
    readonly useTimeoutFn: UnwrapRef<typeof import('@vueuse/core')['useTimeoutFn']>
    readonly useTimeoutPoll: UnwrapRef<typeof import('@vueuse/core')['useTimeoutPoll']>
    readonly useTimestamp: UnwrapRef<typeof import('@vueuse/core')['useTimestamp']>
    readonly useTitle: UnwrapRef<typeof import('@vueuse/core')['useTitle']>
    readonly useToNumber: UnwrapRef<typeof import('@vueuse/core')['useToNumber']>
    readonly useToString: UnwrapRef<typeof import('@vueuse/core')['useToString']>
    readonly useToggle: UnwrapRef<typeof import('@vueuse/core')['useToggle']>
    readonly useTransition: UnwrapRef<typeof import('@vueuse/core')['useTransition']>
    readonly useUrlSearchParams: UnwrapRef<typeof import('@vueuse/core')['useUrlSearchParams']>
    readonly useUserMedia: UnwrapRef<typeof import('@vueuse/core')['useUserMedia']>
    readonly useVModel: UnwrapRef<typeof import('@vueuse/core')['useVModel']>
    readonly useVModels: UnwrapRef<typeof import('@vueuse/core')['useVModels']>
    readonly useVibrate: UnwrapRef<typeof import('@vueuse/core')['useVibrate']>
    readonly useVirtualList: UnwrapRef<typeof import('@vueuse/core')['useVirtualList']>
    readonly useWakeLock: UnwrapRef<typeof import('@vueuse/core')['useWakeLock']>
    readonly useWebNotification: UnwrapRef<typeof import('@vueuse/core')['useWebNotification']>
    readonly useWebSocket: UnwrapRef<typeof import('@vueuse/core')['useWebSocket']>
    readonly useWebWorker: UnwrapRef<typeof import('@vueuse/core')['useWebWorker']>
    readonly useWebWorkerFn: UnwrapRef<typeof import('@vueuse/core')['useWebWorkerFn']>
    readonly useWindowFocus: UnwrapRef<typeof import('@vueuse/core')['useWindowFocus']>
    readonly useWindowScroll: UnwrapRef<typeof import('@vueuse/core')['useWindowScroll']>
    readonly useWindowSize: UnwrapRef<typeof import('@vueuse/core')['useWindowSize']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchArray: UnwrapRef<typeof import('@vueuse/core')['watchArray']>
    readonly watchAtMost: UnwrapRef<typeof import('@vueuse/core')['watchAtMost']>
    readonly watchDebounced: UnwrapRef<typeof import('@vueuse/core')['watchDebounced']>
    readonly watchDeep: UnwrapRef<typeof import('@vueuse/core')['watchDeep']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchIgnorable: UnwrapRef<typeof import('@vueuse/core')['watchIgnorable']>
    readonly watchImmediate: UnwrapRef<typeof import('@vueuse/core')['watchImmediate']>
    readonly watchOnce: UnwrapRef<typeof import('@vueuse/core')['watchOnce']>
    readonly watchPausable: UnwrapRef<typeof import('@vueuse/core')['watchPausable']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
    readonly watchThrottled: UnwrapRef<typeof import('@vueuse/core')['watchThrottled']>
    readonly watchTriggerable: UnwrapRef<typeof import('@vueuse/core')['watchTriggerable']>
    readonly watchWithFilter: UnwrapRef<typeof import('@vueuse/core')['watchWithFilter']>
    readonly whenever: UnwrapRef<typeof import('@vueuse/core')['whenever']>
  }
}

--- File: apps/client/tsconfig.json ---

{
  "compilerOptions": {
    "composite": true,
    "target": "esnext",
    "jsx": "preserve",
    "lib": [
      "ES2023",
      "DOM",
      "DOM.Iterable"
    ],
    "useDefineForClassFields": true,
    "module": "ESNext",
    /* Bundler mode */
    "moduleResolution": "bundler",
    "paths": {
      "~/*": [
        "./src/*"
      ],
      "@xsolare/trip-scheduler-server/*": [
        "../server/src/*"
      ]
    },
    "resolveJsonModule": true,
    "types": [
      "vite/client",
      "vite-plugin-pwa/client"
    ],
    "allowImportingTsExtensions": true,
    /* Linting */
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "references": [
    {
      "path": "./tsconfig.node.json"
    },
    {
      "path": "../server/tsconfig.json"
    }
  ],
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}

--- File: apps/client/tsconfig.node.json ---

{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  },
  "include": [
    "vite.config.ts",
    "./build/**/*"
  ]
}

--- File: apps/server/drizzle.config.ts ---

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  },
  verbose: true,
  strict: true,
})

--- File: apps/server/drizzle/meta/_journal.json ---

{
  "version": "7",
  "dialect": "sqlite",
  "entries": [
    {
      "idx": 0,
      "version": "6",
      "when": 1754255025695,
      "tag": "0000_dapper_wolfsbane",
      "breakpoints": true
    },
    {
      "idx": 1,
      "version": "6",
      "when": 1754255435131,
      "tag": "0001_sad_ezekiel",
      "breakpoints": true
    }
  ]
}

--- File: apps/server/drizzle/meta/0000_snapshot.json ---

{
  "version": "6",
  "dialect": "sqlite",
  "id": "ec0a9f12-c075-4bb6-8c80-10ef6ebf4314",
  "prevId": "00000000-0000-0000-0000-000000000000",
  "tables": {
    "activities": {
      "name": "activities",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "day_id": {
          "name": "day_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "start_time": {
          "name": "start_time",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "end_time": {
          "name": "end_time",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        }
      },
      "indexes": {},
      "foreignKeys": {
        "activities_day_id_days_id_fk": {
          "name": "activities_day_id_days_id_fk",
          "tableFrom": "activities",
          "tableTo": "days",
          "columnsFrom": [
            "day_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    },
    "days": {
      "name": "days",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "trip_id": {
          "name": "trip_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "date": {
          "name": "date",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        }
      },
      "indexes": {},
      "foreignKeys": {
        "days_trip_id_trips_id_fk": {
          "name": "days_trip_id_trips_id_fk",
          "tableFrom": "days",
          "tableTo": "trips",
          "columnsFrom": [
            "trip_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    },
    "trips": {
      "name": "trips",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "image_url": {
          "name": "image_url",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "days": {
          "name": "days",
          "type": "integer",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": 0
        },
        "start_date": {
          "name": "start_date",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "end_date": {
          "name": "end_date",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "status": {
          "name": "status",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'draft'"
        },
        "budget": {
          "name": "budget",
          "type": "real",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": 0
        },
        "currency": {
          "name": "currency",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'RUB'"
        },
        "visibility": {
          "name": "visibility",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'private'"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    }
  },
  "views": {},
  "enums": {},
  "_meta": {
    "schemas": {},
    "tables": {},
    "columns": {}
  },
  "internal": {
    "indexes": {}
  }
}

--- File: apps/server/drizzle/meta/0001_snapshot.json ---

{
  "version": "6",
  "dialect": "sqlite",
  "id": "df0da1f7-ef99-466b-9844-57041c11403a",
  "prevId": "ec0a9f12-c075-4bb6-8c80-10ef6ebf4314",
  "tables": {
    "activities": {
      "name": "activities",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "day_id": {
          "name": "day_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "start_time": {
          "name": "start_time",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "end_time": {
          "name": "end_time",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "sections": {
          "name": "sections",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        }
      },
      "indexes": {},
      "foreignKeys": {
        "activities_day_id_days_id_fk": {
          "name": "activities_day_id_days_id_fk",
          "tableFrom": "activities",
          "tableTo": "days",
          "columnsFrom": [
            "day_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    },
    "days": {
      "name": "days",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "trip_id": {
          "name": "trip_id",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "date": {
          "name": "date",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        }
      },
      "indexes": {},
      "foreignKeys": {
        "days_trip_id_trips_id_fk": {
          "name": "days_trip_id_trips_id_fk",
          "tableFrom": "days",
          "tableTo": "trips",
          "columnsFrom": [
            "trip_id"
          ],
          "columnsTo": [
            "id"
          ],
          "onDelete": "cascade",
          "onUpdate": "no action"
        }
      },
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    },
    "trips": {
      "name": "trips",
      "columns": {
        "id": {
          "name": "id",
          "type": "text",
          "primaryKey": true,
          "notNull": true,
          "autoincrement": false
        },
        "title": {
          "name": "title",
          "type": "text",
          "primaryKey": false,
          "notNull": true,
          "autoincrement": false
        },
        "image_url": {
          "name": "image_url",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "days": {
          "name": "days",
          "type": "integer",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": 0
        },
        "start_date": {
          "name": "start_date",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "end_date": {
          "name": "end_date",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "cities": {
          "name": "cities",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "participants": {
          "name": "participants",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "tags": {
          "name": "tags",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false
        },
        "status": {
          "name": "status",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'draft'"
        },
        "budget": {
          "name": "budget",
          "type": "real",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": 0
        },
        "currency": {
          "name": "currency",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'RUB'"
        },
        "visibility": {
          "name": "visibility",
          "type": "text",
          "primaryKey": false,
          "notNull": false,
          "autoincrement": false,
          "default": "'private'"
        }
      },
      "indexes": {},
      "foreignKeys": {},
      "compositePrimaryKeys": {},
      "uniqueConstraints": {},
      "checkConstraints": {}
    }
  },
  "views": {},
  "enums": {},
  "_meta": {
    "schemas": {},
    "tables": {},
    "columns": {}
  },
  "internal": {
    "indexes": {}
  }
}

--- File: apps/server/eslint.config.ts ---

import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
})

--- File: apps/server/package.json ---

{
  "name": "@xsolare/trip-scheduler-server",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "packageManager": "bun@1.2.19",
  "engines": {
    "bun": ">=1.1.30"
  },
  "scripts": {
    "--------------------------------<      DEV       >--------------------------------": "",
    "dev": "bun run --hot --watch src/server.ts",
    "dev:debug": "bun --inspect run --hot --watch src/server.ts",
    "--------------------------------<      BUILD     >--------------------------------": "",
    "build": "bunx --bun tsup --config build/build-server.ts",
    "start": "bun --bun run dist/index.js",
    "--------------------------------<   DATABASE    >---------------------------------": "",
    "db:migrate": "bun run src/db/migrate.ts",
    "db:generate": "bunx drizzle-kit generate",
    "db:seed": "bun run src/db/seed.ts",
    "db:reset": "rm -f ./sqlite.db && bun run db:migrate && bun run db:seed",
    "--------------------------------< LINT & FORMAT >---------------------------------": "",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "typecheck": "bunx tsc --noEmit"
  },
  "dependencies": {
    "@hono/trpc-server": "^0.4.0",
    "@trpc/server": "^11.4.3",
    "drizzle-kit": "^0.31.4",
    "drizzle-orm": "^0.44.4",
    "hono": "^4.8.12",
    "zod": "^4.0.14"
  },
  "devDependencies": {
    "@antfu/eslint-config": "5.1.0",
    "@types/bun": "latest",
    "bun": "^1.1.33",
    "bun-types": "^1.2.19",
    "eslint": "9.32.0",
    "eslint-plugin-format": "1.0.1",
    "tsup": "^8.5.0",
    "typescript": "5.8.3"
  }
}

--- File: apps/server/src/db/index.ts ---

import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })

--- File: apps/server/src/db/migrate.ts ---

import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from '.'

// eslint-disable-next-line antfu/no-top-level-await
await migrate(db, { migrationsFolder: './drizzle' })

console.log('Migrations applied successfully!')
process.exit(0)

--- File: apps/server/src/db/schema.ts ---

import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Таблица для путешествий (Trips)
export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  description: text('description'),
  days: integer('days').default(0),
  startDate: text('start_date'),
  endDate: text('end_date'),
  cities: text('cities', { mode: 'json' }).$type<string[]>(),
  participants: text('participants', { mode: 'json' }).$type<string[]>(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  status: text('status', { enum: ['completed', 'planned', 'draft'] }).default('draft'),
  budget: real('budget').default(0),
  currency: text('currency').default('RUB'),
  visibility: text('visibility', { enum: ['public', 'private'] }).default('private'),
})

// Таблица для дней (Days)
export const days = sqliteTable('days', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull().references(() => trips.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  title: text('title').notNull(),
  description: text('description'),
})

// Таблица для активностей (Activities)
export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  dayId: text('day_id').notNull().references(() => days.id, { onDelete: 'cascade' }),
  startTime: text('start_time'),
  endTime: text('end_time'),
  title: text('title').notNull(),
  sections: text('sections', { mode: 'json' }).$type<Array<{ id: string, type: string, text: string }>>(),
})

// Определяем отношения между таблицами
export const tripsRelations = relations(trips, ({ many }) => ({
  days: many(days),
}))

export const daysRelations = relations(days, ({ one, many }) => ({
  trip: one(trips, {
    fields: [days.tripId],
    references: [trips.id],
  }),
  activities: many(activities),
}))

export const activitiesRelations = relations(activities, ({ one }) => ({
  day: one(days, {
    fields: [activities.dayId],
    references: [days.id],
  }),
}))

--- File: apps/server/src/db/seed.ts ---

/* eslint-disable no-console */
import { db } from './index'
import { activities, days, trips } from './schema'

/*
 * Исходные моковые данные
 * Скопированы из ваших файлов для наглядности
*/
const MOCK_TRIPS = [
  {
    id: '1',
    title: 'Путешествие в Чжанцзяцзе',
    imageUrl: '/images/zhangjiajie.jpg',
    description: 'Эпическое приключение в горах Аватара.',
    days: 2,
    startDate: '2025-07-15',
    endDate: '2025-07-16',
    cities: ['Чжанцзяцзе'],
    status: 'planned' as const,
    budget: 200000,
    currency: 'RUB',
    participants: ['Евгений', 'Алиса'],
    tags: ['горы', 'природа', 'треккинг'],
    visibility: 'public' as const,
  },
  {
    id: '2',
    title: 'Поездка в Париж',
    imageUrl: '/images/paris.jpg',
    description: 'Романтическая поездка в город любви',
    days: 5,
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    cities: ['Париж'],
    status: 'completed' as const,
    budget: 150000,
    currency: 'RUB',
    participants: ['Анна', 'Михаил'],
    tags: ['романтика', 'культура', 'город'],
    visibility: 'private' as const,
  },
]

const MOCK_DAYS = [
  {
    id: 'day-1',
    tripId: '1',
    date: '2025-07-15',
    title: 'День 1 - Прибытие в Чжанцзяцзе',
    description: 'Ваш первый день в Чжанцзяцзе будет посвящен прибытию и акклиматизации...',
    activities: [
      {
        id: 'activity-1-1',
        startTime: '00:00',
        endTime: '19:00',
        title: 'Прибытие в Международный аэропорт Чжанцзяцзе-Хэхуа (*DYG*)',
        sections: [{
          id: 'section-1-1-1',
          type: 'description',
          text: '*   _Примечание:_ Вы прилетаете внутренним рейсом из Гуанчжоу...',
        }],
      },
      {
        id: 'activity-1-2',
        startTime: '18:00',
        endTime: '19:30',
        title: 'Ужин с традиционной хунаньской кухней',
        sections: [],
      },
    ],
  },
  {
    id: 'day-2',
    tripId: '1',
    date: '2025-07-16',
    title: 'Начало треккинга',
    description: 'Сегодня начинается активная часть нашего путешествия. Мы отправимся к подножию горы Белуха.',
    activities: [
      {
        id: 'activity-2-1',
        startTime: '09:00',
        endTime: '13:00',
        title: 'Треккинг к первой стоянке',
        sections: [],
      },
      {
        id: 'activity-2-2',
        startTime: '13:00',
        endTime: '14:00',
        title: 'Обед на природе',
        sections: [],
      },
    ],
  },
  {
    id: 'day-3',
    tripId: '2',
    date: '2025-09-10',
    title: 'Прибытие и Пик Виктория',
    description: 'Прибытие в Гонконг и подъем на Пик Виктория для панорамного вида на город.',
    activities: [],
  },
]

async function seed() {
  console.log('🌱 Начало заполнения базы данных...')

  // 1. Очистка таблиц в правильном порядке (сначала дочерние)
  console.log('🗑️  Очистка старых данных...')
  await db.delete(activities).run()
  await db.delete(days).run()
  await db.delete(trips).run()

  // 2. Заполнение таблицы путешествий (trips)
  console.log('✈️  Заполнение путешествий...')
  await db.insert(trips).values(MOCK_TRIPS).run()

  // 3. Подготовка и заполнение дней и активностей
  console.log('🗓️  Заполнение дней и активностей...')
  if (MOCK_DAYS.length > 0) {
    const daysToInsert: (typeof days.$inferInsert)[] = []
    const activitiesToInsert: (typeof activities.$inferInsert)[] = []

    for (const day of MOCK_DAYS) {
      // Добавляем день в массив для вставки
      daysToInsert.push({
        id: day.id,
        tripId: day.tripId,
        date: day.date,
        title: day.title,
        description: day.description,
      })

      // Добавляем активности этого дня
      for (const activity of day.activities) {
        activitiesToInsert.push({
          ...activity,
          dayId: day.id, // Связываем активность с днем
        })
      }
    }

    // Вставляем все дни одной командой
    if (daysToInsert.length > 0) {
      await db.insert(days).values(daysToInsert).run()
    }

    // Вставляем все активности одной командой
    if (activitiesToInsert.length > 0) {
      await db.insert(activities).values(activitiesToInsert).run()
    }
  }

  console.log('✅ База данных успешно заполнена!')
}

seed().catch((e) => {
  console.error('❌ Ошибка при заполнении базы данных:', e)
  // eslint-disable-next-line node/prefer-global/process
  process.exit(1)
})

--- File: apps/server/src/index.ts ---

import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { appRouter } from './router'

const app = new Hono()

// tRPC middleware
app.use(
  '/trpc/*',
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:1420',
      'tauri://localhost',
    ],
    credentials: true,
  }),
  trpcServer({
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error, path }) => {
      console.error(`tRPC Error on ${path}:`, error)
    },
  }),
)

// 404 handler
app.notFound(c => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((error, c) => {
  console.error('Application error:', error)
  return c.json({
    error: 'Internal Server Error',
    // eslint-disable-next-line node/prefer-global/process
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  }, 500)
})

export default app

--- File: apps/server/src/lib/schemas.ts ---

import { z } from 'zod'

// Trip schemas
export const TripSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  description: z.string(),
  days: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  cities: z.array(z.string()),
  status: z.enum(['completed', 'planned', 'draft']),
  budget: z.number(),
  currency: z.string(),
  participants: z.array(z.string()),
  tags: z.array(z.string()),
  visibility: z.enum(['public', 'private']),
})

export const CreateTripSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cities: z.array(z.string()).optional(),
})

export const UpdateTripSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Day schemas
export const ActivitySectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  text: z.string(),
})

export const ActivitySchema = z.object({
  id: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  title: z.string(),
  sections: z.array(ActivitySectionSchema),
})

export const DaySchema = z.object({
  id: z.string(),
  tripId: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  activities: z.array(ActivitySchema),
})

// Common schemas
export const IdParamSchema = z.object({
  id: z.string(),
})

export const TripIdParamSchema = z.object({
  tripId: z.string(),
})

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
})

--- File: apps/server/src/lib/trpc.ts ---

import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC
  .context<object>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: error.code,
          httpStatus: shape.data.httpStatus,
        },
      }
    },
  })

// Переиспользуемый middleware для валидации
export const middleware = t.middleware
export const router = t.router
export const mergeRouters = t.mergeRouters
export const publicProcedure = t.procedure

// Вспомогательная функция для создания tRPC ошибок
export function createTRPCError(code: 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR', message: string) {
  throw new TRPCError({
    code,
    message,
  })
}

export { t }

--- File: apps/server/src/modules/day/day.router.ts ---

import { router } from '~/lib/trpc'
import { dayProcedures } from './procedures'

export const dayRouter = router(dayProcedures)

--- File: apps/server/src/modules/day/procedures.ts ---

import { z } from 'zod'
import { DaySchema } from '~/lib/schemas'
import { t } from '~/lib/trpc'
import { dayRepository } from '~/repositories/day.repository'

export const dayProcedures = {
  getByTripId: t.procedure
    .input(z.object({ tripId: z.string() }))
    .output(z.array(DaySchema))
    .query(async ({ input }) => {
      return dayRepository.getByTripId(input.tripId)
    }),
}

--- File: apps/server/src/modules/trip/procedures.ts ---

import { z } from 'zod'
import { CreateTripSchema, TripSchema, UpdateTripSchema } from '~/lib/schemas'
import { createTRPCError, t } from '~/lib/trpc'
import { tripRepository } from '~/repositories/trip.repository'

export const tripProcedures = {
  list: t.procedure
    .input(z.void())
    .output(z.array(TripSchema))
    .query(async () => {
      return tripRepository.getAll()
    }),

  byId: t.procedure
    .input(z.object({ id: z.string() }))
    .output(TripSchema.nullable())
    .query(async ({ input }) => {
      return tripRepository.getById(input.id)
    }),

  create: t.procedure
    .input(CreateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const newTrip = await tripRepository.create(input)

      return newTrip
    }),

  update: t.procedure
    .input(UpdateTripSchema)
    .output(TripSchema)
    .mutation(async ({ input }) => {
      const { id, ...updates } = input
      const updatedTrip = await tripRepository.update(id, updates)
      if (!updatedTrip)
        createTRPCError('NOT_FOUND', 'Trip not found to update')

      return updatedTrip
    }),

  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await tripRepository.delete(input.id)
      return { success: true }
    }),
}

--- File: apps/server/src/modules/trip/trip.router.ts ---

import { router } from '~/lib/trpc'
import { tripProcedures } from './procedures'

export const tripRouter = router(tripProcedures)

--- File: apps/server/src/repositories/day.repository.ts ---

import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { days } from '~/db/schema'

// eslint-disable-next-line unused-imports/no-unused-vars
const queryForTypeInference = db.query.days.findMany({
  with: {
    activities: true,
  },
})

type DayWithActivities = Awaited<typeof queryForTypeInference>[number]

function transformDay(day: DayWithActivities) {
  return {
    ...day,
    description: day.description ?? '',
    activities: day.activities.map((activity) => {
      return {
        ...activity,
        startTime: activity.startTime ?? '',
        endTime: activity.endTime ?? '',
        sections: activity.sections ?? [],
      }
    }),
  }
}

export const dayRepository = {
  /**
   * Получает все дни и их активности для конкретного путешествия.
   * @param tripId - ID путешествия.
   * @returns Массив дней с вложенными активностями.
   */
  async getByTripId(tripId: string) {
    const result: DayWithActivities[] = await db.query.days.findMany({
      where: eq(days.tripId, tripId),
      with: {
        activities: true,
      },
    })

    return result.map(transformDay)
  },

  /**
   * Получает один день по его ID.
   * @param id - ID дня.
   * @returns Объект дня с активностями или null, если не найден.
   */
  async getById(id: string) {
    const result: DayWithActivities | undefined = await db.query.days.findFirst({
      where: eq(days.id, id),
      with: {
        activities: true,
      },
    })

    if (!result) {
      return null
    }

    return transformDay(result)
  },
}

--- File: apps/server/src/repositories/trip.repository.ts ---

import type { z } from 'zod'
import type { CreateTripSchema } from '~/lib/schemas'
import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { trips } from '~/db/schema'

type NewTrip = typeof trips.$inferInsert
type DbTrip = Awaited<ReturnType<typeof db.query.trips.findFirst>>

function transformTrip(trip: DbTrip) {
  if (!trip)
    return null

  return {
    ...trip,
    imageUrl: trip.imageUrl ?? '/images/default-trip.jpg',
    description: trip.description ?? '',
    days: trip.days ?? 0,
    startDate: trip.startDate ?? '',
    endDate: trip.endDate ?? '',
    cities: trip.cities ?? [],
    status: trip.status ?? 'draft',
    budget: trip.budget ?? 0,
    currency: trip.currency ?? 'RUB',
    participants: trip.participants ?? [],
    tags: trip.tags ?? [],
    visibility: trip.visibility ?? 'private',
  }
}

export const tripRepository = {
  async getAll() {
    const dbTrips = await db.query.trips.findMany()
    return dbTrips.map(trip => transformTrip(trip)!)
  },

  async getById(id: string) {
    const dbTrip = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        days: {
          with: {
            activities: true,
          },
        },
      },
    })
    return transformTrip(dbTrip)
  },

  async create(tripData: z.infer<typeof CreateTripSchema>) {
    const newTrip: NewTrip = {
      id: crypto.randomUUID(),
      ...tripData,
      imageUrl: '/images/mock-new.jpg',
      days: 0,
      status: 'draft',
      budget: 0,
      currency: 'RUB',
      visibility: 'private',
    }

    const createdTrip = await db.insert(trips).values(newTrip).returning().get()
    return transformTrip(createdTrip)!
  },

  async update(id: string, updates: Partial<NewTrip>) {
    const updatedTrip = await db.update(trips)
      .set(updates)
      .where(eq(trips.id, id))
      .returning()
      .get()

    return transformTrip(updatedTrip)!
  },

  async delete(id: string) {
    const result = await db.delete(trips).where(eq(trips.id, id)).returning({ id: trips.id })

    return result.length > 0
  },
}

--- File: apps/server/src/router.ts ---

import { router } from './lib/trpc'
import { dayRouter } from './modules/day/day.router'
import { tripRouter } from './modules/trip/trip.router'

export const appRouter = router({
  trip: tripRouter,
  day: dayRouter,
})

export type AppRouter = typeof appRouter

--- File: apps/server/src/server.ts ---

/* eslint-disable no-console */
/* eslint-disable node/prefer-global/process */
import app from './index'

const port = Number(process.env.PORT) || 3000
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Trip Scheduler API starting...`)
console.log(`📍 Server running at http://${host}:${port}`)

export default {
  port,
  hostname: host,
  fetch: app.fetch,
}

--- File: apps/server/tsconfig.json ---

{
  "$schema": "https://json.schemastore.org/tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "target": "ES2020",
    // Enable latest features
    "lib": [
      "ESNext",
      "DOM"
    ],
    "moduleDetection": "force",
    "baseUrl": ".",
    "module": "ESNext",
    // Bundler mode
    "moduleResolution": "bundler",
    "paths": {
      "~/*": [
        "./src/*"
      ]
    },
    "allowJs": true,
    // Best practices
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": false,
    // Some stricter flags (disabled by default)
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "declaration": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*.ts",
    "build/**/*.ts"
  ]
}

--- File: package.json ---

{
  "name": "@xsolare/trip-scheduler",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "bun@1.2.19",
  "engines": {
    "bun": ">=1.1.30"
  },
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "--------------------------------<      DEV       >--------------------------------": "",
    "dev:client": "bun --parallel run --filter='./apps/client' dev:web",
    "dev:server": "bun --cwd ./apps/server dev",
    "--------------------------------<      BUILD     >--------------------------------": "",
    "build": "bun run --filter='./apps/*' build",
    "--------------------------------< LINT & FORMAT >---------------------------------": "",
    "lint": "bun run --filter='./apps/*' lint",
    "typecheck": "bun --filter='./apps/*' typecheck",
    "--------------------------------<     HELPERS   >---------------------------------": "",
    "postinstall": "simple-git-hooks"
  },
  "devDependencies": {
    "lint-staged": "^16.1.2",
    "simple-git-hooks": "^2.13.1"
  },
  "simple-git-hooks": {
    "pre-commit": "lint-staged && bun run typecheck",
    "post-commit": "git status",
    "post-merge": "bun i"
  },
  "lint-staged": {
    "*": "bun run lint"
  }
}

--- File: README.md ---

# 📅 Trip Scheduler: Планировщик Путешествий

**Trip Scheduler** — это умный помощник для создания идеальных маршрутов, организации планов и получения незабываемых впечатлений. Это кросс-платформенное приложение (десктопное приложение на базе Tauri и веб-версия), созданное с акцентом на офлайн-работу и синхронизацию данных.

[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2-24C8E2?logo=tauri)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-black?logo=rust)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![tRPC](https://img.shields.io/badge/tRPC-2B81C8?logo=trpc)](https://trpc.io/)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono)](https://hono.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite)](https://www.sqlite.org/)

## 🌟 Ключевые возможности

-   **🗺️ Планирование путешествий:** Создавайте и управляйте поездками, добавляя даты, города, бюджет, участников и теги.
-   **🗓️ Детальные маршруты:** Разрабатывайте подробный план на каждый день с активностями, привязанными ко времени.
-   **✍️ Редактор с форматированием:** Используйте встроенный Markdown-редактор для добавления описаний и заметок к дням и активностям.
-   **✈️ Кросс-платформенность:** Работайте с приложением на десктопе (через Tauri) или в веб-браузере.
-   **📡 Офлайн-режим:** Благодаря локальной базе данных SQLite, приложение полностью функционально без доступа к интернету.
-   **🔄 Синхронизация данных:** Система синхронизации позволяет сохранять ваши планы в облаке и получать к ним доступ с разных устройств.
-   **✨ Современный интерфейс:** Интуитивно понятный и интерактивный интерфейс с возможностью перетаскивания (drag-and-drop) активностей, всплывающими календарями и встроенным редактированием.
-   **🛠️ Масштабируемая архитектура:** Фронтенд построен на Vue 3 и Pinia с использованием методологии VSA.

## 🏗️ Архитектура проекта

Проект организован как монорепозиторий, управляемый с помощью `Bun Workspaces`.

-   **`apps/client` (Клиентское приложение)**
    -   **Фреймворк:** Vue 3, Vite, TypeScript.
    -   **Десктопная версия:** Собрана с помощью Tauri, что обеспечивает нативную интеграцию с ОС.
    -   **База данных:** Локальная база данных SQLite, управляемая через плагин `tauri-plugin-sql`.
    -   **Управление состоянием:** Pinia используется для централизованного управления состоянием с применением оптимистичных обновлений для более быстрого отклика интерфейса.

-   **`apps/server` (Серверная часть)**
    -   **Фреймворк:** Hono и tRPC для создания быстрых и типобезопасных API.
    -   **База данных:** На данный момент использует мок-данные, но архитектура готова для интеграции с любой реляционной или нереляционной СУБД.

## 🚀 Технологический стек

-   **Фронтенд:** Vue 3, Vite, TypeScript, Pinia, VueUse, SCSS, Milkdown (редактор).
-   **Бэкенд:** Hono, tRPC, TypeScript.
-   **Десктоп:** Tauri, Rust.
-   **База данных:** SQLite (для десктопа), Мок-данные (для разработки сервера).
-   **Инструменты:** Bun, ESLint, simple-git-hooks, lint-staged.

## 🛠️ Установка и запуск

### Предварительные требования

-   [Bun](https://bun.sh/) (менеджер пакетов и среда выполнения).
-   [Rust и Cargo](https://www.rust-lang.org/tools/install).
-   [Зависимости для Tauri](https://tauri.app/v1/guides/getting-started/prerequisites).

### Пошаговая инструкция

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://your-repository-url.git
    cd trip-scheduler
    ```

2.  **Установите зависимости:**
    ```bash
    bun install
    ```

3.  **Наполните базу данных начальными данными (для Tauri):**
    Этот скрипт создаст файл базы данных SQLite и заполнит его мок-данными.
    ```bash
    bun --cwd ./apps/client run db:seed
    ```

### Запуск в режиме разработки

Для одновременного запуска сервера и клиентского приложения:

1.  **Запустите сервер:**
    ```bash
    bun --cwd ./apps/server dev
    ```
    Сервер tRPC будет доступен по адресу `http://localhost:3000`.

2.  **Запустите клиент (Tauri):**
    ```bash
    bun --cwd ./apps/client tauri:dev
    ```

3.  **Запустите клиент (Веб-версия):**
    ```bash
    bun --cwd ./apps/client dev:web
    ```

## 📜 Доступные скрипты

-   `dev:client`: Запуск веб-клиента в режиме разработки.
-   `dev:server`: Запуск сервера в режиме разработки с горячей перезагрузкой.
-   `build`: Сборка всех приложений для продакшена.
-   `lint`: Проверка кода на соответствие стандартам.
-   `typecheck`: Проверка типов TypeScript во всем проекте.
-   `tauri:dev`: Запуск десктопного приложения в режиме разработки.
-   `tauri:build`: Сборка десктопного приложения.
-   `db:seed`: (в `apps/client`) Заполнение локальной БД мок-данными.
-   `db:reset`: (в `apps/client`) Удаление локальной БД.

<!-- ## 🖼️ Примеры интерфейса -->

=====================
