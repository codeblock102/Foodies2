import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constantes";
export default function BarreBas() {
  const { pathname } = useLocation();

  return (
    <section className="BarreBas flex justify-evenly items-center lg:hidden sticky bottom-14 bg-white w-10/12 h-14 mx-auto rounded-full border-solid border-2 border-sky-500v">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            }   gap-1  transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={30}
              height={20}
              className={`${isActive && "invert-white"}`}
            />
      
           
          </Link>
        );
      })}
    </section>
  );
}
