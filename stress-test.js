import autocannon from 'autocannon';

const GATEWAY_URL = 'http://localhost:3000';
const DURATION_SECONDS = 10; 
const CONNECTIONS_PER_ROUTE = 50; // 50 connections per server (100 total)

// 1. This is the missing helper function that builds each cannon!
function startCannon(path) {
  return new Promise((resolve, reject) => {
    const instance = autocannon({
      url: GATEWAY_URL + path,
      connections: CONNECTIONS_PER_ROUTE,
      duration: DURATION_SECONDS
    });

    // Track progress in the console
    autocannon.track(instance, { renderProgressBar: true });

    // When this specific cannon finishes, print its results
    instance.on('done', (result) => {
      console.log(`\n✅ Results for ${path}:`);
      console.log(`   Requests Sent: ${result.requests.total}`);
      console.log(`   Errors: ${result.errors}`);
      console.log(`   Timeouts: ${result.timeouts}`);
      console.log(`   Average Latency: ${result.latency.average} ms`);
      resolve();
    });

    instance.on('error', reject);
  });
}

// 2. The main function that fires them both
async function runDualStressTest() {
  console.log(`🚀 Firing TWO cannons at /1 and /2...`);
  console.log(`⏱️  Duration: ${DURATION_SECONDS} seconds`);
  console.log('Please wait...\n');
  
  // Fire Cannon 1
  startCannon('/1');

  // Wait 1 second, then fire Cannon 2
  setTimeout(() => {
      startCannon('/2');
  }, 1000);
}

runDualStressTest();