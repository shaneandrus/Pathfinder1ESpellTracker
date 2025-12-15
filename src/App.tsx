import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CharacterListView } from './views/CharacterListView';
import { SpellSlotsView } from './views/SpellSlotsView';
import { SpellListView } from './views/SpellListView';
import { SpellbookView } from './views/SpellbookView';
import { AddSpellView } from './views/AddSpellView';
import { ManageClassesView } from './views/ManageClassesView';
import { SettingsView } from './views/SettingsView';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const { state, setView, activeCharacter } = useApp();
  const { user, isLoading: authLoading, isConfigured, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (state.isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading spells...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (state.currentView) {
      case 'characters':
        return <CharacterListView />;
      case 'slots':
        return <SpellSlotsView />;
      case 'spells':
        return <SpellListView />;
      case 'spellbook':
        return <SpellbookView />;
      case 'addSpell':
        return <AddSpellView />;
      case 'manage':
        return <ManageClassesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CharacterListView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1
            className="text-lg font-bold text-indigo-400 cursor-pointer"
            onClick={() => setView('characters')}
          >
            🔮 Spell Tracker
          </h1>
          <div className="flex items-center gap-2">
            {activeCharacter && (
              <span className="text-sm text-gray-400 hidden sm:inline">{activeCharacter.name}</span>
            )}
            {isConfigured && (
              user ? (
                <button
                  onClick={signOut}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                  title={`Signed in as ${user.email}`}
                >
                  ☁️ Sync'd
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded transition-colors"
                >
                  ☁️ Sign In
                </button>
              )
            )}
            <button
              onClick={() => setView('settings')}
              className={`text-xl hover:text-indigo-400 transition-colors ${
                state.currentView === 'settings' ? 'text-indigo-400' : 'text-gray-400'
              }`}
              title="Homebrew Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      {activeCharacter && (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40">
          <div className="max-w-4xl mx-auto flex">
            <NavButton
              active={state.currentView === 'slots'}
              onClick={() => setView('slots')}
              icon="⚡"
              label="Slots"
            />
            <NavButton
              active={state.currentView === 'spellbook'}
              onClick={() => setView('spellbook')}
              icon="📖"
              label="Spellbook"
            />
            <NavButton
              active={state.currentView === 'spells' || state.currentView === 'addSpell'}
              onClick={() => setView('spells')}
              icon="📋"
              label="Known"
            />
            <NavButton
              active={state.currentView === 'manage'}
              onClick={() => setView('manage')}
              icon="⚙️"
              label="Classes"
            />
            <NavButton
              active={state.currentView === 'characters'}
              onClick={() => setView('characters')}
              icon="👤"
              label="Chars"
            />
          </div>
        </nav>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
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
      className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
