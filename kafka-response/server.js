const express = require('express')

const app = express();

const port = 8080;

app.get('/ping', (req,res)=> {
  res.status(200).send('pong');
})

app.post('/', (req,res) =>{
  console.log('triggered by an event');
  res.status(200).send();
})

app.listen(port, ()=> {
  console.log('the server start at the port:',port)
})