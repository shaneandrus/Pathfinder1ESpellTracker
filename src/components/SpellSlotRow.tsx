import type { SpellSlotState } from '../types';

interface SpellSlotRowProps {
  level: number;
  slot: SpellSlotState;
  onToggle: (index: number) => void;
  classColor: string;
}

export function SpellSlotRow({ level, slot, onToggle, classColor }: SpellSlotRowProps) {
  const levelLabel = level === 0 ? 'Cantrips' : `${level}${getOrdinalSuffix(level)} Level`;

  // For 0-level spells (cantrips) or unlimited slots (-1), show as unlimited
  const isCantrip = level === 0;
  const isUnlimited = slot.total === -1;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-24 text-sm font-medium text-gray-300">
        {levelLabel}
      </div>
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        {isCantrip || isUnlimited ? (
          <span className="text-yellow-400 text-sm italic">
            {isCantrip ? 'At will' : 'Unlimited'}
          </span>
        ) : (
          <>
            {Array.from({ length: slot.total }).map((_, i) => {
              const isUsed = i < slot.used;
              return (
                <button
                  key={i}
                  onClick={() => onToggle(i)}
                  className={`spell-slot ${isUsed ? 'spell-slot-used' : 'spell-slot-available'}`}
                  style={{ borderColor: isUsed ? undefined : classColor }}
                  aria-label={`Spell slot ${i + 1} of ${slot.total}, ${isUsed ? 'used' : 'available'}`}
                >
                  {isUsed ? (
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" style={{ color: classColor }} fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="6" />
                    </svg>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>
      <div className="w-12 text-right text-sm text-gray-400">
        {isCantrip || isUnlimited ? '∞' : `${slot.total - slot.used}/${slot.total}`}
      </div>
    </div>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

