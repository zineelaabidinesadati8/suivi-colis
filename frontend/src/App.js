import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';
import Dashboard from './pages/Dashboard';
import Colis from './pages/Colis';
import FormulaireColis from './components/FormulaireColis';
import DetailColis from './pages/DetailColis';

const utilisateur = { id: 1, nom: 'Admin Test', role: 'admin' };

function Page({ titre }) {
  return (
    <div className="carte">
      <h2>{titre}</h2>
      <p>Page en construction</p>
    </div>
  );
}

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
          <Route path="/suivi" element={<Page titre="Suivi" />} />
          <Route path="/utilisateurs" element={<Page titre="Utilisateurs" />} />
          <Route path="/notifications" element={<Page titre="Notifications" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;