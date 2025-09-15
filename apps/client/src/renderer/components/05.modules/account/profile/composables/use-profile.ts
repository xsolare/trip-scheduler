import { useConfirm } from '~/components/01.kit/kit-confirm-dialog'
import { useToast } from '~/components/01.kit/kit-toast'
import { AppRouteNames } from '~/shared/constants/routes'
import { trpc } from '~/shared/services/trpc/trpc.service'
import { useAuthStore } from '~/shared/store/auth.store'

export function useProfile() {
  const authStore = useAuthStore()
  const toast = useToast()
  const confirm = useConfirm()
  const router = useRouter()

  const user = computed(() => authStore.user)

  // --- Profile Info Form ---
  const profileForm = reactive({
    name: user.value?.name || '',
    email: user.value?.email || '',
  })

  const isProfileChanged = computed(() => profileForm.name !== user.value?.name)
  const isUpdatingProfile = ref(false)

  // --- Password Change Form ---
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const isChangingPassword = ref(false)

  const isPasswordFormValid = computed(() =>
    passwordForm.currentPassword
    && passwordForm.newPassword.length >= 6
    && passwordForm.newPassword === passwordForm.confirmPassword,
  )

  // --- Delete Account Form ---
  const deleteForm = reactive({
    password: '',
  })
  const isDeletingAccount = ref(false)

  // --- Methods ---
  async function updateProfile(data?: { name?: string, avatarUrl?: string }) {
    isUpdatingProfile.value = true
    try {
      const payload = data || { name: profileForm.name }
      await authStore.updateUser(payload)
      toast.success('Профиль успешно обновлен')
    }
    catch (e: any) {
      toast.error(e.message || 'Ошибка при обновлении профиля')
    }
    finally {
      isUpdatingProfile.value = false
    }
  }

  async function changePassword() {
    if (!isPasswordFormValid.value)
      return

    isChangingPassword.value = true
    try {
      await trpc.user.changePassword.mutate({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Пароль успешно изменен')
      Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
    }
    catch (e: any) {
      toast.error(e.message || 'Ошибка при смене пароля')
    }
    finally {
      isChangingPassword.value = false
    }
  }

  async function deleteAccount() {
    const isConfirmed = await confirm({
      title: 'Вы уверены, что хотите удалить аккаунт?',
      description: 'Это действие необратимо. Все ваши данные будут удалены.',
      type: 'danger',
      confirmText: 'Да, удалить мой аккаунт',
    })

    if (!isConfirmed)
      return

    isDeletingAccount.value = true
    try {
      await trpc.user.deleteAccount.mutate({ password: deleteForm.password })
      toast.success('Ваш аккаунт был успешно удален.')
      await authStore.signOut()
      await router.push({ name: AppRouteNames.Root })
    }
    catch (e: any) {
      toast.error(e.message || 'Ошибка при удалении аккаунта')
    }
    finally {
      isDeletingAccount.value = false
      deleteForm.password = ''
    }
  }

  async function handleAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file)
      return

    isUpdatingProfile.value = true
    try {
      await authStore.uploadAvatar(file)
      toast.success('Аватар успешно обновлен')
    }
    catch (e) {
      toast.error('Не удалось загрузить аватар.')
    }
    finally {
      isUpdatingProfile.value = false
    }
  }

  watch(user, (newUser) => {
    if (newUser) {
      profileForm.name = newUser.name || ''
      profileForm.email = newUser.email || ''
    }
  })

  return {
    user,
    profileForm,
    passwordForm,
    deleteForm,
    isProfileChanged,
    isPasswordFormValid,
    isUpdatingProfile,
    isChangingPassword,
    isDeletingAccount,
    updateProfile,
    changePassword,
    deleteAccount,
    handleAvatarUpload,
  }
}
