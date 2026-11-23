import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COULEURS = {
  'En attente': '#94a3b8',
  'En transit': '#3b82f6',
  'En livraison': '#8b5cf6',
  'Livré': '#22c55e',
  'Retourné': '#ef4444',
};

export default function DonutStatuts({ parStatut, total }) {
  const donnees = Object.entries(parStatut)
    .map(([nom, valeur]) => ({ nom, valeur }))
    .filter(d => d.valeur > 0);

  return (
    <div className="carte">
      <h3>Répartition des colis</h3>
      <div className="donut-zone">
        <div className="donut-graphique">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donnees} dataKey="valeur" nameKey="nom" innerRadius={60} outerRadius={85} paddingAngle={2}>
                {donnees.map(d => (
                  <Cell key={d.nom} fill={COULEURS[d.nom]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-centre">
            <strong>{total}</strong>
            <span>Total</span>
          </div>
        </div>

        <ul className="legende">
          {Object.entries(parStatut).map(([nom, valeur]) => (
            <li key={nom}>
              <span className="point" style={{ background: COULEURS[nom] }} />
              {nom}
              <b>{valeur}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}