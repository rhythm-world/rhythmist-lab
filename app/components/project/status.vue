<script setup lang="ts">
import type { ProjectStatus } from '#shared/schema';
import type { BadgeProps } from '@nuxt/ui/components/Badge.vue';

defineProps<{
  status: ProjectStatus
}>();

const StatusText: Record<ProjectStatus, string> = {
  generating: '生成中',
  completed: '已完成',
  failed: '失败',
};
const StatusColor: Record<ProjectStatus, BadgeProps['color']> = {
  generating: 'info',
  completed: 'primary',
  failed: 'error',
};
</script>

<template>
  <UBadge :color="StatusColor[status]" size="sm">
    {{ StatusText[status] }}
  </UBadge>
</template>
