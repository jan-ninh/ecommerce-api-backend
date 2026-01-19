import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '#controllers';
import { validateBodyZod, validateParamsZod, validateQueryZod } from '#middlewares';
import { userCreateSchema, userUpdateSchema, userIdParamsSchema, emptyQuerySchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', validateQueryZod(emptyQuerySchema), getUsers);
userRouter.post('/', validateQueryZod(emptyQuerySchema), validateBodyZod(userCreateSchema), createUser);
userRouter.get('/:id', validateQueryZod(emptyQuerySchema), validateParamsZod(userIdParamsSchema), getUserById);
userRouter.put(
  '/:id',
  validateQueryZod(emptyQuerySchema),
  validateParamsZod(userIdParamsSchema),
  validateBodyZod(userUpdateSchema),
  updateUser
);
userRouter.delete('/:id', validateQueryZod(emptyQuerySchema), validateParamsZod(userIdParamsSchema), deleteUser);

export default userRouter;
