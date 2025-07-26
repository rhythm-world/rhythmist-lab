import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const Params = z.object({ id: z.uuidv7() });

export default defineEventHandler(async (ev) => {
  const { user } = await useAuthOrThrow(ev);
  const { id } = await getValidatedRouterParams(ev, Params.parse);
  const res = await db
    .delete(ProjectTable)
    .where(and(
      eq(ProjectTable.id, id),
      eq(ProjectTable.ownerId, user.id),
    ));
  if (!res.rowCount)
    throw createError({ statusCode: 404 });
  await ProjectBlobStore.removeItem(`${id}:music`);
});
