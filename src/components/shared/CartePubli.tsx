import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PubliStats } from "../shared/PubliStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUtilContext } from "@/context/AuthContext";

type CartePubliProps = {
    publication: Models.Document;
};

export default function CartePubli ({ publication }: CartePubliProps) {
  const { util } = useUtilContext();

  if (!publication.createur) return;

  return (
    <div className="post-card">
      <div className="entete-publi flex flex-between w-full flex justify-between items-center bg-white rounded-t-xl">
        <div className="flex items-center gap-3 w-4/6 justify-start">
          <Link to={`/profile/${publication.createur.$id}`}>
            <img
              src={
                publication.createur?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="createur"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-row">
            <p className="base-medium lg:body-bold text-light-1">
              {publication.createur.name}
            </p>
            <div className="flex flex-center gap-2 ">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(publication.$createdAt)}
              </p>
              <p className="subtle-semibold lg:small-regular">
                {publication.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/edit-publication/${publication.$id}`}
          className={`${util.id !== publication.createur.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={30}
            height={30}
          />
        </Link>
      </div>
      <Link to={`/publis/${publication.$id}`}>
        {/* <div className="small-medium lg:base-medium py-5">
          {/* <p className="w-fit ml-14">{publication.caption}</p> 
          <ul className="flex gap-1 mt-2">
            {publication.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                {tag}
              </li>
            ))}
          </ul>
        </div> */}

        <img
          src={publication.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PubliStats publication={publication} utilId={util.id} />
    </div>
  );
};
