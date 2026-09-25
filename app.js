const express = require('express')
const dotenv = require('dotenv')
// const sequelized = require('sequelzie')
const path = require('path')
const adminRoutes = require('./routes/adminRoutes')
const connectDB = require('./config/db')
const authRoutes = require("./routes/authRoutes");
const cookieParser =  require('cookie-parser');
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')

const startServer = async () => {

  dotenv.config()
  await connectDB()
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, "public")));
  
  app.use(cookieParser());

  app.use("/", authRoutes);
  // app.use('/order', orderRoutes)
  // app.use('/admin', adminRoutes)

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))
  app.use('/product', productRoutes);
  app.use('/admin', adminRoutes);
  app.use('/', userRoutes);

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