import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { computeEffectiveStats, getEquippedBonusConflicts, toggleEquipped as storeToggleEquipped } from '../store/characterStore';
import { getAllItems } from '../data/items';
import type { CharacterStats, ItemSlot, CharacterInventoryItem, CharacterCurrency } from '../types';
import { DEFAULT_CHARACTER_STATS, DEFAULT_CURRENCY } from '../types';

function statMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

function fmtMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

const BODY_SLOTS: { slot: ItemSlot; label: string; icon: string }[] = [
  { slot: 'head', label: 'Head', icon: 'fa-solid fa-hat-wizard' },
  { slot: 'neck', label: 'Neck', icon: 'fa-solid fa-gem' },
  { slot: 'shoulders', label: 'Shoulders', icon: 'fa-solid fa-vest' },
  { slot: 'chest', label: 'Chest', icon: 'fa-solid fa-shirt' },
  { slot: 'body', label: 'Body', icon: 'fa-solid fa-person' },
  { slot: 'belt', label: 'Belt', icon: 'fa-solid fa-circle' },
  { slot: 'wrists', label: 'Wrists', icon: 'fa-solid fa-hands' },
  { slot: 'hands', label: 'Gloves', icon: 'fa-solid fa-hand' },
  { slot: 'ring', label: 'Ring', icon: 'fa-solid fa-ring' },
  { slot: 'feet', label: 'Feet', icon: 'fa-solid fa-shoe-prints' },
  { slot: 'main-hand', label: 'Main Hand', icon: 'fa-solid fa-sword' },
  { slot: 'off-hand', label: 'Off Hand', icon: 'fa-solid fa-shield' },
];

const CATEGORY_COLORS: Record<string, string> = {
  weapon: '#4a90d9',
  armor: '#7a93b3',
  shield: '#7a93b3',
  ring: '#c8962e',
  wondrous: '#c8962e',
  potion: '#6daf6d',
  scroll: '#b38f5a',
  wand: '#b38f5a',
  rod: '#b38f5a',
  staff: '#b38f5a',
  gear: '#5a7a8a',
  consumable: '#6daf6d',
  custom: '#9b6db5',
};

interface StatsModalProps {
  stats: CharacterStats;
  onSave: (s: CharacterStats) => void;
  onClose: () => void;
}

