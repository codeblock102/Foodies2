import OuvrirSession from "./_auth/formulaires/OuvrirSession";
import Inscription from "./_auth/formulaires/Inscription";
import { Toaster } from "@/components/ui/toaster"
import { Accueil, CreerPublication, DetailsPubli, EditPublication, Explorer, Profile, Sauvegardes, ToutUtils, UpdateProfile } from "./_root/pages";
import "./globals.css";
import { Routes, Route } from "react-router-dom";
import AuthMiseEnPage from "./_auth/AuthMiseEnPage";
import RootMiseEnPage from "./_root/RootMiseEnPage";


export default function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/** Routes publiques */}
        <Route element={<AuthMiseEnPage />}>
          <Route path="/ouvrirSession" element={<OuvrirSession />} />
          <Route path="/inscription" element={<Inscription />} />
        </Route>
        {/** Routes privées */}
        <Route element = {<RootMiseEnPage/>}>
          <Route path="/" element={<Accueil />} />
          <Route path="/explorer" element={<Explorer/>} />
          <Route path="/sauvegardes" element={<Sauvegardes />} />
          <Route path="/tout-utils" element={<ToutUtils />} />
          <Route path="/creer-publication" element={<CreerPublication />} />
          <Route path="/edit-publication/:id" element={<EditPublication />} />
          <Route path="/publis/:id" element={<DetailsPubli />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster/>
    </main>
  );
}
