/* eslint-disable antfu/no-top-level-await */
import process from 'node:process';
import { createPartFromBase64, createUserContent, GoogleGenAI } from '@google/genai';
import { eq } from 'drizzle-orm';
import { createError } from 'h3';
import { z } from 'zod';

const PROMPT_TEMPLATE = (await useStorage('assets:server').getItem('generate-chart.prompt.md'))!.toString();
const EXAMPLE_AUDIO_BASE64 = toBase64(await useStorage('assets:server').getItemRaw('chart-example.mp3'));

const Params = z.object({ id: z.uuidv7() });

export default defineEventHandler(async (ev) => {
  if (ev.method !== 'POST')
    throw createError({ statusCode: 405 });
  const { id } = await getValidatedRouterParams(ev, Params.parse);
  const { user } = await useAuthOrThrow(ev);

  const [p] = await db
    .select()
    .from(ProjectTable)
    .where(eq(ProjectTable.id, id));

  if (!p || p.ownerId !== user.id)
    throw createError({ statusCode: 404 });

  const music = await ProjectBlobStore.getItemRaw(`${id}:music`);
  if (p.chart || !music)
    throw createError({ statusCode: 400 });

  await db
    .update(ProjectTable)
    .set({ status: 'generating' })
    .where(eq(ProjectTable.id, id));

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: createUserContent([
        { text: PROMPT_TEMPLATE },
        createPartFromBase64(toBase64(music), 'audio/mp3'),
        createPartFromBase64(EXAMPLE_AUDIO_BASE64, 'audio/mp3'),
      ]),
      config: {
        thinkingConfig: {
          thinkingBudget: 128,
        },
      },
    });

    await db
      .update(ProjectTable)
      .set({ status: 'completed', chart: res.text })
      .where(eq(ProjectTable.id, id));
  } catch (e) {
    console.error(e);
    await db
      .update(ProjectTable)
      .set({ status: 'failed' })
      .where(eq(ProjectTable.id, id));
    throw createError({ statusCode: 500 });
  }
});
