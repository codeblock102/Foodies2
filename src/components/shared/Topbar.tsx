import React, { useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import '../../fonts.css'
import { Button } from '../ui/button'
import { useFermeressionMutation } from '@/lib/react-query/requetesEtMutations'
import { useUtilContext } from '@/context/AuthContext'

export default function Topbar() {
    const {mutate: fermerSession, isSuccess} = useFermeressionMutation();
    const navigate  = useNavigate();
    const {util} = useUtilContext();
    useEffect(()=>{
        if(isSuccess) {
            navigate(0);
        }
    },[isSuccess])
  return (
    <section className='topbar w-full h-10 lg:hidden'>
        <div className="flex flex-between py-4 px-5 justify-between">
            <Link to='/' className='flex gap-3 items-center'>
            <h1 className='logo'>Foodies</h1>
            </Link>
            <div className="flex gap-4">
                <Button variant='ghost' className='shad-button_ghost' onClick={()=>fermerSession()}>
                    <img src="/assets/images/fermerSession.svg" alt="" />
                </Button>
                <Link to={`/profile/${util.id}`} className='flex-center gap-3'>
                    <img src={util.imageUrl} alt="" className='h-8 w-8 rounded-full'/>
                </Link>
            </div>
        </div>
        
    </section>
  )
}
