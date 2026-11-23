export default function StatCard({ titre, valeur, icone: Icone, couleur }) {
  return (
    <div className="carte stat-card">
      <div className={`stat-icone ${couleur}`}>
        <Icone size={24} />
      </div>
      <div>
        <div className="stat-titre">{titre}</div>
        <div className="stat-valeur">{valeur}</div>
      </div>
    </div>
  );
}