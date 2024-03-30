import { Models } from "appwrite";

import  Loader  from "../../components/shared/Loader";
import { useGetUtils } from "../../lib/react-query/requetesEtMutations";
import { useGetPublisRecentes } from "@/lib/react-query/requetesEtMutations";
import CartePubli from "@/components/shared/CartePubli";

export default  function Accueil(){

const {
  data: publications,
  isLoading: isPubliLoading,
  isError: isErrorPosts,
} = useGetPublisRecentes();
const {
  data: creators,
  isLoading: isUserLoading,
  isError: isErrorCreators,
} = useGetUtils(10);

if (isErrorPosts || isErrorCreators) {
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <p className="body-medium text-light-1">Something bad happened</p>
      </div>
      <div className="home-creators">
        <p className="body-medium text-light-1">Something bad happened</p>
      </div>
    </div>
  );
}

return (
  <div className="flex flex-1">
    <div className="publications-accueil">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
        {isPubliLoading && !publications ? (
          <Loader />
        ) : (
          <ul className="flex flex-col flex-1 gap-9 w-full items-center">
            {publications?.documents.map((publication: Models.Document) => (
              <li key={publication.$id} className=" publication flex justify-center w-2/4">
                <CartePubli publication={publication} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    <div className="createurs-tendance">
      <h3 className="h3-bold text-light-1 text-center">Top Creators</h3>
      {isUserLoading && !creators ? (
        <Loader />
      ) : (
        <ul className="grid 2xl:grid-cols-2 gap-6">
          {creators?.documents.map((createur) => (
            <li key={createur?.$id}>
             
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
}


