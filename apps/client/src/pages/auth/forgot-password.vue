<script setup lang="ts">
import { AppRoutePaths } from '~/shared/constants/routes'
</script>

<template>
  <section class="content">
    <div class="card">
      <h2>Восстановление пароля</h2>
      <p>Эта функциональность пока в разработке.</p>
      <router-link :to="AppRoutePaths.Auth.SignIn" class="back-link">
        Вернуться ко входу
      </router-link>
    </div>
  </section>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}
.card {
  width: 100%;
  max-width: 520px;
  margin: 16px;
  padding: 32px;
  text-align: center;
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  background-color: var(--bg-secondary-color);

  h2 {
    color: var(--fg-primary-color);
    margin-bottom: 16px;
  }
  p {
    color: var(--fg-secondary-color);
    margin-bottom: 24px;
  }
}
.back-link {
  color: var(--fg-accent-color);
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
}
</style>
