import Dashboard from './pages/Dashboard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

const utilisateur = { nom: 'Admin Test', role: 'admin' };

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
          <Route path="/colis" element={<Page titre="Colis" />} />
          <Route path="/livraisons" element={<Page titre="Mes livraisons" />} />
          <Route path="/suivi" element={<Page titre="Suivi" />} />
          <Route path="/utilisateurs" element={<Page titre="Utilisateurs" />} />
          <Route path="/notifications" element={<Page titre="Notifications" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;