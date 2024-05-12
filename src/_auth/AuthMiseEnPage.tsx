import {Outlet, Navigate} from 'react-router-dom';

export default function AuthMiseEnPage() {
  const estAuth = false;// pour savoir si l'utilisateur est authentifié
  return (
    <>
    {estAuth ? (<Navigate to={"/"}/>): 
    (<>
    <div className="PageAuth w-full h-auto  z-0">
      <div className="relative top-36 mt-12 z-20 text-white"><Outlet/></div>
      <section className='overlay-noir bg-black flex flex-1 justify-center items-center flex-col   relative z-10 opacity-50'>
       
      </section>
      
      </div>
    </>
   
    )}
    </>
  )
}
