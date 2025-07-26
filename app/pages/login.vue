<script setup lang="ts">
definePageMeta({
  auth: 'require-logout',
});

const auth = useAuth();
auth.signIn.social({ provider: 'github' });
</script>

<template>
  redirecting...
</template>
