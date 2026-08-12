import React from 'react';

export default function HomePage() {
  return (
    <main style={{ padding: '3rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#38bdf8', fontSize: '1.8rem', textTransform: 'uppercase' }}>
        Safran Helicopter Engines
      </h1>
      <h2 style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 'normal' }}>
        SignalTech — Gestion de Signalisation Temporaire
      </h2>
      <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
        Plateforme opérationnelle de suivi des stocks, réservations et retours de chantier.
      </p>
      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid #334155', borderRadius: '12px', backgroundColor: '#1e293b' }}>
        <p style={{ color: '#4ade80', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          ✓ Application en ligne
        </p>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
          Déploiement Vercel & connexion Supabase réussis.
        </p>
      </div>
    </main>
  );
}
