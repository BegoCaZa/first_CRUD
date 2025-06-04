//son las acciones que se van a realizar para cada petición
const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');

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

//CREATE a new user
usersController.createUser = (req, res) => {
  const newUser = req.body;
  //id unico un v4
  newUser.userId = v4();

  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);

    // Check si existe el email
    const existingUser = jsonData.find(user => user.email === newUser.email);
    if (existingUser) return res.status(409).send('El email ya está en uso');

    //Meto ese nuevo usuario al array
    jsonData.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(jsonData), err => {
      if (err) return res.status(500).send('Error al escribir en el archivo');

      res.send(newUser);
    });
    // res.end();
  });
};

//READ users by id
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

//UPDATE user by id
usersController.updateUserById = (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);

    const foundUser = jsonData.find(user => user.userId === userId); //encuentra el usuario por id

    if (!foundUser) return res.status(404).send('Usuario no encontrado');

    //no repetir email
    const existingEmail = jsonData.find(
      user => user.email === updatedUser.email && user.id !== userId
    );
    if (existingEmail) return res.status(409).send('El email ya está en uso');

    //creo un nuevo objeto con los datos actualizados?
    const updatedJsonData = jsonData.map(user => {
      if (user.userId === userId) {
        return {
          ...user,
          ...updatedUser //actualizo los datos del usuario
        };
      }
      return user; //si no coicide,devuelvo el usuario sin cambios
    });

    fs.writeFile(usersFilePath, JSON.stringify(updatedJsonData), err => {
      if (err) return res.status(500).send('Error al escribir en el archivo');

      res.send(updatedUser);
      console.log('Usuario actualizado:', updatedUser);
      //mando solo ese usuario actualizado
    });
  });
};

//DELETE user by id
usersController.deleteUserById = (req, res) => {
  const userId = req.params.id;

  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);

    //encuentro el usuario por id
    const foundUser = jsonData.find(user => user.userId === userId);

    if (!foundUser) return res.status(404).send('Usuario no encontrado');

    //nuevo array sin el usuario
    const filteredData = jsonData.filter(user => user.userId !== userId);

    fs.writeFile(usersFilePath, JSON.stringify(filteredData), err => {
      if (err) return res.status(500).send('Error al escribir en el archivo');

      res.send({ message: 'Usuario eliminado correctamente' });
    });
  });
};

module.exports = usersController;
