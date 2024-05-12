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
import { ouvrirSessionValidation} from "@/lib/validation";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast"
import "../../fonts.css";

import { Button } from "@/components/ui/button";
import { useOuvrirSessionMutation } from "@/lib/react-query/requetesEtMutations";
import { useUtilContext } from "@/context/AuthContext";

export default function OuvrirSession() {
    const { toast } = useToast()
    const {checkAuthUtil ,isLoading: isUtilLoading} = useUtilContext()
    const naviguer = useNavigate();
    
  const {mutateAsync:ouvrirSessionUtil} = useOuvrirSessionMutation ();
  // 1. Define your form.
  const form = useForm<z.infer<typeof ouvrirSessionValidation>>({
    resolver: zodResolver(ouvrirSessionValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ouvrirSessionValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    
   
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
    naviguer('/');
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
        
        

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4 w-4/5"
        >
          
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
                {isUtilLoading ? (
                <div className="flex-center gap-2">Chargement...</div>
                ) : (
                "Ouvrir Session "
                )}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Vous avez déjà un compte?{" "}
            <Link
              to="/inscription"
              className=" text-small-semibold ml-1 font-bold"
            >
              Créer un nouveau compte
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}
