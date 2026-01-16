import { Router } from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { userCreateSchema, userUpdateSchema } from '#schemas';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/', validateBodyZod(userCreateSchema), createUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', validateBodyZod(userUpdateSchema), updateUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;
