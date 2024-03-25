import { getCurrentUtil } from '@/lib/appwrite/api';
import {  IUtil } from '@/types'
import {createContext,useContext,useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
export const INITIAL_USER = {
    id: '',
    name:'',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}
const INITIAL_STATE = {
    util: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUtil: () => {},
    setIsAuthenticated: () => {},
    checkAuthUtil: async () => false as boolean,
}
type IContextType = {
    util: IUtil;
    isLoading: boolean;
    setUtil: React.Dispatch<React.SetStateAction<IUtil>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUtil: () => Promise<boolean>;
  };
  

 const AuthContext = createContext<IContextType>(INITIAL_STATE);

 export function AuthProvider({children}:{children:React.ReactNode}) {
    const [util,setUtil] = useState<IUtil>(INITIAL_USER);
    const [isLoading,setIsLoading] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false);
const naviguer = useNavigate();
    const checkAuthUtil = async () => {
        setIsLoading(true)
        try{
            const currentAccount = await getCurrentUtil();
            if(currentAccount){
                setUtil({
                    id: currentAccount.$id,
                    name:currentAccount.name,
                    username:currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio:currentAccount.bio,

                });
                setIsAuthenticated(true);
                return true;
            }
            return false;
        }catch(erreur){
            console.log(erreur);
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        const cookieFallback = localStorage.getItem("cookieFallback");
        if(localStorage.getItem('cookieFallback') === '[]' || localStorage.getItem('cookieFallback') === null ||
        cookieFallback === undefined){
            naviguer('/ouvrirSession');
        }
        checkAuthUtil();
    },[]);
    const value = {
        util,
        setUtil,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUtil
    }
  return (
     <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
  )
}
export const useUtilContext = () => useContext(AuthContext);