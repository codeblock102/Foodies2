import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {  PubliValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUtilContext } from "@/context/AuthContext";

import { useCreerPubli, useUpdatePubli } from "../../lib/react-query/requetesEtMutations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader } from "lucide-react";
import FileUploader from "../shared/FileUploader";

type PubliFormProps = {
  publi?: Models.Document;
  action: "Create" | "Update";
};

export default function PostForm({ publi, action }: PubliFormProps) {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { util } = useUtilContext();
    const form = useForm<z.infer<typeof PubliValidation>>({
      resolver: zodResolver(PubliValidation),
      defaultValues: {
        caption: publi ? publi?.caption : "",
        file: [],
        location: publi ? publi.location : "",
        tags: publi ? publi.tags.join(",") : "",
      },
    });
  
    // Query
    const { mutateAsync: creerPubli, isPending: isLoadingCreate } =
      useCreerPubli();
    const { mutateAsync: updatePubli, isPending: isLoadingUpdate } =
      useUpdatePubli();
  
    // Handler
    const gererSoumission = async (value: z.infer<typeof PubliValidation>) => {
      // ACTION = UPDATE
      if (publi && action === "Update") {
        const updatedPost = await updatePubli({
          ...value,
          postId: publi.$id,
          imageId: publi.imageId,
          imageUrl: publi.imageUrl,
        });
  
        if (!updatedPost) {
          toast({
            title: `${action} Publication échoué. Veuillez réessayer.`,
          });
        }
        return navigate(`/publications/${publi.$id}`);
      }
  
      // ACTION = CREATE
      const nouvelPubli = await creerPubli({
        ...value,
        utilId: util.id,
      });
  
      if (!nouvelPubli) {
        toast({
          title: `${action} Publication échoué. Veuillez réessayer.`,
        });
      }
      navigate("/");
    };
  
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(gererSoumission)}
          className="flex flex-col gap-9 w-full  max-w-5xl">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea
                    className="shad-textarea custom-scrollbar"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={publi?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">
                  Add Tags (separated by comma " , ")
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Art, Expression, Learn"
                    type="text"
                    className="shad-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
  
          <div className="flex gap-4 items-center justify-end">
            <Button
              type="button"
              className="shad-button_dark_4"
              onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="shad-button_primary whitespace-nowrap"
              disabled={isLoadingCreate || isLoadingUpdate}>
              {(isLoadingCreate || isLoadingUpdate) && <Loader />}
              {action} Post
            </Button>
          </div>
        </form>
      </Form>
    );
}
