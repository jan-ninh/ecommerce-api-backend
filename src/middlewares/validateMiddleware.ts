import type { Request, Response, NextFunction } from 'express';
import { z, ZodObject } from 'zod/v4';

export function validateBodyZod(zodSchema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { data, error, success } = zodSchema.safeParse(req.body);

    if (!success) {
      const issue = error.issues.find(i => i.code === 'unrecognized_keys') as
        | { code: string; keys?: string[]; path?: (string | number)[] }
        | undefined;

      if (issue?.keys?.length) {
        const keys = issue.keys;
        const pathArr = issue.path ?? [];
        const path = pathArr.length > 0 ? pathArr.map(p => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '';
        const location = path ? ` (${path.startsWith('[') ? 'items' + path : path.slice(1)})` : '';

        // client freundliche Error Messages
        if (keys.includes('title') || keys.includes('unitPrice')) {
          return next(
            new Error(`Invalid request: Do not send (${keys.join(', ')}). These fields are set by the server.`, {
              cause: 400
            })
          );
        }

        // client freundliche Error Messages
        return next(
          new Error(
            `Invalid request: Unknown fields (${keys.join(', ')}). Please remove them and send only documented fields.`,
            { cause: 400 }
          )
        );
      }

      // Fallback: Standard Zod Error Message
      return next(new Error(z.prettifyError(error), { cause: 400 }));
    }

    req.body = data;
    next();
  };
}
