export default defineNuxtPlugin(async () => {
  const { session, fetchSession } = useAuth();
  if (!session.value)
    await fetchSession();
});
