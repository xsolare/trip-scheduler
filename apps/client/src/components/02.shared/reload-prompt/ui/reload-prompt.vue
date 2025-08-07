<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

async function close() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        Приложение готово к работе оффлайн
      </span>
      <span v-else>
        Доступен новый контент, нажмите кнопку "Обновить" для обновления.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Обновить
    </button>
    <button @click="close">
      Закрыть
    </button>
  </div>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid var(--border-primary-color);
  border-radius: 4px;
  z-index: 10000;
  text-align: left;
  box-shadow: 3px 4px 5px 0 var(--border-secondary-color);
  background-color: var(--bg-primary-color);
  color: var(--fg-primary-color);
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid var(--border-primary-color);
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
  background-color: var(--bg-secondary-color);
  color: var(--fg-primary-color);
  cursor: pointer;
}
</style>
