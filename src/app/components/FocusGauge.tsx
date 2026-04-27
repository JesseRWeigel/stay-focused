import { getFocusLevel } from '../../processing/focusScore';

interface FocusGaugeProps {
  focus: number;
}

const LEVEL_COLORS = {
  low: '#ef4444',
  medium: '#f59e0b',
  high: '#22c55e',
};

export function FocusGauge({ focus }: FocusGaugeProps) {
  const level = getFocusLevel(focus);
  const color = LEVEL_COLORS[level];
  const percentage = Math.round(focus * 100);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `8px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          transition: 'border-color 0.3s ease',
        }}
      >
        <div>
          <div style={{ fontSize: 48, fontWeight: 'bold', color }}>{percentage}%</div>
          <div style={{ fontSize: 14, color: '#666', textTransform: 'uppercase' }}>
            {level} focus
          </div>
        </div>
      </div>
    </div>
  );
}
