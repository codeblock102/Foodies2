import {Route,Routes, useParams, Link, useNavigate,redirect, useLocation, Outlet } from "react-router-dom";

import { Button } from "../../components/ui/button";
import Loader  from "../../components/shared/Loader";
import GridPostList from "../../components/shared/GridPostList";
import { multiFormatDateString } from "@/lib/utils";
import { useGetPublis, useGetUtilById, useSearchPublis } from "@/lib/react-query/requetesEtMutations";

import { useUtilContext } from "@/context/AuthContext";
import { useGetPubliById, useGetUtilPublis, useSupprimerPublication } from "@/lib/react-query/requetesEtMutations";
import { PubliStats } from "@/components/shared/PubliStats";
import { useEffect } from "react";


export default function Profile() {
  const naviguer= useNavigate();
  const { id } = useParams();
  const { util } = useUtilContext();
  const { data: publi, isLoading } = useGetPubliById(id);
  const { data: currentUtil } = useGetUtilById(id || "");
  const { pathname } = useLocation();

  const { data: utilPublis, isLoading: isUserPostLoading } = useGetUtilPublis(
    publi?.createur.$id
  );
 
  if (!currentUtil)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  
  const relatedPosts = utilPublis?.documents.filter(
    (utilPubli) => utilPubli.$id !== id
  );
  return (
    <div className="Profile bg-white w-full">
      {/* Header: User Info */}
      <div className="Info-Util bg-gray-100 p-4 flex justify-between items-center h-1/5 flex-col ">
        <div className="util-section flex items-center flex-col pt-20 text-center">
        <img
              src={
                currentUtil.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              width={120}
              height={50}
              alt="createur"
              className=" rounded-full"
            />
          <div className="info-follow ml-1">
            <h2 className="font-bold text-sm mt-3">{currentUtil.username}</h2>
            <p className="text-xs text-gray-600">{currentUtil.bio}</p>
          </div>
        </div>
        <div className="text-xs text-gray-600 w-full flex justify-between relative bottom-14">
          <span>200 following</span> · <span>177k followers</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-28 mb-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
          Follow
        </button>
      </div>

      {/* Posts Grid */}
      
      <Routes>
        <Route
          index
          element={<GridPostList publis={currentUtil.publications}  />}
        />
        {/* {currentUtil.$id === util.id && (
         // <Route path="/liked-posts" element={<LikedPosts />} />
        )} */}
      </Routes>
      <Outlet />
    </div>
  )
}
