import { useMemo } from 'react';

const STATUS_ORDER = ['Packed', 'Shipped', 'On Way', 'Delivered'];

function formatDateTime(value) {
  if (!value) return '';
  const dt = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleString();
}

export default function Timeline({ updates }) {
  const normalized = useMemo(() => {
    const arr = Array.isArray(updates) ? updates : [];
    return [...arr].sort((a, b) => {
      const atRaw = new Date(a.update_time).getTime();
      const btRaw = new Date(b.update_time).getTime();
      const at = Number.isNaN(atRaw) ? 0 : atRaw;
      const bt = Number.isNaN(btRaw) ? 0 : btRaw;
      return at - bt;
    });
  }, [updates]);

  const byStatus = useMemo(() => {
    const map = new Map();
    for (const u of normalized) {
      const status = u.status_at_time;
      if (!STATUS_ORDER.includes(status)) continue;
      const existing = map.get(status) || [];
      existing.push(u);
      map.set(status, existing);
    }
    return map;
  }, [normalized]);

  if (normalized.length === 0) {
    return <div className="timelineEmpty">No tracking updates found.</div>;
  }

  return (
    <ol className="timeline">
      {STATUS_ORDER.map((status) => {
        const items = byStatus.get(status) || [];
        if (items.length === 0) return null;

        const latest = items[items.length - 1];
        const isDelivered = status === 'Delivered';

        return (
          <li key={status} className={`timelineItem ${isDelivered ? 'done' : 'inProgress'}`}>
            <div className="timelineDot" />
            <div className="timelineBody">
              <div className="timelineStatus">{status}</div>
              <div className="timelineMeta">
                <span>{formatDateTime(latest.update_time)}</span>
                {latest.location ? <span className="timelineLocation"> • {latest.location}</span> : null}
              </div>
              {latest.update_description ? (
                <div className="timelineDesc">{latest.update_description}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

