<script setup lang="ts">
const { user } = useAuth();
</script>

<template>
  <UApp>
    <UHeader title="Rhythmist Lab">
      <template #right>
        <UButton
          href="https://github.com/rhythm-world/rhythmist-lab"
          target="_blank"
          icon="logos:github-icon"
          variant="ghost"
        />
        <UColorModeButton />
        <UUser v-if="user" :avatar="{ src: user.image || undefined, icon: 'lucide:user' }" />
        <UButton v-else @click="navigateTo('/login')">
          登录/注册
        </UButton>
      </template>
    </UHeader>

    <NuxtLoadingIndicator />
    <UMain class="not-md:px-2 bg-gray-50 dark:bg-gray-900">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
