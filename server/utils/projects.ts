import { createStorage } from 'unstorage';
import netlifyBlobsDriver from 'unstorage/drivers/netlify-blobs';

export const ProjectBlobStore = createStorage<{
  items: {
    [key: `${string}:${'cover' | 'music'}`]: ArrayBuffer
  }
}>({
  driver: netlifyBlobsDriver({ name: 'projects', consistency: 'strong' }),
});
