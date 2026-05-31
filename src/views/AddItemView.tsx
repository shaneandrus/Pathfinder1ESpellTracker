import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getAllItems, getItemsByCategory } from '../data/items';
import { generateId } from '../store/characterStore';
import type { Item, ItemCategory, ItemSlot, StatBonus, BonusType, StatKey } from '../types';

const CATEGORIES: { id: ItemCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'fa-solid fa-layer-group' },
  { id: 'weapon', label: 'Weapons', icon: 'fa-solid fa-sword' },
  { id: 'armor', label: 'Armor', icon: 'fa-solid fa-shield-halved' },
  { id: 'shield', label: 'Shields', icon: 'fa-solid fa-shield' },
  { id: 'wondrous', label: 'Wondrous', icon: 'fa-solid fa-wand-sparkles' },
  { id: 'ring', label: 'Rings', icon: 'fa-solid fa-ring' },
  { id: 'potion', label: 'Potions', icon: 'fa-solid fa-flask' },
  { id: 'scroll', label: 'Scrolls', icon: 'fa-solid fa-scroll' },
  { id: 'wand', label: 'Wands', icon: 'fa-solid fa-wand-magic' },
  { id: 'rod', label: 'Rods', icon: 'fa-solid fa-staff' },
  { id: 'staff', label: 'Staves', icon: 'fa-solid fa-staff-snake' },
  { id: 'gear', label: 'Gear', icon: 'fa-solid fa-box' },
  { id: 'custom', label: 'Custom', icon: 'fa-solid fa-pencil' },
];

const STAT_KEYS: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'AC', 'FORT', 'REF', 'WILL', 'INIT', 'SPEED', 'BAB'];
const BONUS_TYPES: BonusType[] = ['enhancement', 'competence', 'luck', 'sacred', 'profane', 'resistance', 'deflection', 'natural', 'armor', 'shield', 'dodge', 'morale', 'insight', 'circumstance', 'alchemical', 'untyped'];
const SLOTS: ItemSlot[] = ['head', 'neck', 'shoulders', 'chest', 'body', 'belt', 'wrists', 'hands', 'ring', 'feet', 'main-hand', 'off-hand', 'none'];

const CATEGORY_COLORS: Record<string, string> = {
  weapon: '#4a90d9', armor: '#7a93b3', shield: '#7a93b3',
  ring: '#c8962e', wondrous: '#c8962e', potion: '#6daf6d',
  scroll: '#b38f5a', wand: '#b38f5a', rod: '#b38f5a', staff: '#b38f5a',
  gear: '#5a7a8a', consumable: '#6daf6d', custom: '#9b6db5',
};

interface CustomItemForm {
  name: string;
  category: ItemCategory;
  slot: ItemSlot;
  weight: string;
  cost: string;
  description: string;
  casterLevel: string;
  aura: string;
  bonuses: StatBonus[];
}

const defaultCustomForm = (): CustomItemForm => ({
  name: '', category: 'custom', slot: 'none',
  weight: '', cost: '', description: '', casterLevel: '', aura: '',
  bonuses: [],
});

