export interface ConfirmDialogState {
  isOpen: boolean
  title: string
  description: string
  resolve: (value: boolean) => void
  reject: (reason?: any) => void
}

const defaultState: Pick<ConfirmDialogState, 'isOpen' | 'title' | 'description'> = {
  isOpen: false,
  title: '',
  description: '',
}

export const useConfirmDialogStore = defineStore('confirmDialog', {
  state: (): ConfirmDialogState => ({
    ...defaultState,
    resolve: () => { },
    reject: () => { },
  }),

  actions: {
    open(options: { title: string, description: string }): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.isOpen = true
        this.title = options.title
        this.description = options.description
        this.resolve = resolve
        this.reject = reject
      })
    },

    _confirm() {
      this.resolve(true)
      this.isOpen = false
      setTimeout(() => this.resetContent(), 300)
    },

    _cancel() {
      this.resolve(false)
      this.isOpen = false
      setTimeout(() => this.resetContent(), 300)
    },

    resetContent() {
      this.title = ''
      this.description = ''
    },
  },
})
