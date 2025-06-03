const express = require('express');
const usersRouter = require('./routes/users.routes');
const port = 3000;

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
