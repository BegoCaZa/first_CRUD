const express = require('express');
const path = require('path');
const fs = require('fs');
const port = 3000;

const app = express();

const usersFilePath = path.resolve(__dirname, '../data/users.json');
console.log(usersFilePath);

app.listen(port, () => {
  console.log('Server running on port ' + port);
});

app.get('/read', (req, res) => {
  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);

    res.send(jsonData);
  });
});

app.get('/write', (req, res) => {
  const newUser = {
    userId: 'e65e1490-c230-4043-80bc-ea32fee5f57c',
    name: 'Ejemplo',
    email: 'ejemplo@hotmail.com'
  };
  fs.readFile(usersFilePath, (err, data) => {
    if (err) return res.status(500).send('Error al leer el archivo');

    const jsonData = JSON.parse(data);
    const updatedList = [...jsonData].push(newUser);
    fs.writeFile(usersFilePath, updatedList, err => {
      if (err) return res.status(500).send('Error al escribir en el archivo');
    });
    res.end();
  });
});
