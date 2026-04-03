import { useMemo, useState } from 'react';
import TrackingResult from '../components/TrackingResult.jsx';

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const trimmedTrackingId = useMemo(() => trackingId.trim(), [trackingId]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!trimmedTrackingId) {
      setError('Please enter a tracking ID.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(trimmedTrackingId)}`);
      const payload = await res.json();

      if (!res.ok) {
        setError(payload?.message || 'Parcel not found');
        return;
      }

      setResult(payload);
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <h1 className="title">Digital Courier & Parcel Tracking</h1>
        <p className="subtitle">Search by tracking ID to view full delivery history.</p>
      </header>

      <form className="searchForm" onSubmit={onSubmit}>
        <input
          className="searchInput"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter tracking ID (e.g., TRK-RID-999)"
          aria-label="Tracking ID"
        />
        <button className="searchButton" type="submit" disabled={loading}>
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error ? (
        <div className="status error" role="alert">
          {error}
        </div>
      ) : null}

      {result ? <TrackingResult data={result} /> : null}
    </div>
  );
}

