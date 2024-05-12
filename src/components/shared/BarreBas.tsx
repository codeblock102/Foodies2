import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constantes";
import { util } from "zod";
import { useUtilContext } from "@/context/AuthContext";
export default function BarreBas() {
  const { pathname } = useLocation();
  const { util } = useUtilContext();

  return (
    <section className="BarreBas flex justify-evenly items-center lg:hidden fixed bottom-14 bg-white w-10/12 h-14 ml-8 rounded-full border-solid border-2 border-sky-500v">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.label == 'Profile'?`/profile/${util.id}`:link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            }   gap-1  transition`}>
            {link.label === "Creer Publi"?<div className='bg-orange-500 hover:bg-orange-600 py-2 px-4  inline-flex items-center rounded-full'>
            <img src={link.imgURL} alt="" width={45}
              height={40} />
     
    </div>:<img
              src={link.imgURL}
              alt={link.label}
              width={30}
              height={20}
              className={`${isActive && "invert-white"}`}
            />
            }
            
      
           
          </Link>
        );
      })}
    </section>
  );
}
