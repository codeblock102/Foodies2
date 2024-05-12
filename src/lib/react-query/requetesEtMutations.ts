import {
    useQuery, useMutation, useQueryClient, useInfiniteQuery
} from '@tanstack/react-query'
import { aimerPubli, creerPubli, fermerSession, getCurrentUtil, getPubliById, getPublisRecentes, getUtilById, getUtilPublis, mettreUtilBd, ouvrirSessionUtil, sauvegarderPubli, searchPublis, supprimerPubli, supprimerPubliSauvegarde, updatePubli } from '../appwrite/api'
import { IActualiserPubli, INouvelUtil, INouvellePubli } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { Query } from 'appwrite'
import { appwriteConfig, databases } from '../appwrite/config'

export const useCreerUtilCompteMutation = () => {
    return useMutation({
        //@ts-ignore
        mutationFn: (util: INouvelUtil) => mettreUtilBd(util)
    })
}

export const useOuvrirSessionMutation = () => {
    return useMutation({
        mutationFn: (util: { email: string; password: string }) => ouvrirSessionUtil(util)
    })
}

export const useFermeressionMutation = () => {
    return useMutation({
        mutationFn: fermerSession
    })
}

export const useCreerPubli = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (publication: INouvellePubli) => creerPubli(publication),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES]
            })
        }
    })
}

export const useGetPublisRecentes = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES],
        queryFn: getPublisRecentes,
    });
};

export const useGetUtils = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_UTILS],
        queryFn: () => getUtils(limit),
    });
};

export const useAimerPubli = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            publiId,
            likesArray,
        }: {
            publiId: string;
            likesArray: string[];
        }) => aimerPubli(publiId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLI_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_UTIL_PRESENT],
            });
        },
    });
};

export const useSauvegarderPublication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ utilId, publiId }: { utilId: string; publiId: string }) =>
            sauvegarderPubli(utilId, publiId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_UTIL_PRESENT],
            });
        },
    });
};

export const useSupprimerPubliSauvegarde = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordId: string) => supprimerPubliSauvegarde(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PUBLIS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_UTIL_PRESENT],
            });
        },
    });
};


export const useGetUtilPresent = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_UTIL_PRESENT],
        queryFn: getCurrentUtil,
    });
};
export const useGetUtilById = (utilId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_UTIL_BY_ID, utilId],
    queryFn: () => getUtilById(utilId),
    enabled: !!utilId,
  });
};
export async function getUtils(limit?: number) {
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export const useUpdatePubli = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (publi: IActualiserPubli) => updatePubli(publi),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PUBLI_BY_ID, data?.$id],
        });
      },
    });
  };

  export const useGetPubliById = (publiId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_PUBLI_BY_ID, publiId],
      queryFn: () => getPubliById(publiId),
      enabled: !!publiId,
    });
  };

  export const useSupprimerPublication = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ publiId, imageId }: { publiId?: string; imageId: string }) =>
        supprimerPubli(publiId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PUBLIS_RECENTES],
        });
      },
    });
  };

 
  export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
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

  export const useSearchPublis = (searchTerm: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.SEARCH_PUBLIS, searchTerm],
      queryFn: () => searchPublis(searchTerm),
      enabled: !!searchTerm,
    });
  };

  export const useGetPublis = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_PUBLIS_INFINI],
    queryFn: getInfinitePosts,
    //@ts-ignore
    getNextPageParam: (lastPage) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      //@ts-ignore
      const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useGetUtilPublis = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
      queryFn: () => getUtilPublis(userId),
      enabled: !!userId,
    });
  };