== Project Prompt ==
Generated: 2025-08-03T14:19:44.267Z
Source Directory: /home/evai/my/trip-scheduler/apps/client/src/components/01.kit/calendar-popover
Included Files: 3
Total Size: 1.50 KB
Format: structured
====================

=== Project File Structure ===
├── ui
│   ├── calendar-popover.vue
│   └── index.ts
└── index.ts
============================

=== File List ===
- index.ts (0.02 KB)
- ui/calendar-popover.vue (1.40 KB)
- ui/index.ts (0.08 KB)
=================

=== File Contents ===

--- File: index.ts ---

export * from './ui'

--- File: ui/calendar-popover.vue ---

<script lang="ts" setup>
import type { DateValue } from 'reka-ui'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { Calendar } from '~/components/01.kit/calendar'

defineProps<{
  placeholder?: string
}>()

const model = defineModel<DateValue>({ required: true })
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      as-child
      class="date-picker-trigger"
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
        <Calendar v-model="model" />
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

--- File: ui/index.ts ---

import CalendarPopover from './calendar-popover.vue'

export { CalendarPopover }

=====================
