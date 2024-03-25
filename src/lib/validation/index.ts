import { z } from "zod"
export const InscriptionValidation = z.object({
    name: z.string().min(2, {message: "Le nom est trop court"}),
    username: z.string().min(2,{message: "Le nom d'utilisateur est trop court"}).max(50, {message: "Le nom d'utilisateur est trop long"}),
    email : z.string().email({message: "Écrivez un courriel valide"}),
    password: z.string().min(8, {message: "Le mot de passe est trop court"})
  })

  export const ouvrirSessionValidation = z.object({
    email : z.string().email({message: "Écrivez un courriel valide"}),
    password: z.string().min(8, {message: "Le mot de passe est trop court"})
  })


  export const PubliValidation = z.object({
    caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
    file: z.custom<File[]>(),
    location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    tags: z.string(),
  });