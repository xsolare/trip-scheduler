<script setup lang="ts">
import type { SignUpPayload } from '~/shared/types/models/auth'
import { Icon } from '@iconify/vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { KitInput } from '~/components/01.kit/kit-input'
import { AppRoutePaths } from '~/shared/constants/routes'

enum OAuthProviders { GitHub = 'github', Google = 'google' }

const store = useAppStore(['auth'])
const toast = useToast()
const router = useRouter()

const step = ref<'details' | 'verify'>('details')

const form = reactive<SignUpPayload & { confirmPassword: string }>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const verificationCode = ref('')
const terms = ref(false)
const formError = ref<string | null>(null)
const isPasswordVisible = ref(false)

const emailRules = [
  (v: string) => !!v || 'Почтовый адрес обязателен',
  (v: string) => /.[^\n\r@\u2028\u2029]*@.+\..+/.test(v) || 'Неверный формат почты',
]
const nameRules = [(v: string) => !!v || 'Имя обязательно']
const passwordRules = [
  (v: string) => !!v || 'Пароль обязателен',
  (v: string) => v.length >= 6 || 'Пароль должен быть не менее 6 символов',
]
const confirmPasswordRules = [
  (v: string) => !!v || 'Подтверждение пароля обязательно',
  (v: string) => v === form.password || 'Пароли не совпадают',
]
const verificationCodeRules = [
  (v: string) => !!v || 'Код обязателен',
  (v: string) => v.length === 6 || 'Код должен состоять из 6 цифр',
]

function validateDetailsForm(): boolean {
  const checks = [
    ...nameRules.map(rule => rule(form.name)),
    ...emailRules.map(rule => rule(form.email)),
    ...passwordRules.map(rule => rule(form.password)),
    ...confirmPasswordRules.map(rule => rule(form.confirmPassword)),
  ]

  const error = checks.find(res => res !== true)
  if (error) {
    formError.value = error as string
    return false
  }

  if (!terms.value) {
    formError.value = 'Необходимо принять условия использования.'
    return false
  }

  formError.value = null
  return true
}

function validateVerificationForm(): boolean {
  const checks = [
    ...verificationCodeRules.map(rule => rule(verificationCode.value)),
  ]
  const error = checks.find(res => res !== true)
  if (error) {
    formError.value = error as string
    return false
  }
  formError.value = null
  return true
}