function StatsModal({ stats, onSave, onClose }: StatsModalProps) {
  const [form, setForm] = useState<CharacterStats>({ ...stats });

  function num(field: keyof CharacterStats, val: string) {
    setForm(prev => ({ ...prev, [field]: parseInt(val) || 0 }));
  }

  function row(label: string, field: keyof CharacterStats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <label style={{ width: 130, fontSize: '0.75rem', color: '#7a93b3', fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{label}</label>
        <input
          type="number"
          value={form[field] as number}
          onChange={e => num(field, e.target.value)}
          style={{ width: 70, background: '#0d1423', border: '1px solid #253249', color: '#e0c87a', borderRadius: 4, padding: '4px 8px', fontSize: '0.875rem', textAlign: 'center' }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #0d1423 0%, #131e30 100%)', border: '1px solid #253249', borderRadius: 12, padding: 24, width: '100%', maxWidth: 380, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: '#c8962e', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: 20, textTransform: 'uppercase' }}>Edit Base Stats</h2>

        <p style={{ fontSize: '0.65rem', color: '#3d5070', marginBottom: 16, letterSpacing: '0.05em' }}>ABILITY SCORES</p>
        {row('Strength', 'STR')}
        {row('Dexterity', 'DEX')}
        {row('Constitution', 'CON')}
        {row('Intelligence', 'INT')}
        {row('Wisdom', 'WIS')}
        {row('Charisma', 'CHA')}

        <p style={{ fontSize: '0.65rem', color: '#3d5070', marginBottom: 16, marginTop: 20, letterSpacing: '0.05em' }}>HIT POINTS</p>
        {row('Max HP', 'maxHP')}
        {row('Current HP', 'currentHP')}

        <p style={{ fontSize: '0.65rem', color: '#3d5070', marginBottom: 16, marginTop: 20, letterSpacing: '0.05em' }}>COMBAT</p>
        {row('Base Attack Bonus', 'bab')}
        {row('Fort Save (base)', 'baseFort')}
        {row('Ref Save (base)', 'baseRef')}
        {row('Will Save (base)', 'baseWill')}
        {row('Speed (ft.)', 'speed')}

        <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #253249', borderRadius: 6, color: '#7a93b3', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #7a4f1a, #c8962e)', border: 'none', borderRadius: 6, color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Save</button>
        </div>
      </div>
    </div>
  );
}

interface NotesModalProps {
  item: CharacterInventoryItem;
  itemName: string;
  onSave: (notes: string) => void;
  onClose: () => void;
}

function NotesModal({ item, itemName, onSave, onClose }: NotesModalProps) {
  const [notes, setNotes] = useState(item.notes ?? '');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #0d1423 0%, #131e30 100%)', border: '1px solid #253249', borderRadius: 12, padding: 24, width: '100%', maxWidth: 360 }}>
        <h3 style={{ fontFamily: 'Cinzel, serif', color: '#c8962e', fontSize: '0.875rem', marginBottom: 4 }}>{itemName}</h3>
        <p style={{ fontSize: '0.7rem', color: '#3d5070', marginBottom: 12 }}>Item notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          style={{ width: '100%', background: '#0d1423', border: '1px solid #253249', borderRadius: 6, color: '#d0c090', padding: '8px 10px', fontSize: '0.8rem', resize: 'vertical', boxSizing: 'border-box' }}
          placeholder="Notes about this item…"
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid #253249', borderRadius: 6, color: '#7a93b3', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onSave(notes); onClose(); }} style={{ flex: 1, padding: '8px', background: 'linear-gradient(135deg, #7a4f1a, #c8962e)', border: 'none', borderRadius: 6, color: '#fff', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryView() {
  const { activeCharacter, setView, toggleItemEquipped, removeItem, updateItemQuantity, updateItemNotes, updateStats, updateCurrency } = useApp();
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [notesTarget, setNotesTarget] = useState<CharacterInventoryItem | null>(null);
  const [slotToast, setSlotToast] = useState<string | null>(null);

  const allItems = useMemo(() => getAllItems(), []);
  const bonusConflicts = useMemo(
    () => activeCharacter ? getEquippedBonusConflicts(activeCharacter) : new Map<string, Set<number>>(),
    [activeCharacter]
  );

  if (!activeCharacter) return null;

  const baseStats = activeCharacter.stats ?? DEFAULT_CHARACTER_STATS;
  const effective = computeEffectiveStats(activeCharacter);
  const currency = activeCharacter.currency ?? DEFAULT_CURRENCY;

  function setCoin(field: keyof CharacterCurrency, raw: string) {
    const val = Math.max(0, parseInt(raw) || 0);
    updateCurrency({ ...currency, [field]: val });
  }

  function adjustCoin(field: keyof CharacterCurrency, delta: number) {
    const val = Math.max(0, (currency[field] ?? 0) + delta);
    updateCurrency({ ...currency, [field]: val });
  }

  const totalGP = currency.pp * 10 + currency.gp + currency.sp / 10 + currency.cp / 100;

  function handleToggleEquipped(entryId: string) {
    const { displaced } = storeToggleEquipped(activeCharacter!, entryId);
    toggleItemEquipped(entryId);
    if (displaced) {
      setSlotToast(`Slot taken — unequipped "${displaced}"`);
      setTimeout(() => setSlotToast(null), 3000);
    }
  }
  const inventory = activeCharacter.inventory ?? [];
  const totalWeight = inventory.reduce((acc, entry) => {
    const def = allItems.find(i => i.id === entry.itemId) ?? activeCharacter.customItems?.find(i => i.id === entry.itemId);
    return acc + (def?.weight ?? 0) * entry.quantity;
  }, 0);

  function resolveItem(entry: CharacterInventoryItem) {
    return allItems.find(i => i.id === entry.itemId) ?? activeCharacter!.customItems?.find(i => i.id === entry.itemId);
  }

  function displayName(entry: CharacterInventoryItem): string {
    return entry.customName ?? resolveItem(entry)?.name ?? entry.itemId;
  }

  // Group inventory by category
  const grouped = inventory.reduce<Record<string, CharacterInventoryItem[]>>((acc, entry) => {
    const cat = resolveItem(entry)?.category ?? 'gear';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(entry);
    return acc;
  }, {});

  const statChip = (label: string, value: string | number, sub?: string) => (
    <div key={label} style={{ minWidth: 64, textAlign: 'center', background: '#0d1423', border: '1px solid #253249', borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3d5070', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: '#e0c87a', fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.65rem', color: '#7a93b3', marginTop: 1 }}>{sub}</div>}
    </div>
  );

  const abilityChip = (label: string, _score: number) => {
    const base = (activeCharacter.stats ?? DEFAULT_CHARACTER_STATS)[label as keyof CharacterStats] as number;
    const effectiveScore = effective[label as keyof typeof effective] as number;
    const mod = statMod(effectiveScore);
    const hasBonus = effectiveScore > base;
    return (
      <div key={label} style={{ minWidth: 64, textAlign: 'center', background: '#0d1423', border: `1px solid ${hasBonus ? '#c8962e55' : '#253249'}`, borderRadius: 8, padding: '8px 10px', position: 'relative' }}>
        {hasBonus && <div style={{ position: 'absolute', top: 3, right: 4, width: 6, height: 6, borderRadius: '50%', background: '#c8962e' }} />}
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.6rem', color: '#3d5070', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: '#e0c87a', fontWeight: 700 }}>{effectiveScore}</div>
        <div style={{ fontSize: '0.65rem', color: mod >= 0 ? '#6daf6d' : '#c05050', marginTop: 1 }}>{fmtMod(mod)}</div>
      </div>
    );
  };

  const hpPercent = Math.max(0, Math.min(100, (baseStats.currentHP / Math.max(1, baseStats.maxHP)) * 100));
  const hpColor = hpPercent > 50 ? '#4a8a4a' : hpPercent > 25 ? '#c8962e' : '#c05050';

  const totalConflicts = bonusConflicts.size;

  return (
    <div style={{ paddingBottom: 90, minHeight: '100vh', background: 'linear-gradient(180deg, #0a0f1a 0%, #0d1423 100%)' }}>
      {/* Slot-swap toast */}
      {slotToast && (
        <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 60, background: '#1a1408', border: '1px solid #5a4010', borderRadius: 8, padding: '8px 16px', fontSize: '0.72rem', color: '#e0c060', fontFamily: 'Cinzel, serif', boxShadow: '0 4px 16px rgba(0,0,0,0.6)', whiteSpace: 'nowrap', animation: 'fadeSlideIn 0.2s ease' }}>
          <i className="fa-solid fa-arrow-right-arrow-left" style={{ marginRight: 6 }} />{slotToast}
        </div>
      )}

      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: '#c8962e', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          Inventory & Stats
        </h1>
        <button
          onClick={() => setShowStatsModal(true)}
          style={{ background: 'transparent', border: '1px solid #253249', borderRadius: 6, color: '#7a93b3', fontSize: '0.7rem', fontFamily: 'Cinzel, serif', padding: '5px 10px', cursor: 'pointer', letterSpacing: '0.05em' }}
        >
          <i className="fa-solid fa-pen" style={{ marginRight: 5 }} />Edit Base Stats
        </button>
      </div>

      {/* ── STATS PANEL ── */}
      <div style={{ margin: '14px 16px 0' }}>
        {/* HP Bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#3d5070', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hit Points</span>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: hpColor, fontWeight: 700 }}>
              {baseStats.currentHP} / {baseStats.maxHP}
            </span>
          </div>
          <div style={{ height: 8, background: '#0d1423', borderRadius: 4, border: '1px solid #253249', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${hpPercent}%`,
              background: `linear-gradient(90deg, ${hpColor}, ${hpColor}cc)`,
              transition: 'width 0.3s ease',
              animation: hpPercent <= 25 ? 'pulse-glow 2s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, justifyContent: 'center' }}>
            <button onClick={() => updateStats({ ...baseStats, currentHP: Math.max(0, baseStats.currentHP - 1) })} style={{ background: '#1a1020', border: '1px solid #3d2020', borderRadius: 4, color: '#c05050', width: 28, height: 28, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>–</button>
            <button onClick={() => updateStats({ ...baseStats, currentHP: Math.min(baseStats.maxHP, baseStats.currentHP + 1) })} style={{ background: '#0f1a10', border: '1px solid #203820', borderRadius: 4, color: '#6daf6d', width: 28, height: 28, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>

        {/* Ability Scores */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 10 }}>
          {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const).map(ab =>
            abilityChip(ab, effective[ab])
          )}
        </div>

        {/* Combat Stats */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {statChip('AC', effective.effectiveAC)}
          {statChip('Fort', fmtMod(effective.baseFort + statMod(effective.CON)))}
          {statChip('Ref', fmtMod(effective.baseRef + statMod(effective.DEX)))}
          {statChip('Will', fmtMod(effective.baseWill + statMod(effective.WIS)))}
          {statChip('BAB', `+${effective.bab}`)}
          {statChip('Speed', `${effective.speed}ft`)}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '18px 16px', height: 1, background: 'linear-gradient(90deg, transparent, #253249, transparent)' }} />

      {/* ── CURRENCY ── */}
      <div style={{ margin: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#3d5070', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Currency</h2>
          <span style={{ fontSize: '0.65rem', color: '#5a7a8a' }}>{totalGP.toFixed(2)} gp total</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {([
            { key: 'pp', label: 'Platinum', color: '#a8c8e8', bg: '#0d1a2a', border: '#2a4a6a' },
            { key: 'gp', label: 'Gold',     color: '#e0c060', bg: '#1a1408', border: '#5a4010' },
            { key: 'sp', label: 'Silver',   color: '#c0c8d0', bg: '#121618', border: '#3a4448' },
            { key: 'cp', label: 'Copper',   color: '#c08050', bg: '#1a1008', border: '#5a3010' },
          ] as const).map(({ key, label, color, bg, border }) => (
            <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
              <input
                type="number"
                min="0"
                value={currency[key]}
                onChange={e => setCoin(key, e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', textAlign: 'center',
                  background: 'transparent', border: 'none', outline: 'none',
                  color, fontFamily: 'Cinzel, serif', fontSize: '1.1rem', fontWeight: 700,
                  MozAppearance: 'textfield',
                }}
              />
              <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 5 }}>
                <button onClick={() => adjustCoin(key, -1)} style={{ flex: 1, background: 'transparent', border: `1px solid ${border}`, borderRadius: 3, color, cursor: 'pointer', fontSize: '0.7rem', padding: '1px 0' }}>−</button>
                <button onClick={() => adjustCoin(key, 1)}  style={{ flex: 1, background: 'transparent', border: `1px solid ${border}`, borderRadius: 3, color, cursor: 'pointer', fontSize: '0.7rem', padding: '1px 0' }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '18px 16px', height: 1, background: 'linear-gradient(90deg, transparent, #253249, transparent)' }} />

      {/* ── EQUIPMENT SLOTS ── */}
      <div style={{ margin: '0 16px 6px' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#3d5070', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Equipment Slots</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {BODY_SLOTS.map(({ slot, label, icon }) => {
            const equipped = inventory.find(e => e.equipped && (resolveItem(e)?.slot === slot));
            return (
              <div
                key={slot}
                onClick={() => { if (equipped) handleToggleEquipped(equipped.id); }}
                style={{
                  background: equipped ? 'linear-gradient(135deg, #111828, #1a2535)' : '#0a0f1a',
                  border: `1px solid ${equipped ? '#c8962e44' : '#1a2535'}`,
                  borderRadius: 8,
                  padding: '8px 6px',
                  cursor: equipped ? 'pointer' : 'default',
                  textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: equipped ? '#c8962e' : '#253249', marginBottom: 3 }}>
                  <i className={icon} />
                </div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', color: '#3d5070', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                {equipped ? (
                  <div style={{ fontSize: '0.6rem', color: '#a0b8cc', lineHeight: 1.2 }}>{displayName(equipped)}</div>
                ) : (
                  <div style={{ fontSize: '0.55rem', color: '#1a2535' }}>— empty —</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '18px 16px', height: 1, background: 'linear-gradient(90deg, transparent, #253249, transparent)' }} />

      {/* ── INVENTORY LIST ── */}
      <div style={{ margin: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#3d5070', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            Carried Items
            {inventory.length > 0 && <span style={{ marginLeft: 8, color: '#253249' }}>({inventory.length})</span>}
          </h2>
          <span style={{ fontSize: '0.65rem', color: '#3d5070' }}>{totalWeight.toFixed(1)} lbs</span>
        </div>

        {/* Stacking conflict notice */}
        {totalConflicts > 0 && (
          <div style={{ background: '#1a1408', border: '1px solid #5a3a08', borderRadius: 8, padding: '8px 12px', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#c8962e', fontSize: '0.75rem', marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', color: '#c8962e', marginBottom: 2 }}>Bonus Stacking Conflicts</div>
              <div style={{ fontSize: '0.62rem', color: '#7a6030', lineHeight: 1.4 }}>
                {totalConflicts} equipped item{totalConflicts !== 1 ? 's have' : ' has'} bonuses overridden by a higher bonus of the same type. Shadowed bonuses are shown with ⚠ and strikethrough. Only the highest bonus of each type applies (except dodge & untyped, which always stack).
              </div>
            </div>
          </div>
        )}

        {inventory.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#253249', fontFamily: 'Cinzel, serif', fontSize: '0.75rem' }}>
            No items yet. Add some below.
          </div>
        )}

        {Object.entries(grouped).map(([cat, entries]) => (
          <div key={cat} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.6rem', color: '#3d5070', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 2, background: CATEGORY_COLORS[cat] ?? '#5a7a8a' }} />
              {cat}
            </div>
            {entries.map((entry, idx) => {
              const def = resolveItem(entry);
              const color = CATEGORY_COLORS[def?.category ?? cat] ?? '#5a7a8a';
              return (
                <div
                  key={entry.id}
                  style={{
                    background: 'linear-gradient(135deg, #0e1520, #111928)',
                    border: `1px solid #1e2d40`,
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 6,
                    animation: `fadeSlideIn 0.2s ease both`,
                    animationDelay: `${idx * 0.04}s`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#c8d8e8', fontWeight: 600, marginBottom: 2 }}>{displayName(entry)}</div>
                      {def?.bonuses && def.bonuses.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 3 }}>
                          {def.bonuses.map((b, bi) => {
                            const shadowed = entry.equipped && bonusConflicts.get(entry.id)?.has(bi);
                            return (
                              <span key={bi} title={shadowed ? `Shadowed: a higher ${b.type} bonus to ${b.stat} is already equipped` : undefined} style={{ fontSize: '0.6rem', background: shadowed ? '#1a1a1a' : '#0d1a28', border: `1px solid ${shadowed ? '#3d3020' : '#253249'}`, borderRadius: 10, padding: '1px 6px', color: shadowed ? '#5a4a30' : '#c8962e', textDecoration: shadowed ? 'line-through' : 'none', opacity: shadowed ? 0.6 : 1 }}>
                                {shadowed && <span style={{ marginRight: 2, textDecoration: 'none', display: 'inline-block' }}>⚠</span>}
                                {b.value > 0 ? '+' : ''}{b.value} {b.stat} ({b.type})
                              </span>
                            );
                          })}
                          {(entry.customBonuses ?? []).map((b, bi) => {
                            const shadowed = entry.equipped && bonusConflicts.get(entry.id)?.has(bi);
                            return (
                              <span key={`c${bi}`} title={shadowed ? `Shadowed: a higher ${b.type} bonus to ${b.stat} is already equipped` : undefined} style={{ fontSize: '0.6rem', background: shadowed ? '#1a1020' : '#1a0d28', border: `1px solid ${shadowed ? '#3d2050' : '#3d2560'}`, borderRadius: 10, padding: '1px 6px', color: shadowed ? '#4a3060' : '#9b6db5', textDecoration: shadowed ? 'line-through' : 'none', opacity: shadowed ? 0.6 : 1 }}>
                                {shadowed && <span style={{ marginRight: 2, textDecoration: 'none', display: 'inline-block' }}>⚠</span>}
                                {b.value > 0 ? '+' : ''}{b.value} {b.stat} ({b.type})
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {entry.notes && (
                        <div style={{ fontSize: '0.65rem', color: '#5a7a8a', fontStyle: 'italic' }}>{entry.notes}</div>
                      )}
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                      {/* Equip toggle */}
                      {def?.slot !== 'none' && def?.slot && (
                        <button
                          onClick={() => handleToggleEquipped(entry.id)}
                          style={{
                            background: entry.equipped ? 'linear-gradient(135deg, #7a4f1a, #c8962e)' : 'transparent',
                            border: `1px solid ${entry.equipped ? '#c8962e' : '#253249'}`,
                            borderRadius: 4,
                            color: entry.equipped ? '#fff' : '#3d5070',
                            fontSize: '0.6rem',
                            fontFamily: 'Cinzel, serif',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {entry.equipped ? 'Equipped' : 'Equip'}
                        </button>
                      )}
                      {/* Quantity */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button onClick={() => updateItemQuantity(entry.id, entry.quantity - 1)} style={{ width: 20, height: 20, background: 'transparent', border: '1px solid #253249', borderRadius: 3, color: '#7a93b3', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: '0.75rem', color: '#a0b8cc', minWidth: 20, textAlign: 'center' }}>{entry.quantity}</span>
                        <button onClick={() => updateItemQuantity(entry.id, entry.quantity + 1)} style={{ width: 20, height: 20, background: 'transparent', border: '1px solid #253249', borderRadius: 3, color: '#7a93b3', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {def?.weight != null && (
                        <span style={{ fontSize: '0.6rem', color: '#3d5070' }}>
                          <i className="fa-solid fa-weight-hanging" style={{ marginRight: 3 }} />{(def.weight * entry.quantity).toFixed(1)} lbs
                        </span>
                      )}
                      {def?.cost && (
                        <span style={{ fontSize: '0.6rem', color: '#3d5070' }}>{def.cost}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setNotesTarget(entry)}
                        style={{ background: 'transparent', border: 'none', color: '#3d5070', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px' }}
                        title="Notes"
                      >
                        <i className="fa-solid fa-note-sticky" />
                      </button>
                      <button
                        onClick={() => removeItem(entry.id)}
                        style={{ background: 'transparent', border: 'none', color: '#6a3030', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 4px' }}
                        title="Remove"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <button
          onClick={() => setView('addItem')}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '12px',
            background: 'linear-gradient(135deg, #0a1520, #111e30)',
            border: '1px dashed #253249',
            borderRadius: 10,
            color: '#4a6a8a',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: 8 }} />Add Item
        </button>
      </div>

      {showStatsModal && (
        <StatsModal
          stats={baseStats}
          onSave={updateStats}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {notesTarget && (
        <NotesModal
          item={notesTarget}
          itemName={displayName(notesTarget)}
          onSave={(notes) => updateItemNotes(notesTarget.id, notes)}
          onClose={() => setNotesTarget(null)}
        />
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
