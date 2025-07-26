export default defineEventHandler(async (ev) => {
  const body = await readFormData(ev);
  const file = body.get('music');
  if (!(file instanceof File))
    throw createError({ statusCode: 400 });
  const { user } = await useAuthOrThrow(ev);

  const [p] = await db
    .insert(ProjectTable)
    .values({
      ownerId: user.id,
      title: body.get('title')?.toString() || '',
      status: 'generating',
    })
    .returning();
  await ProjectBlobStore.setItemRaw(`${p.id}:music`, await file.arrayBuffer());

  void fetch(new URL(`/api/projects/${p.id}/generate-background`, getRequestURL(ev)), {
    method: 'POST',
    headers: ev.headers,
  });

  return p;
});
