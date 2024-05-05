import { useParams, Link, useNavigate } from "react-router-dom";

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
              <Link
                to={`/profile/${publi?.createur.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    publi?.createur.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {publi?.createur.name}
                  </p>
                  {/* <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(publi?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {publi?.location}
                    </p>
                  </div> */}
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/edit-publication/${publi?.$id}`}
                  className={`${util.id !== publi?.createur.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
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
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
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
            </div>

            <div className="w-full">
              <PubliStats publication={publi} utilId={util.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
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

