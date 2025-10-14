<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { KitBtn } from '~/components/01.kit/kit-btn'
import { KitCheckbox } from '~/components/01.kit/kit-checkbox'
import { KitDivider } from '~/components/01.kit/kit-divider'
import { KitInput } from '~/components/01.kit/kit-input'
import { AppRoutePaths } from '~/shared/constants/routes'

enum OAuthProviders { GitHub = 'github', Google = 'google' }
enum OAuthErrors { MissingToken = 'missing_token', MeError = 'me_error' }

const store = useAppStore(['auth'])
const toast = useToast()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const terms = ref(false)
const formError = ref<string | null>(null)

const isPasswordVisible = ref(false)

const emailRules = [
  (v: string) => !!v || 'Почтовый адрес обязателен',
  (v: string) => /.[^\n\r@\u2028\u2029]*@.+\..+/.test(v) || 'Неверный формат почты',
]

const passwordRules = [
  (v: string) => !!v || 'Пароль обязателен',
  (v: string) => v.length >= 8 || 'Пароль должен быть не менее 8 символов',
]

async function submitSignIn() {
  formError.value = null

  const emailError = emailRules.map(rule => rule(email.value)).find(res => res !== true)
  if (emailError) {
    formError.value = emailError
    return
  }

  const passwordError = passwordRules.map(rule => rule(password.value)).find(res => res !== true)
  if (passwordError) {
    formError.value = passwordError
    return
  }

  if (!terms.value) {
    formError.value = 'Необходимо принять условия использования.'
    return
  }

  try {
    await store.auth.signIn({ email: email.value, password: password.value })
    const returnUrl = route.query.returnUrl as string
    await router.push(returnUrl || AppRoutePaths.Trip.List)
  }
  catch (error: any) {
    toast.error(error.message || 'Произошла ошибка при авторизации.')
  }
}

async function handleOAuth(_provider: OAuthProviders) {
  toast.warn(`В процессе разработки :)`)
  const returnUrl = route.query.returnUrl as string
  await router.push(returnUrl || AppRoutePaths.Trip.List)

  // const targetUrl = `${import.meta.env.VITE_APP_SERVER_URL}/v1/auth/${provider}`
  // await router.push(targetUrl)
}

const isLoading = computed(() => store.auth.isLoading)

const passwordInputType = computed(() => isPasswordVisible.value ? 'text' : 'password')
const passwordToggleIcon = computed(() => isPasswordVisible.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline')

watch(formError, (newError) => {
  if (newError) {
    toast.error(newError, { expire: 4000 })
  }
})

onMounted(() => {
  const oauthError = route.query.oa_error as OAuthErrors
  if (oauthError) {
    let msg = ''
    switch (oauthError) {
      case OAuthErrors.MissingToken:
        msg = 'Ошибка при OAuth авторизации.'
        break
      case OAuthErrors.MeError:
        msg = 'Не удалось получить данные пользователя.'
        break
    }
    toast.error(msg)
    router.replace({ query: {} })
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

      <form class="form" @submit.prevent="submitSignIn">
        <KitInput
          v-model="email"
          label="Почтовый адрес"
          type="email"
          name="email"
          icon="mdi-email-outline"
          placeholder="user@example.com"
          required
        />

        <KitInput
          v-model="password"
          label="Пароль"
          :type="passwordInputType"
          name="password"
          icon="mdi-lock-outline"
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

        <KitCheckbox v-model="terms">
          Я подтверждаю, что прочитал и принимаю <a href="#">Условия использования</a> и <a href="#">Политику конфиденциальности</a>.
        </KitCheckbox>

        <KitBtn
          type="submit"
          :disabled="isLoading || !terms"
          style="width: 100%;"
        >
          Авторизоваться
        </KitBtn>
      </form>

      <div class="utils">
        <router-link :to="AppRoutePaths.Auth.ForgotPassword" class="util-link">
          Забыли пароль?
        </router-link>
        <router-link :to="{ path: AppRoutePaths.Auth.SignUp, query: route.query }" class="util-link">
          Создать аккаунт
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

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
  }
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 12px;
    color: var(--fg-tertiary-color);
  }

  input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: var(--r-s);
    color: var(--fg-primary-color);
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: var(--border-focus-color);
    }
  }

  .icon-btn {
    position: absolute;
    right: 8px;
    color: var(--fg-secondary-color);
    &:hover {
      color: var(--fg-primary-color);
    }
  }
}

.utils {
  display: flex;
  justify-content: space-between;
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
