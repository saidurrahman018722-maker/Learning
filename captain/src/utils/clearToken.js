import corn from "node-cron"
import {prisma} from "../config/db.js"

export const clearExpiredTokens = async ()=>{
    const threeDaysAgo =new Date(Date.now()-3*60*60*1000*24);
    try{

    corn.schedule("0 0 * * *",async ()=>{

    await prisma.blackListToken.deleteMany({
        where:{
            expiredAt:{
                lt:threeDaysAgo
            }
        }
    })
})

    }
    catch(error){
        console.error(error.message);
    };

}