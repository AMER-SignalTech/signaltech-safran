'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, 
  Layers, 
  QrCode, 
  ShieldAlert, 
  Package, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Camera, 
  Check, 
  AlertCircle,
  X
} from 'lucide-react';

// Client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Données initiales
const INITIAL_EQUIPMENTS = [
  { id: '1', ref: 'PAN-AK05-01', name: 'AK5 — Travaux', category: 'Danger', total: 25, available: 11, min: 5, shape: 'triangle', icon: '🚧' },
  { id: '2', ref: 'PAN-AK03-01', name: 'AK3 — Chaussée Rétrécie', category: 'Danger', total: 12, available: 4, min: 3, shape: 'triangle', icon: '🛣️' },
  { id: '3', ref: 'PAN-B001-01', name: 'B1 — Sens Interdit', category: 'Interdiction', total: 10, available: 2, min: 3, shape: 'circle', icon: '⛔' },
  { id: '4', ref: 'PAN-B14-01', name: 'B14 — Limite 20 km/h', category: 'Interdiction', total: 15, available: 12, min: 4, shape: 'circle', icon: '20' },
  { id: '5', ref: 'PAN-KC01-01', name: 'KC1 — Déviation', category: 'Indication', total: 18, available: 10, min: 5, shape: 'square', icon: '↗️' },
  { id: '6', ref: 'PAN-AK17-01', name: 'AK17 — Feux Alternés', category: 'Danger', total: 6, available: 1, min: 2, shape: 'triangle', icon: '🚦' },
];

const INITIAL_DELAYS = [
  { id: 'r1', company: 'Eiffage Route', resp: 'M. Dupont', building: 'Bât. 12', zone: 'Accès Nord', expectedEnd: '2026-08-10', items: '3x AK5' },
  { id: 'r2', company: 'SATELEC', resp: 'J. Martin', building: 'Bât. 04', zone: 'Parking Hangar 2', expectedEnd: '2026-08-11', items: '2x B1, 4x K8' },
];

