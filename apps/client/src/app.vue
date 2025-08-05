<script setup>
import { DefaultLayout } from '~/components/05.layouts/default'
import { EmptyLayout } from '~/components/05.layouts/empty'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

import '~/assets/scss/global.scss'
import '~/assets/scss/atomic.scss'
import '~/assets/scss/normalize.scss'
import '~/assets/scss/animation.scss'
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
