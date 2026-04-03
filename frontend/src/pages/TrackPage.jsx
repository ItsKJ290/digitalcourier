import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrackingResult from '../components/TrackingResult.jsx';

export default function TrackPage() {
  const { tracking_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/track/${encodeURIComponent(tracking_id)}`);
        const payload = await res.json();
        if (!alive) return;
        if (!res.ok) {
          setError(payload?.message || 'Parcel not found');
          setData(null);
          return;
        }
        setData(payload);
      } catch (err) {
        if (!alive) return;
        setError('Network error. Is the backend running?');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [tracking_id]);

  if (loading) return <div className="page" style={{ paddingTop: 24 }}>Loading...</div>;

  return (
    <div className="page">
      {error ? (
        <div className="resultCard" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="status error" role="alert">
            {error}
          </div>
        </div>
      ) : data ? (
        <TrackingResult data={data} />
      ) : null}
    </div>
  );
}

