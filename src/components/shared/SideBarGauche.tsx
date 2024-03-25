import '../../fonts.css'
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constantes";

import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { INITIAL_USER, useUtilContext } from "@/context/AuthContext";
import { useFermeressionMutation } from "@/lib/react-query/requetesEtMutations";
import Loader from './Loader';
export default function SideBarGauche() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { util, setUtil, setIsAuthenticated, isLoading } = useUtilContext();
    const { mutate: fermerSession } = useFermeressionMutation();

    const gererFermerSession = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();
        fermerSession();
        setIsAuthenticated(false);
        setUtil(INITIAL_USER);
        navigate("/ouvrirSession"); 
      };
  return (
    <nav className="SideBarGauche">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <h1 className="logo">Foodies</h1>
        </Link>

        {isLoading || !util.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${util.id}`} className="flex gap-3 items-center">
            <img
              src={util.imageUrl}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{util.name}</p>
              <p className="small-regular text-light-3">@{util.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => gererFermerSession(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
  
}
