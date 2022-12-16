import { z } from 'zod'
import { ulidSchema as ulid } from './ulid';

export { ulidSchema as ulid } from './ulid';
export { timeSchema as time } from './ulid';

export const noteEntry = z.object({
  id: ulid,
  file: z.string(),
  metadata: z.object({
    version: z.string(),
    url: z.string(),
    title: z.string()
  }).refine(m => JSON.stringify(m).length <= 1024, {
    message: 'Metadata must be less than 1024 bytes',
  })
});
