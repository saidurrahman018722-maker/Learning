import amqp from 'amqplib';

// We keep these variables scoped to the module so they can be reused
let connection;
let channel;

/**
 * 1. Connect to RabbitMQ Server
 */
export const connectRabbitMQ = async () => {
  try {
    // Falls back to localhost if environment variable is not set
    const rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    
    connection = await amqp.connect(rabbitMqUrl);
    channel = await connection.createChannel();
    
    console.log('RabbitMQ Connected Successfully');
  } catch (error) {
    console.error('RabbitMQ Connection Failed:', error.message);
    process.exit(1); // Exit if connection fails, as the app likely depends on it
  }
};


 // 2. Publish a message to a specific queue
//@param {string} queueName - The name of the queue
// @param {object|string} data - The message payload

export const publishToQueue = async (queueName, data) => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized. Call connectRabbitMQ() first.');
  }  await connectRabbitMQ();

  try {
    // Ensure the queue exists before sending to it (durable: true survives server restarts)
    await channel.assertQueue(queueName, { durable: true });
    
    // Convert data to a Buffer (RabbitMQ only accepts Buffers)
    const messageBuffer = Buffer.from(JSON.stringify(data));
    
    channel.sendToQueue(queueName, messageBuffer);
    console.log(`Message published to queue: [${queueName}]`);
  } catch (error) {
    console.error(`Failed to publish to queue ${queueName}:`, error);
  }
};

// /**
//  * 3. Consume messages from a specific queue
//  * @param {string} queueName - The name of the queue to listen to
//  * @param {function} callback - The function to run when a message arrives
//  */
export const consumeToQueue = async (queueName, callback) => {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized. Call connectRabbitMQ() first.');
  }
   await connectRabbitMQ();
  try {
    // Ensure the queue exists before trying to consume from it
    await channel.assertQueue(queueName, { durable: true });
    
    console.log(`Waiting for messages in queue: [${queueName}]...`);

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        // Parse the Buffer back into a readable JavaScript object
        const content = JSON.parse(msg.content.toString());
        
        // Execute the custom logic you passed in
        callback(content);
        
        // Acknowledge the message so RabbitMQ removes it from the queue
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error(`Failed to consume from queue ${queueName}:`, error);
  }
};

/**
 * Optional: Graceful shutdown handler
 */
export const closeRabbitMQ = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('RabbitMQ connection closed.');
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error);
  }
};