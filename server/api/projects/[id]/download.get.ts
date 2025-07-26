import { eq } from 'drizzle-orm';
import JSZip from 'jszip';
import { z } from 'zod';

const Params = z.object({ id: z.uuidv7() });

function inferBpm(chart: string) {
  const match = chart.match(/\((\d+)\)/);
  if (match)
    return Number.parseInt(match[1], 10);
}

export default defineEventHandler(async (ev) => {
  const { user } = await useAuthOrThrow(ev);
  const { id } = await getValidatedRouterParams(ev, Params.parse);
  const [p] = await db
    .select()
    .from(ProjectTable)
    .where(eq(ProjectTable.id, id));
  if (!p || p.ownerId !== user.id)
    throw createError({ statusCode: 404 });
  if (p.status !== 'completed')
    throw createError({ statusCode: 400 });

  const zip = new JSZip();
  zip.file('track.mp3', await ProjectBlobStore.getItemRaw(`${p.id}:music`));
  zip.file('maidata.txt', `&title=${p.title}
&wholebpm=${inferBpm(p.chart!)}
&des=Rhythmist AI
&cabinet=DX

&des_1=
&lv_1=?
&inote_1=
${p.chart!}`);
  zip.file('bg.png', await useStorage('assets:server').getItemRaw('placeholder.png'));
  setHeader(ev, 'Content-Disposition', `attachment; filename="${encodeURIComponent(p.title)}.zip"`);
  return zip.generateNodeStream();
});
