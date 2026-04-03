import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await api.get('/api/dashboard/parcels');
        if (!alive) return;
        setParcels(res.data.parcels || []);
      } catch (err) {
        if (!alive) return;
        setError(err?.response?.data?.message || 'Failed to load parcels');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="page" style={{ paddingTop: 24 }}>Loading...</div>;

  return (
    <div className="page">
      <div className="resultCard">
        <div className="resultHeader" style={{ alignItems: 'center' }}>
          <div>
            <div className="resultTitle">My Parcels</div>
            <div className="metaLine" style={{ margin: 0 }}>
              <span className="metaLabel">Total:</span>
              <span className="metaValue">{parcels.length}</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="status error" role="alert" style={{ marginTop: 10 }}>
            {error}
          </div>
        ) : null}

        {parcels.length === 0 ? (
          <div className="timelineEmpty" style={{ marginTop: 12 }}>
            No parcels assigned to your account yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
            {parcels.map((p) => (
              <Link
                key={p.id}
                to={`/dashboard/track/${encodeURIComponent(p.tracking_id)}`}
                className="parcelLink"
              >
                <div className="parcelLinkTop">
                  <div className="parcelTracking">{p.tracking_id}</div>
                  <div className="parcelStatus">{p.current_status}</div>
                </div>
                <div className="parcelMeta">
                  <span>{p.receiver_name ? `To: ${p.receiver_name}` : ''}</span>
                  <span>{p.destination ? ` • ${p.destination}` : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

