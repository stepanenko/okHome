const express = require('express');
const mongoose = require('mongoose');
const Client = require('./models/Client');
const ControllerError = require('./errors/ControllerError');

mongoose.connect('mongodb://localhost/restvideo', { useNewUrlParser: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/clients/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const client = await Client.findById(id);
    res.status(200).json(client);
  } 
  catch (e) {
    next(new ControllerError(e.message, 400));
  }
});

app.get('/api/clients', async (req, res, next) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  }
  catch (e) {
    next(new ControllerError(e.message, 400));
  }
});

app.post('/api/clients', async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  }
  catch (e) {
    next(new ControllerError(e.message, 400));
  }
});

app.put('/api/clients/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(client);
  }
  catch (e) {
    next(new ControllerError(e.message, 400));
  }
});

app.delete('/api/clients/:id', async (req, res, next) => {
  try {
    const client = await Client.findByIdAndRemove(req.params.id);
    res.status(203).json(client);
  }
  catch (e) {
    next(new ControllerError(e.message, 400));
  }
});

app.use((req, res, next) => {
  next(new ControllerError('Not Found', 404));
});

// All errors from controllers 'next()' come here:
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.msg,
    status: err.status
  });
}); 

app.listen(3000, () => console.log('Listening...'));