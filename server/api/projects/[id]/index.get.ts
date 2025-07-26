import { eq } from 'drizzle-orm';
import { z } from 'zod';

const Params = z.object({ id: z.uuidv7() });

export default defineEventHandler(async (ev) => {
  const { user } = await useAuthOrThrow(ev);
  const { id } = await getValidatedRouterParams(ev, Params.parse);
  const [p] = await db
    .select()
    .from(ProjectTable)
    .where(eq(ProjectTable.id, id));
  if (!p || p.ownerId !== user.id)
    throw createError({ statusCode: 404 });
  return p;
});
