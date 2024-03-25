import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InscriptionValidation } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast"
import "../../fonts.css";

import { Button } from "@/components/ui/button";
import { creerUtil } from "@/lib/appwrite/api";
import { useCreerUtilCompteMutation, useOuvrirSessionMutation } from "@/lib/react-query/requetesEtMutations";
import { useUtilContext } from "@/context/AuthContext";

export default function Inscription() {
    const { toast } = useToast();
    const naviguer = useNavigate();

    const {checkAuthUtil} = useUtilContext()
   
    // 1. Define your form.
    const form = useForm<z.infer<typeof InscriptionValidation>>({
        resolver: zodResolver(InscriptionValidation),
        defaultValues: {
          name: "",
          username: "",
          email: "",
          password: "",
        },
      });
    
  
  //@ts-ignore
const {mutateAsync:creerCompteUtil,isPending:isCreerUtil} = useCreerUtilCompteMutation();
const {mutateAsync:ouvrirSessionUtil} = useOuvrirSessionMutation ();
  
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof InscriptionValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
    const nouvelUtil = await creerUtil(values); //
    if(!nouvelUtil){
        return toast({
            title: "Le compte n'a pas été créée",
            
          }); 
    }
   const session = await ouvrirSessionUtil({
    email:values.email, password:values.password
   })
   if(!session){
    return toast({
        title: "Connexion refusé. Réessayer",
        
      }); 
   }
   const isLoggedIn = await checkAuthUtil();

   if(isLoggedIn){
    form.reset();
    naviguer('/')
   }else{
    return toast({
        title: "Connexion refusé. Réessayer",
        
      }); 
   }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-center flex-col items-center">
        <h1 className="logo text-4xl mb-12">Foodies</h1>
        <h2 className="h3-bold md:h2-bold sm:pt-12">Créer un nouveau compte</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Pour utiliser Foodies, entrez vos informations
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom d'utilisateur</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field}/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courriel</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field}/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field}/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button-primary">
                {isCreerUtil ? (
                <div className="flex-center gap-2">Chargement...</div>
                ) : (
                "S'inscrire"
                )}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Vous avez déjà un compte?{" "}
            <Link
              to="/ouvrirSession"
              className="text-primary text-small-semibold ml-1"
            >
              Ouvrir Session
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}
