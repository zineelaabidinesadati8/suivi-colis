export default function TopVilles({ parVille }) {
  const villes = Object.entries(parVille)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = villes.length > 0 ? villes[0][1] : 1;

  return (
    <div className="carte">
      <h3>Villes les plus livrées</h3>
      <ul className="villes">
        {villes.map(([ville, nb]) => (
          <li key={ville}>
            <div className="ville-ligne">
              <span>{ville}</span>
              <b>{nb}</b>
            </div>
            <div className="barre">
              <div className="barre-remplie" style={{ width: `${(nb / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}