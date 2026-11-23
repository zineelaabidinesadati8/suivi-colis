export default function Timeline({ etapes }) {
  return (
    <ol className="timeline">
      {[...etapes].reverse().map(e => (
        <li key={e.id}>
          <span className="timeline-point" />
          <strong>{e.libelle}</strong>
          {e.commentaire && <p>{e.commentaire}</p>}
          <small>{new Date(e.created_at).toLocaleString('fr-FR')}</small>
        </li>
      ))}
    </ol>
  );
}