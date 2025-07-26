<script setup lang="ts">
import type { ProjectStatus } from '#shared/schema';

definePageMeta({
  auth: 'require-login',
});

const { data: projects, pending, error } = await useFetch('/api/projects');
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">
        我的谱面
      </h1>
      <ProjectCreateModal @created="(id) => navigateTo(`/projects/${id}`)">
        <UButton icon="lucide:plus" size="lg">
          创建新谱面
        </UButton>
      </ProjectCreateModal>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 8" :key="i" class="aspect-square" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <UIcon name="lucide:circle-x" class="w-12 h-12 text-red-500 mb-4" />
      <p class="text-gray-600">
        加载谱面失败，请稍后重试
      </p>
    </div>

    <div v-else-if="!projects?.length" class="text-center py-12">
      <UIcon name="lucide:folder-open" class="w-12 h-12 text-gray-400 mb-4" />
      <p class="text-gray-600 mb-4">
        还没有谱面，开始创建你的第一个谱面吧
      </p>
    </div>

    <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <UCard
        v-for="project in projects"
        :key="project.id"
        class="group cursor-pointer transition-transform hover:scale-105"
        :ui="{ body: 'p-0' }"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <div class="aspect-square relative overflow-hidden rounded-t-lg">
          <div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
            <UIcon name="lucide:music" class="w-12 h-12 text-white/80" />
          </div>

          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

          <div class="absolute top-2 right-2">
            <ProjectStatus :status="project.status" />
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-semibold text-gray-900 truncate">
            {{ project.title }}
          </h3>

          <div v-if="project.status === 'generating'" class="mt-3">
            <UProgress />
          </div>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