async function submitSignUp() {
  if (!validateDetailsForm()) {
    return
  }

  try {
    await store.auth.signUp({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    step.value = 'verify'
    toast.success('Код подтверждения отправлен на вашу почту.')
  }
  catch (error: any) {
    toast.error(error.message || 'Произошла ошибка при отправке кода.')
  }
}

async function submitVerification() {
  if (!validateVerificationForm()) {
    return
  }

  try {
    await store.auth.verifyEmail({
      email: form.email,
      token: verificationCode.value,
    })
    await router.push(AppRoutePaths.Trip.List)
  }
  catch (error: any) {
    toast.error(error.message || 'Произошла ошибка при подтверждении почты.')
  }
}

const isLoading = computed(() => store.auth.isLoading)
const passwordInputType = computed(() => (isPasswordVisible.value ? 'text' : 'password'))
const passwordToggleIcon = computed(() => (isPasswordVisible.value ? 'mdi:eye-off-outline' : 'mdi:eye-outline'))

async function handleOAuth(_provider: OAuthProviders) {
  toast.warn(`В процессе разработки :)`)
  await router.push(AppRoutePaths.Trip.List)

  // const targetUrl = `${import.meta.env.VITE_APP_SERVER_URL}/v1/auth/${provider}`
  // await router.push(targetUrl)
}

watch(formError, (newError) => {
  if (newError) {
    toast.error(newError, { expire: 4000 })
  }
})
</script>

<template>
  <section class="content">
    <div class="card">
      <div v-if="isLoading" class="loader-overlay">
        <Icon icon="mdi:loading" class="spinner" />
      </div>
      <router-link :to="AppRoutePaths.Root" class="logo">
        <Icon icon="mdi:map-marker-path" class="logo-icon" />
        <span class="logo-text">Trip Scheduler</span>
      </router-link>

      <!-- Step 1: Details Form -->
      <form v-if="step === 'details'" class="form" @submit.prevent="submitSignUp">
        <KitInput
          v-model="form.name"
          label="Ваше имя"
          type="text"
          name="name"
          icon="mdi:account-outline"
          placeholder="Иван Петров"
          required
        />
        <KitInput
          v-model="form.email"
          label="Почтовый адрес"
          type="email"
          name="email"
          icon="mdi:email-outline"
          placeholder="user@example.com"
          required
        />
        <KitInput
          v-model="form.password"
          label="Пароль"
          :type="passwordInputType"
          name="password"
          icon="mdi:lock-outline"
          placeholder="••••••••"
          required
        >
          <template #append>
            <button
              type="button"
              class="icon-btn"
              @click="isPasswordVisible = !isPasswordVisible"
            >
              <Icon :icon="passwordToggleIcon" />
            </button>
          </template>
        </KitInput>
        <KitInput
          v-model="form.confirmPassword"
          label="Подтвердите пароль"
          :type="passwordInputType"
          name="confirmPassword"
          icon="mdi:lock-check-outline"
          placeholder="••••••••"
          required
        />

        <KitCheckbox v-model="terms">
          Я принимаю <a href="#">Условия использования</a> и <a href="#">Политику конфиденциальности</a>.
        </KitCheckbox>

        <KitBtn
          type="submit"
          :disabled="isLoading || !terms"
          style="width: 100%; margin-top: 8px;"
        >
          Зарегистрироваться
        </KitBtn>
      </form>

      <!-- Step 2: Verification Form -->
      <form v-if="step === 'verify'" class="form" @submit.prevent="submitVerification">
        <p class="verification-info">
          Мы отправили 6-значный код на <strong>{{ form.email }}</strong>. Пожалуйста, введите его ниже.
        </p>
        <KitInput
          v-model="verificationCode"
          label="Код подтверждения"
          type="text"
          name="verificationCode"
          icon="mdi:numeric"
          placeholder="123456"
          required
          maxlength="6"
        />
        <KitBtn
          type="submit"
          :disabled="isLoading"
          style="width: 100%; margin-top: 8px;"
        >
          Подтвердить и войти
        </KitBtn>
        <button type="button" class="util-link" style="margin-top: 16px; background: none; border: none; cursor: pointer;" @click="step = 'details'">
          Изменить email
        </button>
      </form>

      <div class="utils">
        <router-link :to="AppRoutePaths.Auth.SignIn" class="util-link">
          Уже есть аккаунт? Войти
        </router-link>
      </div>

      <KitDivider :is-loading="isLoading">
        ИЛИ
      </KitDivider>

      <div class="additional-oauth">
        <KitBtn
          variant="outlined"
          color="secondary"
          :disabled="isLoading"
          icon="mdi:google"
          style="flex-grow: 1;"
          @click="handleOAuth(OAuthProviders.Google)"
        >
          Google
        </KitBtn>
        <KitBtn
          variant="outlined"
          color="secondary"
          :disabled="isLoading"
          icon="mdi:github"
          style="flex-grow: 1;"
          @click="handleOAuth(OAuthProviders.GitHub)"
        >
          GitHub
        </KitBtn>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  padding: 16px;
}
.card {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-secondary-color);
  box-shadow: var(--s-l);
  border-radius: var(--r-l);
  padding: 32px;
  overflow: hidden;
  @include media-down(xs) {
    padding: 24px;
  }
}
.loader-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary-color);
  z-index: 20;
  .spinner {
    font-size: 3rem;
    color: var(--fg-accent-color);
    animation: spin 1s linear infinite;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  text-decoration: none;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.8;
  }
  color: var(--fg-primary-color);
  .logo-icon {
    font-size: 2.5rem;
    color: var(--fg-accent-color);
  }
  .logo-text {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.kit-checkbox-wrapper) {
    .kit-checkbox-label {
      font-size: 0.8rem;
      color: var(--fg-secondary-color);
      line-height: 1.5;
    }
    a {
      color: var(--fg-accent-color);
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.verification-info {
  text-align: center;
  color: var(--fg-secondary-color);
  line-height: 1.5;
  margin-bottom: 16px;
  strong {
    color: var(--fg-primary-color);
  }
}

.icon-btn {
  display: flex;
  color: var(--fg-secondary-color);
  padding: 4px;
  border-radius: 50%;
  &:hover {
    color: var(--fg-primary-color);
    background-color: rgba(var(--fg-primary-color-rgb), 0.1);
  }
}
.utils {
  display: flex;
  justify-content: center;
  margin: 16px 0 24px;
}
.util-link {
  font-size: 0.875rem;
  color: var(--fg-accent-color);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.additional-oauth {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}
</style>
