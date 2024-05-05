import SideBarGauche from '@/components/shared/SideBarGauche'
import Topbar from '@/components/shared/Topbar'
import BarreBas from '@/components/shared/BarreBas'
import { Outlet } from "react-router-dom";
import '../globals.css'
export default function RootMiseEnPage() {
  
  return ( <div className="w-full md:flex">
    {/* <SideBarGauche /> */}
  
    <Topbar />

  <section className="mise-en-page flex  w-screen h-screen">
    <Outlet />
  </section>
  
  <BarreBas />
</div>
  )
}
