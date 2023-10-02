require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// database
const connectDB = require('./db/connect');

//routes
const authRouter = require('./routes/authRoutes');
const memberRouter = require('./routes/memberRoutes');
const taskRouter = require('./routes/taskRoutes');
const eventRouter = require('./routes/eventRoutes');

const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/members', memberRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/events', eventRouter);


const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();



