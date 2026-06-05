import zod from 'zod'


export const  registerSchema =zod.object({
    name:zod.string().trim().min(2,"the name must have at least 2 characters").max(20,"the name can have max 20 characters "),
    email:zod.string().email("this must be a valid email"),
    password : zod.string().min(6,"the password must be a atlest 6 digits.")

})

export const loginSchema = zod.object({
    email:zod.string().email("this must be a valid email"),
    password : zod.coerce.number().min(6,"the password must be a atlest 6 digits.")

})


export const blackListTokenSchema = zod.object({
    token: zod.string({
    required_error: "Token is required to blacklist.",
    invalid_type_error: "Token must be a valid string.",
  }).min(1, "Token cannot be empty.")
})