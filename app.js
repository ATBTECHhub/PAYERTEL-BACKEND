import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import waitListRouter from './routes/waitListRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import billRouter from './routes/billRoutes.js';
import superAdminRouter from "./routes/superAdminRoutes.js";
import financialMagerRouter from "./routes/financialManagerRoutes.js";
import supportManagerRouter from "./routes/suportMangerRoutes.js";
import contentManagerRouter from "./routes/contentMangerRoutes.js";
import transactionRouter from './routes/transactionRoutes.js';
import thirdartyWalletRouter from './routes/thirdartyWalletRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

const app = express();

app.use(express.json());

// Use MongoDB for session storage
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB,
      ttl: 14 * 24 * 60 * 60, // = 14 days
      autoRemove: 'native', // Automatically remove expired sessions
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Trust proxy setting
app.set('trust proxy', 1);

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 1) GLOBAL MIDDLEWARES

// Enable CORS with specific options
// const corsOptions = {
//   origin: process.env.CLIENT_URL,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };
// app.use(cors(corsOptions));

app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // max number of requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price', // Add other properties as needed
    ],
  })
);

// 2) ROUTES
app.use('/api/v1/waitlist', waitListRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bills', billRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use("api/v1/support-manager", supportManagerRouter); 
app.use("/api/v1/financial-manager", financialMagerRouter);
app.use("/api/v1/content-manager", contentManagerRouter);
app.use('/api/v1/third-party-wallet', thirdartyWalletRouter);
app.use("/api/v1/super-admin", superAdminRouter);

// Handling all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

export default app;
