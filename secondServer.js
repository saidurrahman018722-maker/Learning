import express from 'express';
import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`👑 Primary manager (PID: ${process.pid}) is starting...`);
    console.log(`💻 Spawning ${numCPUs} workers for Server 2\n`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`💀 Worker ${worker.process.pid} died. Restarting immediately...`);
        cluster.fork();
    });
} else {
    const app = express();

    app.get('/', (req, res) => {
        // console.log(`Server 2 (Worker ${process.pid}) handled the request`);
        for(let i=1;i<1000000000;i++){
            
        }
        res.send(`Hello from Server 2! (Handled by Worker ${process.pid})`);
    });

    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`📦 Server 2 Worker (${process.pid}) is listening on port ${PORT}`);
    });
}