const express = require('express')
const dotenv = require('dotenv')
// const sequelized = require('sequelzie')
const path = require('path')
const connectDB = require('./config/db')
const cookieParser =  require('cookie-parser');
const apiRoutes = require('./routes/api')
const webRoutes = require('./routes/web')
const startServer = async () => {

  dotenv.config()
  await connectDB()
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, "public")));
  
  app.use(cookieParser());

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  app.use('/api', apiRoutes);   // REST API (JSON)
  app.use('/', webRoutes);      // các trang HTML

  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Server is running on port ${port}`)
  })
};

startServer().catch(err => {
  console.error('Failed to start server:', err)
  process.exit(1)
});