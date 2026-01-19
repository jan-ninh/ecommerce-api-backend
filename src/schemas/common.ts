import { z } from 'zod/v4';

// Standard ObjectId als String (24 hex)
export const objectIdString = z
  .string({ error: 'id must be a string' })
  .regex(/^[a-fA-F0-9]{24}$/, { message: 'Invalid id format' });

// Für Routes, die KEINE Query params erlauben
export const emptyQuerySchema = z.strictObject({}); //Query muss leer sein