export default function AddItemView() {
  const { activeCharacter, setView, addItem, addCustomItemToCharacter } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState<CustomItemForm>(defaultCustomForm());

  const allItems = useMemo(() => getAllItems(), []);
  const customItems = activeCharacter?.customItems ?? [];

  const filtered = useMemo(() => {
    const base = category === 'custom'
      ? customItems
      : category === 'all'
        ? [...allItems, ...customItems]
        : [...getItemsByCategory(category as ItemCategory), ...customItems.filter(i => i.category === category)];

    if (!query) return base;
    const q = query.toLowerCase();
    return base.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [allItems, customItems, category, query]);

  function handleAdd(item: Item) {
    addItem({ id: generateId(), itemId: item.id, quantity: 1, equipped: false });
    setAddedIds(prev => new Set(prev).add(item.id));
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(item.id); return s; }), 1500);
  }

  function addBonusRow() {
    setCustomForm(prev => ({ ...prev, bonuses: [...prev.bonuses, { stat: 'STR', value: 2, type: 'enhancement' }] }));
  }

  function updateBonus(idx: number, field: keyof StatBonus, val: string | number) {
    setCustomForm(prev => ({
      ...prev,
      bonuses: prev.bonuses.map((b, i) => i === idx ? { ...b, [field]: field === 'value' ? Number(val) : val } : b),
    }));
  }

  function removeBonus(idx: number) {
    setCustomForm(prev => ({ ...prev, bonuses: prev.bonuses.filter((_, i) => i !== idx) }));
  }

  function handleCreateCustom() {
    if (!customForm.name.trim()) return;
    const item: Item = {
      id: `custom-${generateId()}`,
      name: customForm.name.trim(),
      category: customForm.category,
      slot: customForm.slot,
      weight: customForm.weight ? parseFloat(customForm.weight) : undefined,
      cost: customForm.cost || undefined,
      description: customForm.description || 'Custom item.',
      bonuses: customForm.bonuses.length ? customForm.bonuses : undefined,
      casterLevel: customForm.casterLevel ? parseInt(customForm.casterLevel) : undefined,
      aura: customForm.aura || undefined,
    };
    addCustomItemToCharacter(item);
    addItem({ id: generateId(), itemId: item.id, quantity: 1, equipped: false });
    setCustomForm(defaultCustomForm());
    setShowCustomForm(false);
    setView('inventory');
  }

  const selectStyle = {
    background: '#0d1423', border: '1px solid #253249', borderRadius: 4,
    color: '#d0c090', padding: '4px 8px', fontSize: '0.75rem',
  };

  return (
    <div style={{ paddingBottom: 90, minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1423 100%)' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => setView('inventory')}
          style={{ background: 'transparent', border: 'none', color: '#7a93b3', fontSize: '1rem', cursor: 'pointer', padding: '4px 6px' }}
        >
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: '#c8962e', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Add Item
        </h1>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3d5070', fontSize: '0.8rem' }} />
          <input
            type="text"
            placeholder="Search items…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#0d1423', border: '1px solid #253249', borderRadius: 8,
              color: '#c8d8e8', padding: '10px 10px 10px 36px', fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Category filter chips */}
      <div style={{ padding: '10px 16px', overflowX: 'auto', display: 'flex', gap: 6, paddingBottom: 12 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            style={{
              flexShrink: 0,
              background: category === cat.id ? 'linear-gradient(135deg, #7a4f1a, #c8962e)' : '#0d1423',
              border: `1px solid ${category === cat.id ? '#c8962e' : '#253249'}`,
              borderRadius: 20,
              color: category === cat.id ? '#fff' : '#7a93b3',
              padding: '5px 12px',
              fontSize: '0.65rem',
              fontFamily: 'Cinzel, serif',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <i className={cat.icon} style={{ marginRight: 5, fontSize: '0.6rem' }} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: '0.6rem', color: '#3d5070', marginBottom: 8, fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </div>

        {filtered.map((item, idx) => {
          const isExpanded = expanded === item.id;
          const isAdded = addedIds.has(item.id);
          const color = CATEGORY_COLORS[item.category] ?? '#5a7a8a';
          return (
            <div
              key={item.id}
              style={{
                background: 'linear-gradient(135deg, #0e1520, #111928)',
                border: '1px solid #1e2d40',
                borderLeft: `3px solid ${color}`,
                borderRadius: 8,
                marginBottom: 6,
                overflow: 'hidden',
                animation: 'fadeSlideIn 0.15s ease both',
                animationDelay: `${Math.min(idx, 20) * 0.03}s`,
              }}
            >
              <div
                style={{ padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}
                onClick={() => setExpanded(isExpanded ? null : item.id)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#c8d8e8', fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.category}</span>
                    {item.slot !== 'none' && <span style={{ fontSize: '0.6rem', color: '#3d5070' }}>• {item.slot}</span>}
                    {item.cost && <span style={{ fontSize: '0.6rem', color: '#3d5070' }}>• {item.cost}</span>}
                    {item.bonuses?.map((b, bi) => (
                      <span key={bi} style={{ fontSize: '0.6rem', background: '#0d1a28', border: '1px solid #253249', borderRadius: 10, padding: '1px 6px', color: '#c8962e' }}>
                        {b.value > 0 ? '+' : ''}{b.value} {b.stat}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                  style={{
                    flexShrink: 0,
                    background: isAdded ? 'linear-gradient(135deg, #1a4a1a, #2a7a2a)' : 'linear-gradient(135deg, #7a4f1a, #c8962e)',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '6px 14px',
                    fontSize: '0.65rem',
                    fontFamily: 'Cinzel, serif',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                >
                  {isAdded ? <><i className="fa-solid fa-check" /> Added</> : '+ Add'}
                </button>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 12px 12px', borderTop: '1px solid #1a2535' }}>
                  <p style={{ fontSize: '0.72rem', color: '#7a93b3', lineHeight: 1.5, margin: '8px 0' }}>{item.description}</p>
                  {item.aura && <div style={{ fontSize: '0.65rem', color: '#5a7a8a' }}><b style={{ color: '#3d5070' }}>Aura:</b> {item.aura} {item.casterLevel ? `(CL ${item.casterLevel})` : ''}</div>}
                  {item.weight != null && <div style={{ fontSize: '0.65rem', color: '#5a7a8a', marginTop: 3 }}><b style={{ color: '#3d5070' }}>Weight:</b> {item.weight} lb{item.weight !== 1 ? 's' : ''}</div>}
                  {item.bonuses && item.bonuses.length > 0 && (
                    <div style={{ marginTop: 6 }}>
                      <div style={{ fontSize: '0.6rem', color: '#3d5070', marginBottom: 4, fontFamily: 'Cinzel, serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Bonuses</div>
                      {item.bonuses.map((b, bi) => (
                        <div key={bi} style={{ fontSize: '0.65rem', color: '#c8962e', marginBottom: 2 }}>
                          {b.value > 0 ? '+' : ''}{b.value} <b>{b.stat}</b> <span style={{ color: '#5a7a8a' }}>({b.type})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#253249', fontFamily: 'Cinzel, serif', fontSize: '0.75rem' }}>
            No matching items found.
          </div>
        )}
      </div>

      {/* Custom Item Creator */}
      <div style={{ margin: '16px', borderTop: '1px solid #1a2535', paddingTop: 16 }}>
        <button
          onClick={() => setShowCustomForm(v => !v)}
          style={{
            width: '100%', padding: '10px', background: 'transparent', border: '1px solid #253249',
            borderRadius: 8, color: '#9b6db5', fontFamily: 'Cinzel, serif', fontSize: '0.75rem',
            cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <i className={`fa-solid fa-${showCustomForm ? 'chevron-up' : 'plus'}`} />
          {showCustomForm ? 'Hide Custom Creator' : 'Create Custom Item'}
        </button>

        {showCustomForm && (
          <div style={{ marginTop: 14, background: 'linear-gradient(135deg, #0d1020, #111530)', border: '1px solid #2a2060', borderRadius: 10, padding: 16 }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: '#9b6db5', fontSize: '0.85rem', marginBottom: 14, letterSpacing: '0.1em' }}>Custom Item</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name *</label>
                <input value={customForm.name} onChange={e => setCustomForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Ring of Warding" style={{ width: '100%', boxSizing: 'border-box', background: '#0d1423', border: '1px solid #253249', borderRadius: 4, color: '#d0c090', padding: '6px 8px', fontSize: '0.8rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                <select value={customForm.category} onChange={e => setCustomForm(prev => ({ ...prev, category: e.target.value as ItemCategory }))} style={{ width: '100%', ...selectStyle }}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Slot</label>
                <select value={customForm.slot} onChange={e => setCustomForm(prev => ({ ...prev, slot: e.target.value as ItemSlot }))} style={{ width: '100%', ...selectStyle }}>
                  {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight (lbs)</label>
                <input type="number" value={customForm.weight} onChange={e => setCustomForm(prev => ({ ...prev, weight: e.target.value }))} placeholder="0" style={{ width: '100%', boxSizing: 'border-box', ...selectStyle }} />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cost</label>
                <input value={customForm.cost} onChange={e => setCustomForm(prev => ({ ...prev, cost: e.target.value }))} placeholder="e.g. 2,000 gp" style={{ width: '100%', boxSizing: 'border-box', ...selectStyle }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <textarea value={customForm.description} onChange={e => setCustomForm(prev => ({ ...prev, description: e.target.value }))} rows={2} placeholder="What does this item do?" style={{ width: '100%', boxSizing: 'border-box', background: '#0d1423', border: '1px solid #253249', borderRadius: 4, color: '#d0c090', padding: '6px 8px', fontSize: '0.75rem', resize: 'vertical' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Caster Level</label>
                <input type="number" value={customForm.casterLevel} onChange={e => setCustomForm(prev => ({ ...prev, casterLevel: e.target.value }))} placeholder="e.g. 5" style={{ width: '100%', boxSizing: 'border-box', ...selectStyle }} />
              </div>

              <div>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aura</label>
                <input value={customForm.aura} onChange={e => setCustomForm(prev => ({ ...prev, aura: e.target.value }))} placeholder="e.g. Faint Abjuration" style={{ width: '100%', boxSizing: 'border-box', ...selectStyle }} />
              </div>
            </div>

            {/* Bonus rows */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.6rem', color: '#3d5070', fontFamily: 'Cinzel, serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stat Bonuses</label>
                <button onClick={addBonusRow} style={{ background: 'transparent', border: '1px solid #2a2060', borderRadius: 4, color: '#9b6db5', fontSize: '0.65rem', cursor: 'pointer', padding: '3px 8px' }}>+ Add Bonus</button>
              </div>
              {customForm.bonuses.map((b, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
                  <select value={b.stat} onChange={e => updateBonus(idx, 'stat', e.target.value)} style={{ flex: '0 0 70px', ...selectStyle }}>
                    {STAT_KEYS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="number" value={b.value} onChange={e => updateBonus(idx, 'value', e.target.value)} style={{ flex: '0 0 50px', textAlign: 'center', ...selectStyle }} />
                  <select value={b.type} onChange={e => updateBonus(idx, 'type', e.target.value)} style={{ flex: 1, ...selectStyle }}>
                    {BONUS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button onClick={() => removeBonus(idx)} style={{ background: 'transparent', border: 'none', color: '#6a3030', cursor: 'pointer', fontSize: '0.8rem', padding: '0 4px' }}>✕</button>
                </div>
              ))}
            </div>

            <button
              onClick={handleCreateCustom}
              disabled={!customForm.name.trim()}
              style={{
                width: '100%', padding: '10px',
                background: customForm.name.trim() ? 'linear-gradient(135deg, #4a1a7a, #9b6db5)' : '#1a1530',
                border: 'none', borderRadius: 6, color: '#fff',
                fontFamily: 'Cinzel, serif', fontSize: '0.75rem',
                cursor: customForm.name.trim() ? 'pointer' : 'default',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                opacity: customForm.name.trim() ? 1 : 0.5,
              }}
            >
              <i className="fa-solid fa-plus" style={{ marginRight: 8 }} />Create & Add to Inventory
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
