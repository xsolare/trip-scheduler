import type { ColorPalette } from '~/shared/store/theme.store'

export interface ThemePreset {
  name: string
  palette: ColorPalette
}

export const themePresets: ThemePreset[] = [
  {
    name: 'Zedokai',
    palette: {
      // BG
      'bg-primary-color': '#faf4f2',
      'bg-secondary-color': '#f2edeb',
      'bg-tertiary-color': '#e0dad9',
      'bg-header-color': '242, 237, 235',
      'bg-disabled-color': '#f2edeb',
      'bg-inverted-color': '#29242a',
      'bg-accent-overlay-color': '#e160324d',
      'bg-accent-color': '#fce9e4',
      'bg-pressed-color': '#29242a0d',
      'bg-overlay-primary-color': '#706b6e36',
      'bg-overlay-secondary-color': '#a59fa0dc',
      'bg-action-hover-color': '#f37a51',
      'bg-hover-color': '#ede7e5bf',
      'bg-focus-color': '#fce9e4',
      'bg-highlight-color': '#fdf5d7',

      // BG STATUS
      'bg-success-color': '#d4e6d6',
      'bg-error-color': '#f3d9e0',
      'bg-warning-color': '#fce9e4',
      'bg-info-color': '#fdecd7',

      // FG
      'fg-primary-color': '#29242a',
      'fg-secondary-color': '#706b6e',
      'fg-tertiary-color': '#a59fa0',
      'fg-muted-color': '#29242a66',
      'fg-accent-color': '#e16032',
      'fg-action-color': '#e16032',
      'fg-inverted-color': '#faf4f2',
      'fg-disabled-color': '#29242a4d',
      'fg-pressed-color': '#29242a',
      'fg-highlight-color': '#d99f47',

      // FG STATUS
      'fg-success-color': '#269d69',
      'fg-error-color': '#e14775',
      'fg-warning-color': '#e16032',
      'fg-info-color': '#cc7a0a',

      // Border
      'border-primary-color': '#d2cdcb',
      'border-secondary-color': '#e0dad9',
      'border-accent-color': '#f37a51',
      'border-disabled-color': '#e0dad9',
      'border-button-secondary-color': '#e1603233',
      'border-focus-color': '#e16032',
      'border-pressed-color': '#e16032',

      // BORDER STATUS
      'border-success-color': '#5bbd8b',
      'border-error-color': '#e87899',
      'border-warning-color': '#f37a51',
      'border-info-color': '#d99f47',
    },
  },
  {
    name: 'Нордический Бриз',
    palette: {
      // BG
      'bg-primary-color': '#eceff4',
      'bg-secondary-color': '#e5e9f0',
      'bg-tertiary-color': '#d8dee9',
      'bg-header-color': '229, 233, 240',
      'bg-disabled-color': '#e5e9f0',
      'bg-inverted-color': '#2e3440',
      'bg-accent-overlay-color': '#5e81ac4d',
      'bg-accent-color': '#dce5f0',
      'bg-pressed-color': '#2e34400d',
      'bg-overlay-primary-color': '#4c566a36',
      'bg-overlay-secondary-color': '#4c566adc',
      'bg-action-hover-color': '#81a1c1',
      'bg-hover-color': '#d8dee9',
      'bg-focus-color': '#dce5f0',
      'bg-highlight-color': '#f4efe2',

      // BG STATUS
      'bg-success-color': '#e6f0df',
      'bg-error-color': '#f2e0e2',
      'bg-warning-color': '#f5e8e3',
      'bg-info-color': '#e4f2f5',

      // FG
      'fg-primary-color': '#2e3440',
      'fg-secondary-color': '#4c566a',
      'fg-tertiary-color': '#4c566a',
      'fg-muted-color': '#2e344066',
      'fg-accent-color': '#5e81ac',
      'fg-action-color': '#5e81ac',
      'fg-inverted-color': '#eceff4',
      'fg-disabled-color': '#2e34404d',
      'fg-pressed-color': '#2e3440',
      'fg-highlight-color': '#bf9d6f',

      // FG STATUS
      'fg-success-color': '#a3be8c',
      'fg-error-color': '#bf616a',
      'fg-warning-color': '#d08770',
      'fg-info-color': '#88c0d0',

      // Border
      'border-primary-color': '#d8dee9',
      'border-secondary-color': '#e5e9f0',
      'border-accent-color': '#81a1c1',
      'border-disabled-color': '#e5e9f0',
      'border-button-secondary-color': '#5e81ac33',
      'border-focus-color': '#5e81ac',
      'border-pressed-color': '#5e81ac',

      // BORDER STATUS
      'border-success-color': '#b3cc9f',
      'border-error-color': '#cc8088',
      'border-warning-color': '#d9a290',
      'border-info-color': '#a3d1de',
    },
  },
  {
    name: 'Солнечная Гавань',
    palette: {
      // BG
      'bg-primary-color': '#f1f0e9',
      'bg-secondary-color': '#eae8e0',
      'bg-tertiary-color': '#e6e4de',
      'bg-header-color': '234, 232, 224',
      'bg-disabled-color': '#f2f2f2',
      'bg-inverted-color': '#1b1b1f',
      'bg-accent-overlay-color': '#00b96b33',
      'bg-accent-color': '#d2e7dd',
      'bg-pressed-color': '#1b1b1f0d',
      'bg-overlay-primary-color': '#36363636',
      'bg-overlay-secondary-color': '#aeaeb2dc',
      'bg-action-hover-color': '#00b96b99',
      'bg-hover-color': '#eeeeee',
      'bg-focus-color': '#d2e7dd',
      'bg-highlight-color': '#fcf8e3',

      // BG STATUS
      'bg-success-color': '#d9f1e4',
      'bg-error-color': '#fde5e3',
      'bg-warning-color': '#fff4d9',
      'bg-info-color': '#d9e8ff',

      // FG
      'fg-primary-color': '#1b1b1f',
      'fg-secondary-color': '#1b1b1f99',
      'fg-tertiary-color': '#1b1b1f61',
      'fg-muted-color': '#1b1b1f40',
      'fg-accent-color': '#1c6b48',
      'fg-action-color': '#1c6b48',
      'fg-inverted-color': '#ffffff',
      'fg-disabled-color': '#1b1b1f4d',
      'fg-pressed-color': '#1b1b1f',
      'fg-highlight-color': '#9c7a2e',

      // FG STATUS
      'fg-success-color': '#1c6b48',
      'fg-error-color': '#f44336',
      'fg-warning-color': '#b8860b',
      'fg-info-color': '#1677ff',

      // Border
      'border-primary-color': '#00000028',
      'border-secondary-color': '#00000020',
      'border-accent-color': '#86bda5',
      'border-disabled-color': '#00000020',
      'border-button-secondary-color': '#00b96b33',
      'border-focus-color': '#1c6b48',
      'border-pressed-color': '#1c6b48',

      // BORDER STATUS
      'border-success-color': '#5cb85c',
      'border-error-color': '#f88a82',
      'border-warning-color': '#ffd580',
      'border-info-color': '#8abfff',
    },
  },
  {
    name: 'Полуночный Неон',
    palette: {
      // BG
      'bg-primary-color': '#282a36',
      'bg-secondary-color': '#21222c',
      'bg-tertiary-color': '#44475a',
      'bg-header-color': '33, 34, 44',
      'bg-disabled-color': '#21222c',
      'bg-inverted-color': '#f8f8f2',
      'bg-accent-overlay-color': '#ff79c64d',
      'bg-accent-color': '#44324f',
      'bg-pressed-color': '#f8f8f20d',
      'bg-overlay-primary-color': '#bd93f936',
      'bg-overlay-secondary-color': '#6272a4dc',
      'bg-action-hover-color': '#ff92d4',
      'bg-hover-color': '#44475a',
      'bg-focus-color': '#44324f',
      'bg-highlight-color': '#504e3b',

      // BG STATUS
      'bg-success-color': '#334e3d',
      'bg-error-color': '#4f3535',
      'bg-warning-color': '#504e3b',
      'bg-info-color': '#3c4b50',

      // FG
      'fg-primary-color': '#f8f8f2',
      'fg-secondary-color': '#bd93f9',
      'fg-tertiary-color': '#6272a4',
      'fg-muted-color': '#f8f8f266',
      'fg-accent-color': '#ff79c6',
      'fg-action-color': '#ff79c6',
      'fg-inverted-color': '#282a36',
      'fg-disabled-color': '#f8f8f24d',
      'fg-pressed-color': '#f8f8f2',
      'fg-highlight-color': '#f1fa8c',

      // FG STATUS
      'fg-success-color': '#50fa7b',
      'fg-error-color': '#ff5555',
      'fg-warning-color': '#f1fa8c',
      'fg-info-color': '#8be9fd',

      // Border
      'border-primary-color': '#44475a',
      'border-secondary-color': '#191a21',
      'border-accent-color': '#ff92d4',
      'border-disabled-color': '#191a21',
      'border-button-secondary-color': '#ff79c633',
      'border-focus-color': '#ff79c6',
      'border-pressed-color': '#ff79c6',

      // BORDER STATUS
      'border-success-color': '#50fa7b',
      'border-error-color': '#ff5555',
      'border-warning-color': '#f1fa8c',
      'border-info-color': '#8be9fd',
    },
  },
]
