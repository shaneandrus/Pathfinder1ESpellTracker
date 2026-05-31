import { useState, useCallback } from 'react';

type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

interface DieConfig {
  type: DieType;
  max: number;
  label: string;
  color: string;
}

const DICE: DieConfig[] = [
  { type: 'd4', max: 4, label: 'd4', color: '#22c55e' },
  { type: 'd6', max: 6, label: 'd6', color: '#3b82f6' },
  { type: 'd8', max: 8, label: 'd8', color: '#8b5cf6' },
  { type: 'd10', max: 10, label: 'd10', color: '#f59e0b' },
  { type: 'd12', max: 12, label: 'd12', color: '#ef4444' },
  { type: 'd20', max: 20, label: 'd20', color: '#ec4899' },
  { type: 'd100', max: 100, label: 'd100', color: '#14b8a6' },
];

interface RollResult {
  id: number;
  dice: DieType;
  count: number;
  modifier: number;
  rolls: number[];
  total: number;
  timestamp: number;
}

let rollIdCounter = 0;

export function DiceRollerView() {
  const [selectedDie, setSelectedDie] = useState<DieConfig>(DICE[5]); // d20 default
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<number[] | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);

  const rollDice = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);

    // Animate with random numbers flickering
    let tick = 0;
    const totalTicks = 12;
    const interval = setInterval(() => {
      tick++;
      const fakeRolls = Array.from({ length: diceCount }, () =>
        Math.floor(Math.random() * selectedDie.max) + 1
      );
      setCurrentDisplay(fakeRolls);

      if (tick >= totalTicks) {
        clearInterval(interval);
        // Final real roll
        const realRolls = Array.from({ length: diceCount }, () =>
          Math.floor(Math.random() * selectedDie.max) + 1
        );
        setCurrentDisplay(realRolls);
        const total = realRolls.reduce((a, b) => a + b, 0) + modifier;

        const result: RollResult = {
          id: ++rollIdCounter,
          dice: selectedDie.type,
          count: diceCount,
          modifier,
          rolls: realRolls,
          total,
          timestamp: Date.now(),
        };
        setHistory(prev => [result, ...prev].slice(0, 50));
        setIsRolling(false);
      }
    }, 60);
  }, [isRolling, diceCount, selectedDie, modifier]);

  const currentTotal = currentDisplay
    ? currentDisplay.reduce((a, b) => a + b, 0) + modifier
    : null;

  const isNat20 = selectedDie.type === 'd20' && diceCount === 1 &&
    currentDisplay?.[0] === 20 && !isRolling;
  const isNat1 = selectedDie.type === 'd20' && diceCount === 1 &&
    currentDisplay?.[0] === 1 && !isRolling;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6"><i className="fa-solid fa-dice-d20 mr-2" />Dice Roller</h1>

      {/* Dice Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DICE.map(die => (
          <button
            key={die.type}
            onClick={() => setSelectedDie(die)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
              selectedDie.type === die.type
                ? 'ring-2 ring-white scale-110 shadow-lg'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: die.color + (selectedDie.type === die.type ? '' : '40'),
              color: selectedDie.type === die.type ? '#fff' : die.color,
            }}
          >
            {die.label}
          </button>
        ))}
      </div>

      {/* Count & Modifier Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="label">Number of Dice</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDiceCount(c => Math.max(1, c - 1))}
              className="btn btn-secondary text-lg px-3 py-1"
            >−</button>
            <span className="text-xl font-bold text-white w-10 text-center">{diceCount}</span>
            <button
              onClick={() => setDiceCount(c => Math.min(20, c + 1))}
              className="btn btn-secondary text-lg px-3 py-1"
            >+</button>
          </div>
        </div>
        <div className="flex-1">
          <label className="label">Modifier</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModifier(m => m - 1)}
              className="btn btn-secondary text-lg px-3 py-1"
            >−</button>
            <span className="text-xl font-bold text-white w-10 text-center">
              {modifier >= 0 ? `+${modifier}` : modifier}
            </span>
            <button
              onClick={() => setModifier(m => m + 1)}
              className="btn btn-secondary text-lg px-3 py-1"
            >+</button>
          </div>
        </div>
      </div>

      {/* Roll Display Area */}
      <div
        className={`card mb-6 text-center py-8 transition-all duration-300 ${
          isRolling ? 'dice-rolling' : ''
        } ${isNat20 ? 'ring-2 ring-yellow-400 bg-yellow-900/30' : ''} ${
          isNat1 ? 'ring-2 ring-red-500 bg-red-900/30' : ''
        }`}
      >
        {currentDisplay ? (
          <>
            {isNat20 && <div className="text-yellow-400 text-sm font-bold mb-2 animate-bounce"><i className="fa-solid fa-trophy mr-1" />NATURAL 20!<i className="fa-solid fa-trophy ml-1" /></div>}
            {isNat1 && <div className="text-red-400 text-sm font-bold mb-2 animate-bounce"><i className="fa-solid fa-skull mr-1" />NATURAL 1...</div>}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {currentDisplay.map((val, i) => (
                <div
                  key={i}
                  className={`die-face ${isRolling ? 'die-spin' : 'die-land'}`}
                  style={{ borderColor: selectedDie.color }}
                >
                  {val}
                </div>
              ))}
            </div>
            {modifier !== 0 && (
              <div className="text-gray-400 text-sm mb-1">
                {currentDisplay.join(' + ')}{modifier >= 0 ? ` + ${modifier}` : ` − ${Math.abs(modifier)}`}
              </div>
            )}
            <div
              className="text-5xl font-black transition-all duration-200"
              style={{ color: selectedDie.color }}
            >
              {currentTotal}
            </div>
            <div className="text-gray-500 text-xs mt-2">
              {diceCount}{selectedDie.type}{modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-lg">Tap Roll to begin</div>
        )}
      </div>

      {/* Roll Button */}
      <button
        onClick={rollDice}
        disabled={isRolling}
        className={`w-full py-4 rounded-xl text-xl font-bold transition-all duration-200 mb-6 ${
          isRolling
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-lg shadow-indigo-600/30'
        }`}
      >
        {isRolling
          ? <><i className="fa-solid fa-dice-d20 mr-2" />Rolling...</>
          : <><i className="fa-solid fa-dice-d20 mr-2" />{`Roll ${diceCount}${selectedDie.type}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`}</>
        }
      </button>

      {/* Roll History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Roll History</h2>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {history.map(roll => (
              <div key={roll.id} className="card py-2 px-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-400">
                    {roll.count}{roll.dice}{roll.modifier !== 0 ? (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier) : ''}
                  </span>
                  <span className="text-xs text-gray-600 ml-2">
                    [{roll.rolls.join(', ')}]{roll.modifier !== 0 ? (roll.modifier >= 0 ? ` +${roll.modifier}` : ` ${roll.modifier}`) : ''}
                  </span>
                </div>
                <span className="text-lg font-bold text-white">{roll.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
