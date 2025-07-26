<script setup lang="ts">
const route = useRoute();
const { data: project, error, pending, refresh } = await useFetch(`/api/projects/${route.params.id}`);

const remove = useAsyncState(
  async () => {
    await $fetch(`/api/projects/${route.params.id}`, { method: 'DELETE' });
    await navigateTo('/');
  },
  null,
  {
    immediate: false,
  },
);

async function regenerate() {
  await $fetch(`/api/projects/${route.params.id}/generate-background`, { method: 'POST' });
  refresh();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <UContainer class="py-8">
      <div class="flex items-center mb-6">
        <UButton
          to="/"
          variant="ghost"
          icon="lucide:arrow-left"
          class="mr-4"
        />
        <h1 class="text-2xl font-bold text-gray-900">
          谱面详情
        </h1>
      </div>

      <div v-if="pending" class="flex justify-center py-12">
        <UProgress />
      </div>

      <div v-else-if="error" class="text-center py-12">
        <UIcon name="lucide:circle-x" class="w-12 h-12 text-red-500 mb-4" />
        <p class="text-gray-600">
          加载谱面失败
        </p>
      </div>

      <div v-else-if="project" class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">
                基本信息
              </h2>
            </template>

            <UForm class="space-y-4" :state="project">
              <UFormField label="谱面名称" name="name" required>
                <UInput v-model="project.title" />
              </UFormField>

              <UButton
                class="mr-3"
                :disabled="project.status !== 'completed'"
                icon="lucide:download"
                as="a"
                :href="`/api/projects/${project.id}/download`"
                target="_blank"
              >
                下载
              </UButton>

              <UButton
                class="mr-3"
                :disabled="project.status !== 'completed'"
                variant="outline"
                color="neutral"
                icon="lucide:refresh-ccw"
                @click="regenerate()"
              >
                重新生成
              </UButton>

              <UModal :ui="{ title: 'text-xl' }">
                <template #title>
                  <UIcon name="lucide:trash" />
                  <span class="ml-1 align-text-bottom">删除谱面</span>
                </template>
                <template #description>
                  谱面删除后不可恢复，确认删除吗？
                </template>
                <template #footer="{ close }">
                  <UButton color="error" @click="remove.execute().then(close)">
                    确认删除
                  </UButton>
                  <UButton variant="outline" color="neutral" :loading="remove.isLoading.value" @click="close">
                    取消
                  </UButton>
                </template>

                <UButton class="mr-3" variant="outline" color="error" icon="lucide:trash-2">
                  删除
                </UButton>
              </UModal>
            </UForm>
          </UCard>

          <UCard v-if="project.status === 'generating'" class="mt-6">
            <template #header>
              <h3 class="text-lg font-semibold">
                生成进度
              </h3>
            </template>
            <div class="text-center py-4">
              <UProgress />
              <p class="text-sm text-gray-600 mt-2">
                正在生成谱面，请稍候...
              </p>
            </div>
          </UCard>

          <UCard v-else-if="project.status === 'failed'" class="mt-6">
            <template #header>
              <h3 class="text-lg font-semibold">
                生成失败
              </h3>
            </template>
            <div class="text-center py-4">
              <UIcon name="i-s-exclamation-triangle" class="w-8 h-8 text-red-500 mb-2" />
              <p class="text-gray-600">
                谱面生成失败，请稍后重试
              </p>
            </div>
          </UCard>
        </div>

        <div>
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">
                预览
              </h3>
            </template>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
