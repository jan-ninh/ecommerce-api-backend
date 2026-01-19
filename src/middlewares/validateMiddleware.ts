import type { Request, Response, NextFunction } from 'express';
import { z, type ZodObject } from 'zod/v4';

type AnyZodObject = ZodObject<any>;

function badRequest(message: string) {
  return new Error(message, { cause: 400 });
}

function formatUnrecognizedKeysIssue(error: z.ZodError): { keys: string[]; path: string } | null {
  const issue = error.issues.find(i => i.code === 'unrecognized_keys') as
    | { code: string; keys?: string[]; path?: (string | number)[] }
    | undefined;

  if (!issue?.keys?.length) return null;

  const keys = issue.keys;
  const pathArr = issue.path ?? [];
  const path = pathArr.length > 0 ? pathArr.map(p => (typeof p === 'number' ? `[${p}]` : `.${p}`)).join('') : '';

  // z.B. ".items[0]" -> "items[0]" (lesbarer)
  const normalizedPath = path && path.startsWith('.') ? path.slice(1) : path;

  return { keys, path: normalizedPath };
}

export function validateBodyZod(zodSchema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { data, error, success } = zodSchema.safeParse(req.body);

    if (!success) {
      const unrec = formatUnrecognizedKeysIssue(error);

      if (unrec) {
        const { keys, path } = unrec;
        const location = path ? ` (${path})` : '';

        // Client-freundliche Spezialfälle (Orders Snapshot-Felder, etc.)
        if (keys.includes('title') || keys.includes('unitPrice')) {
          return next(
            badRequest(
              `Invalid request: Do not send (${keys.join(', ')})${location}. These fields are set by the server.`
            )
          );
        }

        return next(
          badRequest(
            `Invalid request: Unknown fields (${keys.join(
              ', '
            )})${location}. Please remove them and send only documented fields.`
          )
        );
      }

      return next(badRequest(z.prettifyError(error)));
    }

    req.body = data;
    next();
  };
}

export function validateParamsZod(zodSchema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { data, error, success } = zodSchema.safeParse(req.params);

    if (!success) {
      const unrec = formatUnrecognizedKeysIssue(error);

      if (unrec) {
        const { keys, path } = unrec;
        const location = path ? ` (${path})` : '';
        return next(badRequest(`Invalid request: Unknown params (${keys.join(', ')})${location}.`));
      }

      return next(badRequest(z.prettifyError(error)));
    }

    // Express types sind restriktiv -> cast ist ok
    (req as any).params = data;
    next();
  };
}

export function validateQueryZod(zodSchema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { data, error, success } = zodSchema.safeParse(req.query);

    if (!success) {
      const unrec = formatUnrecognizedKeysIssue(error);

      if (unrec) {
        const { keys, path } = unrec;
        const location = path ? ` (${path})` : '';
        return next(badRequest(`Invalid request: Unknown query params (${keys.join(', ')})${location}.`));
      }

      return next(badRequest(z.prettifyError(error)));
    }

    // Express 5: req.query ist getter-only -> NICHT neu zuweisen!
    // Stattdessen das bestehende Query-Objekt leeren und befüllen:
    const q = req.query as Record<string, unknown>;

    for (const key of Object.keys(q)) delete q[key];
    Object.assign(q, data);

    next();
  };
}
