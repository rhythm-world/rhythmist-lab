import { eq } from 'drizzle-orm';

export default defineEventHandler(async (ev) => {
  const session = await useAuthOrThrow(ev);
  return await db
    .select()
    .from(ProjectTable)
    .where(eq(ProjectTable.ownerId, session.user.id));
});
