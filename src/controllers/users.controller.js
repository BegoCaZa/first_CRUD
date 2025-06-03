//son las acciones que se van a realizar para cada petición
const fs = require('fs');
const path = require('path');
import { v4 } from 'uuid';

//creo el objeto para guardar las acciones
const usersController = {};

//traigo la info necesario
const usersFilePath = path.resolve(__dirname, '../../data/users.json');
console.log(usersFilePath);

//creo un método readAllUsers y meto la accion de leer
usersController.readAllUsers = (req, res) => {
  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);
    res.send(jsonData);
  });
};

//read users by id
usersController.readUserById = (req, res) => {
  const userId = req.params.id;
  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);
    const user = jsonData.find(user => user.userId === userId);

    if (!user) return res.status(404).send('Usuario no encontrado');

    res.send(user);
  });
};

//create a new user (email must be unique)
usersController.createUser = (req, res) => {
  const newUser = req.body;
  //id unico un v4
  newUser.userId = v4();

  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);

    // Check si existe el email
    const existingUser = jsonData.find(user => user.email === newUser.email);
    if (existingUser) return res.status(400).send('El email ya está en uso');

    //Meto ese nuevo usuario al array
    jsonData.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(jsonData), err => {
      if (err) return res.status(500).send('Error al escribir en el archivo');
      res.status(201).send(newUser);
    });
    // res.end();
  });
};

module.exports = usersController;
