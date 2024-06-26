
import { useParams } from "react-router-dom";

import Loader from "../../components/shared/Loader";
import PostForm from "../../components/formulaires/PostForm";
import { useGetPubliById } from '@/lib/react-query/requetesEtMutations';

export default function EditPubli(){
  const { id } = useParams();
  const { data: publi, isLoading } = useGetPubliById(id);

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="EditPubli w-4/5">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Modifieer Publi</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action="Update" publi={publi} />}
      </div>
    </div>
  );
};

