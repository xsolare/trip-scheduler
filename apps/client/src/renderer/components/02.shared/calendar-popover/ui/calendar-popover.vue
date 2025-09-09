<script lang="ts" setup>
import type { CalendarDate } from '@internationalized/date'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { KitCalendar } from '~/components/01.kit/kit-calendar'
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
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        align="start"
        class="date-picker-content"
        :avoid-collisions="true"
        :collision-padding="4"
      >
        <KitCalendar
          :model-value="model"
          @update:model-value="handleUpdateValue"
        >
          <template #footer>
            <slot name="footer" />
          </template>
        </KitCalendar>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped lang="scss">
:deep(.date-picker-content) {
  border-radius: var(--r-s);
  animation-duration: 0.6s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 8px;
  z-index: 2002;

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
