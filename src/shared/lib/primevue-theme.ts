import { definePreset } from '@primeuix/themes'
import Theme from '@primeuix/themes/aura'

import '~/assets/scss/global.scss'
import '~/assets/scss/atomic.scss'
import '~/assets/scss/normalize.scss'
import '~/assets/scss/fonts.scss'
import 'primeicons/primeicons.css'

const Noir = definePreset(Theme, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
  },
})

const PrimeVueConfig = {
  ripple: true,
  theme: {
    preset: Noir,
  },
}

export { PrimeVueConfig }
