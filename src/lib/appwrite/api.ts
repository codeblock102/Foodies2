import { IActualiserPubli, INouvelUtil, INouvellePubli } from "@/types";
import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases,storage } from "./config";

export async function creerUtil(util: INouvelUtil) {
   try {
      const nouveauCompte = await account.create(
         ID.unique(),
         util.email,
         util.password,
         util.name,

      )
      if (!nouveauCompte) throw Error;
      const avatarUrl = avatars.getInitials(util.name);
      const nouvelUtil = await mettreUtilBd({
         accountId: nouveauCompte.$id,
         name: nouveauCompte.name,
         email: nouveauCompte.email,
         username: util.username,
         imageUrl: avatarUrl,
      })
      return nouvelUtil;
   } catch (erreur) {
      console.log(erreur);
      return erreur;
   }
}

export async function mettreUtilBd(util: {
   accountId: string,
   email: string,
   name: string
   imageUrl: URL,
   username?: string
}) {
   try{
      const nouvelUtil = await databases.createDocument(
         appwriteConfig.databaseId,
         appwriteConfig.userCollectionId,
         ID.unique(),
         util
      )
      return nouvelUtil;
   }catch(erreur){
      console.log(erreur);
   }
}
export async function getUtilById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function ouvrirSessionUtil(util:{email:string,password:string}){
   try{
        
      const session = await account.createEmailSession(util.email,util.password);
      return session
   }catch(erreur){
      console.log(erreur);
   }
}
export async function getAccount() {
   try {
     const currentAccount = await account.get();
      
     return currentAccount;
   } catch (error) {
     console.log(error);
   }
 }
export async function getCurrentUtil(){
   try{
      const currentAccount = await getAccount();
      if(!currentAccount){
         throw new Error;
      }
      const currentUtil = await databases.listDocuments(
         appwriteConfig.databaseId,appwriteConfig.userCollectionId,[Query.equal('accountId',currentAccount.$id)]
      )
      console.log(currentAccount)
      if(!currentUtil){
         throw Error;
      }
      return currentUtil.documents[0];
   }catch(erreur){
      console.log(erreur);
   }
}

