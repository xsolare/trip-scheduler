<script setup>
import { DefaultLayout } from '~/components/05.layouts/default'

import '~/assets/scss/global.scss'
import '~/assets/scss/atomic.scss'
import '~/assets/scss/normalize.scss'
import '~/assets/scss/fonts.scss'

import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

const route = useRoute()
const layout = computed(() => route.meta.layout || 'default')

const layouts = {
  default: DefaultLayout,
}
</script>

<template>
  <component :is="layouts[layout]">
    <router-view />
  </component>
</template>
