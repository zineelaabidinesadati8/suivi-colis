const CLASSES = {
  'En attente': 'statut-gris',
  'En transit': 'statut-bleu',
  'En livraison': 'statut-violet',
  'Livré': 'statut-vert',
  'Retourné': 'statut-rouge',
};

export default function StatutBadge({ statut }) {
  return <span className={`statut ${CLASSES[statut] || 'statut-gris'}`}>{statut}</span>;
}