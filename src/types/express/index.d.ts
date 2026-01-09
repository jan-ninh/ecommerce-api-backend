import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    customProperty?: string;
    user?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  }
}

export {};
