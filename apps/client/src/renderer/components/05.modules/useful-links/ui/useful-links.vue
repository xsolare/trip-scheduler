<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { KitInput } from '~/components/01.kit/kit-input'
import { useUsefulLinks } from '~/components/05.modules/useful-links/composables/use-useful-links'

const {
  searchQuery,
  sortOrder,
  selectedTags,
  allTags,
  filteredCategories,
  toggleTag,
  allCategories,
} = useUsefulLinks()

const viewMode = ref<'grid' | 'list'>('grid')

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  }
  catch {
    return '' // Возвращаем пустую строку, если URL некорректен
  }
}

function categoryToId(title: string) {
  return `category-${title.replace(/\s+/g, '-')}`
}

function scrollToCategory(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <section class="useful-links">
    <div class="header">
      <h1>Полезные ссылки</h1>
      <p>Подборка проверенных сервисов, которые помогут спланировать ваше идеальное путешествие.</p>
    </div>

    <!-- Быстрые фильтры по категориям -->
    <div class="quick-filters">
      <button
        v-for="category in allCategories"
        :key="category.title"
        class="quick-filter-btn"
        :title="category.title"
        @click="scrollToCategory(categoryToId(category.title))"
      >
        <Icon :icon="category.icon" />
      </button>
    </div>

    <div class="controls-wrapper">
      <!-- Поиск -->
      <div class="search-bar">
        <KitInput
          v-model="searchQuery"
          placeholder="Поиск по названию или описанию..."
          icon="mdi:magnify"
          size="lg"
        />
      </div>

      <!-- Управление отображением -->
      <div class="view-controls">
        <select v-model="sortOrder" class="sort-select">
          <option value="default">
            Сортировка: по умолчанию
          </option>
          <option value="alphabetical">
            Сортировка: по алфавиту
          </option>
        </select>
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'grid' }" title="Сетка" @click="viewMode = 'grid'">
            <Icon icon="mdi:view-grid-outline" />
          </button>
          <button :class="{ active: viewMode === 'list' }" title="Список" @click="viewMode = 'list'">
            <Icon icon="mdi:view-list-outline" />
          </button>
        </div>
      </div>
    </div>

    <!-- Фильтр по тегам -->
    <div v-if="allTags.length" class="tags-filter">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag-btn" :class="[{ active: selectedTags.includes(tag) }]"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Сетка/список категорий -->
    <div v-if="filteredCategories.length > 0" class="categories-container" :class="[`view--${viewMode}`]">
      <div v-for="category in filteredCategories" :id="categoryToId(category.title)" :key="category.title" class="category-card">
        <h2 class="category-title">
          <Icon :icon="category.icon" />
          <span>{{ category.title }}</span>
        </h2>
        <ul class="links-list">
          <li v-for="link in category.links" :key="link.name" class="link-item">
            <a :href="link.url" target="_blank" rel="noopener noreferrer">
              <div class="link-left">
                <img :src="getFaviconUrl(link.url)" class="link-favicon" alt="">
                <div class="link-info">
                  <div class="link-name-wrapper">
                    <span class="link-name">{{ link.name }}</span>
                    <span v-if="link.recommended" class="recommended-badge">Наш выбор</span>
                  </div>
                  <p class="link-description">{{ link.description }}</p>
                  <div v-if="link.tags" class="link-tags">
                    <span v-for="tag in link.tags" :key="tag" class="link-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <Icon icon="mdi:open-in-new" class="link-icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Нет результатов -->
    <div v-else class="no-results">
      <Icon icon="mdi:magnify-remove-outline" class="no-results-icon" />
      <h3>Ничего не найдено</h3>
      <p>Попробуйте изменить поисковый запрос или сбросить фильтры по тегам.</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.useful-links {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }
  p {
    font-size: 1.1rem;
    color: var(--fg-secondary-color);
    max-width: 600px;
  }
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--bg-secondary-color);
  border-radius: var(--r-l);
  border: 1px solid var(--border-secondary-color);
}

.quick-filter-btn {
  background-color: var(--bg-tertiary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  border-radius: var(--r-m);
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
  }
}

.controls-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.search-bar {
  width: 100%;
}

.view-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.sort-select {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-primary-color);
  border-radius: var(--r-m);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  height: 44px; // Align with input
}

.view-toggle {
  display: flex;
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-m);
  padding: 2px;

  button {
    background: none;
    border: none;
    font-size: 1.25rem;
    padding: 0.4rem 0.6rem;
    cursor: pointer;
    color: var(--fg-tertiary-color);
    border-radius: var(--r-s);
    transition: all 0.2s ease;

    &.active {
      background-color: var(--bg-hover-color);
      color: var(--fg-accent-color);
    }
  }
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  color: var(--fg-secondary-color);
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  border-radius: var(--r-full);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--fg-accent-color);
    color: var(--fg-accent-color);
  }

  &.active {
    background-color: var(--fg-accent-color);
    border-color: var(--fg-accent-color);
    color: white;
  }
}

.categories-container {
  display: grid;
  gap: 1.5rem;

  &.view--grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
  &.view--list {
    grid-template-columns: 1fr;
  }
}

.category-card {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-secondary-color);
  border-radius: var(--r-l);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-secondary-color);
  color: var(--fg-primary-color);

  .iconify {
    color: var(--fg-accent-color);
    font-size: 1.5rem;
  }
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-item a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--r-m);
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--bg-hover-color);

    .link-name {
      color: var(--fg-accent-color);
    }
  }
}

.link-left {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
}

.link-favicon {
  width: 20px;
  height: 20px;
  margin-top: 3px;
  flex-shrink: 0;
  border-radius: 4px;
}

.link-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.link-name-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.link-name {
  font-weight: 500;
  color: var(--fg-primary-color);
  transition: color 0.2s ease;
}

.recommended-badge {
  background-color: hsl(48, 100%, 50%, 0.2);
  color: hsl(48, 100%, 30%);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: var(--r-s);
}

.link-description {
  font-size: 0.85rem;
  color: var(--fg-secondary-color);
  margin: 0;
  line-height: 1.4;
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.link-tag {
  background-color: var(--bg-tertiary-color);
  color: var(--fg-tertiary-color);
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  border-radius: var(--r-full);
}

.link-icon {
  font-size: 1rem;
  color: var(--fg-tertiary-color);
  flex-shrink: 0;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  color: var(--fg-secondary-color);
  border: 2px dashed var(--border-secondary-color);
  border-radius: var(--r-l);
  margin-top: 1rem;

  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    color: var(--fg-primary-color);
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0;
  }
}
</style>