export default function SignalTechApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'scan'>('dashboard');
  const [equipments, setEquipments] = useState(INITIAL_EQUIPMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  
  // Formulaire Réservation
  const [resForm, setResForm] = useState({
    company: '',
    resp: '',
    building: 'Bâtiment 04',
    zone: '',
    qty: 1
  });
  const [resStatus, setResStatus] = useState<string | null>(null);

  // Scan QR Code
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    async function fetchStock() {
      if (!supabase) return;
      const { data } = await supabase.from('vw_equipment_availability').select('*');
      if (data && data.length > 0) {
        // Synchronisation base si disponible
      }
    }
    fetchStock();
  }, []);

  const handleOpenReservation = (item: any) => {
    setSelectedEquipment(item);
    setResForm(prev => ({ ...prev, qty: 1 }));
    setReservationModalOpen(true);
    setResStatus(null);
  };

  const handleSubmitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (resForm.qty > selectedEquipment.available) {
      setResStatus('Erreur : Quantité demandée supérieure au stock disponible.');
      return;
    }

    setEquipments(prev => prev.map(eq => {
      if (eq.id === selectedEquipment.id) {
        return { ...eq, available: eq.available - resForm.qty };
      }
      return eq;
    }));

    setResStatus('Réservation transmise avec succès ! Bon de sortie généré.');
    setTimeout(() => {
      setReservationModalOpen(false);
      setResStatus(null);
    }, 1500);
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = equipments.find(e => e.ref.toLowerCase() === scanInput.trim().toLowerCase());
    if (!item) {
      setScanResult({ type: 'error', msg: `Panneau non trouvé (${scanInput})` });
    } else {
      setScanResult({ type: 'success', msg: `Scan validé : ${item.name} — Magasin Bât. 04 (Rack A1)` });
      setScanInput('');
    }
  };

  const filteredEquipments = equipments.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HEADER SAFRAN */}
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0b0f19', padding: '0.8rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#0284c7', width: '8px', height: '28px', borderRadius: '2px' }}></div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em', color: '#ffffff', margin: 0 }}>SAFRAN HELICOPTER ENGINES</h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>SignalTech — Gestion de Signalisation Temporaire</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'dashboard' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'catalog' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <Layers size={16} /> Catalogue & Stock
          </button>
          <button 
            onClick={() => setActiveTab('scan')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'scan' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <QrCode size={16} /> Scan Terrain
          </button>
        </nav>
      </header>

      {/* CONTENU */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  ALERTES STOCK BAS <ShieldAlert size={20} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.5rem' }}>
                  {equipments.filter(e => e.available <= e.min).length}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  CHANTIERS ACTIFS <Package size={20} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.5rem' }}>14</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  RETARDS RESTITUTION <Clock size={20} color="#f43f5e" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight 800, color: '#f43f5e', marginTop: '0.5rem' }}>{INITIAL_DELAYS.length}</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  DISPONIBILITÉ GLOBALE <CheckCircle2 size={20} color="#34d399" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight 800, color: '#34d399', marginTop: '0.5rem' }}>82%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#f59e0b', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={18} /> Matériel sous le Seuil de Sécurité
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {equipments.filter(e => e.available <= e.min).map(item => (
                    <div key={item.id} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #451a03', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Réf: {item.ref}</div>
                      </div>
                      <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                        Dispo: {item.available} / {item.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#f43f5e', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} /> Chantiers HORS DÉLAI (Relance Auto)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {INITIAL_DELAYS.map(delay => (
                    <div key={delay.id} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #881337', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fecdd3' }}>{delay.company} ({delay.resp})</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{delay.building} — {delay.zone}</div>
                      </div>
                      <button style={{ backgroundColor: '#e11d48', color: '#ffffff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        Relancer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATALOGUE */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="Rechercher un panneau (ex: AK5, B1)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.75rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {filteredEquipments.map(item => (
                <div key={item.id} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '70px', 
                      height: '70px', 
                      borderRadius: item.shape === 'circle' ? '50%' : '8px',
                      backgroundColor: item.shape === 'triangle' ? '#fef08a' : item.shape === 'circle' ? '#ffffff' : '#0284c7',
                      border: item.shape === 'triangle' ? '3px solid #dc2626' : item.shape === 'circle' ? '5px solid #dc2626' : '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>

                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>{item.category}</span>
                      <h4 style={{ margin: '0.1rem 0', fontSize: '1rem', fontWeight: 700 }}>{item.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{item.ref}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #334155', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Stock Disponible</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.available > item.min ? '#34d399' : '#fbbf24' }}>
                        {item.available} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>/ {item.total}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenReservation(item)}
                      disabled={item.available === 0}
                      style={{ 
                        backgroundColor: item.available > 0 ? '#0284c7' : '#334155', 
                        color: '#ffffff', 
                        border: 'none', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '6px', 
                        fontWeight: 600, 
                        fontSize: '0.85rem', 
                        cursor: item.available > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Plus size={16} /> Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCANNER */}
        {activeTab === 'scan' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Scan QR Code Terrain</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Scannez l'étiquette au dos du panneau</p>
            </div>

            <div style={{ aspectRatio: '1/1', backgroundColor: '#1e293b', border: '2px dashed #0284c7', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Camera size={48} color="#38bdf8" />
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.5rem', fontWeight: 600 }}>Caméra Active</span>
            </div>

            <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Réf: PAN-AK05-01"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace' }}
              />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Valider
              </button>
            </form>

            {scanResult && (
              <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: scanResult.type === 'success' ? '#064e3b' : '#881337', border: `1px solid ${scanResult.type === 'success' ? '#10b981' : '#f43f5e'}`, color: '#ffffff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {scanResult.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                {scanResult.msg}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODALE */}
      {reservationModalOpen && selectedEquipment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Réservation — {selectedEquipment.name}</h3>
              <button onClick={() => setReservationModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmitReservation} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Entreprise Prestataire</label>
                <input required type="text" placeholder="ex: SATELEC / Eiffage" value={resForm.company} onChange={e => setResForm({...resForm, company: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Responsable Chantier</label>
                <input required type="text" placeholder="Nom Prénom" value={resForm.resp} onChange={e => setResForm({...resForm, resp: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Bâtiment</label>
                  <select value={resForm.building} onChange={e => setResForm({...resForm, building: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem' }}>
                    <option>Bâtiment 04</option>
                    <option>Bâtiment 12</option>
                    <option>Hangar Essais</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Quantité (Max: {selectedEquipment.available})</label>
                  <input type="number" min="1" max={selectedEquipment.available} value={resForm.qty} onChange={e => setResForm({...resForm, qty: parseInt(e.target.value) || 1})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem' }} />
                </div>
              </div>

              {resStatus && (
                <div style={{ fontSize: '0.8rem', color: resStatus.includes('Erreur') ? '#f43f5e' : '#34d399', fontWeight: 600 }}>
                  {resStatus}
                </div>
              )}

              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Confirmer la Réservation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
