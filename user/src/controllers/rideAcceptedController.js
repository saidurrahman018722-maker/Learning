
import { consumeToQueue } from "../services/rabbitmq.js"
import { EventEmitter } from 'events';

// Create the global event bus for your rides
export const rideEventEmitter = new EventEmitter();

   export const rideAccepted = async (req, res) => {
            // 1. Set a 30-second timeout. If no ride comes in, close the connection cleanly.
            const timeout = setTimeout(() => {
                // Stop listening to prevent memory leaks
                rideEventEmitter.removeAllListeners('ride-has-been-accepted'); 
                
                // 204 No Content tells the frontend "Nothing yet, try asking again"
                return res.status(204).end(); 
            }, 30000);

            // 2. Pause the request here. Wait for RabbitMQ to trigger this exact event.
            rideEventEmitter.once('ride-has-been-accepted', (data) => {
                
                // We got a ride! Cancel the timeout so it doesn't fire later.
                clearTimeout(timeout);
                
                // Send the ride data to the Captain's app instantly
                return res.status(200).json({
                    success: true,
                    ...data,
                });
            });
            };

    
         export const rabbitMQinit = ()=>{
            consumeToQueue('ride-accepted',(data)=>{
            console.log(data);
            rideEventEmitter.emit('ride-has-been-accepted', data);
    })
         }


