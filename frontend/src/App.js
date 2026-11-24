import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';
import Dashboard from './pages/Dashboard';
import Colis from './pages/Colis';
import FormulaireColis from './components/FormulaireColis';
import DetailColis from './pages/DetailColis';
import Suivi from './pages/Suivi';
import Notifications from './pages/Notifications';
import Utilisateurs from './pages/Utilisateurs';
import NonTrouve from './pages/NonTrouve';

const utilisateur = { id: 1, nom: 'Admin Test', role: 'admin' };


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout utilisateur={utilisateur} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/colis" element={<Colis utilisateur={utilisateur} />} />
          <Route path="/colis/nouveau" element={<FormulaireColis />} />
          <Route path="/colis/:id" element={<DetailColis utilisateur={utilisateur} />} />
          <Route path="/colis/:id/modifier" element={<FormulaireColis />} />
          <Route path="/livraisons" element={<Colis utilisateur={utilisateur} />} />
          <Route path="/suivi" element={<Suivi />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/notifications" element={<Notifications utilisateur={utilisateur} />} />
          <Route path="*" element={<NonTrouve />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;