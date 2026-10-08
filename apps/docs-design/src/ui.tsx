import type { CSSProperties, ReactNode } from 'react';

// ชิ้นส่วนแสดงผลเล็ก ๆ ของหน้า token — ใช้ inline style + CSS variable ของ BRT
export const mono: CSSProperties = { fontFamily: 'var(--brt-font-mono)', fontSize: 12 };

export function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>{title}</h2>
      {note && (
        <p style={{ margin: '0 0 16px', color: 'var(--brt-color-text-muted)', fontSize: 14 }}>
          {note}
        </p>
      )}
      {children}
    </section>
  );
}

/** สีตัวอักษรที่อ่านออกบนพื้นสีนั้น */
export function readableOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111827' : '#ffffff';
}

export function Swatch({ color, label, sub }: { color: string; label: string; sub?: string }) {
  const isHex = color.startsWith('#');
  return (
    <div style={{ minWidth: 96 }}>
      <div
        style={{
          background: color,
          height: 56,
          borderRadius: 8,
          border: '1px solid var(--brt-color-border-default)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 6,
          color: isHex ? readableOn(color) : undefined,
          ...mono,
        }}
      >
        {label}
      </div>
      {sub && (
        <div style={{ ...mono, color: 'var(--brt-color-text-muted)', marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const cell: CSSProperties = {
    padding: '8px 12px',
    borderBottom: '1px solid var(--brt-color-border-default)',
    textAlign: 'left',
    verticalAlign: 'middle',
  };
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} style={{ ...cell, color: 'var(--brt-color-text-muted)', fontWeight: 500 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} style={cell}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
