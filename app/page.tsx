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
  RefreshCw
} from 'lucide-react';

// Client Supabase connecté à vos variables d'environnement Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function SignalTechApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'scan'>('catalog');
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  // Charger le stock réel depuis Supabase au chargement de la page
  const fetchStockFromSupabase = async () => {
    setLoading(true);
    if (supabase) {
      const { data, error } = await supabase.from('equipments').select('*').order('reference', { ascending: true });
      if (data && !error) {
        setEquipments(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStockFromSupabase();
  }, []);

  // Effectuer une réservation réelle dans Supabase
  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resForm.qty > selectedEquipment.available_quantity) {
      setResStatus('Erreur : Quantité demandée supérieure au stock disponible.');
      return;
    }

    const newAvailable = selectedEquipment.available_quantity - resForm.qty;

    if (supabase) {
      // Mettre à jour la base de données Supabase
      const { error } = await supabase
        .from('equipments')
        .update({ available_quantity: newAvailable })
        .eq('id', selectedEquipment.id);

      if (error) {
        setResStatus(`Erreur de synchronisation : ${error.message}`);
        return;
      }
    }

    setResStatus('Réservation validée ! Le stock Supabase a été mis à jour.');
    await fetchStockFromSupabase(); // Rafraîchir le stock
    
    setTimeout(() => {
      setReservationModalOpen(false);
      setResStatus(null);
    }, 1200);
  };

  // Traiter un scan QR Code réel
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = equipments.find(e => e.reference.toLowerCase() === scanInput.trim().toLowerCase());
    if (!item) {
      setScanResult({ type: 'error', msg: `Panneau non identifié dans Supabase (${scanInput})` });
    } else {
      setScanResult({ 
        type: 'success', 
        msg: `Scan validé : ${item.name} | Emplacement : ${item.location} | Stock dispo : ${item.available_quantity}/${item.total_quantity}` 
      });
      setScanInput('');
    }
  };

  const filteredEquipments = equipments.filter(e => 
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.reference?.toLowerCase().includes(searchTerm.toLowerCase())
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

        {/* NAVIGATION TABS */}
        <nav style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.25rem', borderRadius: '8px' }}>
          <button 
            onClick={() => setActiveTab('catalog')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'catalog' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <Layers size={16} /> Catalogue & Stock Realtime
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'dashboard' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={16} /> Dashboard KPI
          </button>
          <button 
            onClick={() => setActiveTab('scan')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'scan' ? '#0284c7' : 'transparent', color: '#ffffff', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <QrCode size={16} /> Scan Terrain
          </button>
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* BOUTON RAFRAICHIR BASE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Connecté à la base Supabase PostgreSQL
          </span>
          <button onClick={fetchStockFromSupabase} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualiser les stocks
          </button>
        </div>

        {/* VUE CATALOGUE & STOCK REEL */}
        {activeTab === 'catalog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Rechercher un panneau par nom ou référence (ex: AK5, B1, K8)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem 1rem 0.75rem 2.75rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Chargement du stock Supabase...</div>
            ) : (
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
                        {item.icon_symbol}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>{item.category}</span>
                        <h4 style={{ margin: '0.1rem 0', fontSize: '1rem', fontWeight: 700 }}>{item.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{item.reference}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
                      📍 {item.location}
                    </div>

                    <div style={{ borderTop: '1px solid #334155', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Stock Dispo</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: item.available_quantity > item.min_threshold ? '#34d399' : '#fbbf24' }}>
                          {item.available_quantity} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>/ {item.total_quantity}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => { setSelectedEquipment(item); setReservationModalOpen(true); }}
                        disabled={item.available_quantity === 0}
                        style={{ 
                          backgroundColor: item.available_quantity > 0 ? '#0284c7' : '#334155', 
                          color: '#ffffff', 
                          border: 'none', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          fontWeight: 600, 
                          fontSize: '0.85rem', 
                          cursor: item.available_quantity > 0 ? 'pointer' : 'not-allowed',
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
            )}
          </div>
        )}

        {/* VUE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  ALERTES STOCK CRITIQUE <ShieldAlert size={20} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.5rem' }}>
                  {equipments.filter(e => e.available_quantity <= e.min_threshold).length}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  TOTAL PANNEAUX SITE <Package size={20} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.5rem' }}>
                  {equipments.reduce((acc, curr) => acc + (curr.total_quantity || 0), 0)}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  PANNEAUX SUR CHANTIER <Clock size={20} color="#f43f5e" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight 800, color: '#f43f5e', marginTop: '0.5rem' }}>
                  {equipments.reduce((acc, curr) => acc + ((curr.total_quantity || 0) - (curr.available_quantity || 0)), 0)}
                </div>
              </div>

              <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>
                  TAUX DISPONIBILITE <CheckCircle2 size={20} color="#34d399" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight 800, color: '#34d399', marginTop: '0.5rem' }}>
                  {equipments.length > 0 ? Math.round((equipments.reduce((a,c) => a + c.available_quantity, 0) / equipments.reduce((a,c) => a + c.total_quantity, 0)) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VUE SCAN */}
        {activeTab === 'scan' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Scan QR Code Terrain</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>Scannez ou saisissez la référence d'un panneau pour contrôler sa fiche Supabase</p>
            </div>

            <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Réf ex: PAN-AK05-01"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#ffffff', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                Rechercher
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

      {/* MODALE RESERVATION */}
      {reservationModalOpen && selectedEquipment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Réservation Supabase — {selectedEquipment.name}</h3>
              <button onClick={() => setReservationModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmitReservation} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Entreprise Prestataire</label>
                <input required type="text" placeholder="ex: SATELEC / Eiffage" value={resForm.company} onChange={e => setResForm({...resForm, company: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Responsable Chantier</label>
                <input required type="text" placeholder="Nom Prénom" value={resForm.resp} onChange={e => setResForm({...resForm, resp: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Bâtiment</label>
                  <select value={resForm.building} onChange={e => setResForm({...resForm, building: e.target.value})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                    <option>Bâtiment 04</option>
                    <option>Bâtiment 12</option>
                    <option>Hangar Essais</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Quantité (Max: {selectedEquipment.available_quantity})</label>
                  <input type="number" min="1" max={selectedEquipment.available_quantity} value={resForm.qty} onChange={e => setResForm({...resForm, qty: parseInt(e.target.value) || 1})} style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                </div>
              </div>

              {resStatus && (
                <div style={{ fontSize: '0.8rem', color: resStatus.includes('Erreur') ? '#f43f5e' : '#34d399', fontWeight: 600 }}>
                  {resStatus}
                </div>
              )}

              <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}>
                Confirmer & Déduire du Stock Supabase
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
