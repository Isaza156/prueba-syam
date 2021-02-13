const express = require ('express');
const app = express();
const routes= require('./routes/routes');
const cors = require('cors')

app.set('port', 3307);

app.use(cors())
app.use(express.json());

app.use('/', routes);

app.listen(app.get('port'), () => {
  console.log(`Server on Port ${app.get('port')}`);
});