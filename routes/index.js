const express = require('express');

const userTokenRouter = require('./token.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');

const app = express();

app.get('/', (_, res) => {
  return res.send({
    message: 'Index route',
  });
});

app.use('/token', userTokenRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

module.exports = app;
