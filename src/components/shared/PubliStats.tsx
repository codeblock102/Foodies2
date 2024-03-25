import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";

import { useAimerPubli, useGetUtilPresent, useSauvegarderPublication, useSupprimerPubliSauvegarde } from "@/lib/react-query/requetesEtMutations";

type PostStatsProps = {
  publication: Models.Document;
  utilId: string;
};

export function PubliStats({ publication, utilId }: PostStatsProps){
  const location = useLocation();
  const likesList = publication.likes.map((util: Models.Document) => util.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: aimerPubli } = useAimerPubli();
  const { mutate: sauvegarderPubli } = useSauvegarderPublication();
  const { mutate: supprimerPubliSauvegarde } = useSupprimerPubliSauvegarde();

  const { data: utilPresent } = useGetUtilPresent();

  const savedPostRecord = utilPresent?.save?.find(
    (record: Models.Document) => record.publication.$id === utilPresent.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [utilPresent]);

  const handleLikePubli = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(utilId)) {
      likesArray = likesArray.filter((Id) => Id !== utilId);
    } else {
      likesArray.push(utilId);
    }

    setLikes(likesArray);
    aimerPubli({ publiId: publication.$id, likesArray });
  };

  const handleSavePubli = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return supprimerPubliSauvegarde(savedPostRecord.$id);
    }

    sauvegarderPubli({ utilId: utilId, publiId: publication.$id });
    setIsSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, utilId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePubli(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePubli(e)}
        />
      </div>
    </div>
  );
};

