import express from 'express';
import morgan from 'morgan';
import proxy from 'express-http-proxy';

const app = express();

// 1. Use Morgan to log all traffic entering the Gateway
app.use(morgan('dev')); 

// 2. Gateway Security (Optional but recommended)
// app.use((req, res, next) => {
//     // Example: Check for an API key before letting them through
//     if (req.headers['x-api-key'] !== 'my-secret-key') {
//         return res.status(401).send('Unauthorized');
//     }
//     next();
// });

// 3. Routing requests to your microservices
// When a user hits localhost:3000/users, the gateway secretly fetches it from localhost:3001
// Route 1
app.use('/1', proxy('http://localhost:3001'));
app.use('/2', proxy('http://localhost:3002'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚪 API Gateway is running on port ${PORT}`);
});