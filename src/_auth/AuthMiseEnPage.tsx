import {Outlet, Navigate} from 'react-router-dom';

export default function AuthMiseEnPage() {
  const estAuth = false;// pour savoir si l'utilisateur est authentifié
  return (
    <>
    {estAuth ? (<Navigate to={"/"}/>): 
    (<>
      <section className='flex flex-1 justify-center items-center flex-col py-10'>
        <Outlet/>
      </section>
      <img src="/assets/images/connectionImg.jpg" alt="image page" className=' hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'/>
    </>
   
    )}
    </>
  )
}
