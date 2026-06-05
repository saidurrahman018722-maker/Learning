import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });



const connectDB = async ()=>{
    try {
        await prisma.$connect();
    } catch (error) {
        return resizeBy.status(400).json({message:error.message})
        process.exit(1);
    }
    
}

const disconnectDB = async ()=>{
    try {
        await prisma.$disconnect();
        process.exit(1);
        
    } catch (error) {
        return resizeBy.status(400).json({message:error.message})
    }
    
}

export { prisma,connectDB,disconnectDB };