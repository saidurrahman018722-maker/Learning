import express from 'express';
import cluster from 'cluster';
import os from 'os';

// Count how many CPU cores your computer has
const numCPUs = os.cpus().length;

// If this is the main process, its job is just to spawn workers
if (cluster.isPrimary) {
    console.log(`👑 Primary manager (PID: ${process.pid}) is starting...`);
    console.log(`💻 Spawning ${numCPUs} workers for Server 1\n`);

    // Fork a new worker for every CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // If a worker crashes under extreme stress, instantly restart it!
    cluster.on('exit', (worker, code, signal) => {
        console.log(`💀 Worker ${worker.process.pid} died. Restarting immediately...`);
        cluster.fork();
    });

} 
// If this is a worker process, start the actual Express server
else {
    const app = express();

    app.get('/', (req, res) => {
        // We log the process ID so you can see which core answered the request!
        // console.log(`Server 1 (Worker ${process.pid}) handled the request`);
        for(let i=1;i<1000000000;i++){
            
        }
        res.send(`Hello from Server 1! (Handled by Worker ${process.pid})`);
    });

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`📦 Server 1 Worker (${process.pid}) is listening on port ${PORT}`);
    });
}