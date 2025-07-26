<script setup lang="ts">
const emit = defineEmits<{
  created: [id: string]
}>();

const open = defineModel<boolean>('open');

const form = ref({
  title: '',
  music: null as File | null,
});

const create = useAsyncState(
  async () => {
    const body = new FormData();
    body.append('title', form.value.title);
    if (form.value.music)
      body.append('music', form.value.music);
    const p = await $fetch('/api/projects', {
      method: 'POST',
      body,
    });
    emit('created', p!.id);
  },
  null,
  {
    immediate: false,
  },
);

function close() {
  open.value = false;
  form.value = { title: '', music: null };
}
</script>

<template>
  <UModal v-model:open="open" title="生成谱面">
    <template #body>
      <UForm :state="form" @submit="create.execute()">
        <UFormField label="谱面标题" name="title" required>
          <UInput v-model="form.title" />
        </UFormField>
        <UFormField label="音乐" name="music" required>
          <UFileUpload v-model="form.music" accept="audio/mp3" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <UButton :loading="create.isLoading.value" @click="create.execute()">
        生成谱面
      </UButton>
      <UButton :disabled="create.isLoading.value" @click="close">
        取消
      </UButton>
    </template>

    <slot />
  </UModal>
</template>
