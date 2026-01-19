import '#db';
import express from 'express';
import { userRouter, categoryRouter, productRouter, orderRouter, docsRouter } from '#routers';
import { errorHandler, logger } from '#middlewares';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/docs', docsRouter);
app.use('/*splat', (req, res) => {
  throw new Error('Not found!', { cause: 404 });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`\\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`);
  console.log(`\\x1b[36mOpenAPI JSON served at  http://localhost:${port}/docs/openapi.json\\x1b[0m`);
  console.log(`\\x1b[33mSwagger UI served at http://localhost:${port}/docs\\x1b[0m`);
});