export async function fermerSession() {
   try {
     const session = await account.deleteSession("current");
 
     return session;
   } catch (error) {
     console.log(error);
   }
 }

 export async function creerPubli(publi: INouvellePubli) {
   try {
     // Upload file to appwrite storage
     const uploadedFile = await uploadFichier(publi.file[0]);
 
     if (!uploadedFile) throw Error;
 
     // Get file url
     const fichierUrl = getFilePreview(uploadedFile.$id);
     if (!fichierUrl) {
       await supprimerFichier(uploadedFile.$id);
       throw Error;
     }
 
     // Convert tags into array
     const tags = publi.tags?.replace(/ /g, "").split(",") || [];
 
     // Create post
     const newPost = await databases.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       ID.unique(),
       {
         createur: publi.utilId,
         caption: publi.caption,
         imageUrl: fichierUrl,
         imageId: uploadedFile.$id,
         location: publi.location,
         tags: tags,
       }
     );
 
     if (!newPost) {
       await supprimerFichier(uploadedFile.$id);
       throw Error;
     }
 
     return newPost;
   } catch (error) {
     console.log(error);
   }
 }
 export async function uploadFichier(fichier: File) {
   try {
     const uploadedFile = await storage.createFile(
       appwriteConfig.storageId,
       ID.unique(),
       fichier
     );
 
     return uploadedFile;
   } catch (error) {
     console.log(error);
   }
 }

 export function getFilePreview(fileId: string) {
   try {
     const fileUrl = storage.getFilePreview(
       appwriteConfig.storageId,
       fileId,
       2000,
       2000,
       "top",
       100
     );
 
     if (!fileUrl) throw Error;
 
     return fileUrl;
   } catch (error) {
     console.log(error);
   }
 }

 export async function supprimerFichier(fichierId: string) {
   try {
     await storage.deleteFile(appwriteConfig.storageId, fichierId);
 
     return { status: "ok" };
   } catch (error) {
     console.log(error);
   }
 }
 
 export async function getPublisRecentes(){
   const publications = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.postCollectionId,[Query.orderDesc('$createdAt'), Query.limit(20)]);
   if(!publications){
      throw Error;
   }
   return publications
 }

 export async function aimerPubli(publiId: string, likesArray: string[]) {
   try {
     const updatedPubli = await databases.updateDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       publiId,
       {
         likes: likesArray,
       }
     );
 
     if (!updatedPubli) throw Error;
 
     return updatedPubli;
   } catch (error) {
     console.log(error);
   }
 }

 export async function sauvegarderPubli(utilId: string, publiId: string) {
   try {
     const updatedPubli = await databases.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.savesCollectionId,
       ID.unique(),
       {
         util: utilId,
         publi: publiId,
       }
     );
 
     if (!updatedPubli) throw Error;
 
     return updatedPubli;
   } catch (error) {
     console.log(error);
   }
 }

 export async function supprimerPubliSauvegarde(savedRecordId: string) {
   try {
     const statusCode = await databases.deleteDocument(
       appwriteConfig.databaseId,
       appwriteConfig.savesCollectionId,
       savedRecordId
     );
 
     if (!statusCode) throw Error;
 
     return { status: "Ok" };
   } catch (error) {
     console.log(error);
   }
 }
 
 export async function updatePubli(publi: IActualiserPubli) {
   const hasFileToUpdate = publi.file.length > 0;
 
   try {
     let image = {
       imageUrl: publi.imageUrl,
       imageId: publi.imageId,
     };
 
     if (hasFileToUpdate) {
       // Upload new file to appwrite storage
       const uploadedFile = await uploadFichier(publi.file[0]);
       if (!uploadedFile) throw Error;
 
       // Get new file url
       const fichierUrl = getFilePreview(uploadedFile.$id);
       if (!fichierUrl) {
         await supprimerFichier(uploadedFile.$id);
         throw Error;
       }
 
       image = { ...image, imageUrl: fichierUrl, imageId: uploadedFile.$id };
     }
 
     // Convert tags into array
     const tags = publi.tags?.replace(/ /g, "").split(",") || [];
 
     //  Update post
     const updatedPost = await databases.updateDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       publi.postId,
       {
         caption: publi.caption,
         imageUrl: image.imageUrl,
         imageId: image.imageId,
         location: publi.location,
         tags: tags,
       }
     );
 
     // Failed to update
     if (!updatedPost) {
       // Delete new file that has been recently uploaded
       if (hasFileToUpdate) {
         await supprimerFichier(image.imageId);
       }
 
       // If no new file uploaded, just throw error
       throw Error;
     }
 
     // Safely delete old file after successful update
     if (hasFileToUpdate) {
       await supprimerFichier(publi.imageId);
     }
 
     return updatedPost;
   } catch (error) {
     console.log(error);
   }
 }
 
 export async function getPubliById(publiId?: string) {
  if (!publiId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      publiId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function supprimerPubli(publiId?: string, imageId?: string) {
  if (!publiId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      publiId
    );

    if (!statusCode) throw Error;

    await supprimerFichier(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
export async function getPublis(searchTerm: string) {
  try {
    const publis = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!publis) throw Error;

    return publis;
  } catch (error) {
    console.log(error);
  }
}

export async function getPubliInfini({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const publis = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!publis) throw Error;

    return publis;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPublis(searchTerm: string) {
  try {
    const publis = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!publis) throw Error;

    return publis;
  } catch (error) {
    console.log(error);
  }
}

export async function getUtilPublis(utilId?: string) {
  if (!utilId) return;

  try {
    const publi = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("createur", utilId), Query.orderDesc("$createdAt")]
    );

    if (!publi) throw Error;

    return publi;
  } catch (error) {
    console.log(error);
  }
}