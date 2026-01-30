import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AlertProvider } from '@/context/alertContext';
import AlertComponent from '@/components/ui/alertComponent';
import Layout from '@/components/ui/layout';
import PrincipalComponent from '@/components/principal/principal';
import ContactComponent from '@/components/contact/contactComponent';
/* import QuienesSomos from '@/pages/quienesSomos';
import Historia from '@/pages/historia';
import Comision from '@/pages/comision';
import Comunidad from '@/pages/comunidad';
import Institucional from '@/pages/institucional';
import ProximosEventos from '@/pages/proximosEventos';
import Clasificados from '@/pages/clasificados';
import Fotos from '@/pages/fotos';
import NuestrosVehiculos from '@/pages/nuestrosVehiculos';
import MotoresEstacionarios from '@/pages/motoresEstacionarios';
import Contacto from '@/pages/contacto'; */
import '@/style.css';

export default function App() {

  return (
    <>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<PrincipalComponent />} />
              <Route path='/contacto' element={<ContactComponent />} />
              {/* <Route path='/nosotros/quienessomos' element={<QuienesSomos />} />
              <Route path='/nosotros/historia' element={<Historia />} />
              <Route path='/nosotros/comisiondirectiva' element={<Comision />} />
              <Route path='/nosotros/mensajesdelacomunidad' element={<Comunidad />} />
              <Route path='/novedades/institucional' element={<Institucional />} />
              <Route path='/novedades/proximoseventos' element={<ProximosEventos />} />
              <Route path='/galeria/clasificados' element={<Clasificados />} />
              <Route path='/galeria/fotos' element={<Fotos />} />
              <Route path='/galeria/nuestrosvehiculos' element={<NuestrosVehiculos />} />
              <Route path='/galeria/motoresestacionarios' element={<MotoresEstacionarios />} />
              <Route path='/contacto' element={<Contacto />} /> */}
              
            </Route>
          </Routes>
        </BrowserRouter>
        <AlertComponent />
      </AlertProvider>
    </>
  )
}
