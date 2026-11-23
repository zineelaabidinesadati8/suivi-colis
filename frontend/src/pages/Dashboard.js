import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, RotateCcw } from 'lucide-react';
import ColisService from '../services/ColisService';
import StatCard from '../components/dashboard/StatCard';
import RecentColis from '../components/dashboard/RecentColis';
import DonutStatuts from '../components/dashboard/DonutStatuts';
import TopVilles from '../components/dashboard/TopVilles';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    const charger = async () => {
      setStats(await ColisService.getStatistiques());
      const tous = await ColisService.getTousColis();
      setRecents(tous.slice(-4).reverse());
    };
    charger();
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <>
      <div className="stats-grille">
        <StatCard titre="Total colis" valeur={stats.total} icone={Package} couleur="bleu" />
        <StatCard titre="En transit" valeur={stats.parStatut['En transit']} icone={Truck} couleur="violet" />
        <StatCard titre="Livrés" valeur={stats.parStatut['Livré']} icone={CheckCircle} couleur="vert" />
        <StatCard titre="Retournés" valeur={stats.parStatut['Retourné']} icone={RotateCcw} couleur="rose" />
      </div>

      <div className="dashboard-grille">
        <DonutStatuts parStatut={stats.parStatut} total={stats.total} />
        <TopVilles parVille={stats.parVille} />
      </div>

      <RecentColis colis={recents} />
    </>
  );
}