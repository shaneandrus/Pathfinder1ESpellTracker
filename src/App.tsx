import { AppProvider, useApp } from './context/AppContext';
import { CharacterListView } from './views/CharacterListView';
import { SpellSlotsView } from './views/SpellSlotsView';
import { SpellListView } from './views/SpellListView';
import { SpellbookView } from './views/SpellbookView';
import { AddSpellView } from './views/AddSpellView';
import { ManageClassesView } from './views/ManageClassesView';
import { SettingsView } from './views/SettingsView';
import { DiceRollerView } from './views/DiceRollerView';
import InventoryView from './views/InventoryView';
import AddItemView from './views/AddItemView';

function AppContent() {
  const { state, setView, activeCharacter } = useApp();

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div
            className="mx-auto mb-6"
            style={{
              width: 56,
              height: 56,
              border: '2px solid #253249',
              borderTop: '2px solid #c8962e',
              borderRadius: '50%',
              animation: 'rune-spin 0.9s linear infinite',
            }}
          />
          <p
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: '#7a93b3',
              textTransform: 'uppercase',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            Consulting the Arcane Codex…
          </p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (state.currentView) {
      case 'characters': return <CharacterListView />;
      case 'slots':      return <SpellSlotsView />;
      case 'spells':     return <SpellListView />;
      case 'spellbook':  return <SpellbookView />;
      case 'addSpell':   return <AddSpellView />;
      case 'manage':     return <ManageClassesView />;
      case 'settings':   return <SettingsView />;
      case 'dice':       return <DiceRollerView />;
      case 'inventory':  return <InventoryView />;
      case 'addItem':    return <AddItemView />;
      default:           return <CharacterListView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'linear-gradient(180deg, rgba(7,9,26,0.98) 0%, rgba(14,21,40,0.97) 100%)',
          borderBottom: '1px solid #253249',
          boxShadow: '0 1px 0 rgba(200,150,46,0.12), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setView('characters')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span
              style={{
                fontFamily: 'Cinzel, serif',
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.06em',
                background: 'linear-gradient(135deg, #e0b04a 0%, #c8962e 50%, #f0cb7a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ✦ Spell Tracker
            </span>
          </button>
          <div className="flex items-center gap-3">
            {activeCharacter && (
              <span
                className="hidden sm:inline"
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: '#7a93b3',
                  textTransform: 'uppercase',
                }}
              >
                {activeCharacter.name}
              </span>
            )}
            <button
              onClick={() => setView('settings')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '1rem',
                color: state.currentView === 'settings' ? '#e0b04a' : '#3d5070',
                transition: 'color 0.2s',
              }}
              title="Homebrew Settings"
            >
              <i className="fa-solid fa-gear" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 view-enter">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      {activeCharacter && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            background: 'linear-gradient(0deg, rgba(7,9,26,0.99) 0%, rgba(14,21,40,0.97) 100%)',
            borderTop: '1px solid #253249',
            boxShadow: '0 -1px 0 rgba(200,150,46,0.08), 0 -4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="max-w-4xl mx-auto"
            style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            <NavButton active={state.currentView === 'slots'}     onClick={() => setView('slots')}      icon="fa-solid fa-bolt"           label="Slots" />
            <NavButton active={state.currentView === 'spellbook'} onClick={() => setView('spellbook')}  icon="fa-solid fa-book-open"      label="Spells" />
            <NavButton active={state.currentView === 'spells' || state.currentView === 'addSpell'} onClick={() => setView('spells')} icon="fa-solid fa-scroll" label="Known" />
            <NavButton active={state.currentView === 'inventory' || state.currentView === 'addItem'} onClick={() => setView('inventory')} icon="fa-solid fa-bag-shopping" label="Items" />
            <NavButton active={state.currentView === 'manage'}    onClick={() => setView('manage')}      icon="fa-solid fa-hat-wizard"     label="Classes" />
            <NavButton active={state.currentView === 'dice'}      onClick={() => setView('dice')}        icon="fa-solid fa-dice-d20"       label="Dice" />
            <NavButton active={state.currentView === 'characters'} onClick={() => setView('characters')} icon="fa-solid fa-users"         label="Chars" />
          </div>
        </nav>
      )}
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="py-3 flex flex-col items-center gap-0.5 transition-colors touch-manipulation"
      style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', flex: '0 0 auto', minWidth: 60 }}
    >
      {active && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 28,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #c8962e, transparent)',
            borderRadius: 1,
          }}
        />
      )}
      <i className={icon} style={{ fontSize: '1rem', lineHeight: 1, width: 18, textAlign: 'center' }} />
      <span
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.58rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: active ? '#e0b04a' : '#3d5070',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
