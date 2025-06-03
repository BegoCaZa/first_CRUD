const express = require('express');
const usersController = require('../controllers/users.controller');
const usersRouter = express.Router();

//definir las rutas
usersRouter.get('/read', usersController.readAllUsers);
usersRouter.get('/read/:id', usersController.readUserById);
usersRouter.post('/write', usersController.createUser);
usersRouter.patch('/update/:id', usersController.updateUserById);
usersRouter.delete('/delete/:id', usersController.deleteUserById);

module.exports = usersRouter;
