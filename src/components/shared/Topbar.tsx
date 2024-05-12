import { useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import '../../fonts.css'
import { useFermeressionMutation } from '@/lib/react-query/requetesEtMutations'

export default function Topbar() {
    const {mutate: fermerSession, isSuccess} = useFermeressionMutation();
    const navigate  = useNavigate();
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
            <img
            src={ "/assets/icons/cog-solid.svg"}
            alt="share"
            width={30}
            height={30}
            className="cursor-pointer"
            // onClick={(e) => handleSavePubli(e)}
            />
                {/* <Button variant='ghost' className='shad-button_ghost' onClick={()=>fermerSession()}>
                    <img src="/assets/images/fermerSession.svg" alt="" />
                </Button> */}
                {/* <Link to={`/profile/${util.id}`} className='flex-center gap-3'>
                    <img src={util.imageUrl} alt="" className='h-8 w-8 rounded-full'/>
                </Link> */}
            </div>
        </div>
        
   
  )
}
