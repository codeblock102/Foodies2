import { useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import '../../fonts.css'
import { useFermeressionMutation } from '@/lib/react-query/requetesEtMutations'
import { useUtilContext, INITIAL_USER } from '@/context/AuthContext';
import { Button } from '../ui/button';

export default function Topbar() {
    const {mutate: fermerSession, isSuccess} = useFermeressionMutation();
    const { setUtil, setIsAuthenticated } = useUtilContext();
    const navigate  = useNavigate();

    const gererFermerSession = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();
        fermerSession();
        setIsAuthenticated(false);
        setUtil(INITIAL_USER);
        navigate("/ouvrirSession"); 
      };
    useEffect(()=>{
        if(isSuccess) {
            navigate(0);
        }
    },[isSuccess])
  return (
   
        <div className="Topbar flex flex-between py-4 px-5 justify-between  w-full h-14 lg:hidden">
            <Link to='/' className='flex gap-3 items-center '>
            <h1 className='logo'>Foodies</h1>
            </Link>
            <div className="flex gap-4 h-fit mb-16">
            {/* <img
            src={ "/assets/icons/cog-solid.svg"}
            alt="share"
            width={30}
            height={30}
            className="cursor-pointer"
            // onClick={(e) => handleSavePubli(e)}
            /> */}
        <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => gererFermerSession(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
            </div>
        </div>
        
   
  )
}
