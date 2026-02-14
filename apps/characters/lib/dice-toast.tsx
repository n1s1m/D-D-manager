import { toast } from '@repo/ui-components';

export function showD20RollToast(roll: number, modifier: number, label: string) {
  const total = roll + modifier;
  const modStr = modifier >= 0 ? `+${modifier}` : String(modifier);

  if (roll === 1) {
    toast(
      <div className="text-center py-2">
        <div className="text-lg font-bold uppercase tracking-wider text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
          Critical fail
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {label}: 1d20 → <span className="text-destructive font-semibold">1</span> {modStr} = {total}
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
          border: '2px solid rgb(248 113 113 / 0.5)',
          boxShadow: '0 0 20px rgba(248, 113, 113, 0.3)',
        },
      }
    );
    return;
  }

  if (roll === 20) {
    toast(
      <div className="text-center py-2">
        <div className="text-lg font-bold uppercase tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
          Critical success
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {label}: 1d20 → <span className="text-amber-400 font-semibold">20</span> {modStr} = {total}
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
          border: '2px solid rgb(253 224 71 / 0.5)',
          boxShadow: '0 0 20px rgba(253, 224, 71, 0.3)',
        },
      }
    );
    return;
  }

  toast(
    <div className="text-sm">
      <span className="font-medium">{label}</span>: 1d20 ({roll}) {modStr} = <strong>{total}</strong>
    </div>,
    { duration: 4000 }
  );
}

export function showDiceRollToast(label: string, rolls: number[], total: number, options?: { duration?: number }) {
  const rollStr = rolls.join(' + ');
  toast(
    <div className="text-sm">
      <span className="font-medium">{label}</span>: {rollStr} = <strong>{total}</strong>
    </div>,
    { duration: options?.duration ?? 5000 }
  );
}
