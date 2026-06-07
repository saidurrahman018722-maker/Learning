import z from "zod"


export const RideSchema = z.object({
    pickup : z.string("the pick up point in required."),
    destination : z.string("the destination point in required."),
})