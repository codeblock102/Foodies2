import { useParams, Link, useNavigate} from "react-router-dom";

import { Button } from "../../components/ui/button";
import Loader  from "../../components/shared/Loader";
import GridPostList from "../../components/shared/GridPostList";
import { multiFormatDateString } from "@/lib/utils";
import { useUtilContext } from "@/context/AuthContext";
import { useGetPubliById, useGetUtilPublis, useSupprimerPublication } from "@/lib/react-query/requetesEtMutations";
import { PubliStats } from "@/components/shared/PubliStats";

export default function DetailsPubli(){
  const navigate = useNavigate();
  const { id } = useParams();
  const { util } = useUtilContext();

  const { data: publi, isLoading } = useGetPubliById(id);
  const { data: utilPublis, isLoading: isUserPostLoading } = useGetUtilPublis(
    publi?.createur.$id
  );
  const { mutate: supprimerPubli } = useSupprimerPublication();

  const relatedPosts = utilPublis?.documents.filter(
    (utilPubli) => utilPubli.$id !== id
  );

  const gererSuprimerPubli = () => {
    supprimerPubli({ publiId: id, imageId: publi?.imageId });
    navigate(-1);
  };

  return (
    
    <div className="post_details-container">
      <div className="entete-publi flex flex-between w-full flex justify-between items-center bg-white rounded-t-xl h-14 px-4">
        <div className="flex items-center gap-3 w-5/6 justify-start">
          <Link to={`/profile/${publi?.createur.$id}`}>
            <img
              src={
                publi?.createur.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="createur"
              className="w-8 lg:h-8 rounded-full"
            />
          </Link>

          <div className="flex flex-row">
            <p className="base-medium lg:body-bold text-light-1">
              {publi?.createur.name}
            </p>
            <div className="flex flex-center gap-2 ">
              <p className="subtle-semibold lg:small-regular ml-10 ">
                {multiFormatDateString(publi?.$createdAt)}
              </p>
              {/* <p className="subtle-semibold lg:small-regular">
                {publication.location}
              </p> */}
            </div>
          </div>
        </div>

        <Link
          to={`/edit-publication/${publi?.$id}`}
          className={`${util.id !== publi?.createur.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={30}
            height={30}
          />
        </Link>
        <Button
                  onClick={gererSuprimerPubli}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    util.id !== publi?.createur.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={30}
                    height={30}
                  />
                </Button>
      </div>
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !publi ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={publi?.imageUrl}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              
            </div>

            <hr className="border w-full border-dark-4/80" />

            {/* <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{publi?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {publi?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div> */}
            
            <div className="w-full">
              <PubliStats publication={publi} utilId={util.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Plus de publications
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList publis={relatedPosts} />
        )}
      </div>
    </div>
  );
};

