import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* Barre de navigation supérieure */}
      <header style={{ borderBottom: '1px solid #1e293b', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#0284c7', width: '12px', height: '24px', borderRadius: '3px' }}></div>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.05em' }}>SAFRAN HELICOPTER ENGINES</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#38bdf8', border: '1px solid #0369a1', padding: '0.25rem 0.75rem', borderRadius: '6px' }}>
          SignalTech v1.0
        </span>
      </header>

      {/* Contenu principal */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Gestion & Réservation de Signalisation Temporaire
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Plateforme de suivi des stocks, localisation du matériel et traçabilité des chantiers.
          </p>
        </div>

        {/* Grille de raccourcis cliquables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Carte 1 : Dashboard */}
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Tableau de Bord</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                Consulter les niveaux de stock en temps réel, les alertes de seuil bas et les retards de restitution.
              </p>
            </div>
          </Link>

          {/* Carte 2 : Catalogue des Panneaux */}
          <Link href="/catalog" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚧</div>
              <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Catalogue Panneaux</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                Visualiser le stock avec les visuels des panneaux, réserver du matériel et spécifier la zone du chantier.
              </p>
            </div>
          </Link>

          {/* Carte 3 : Scan QR Code (Terrain) */}
          <Link href="/scan" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #0284c7', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📱</div>
              <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Scanner QR Code</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0 }}>
                Interface mobile pour enregistrer instantanément les sorties et les retours de matériel au magasin.
              </p>
            </div>
          </Link>

        </div>

        {/* Section Statut du système */}
        <div style={{ marginTop: '3rem', padding: '1.25rem', border: '1px solid #164e63', borderRadius: '10px', backgroundColor: '#083344', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#22d3ee', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>
              ● Système connecté à Supabase
            </span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Base de données opérationnelle — Site industriel Safran Helicopter Engines
            </span>
          </div>
          <Link href="/scan" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Faire un scan
          </Link>
        </div>
      </main>
    </div>
  );
}
