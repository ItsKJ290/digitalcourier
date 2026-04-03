import { useEffect, useState } from 'react';
import { api } from '../api/client';

const STATUSES = ['Packed', 'Shipped', 'On Way', 'Delivered'];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  // Add parcel form
  const [trackingId, setTrackingId] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [destination, setDestination] = useState('');
  const [currentStatus, setCurrentStatus] = useState('Packed');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Status update form
  const [updateTrackingId, setUpdateTrackingId] = useState('');
  const [updateStatusAtTime, setUpdateStatusAtTime] = useState('Packed');
  const [updateLocation, setUpdateLocation] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    async function loadUsers() {
      setUsersLoading(true);
      setUsersError('');
      try {
        const res = await api.get('/api/admin/users');
        if (!alive) return;
        setUsers(res.data.users || []);
      } catch (err) {
        if (!alive) return;
        setUsersError(err?.response?.data?.message || 'Failed to load users');
      } finally {
        if (!alive) return;
        setUsersLoading(false);
      }
    }
    loadUsers();
    return () => {
      alive = false;
    };
  }, []);

  async function onAddParcel(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!trackingId.trim()) return setError('tracking_id is required');
    if (!senderId) return setError('Choose a registered sender user');
    if (!receiverName.trim()) return setError('receiver_name is required');
    if (!destination.trim()) return setError('destination is required');

    setSaving(true);
    try {
      const res = await api.post('/api/parcels', {
        tracking_id: trackingId.trim(),
        sender_id: Number(senderId),
        receiver_name: receiverName.trim(),
        destination: destination.trim(),
        current_status: currentStatus,
        estimated_delivery: estimatedDelivery || null,
      });
      setMessage(`Parcel created: ${res.data.parcel?.tracking_id}`);

      // Reset only the tracked fields (keep select populated)
      setTrackingId('');
      setReceiverName('');
      setDestination('');
      setEstimatedDelivery('');
      setCurrentStatus('Packed');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create parcel');
    } finally {
      setSaving(false);
    }
  }

  async function onUpdateStatus(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!updateTrackingId.trim()) return setError('tracking_id is required for status updates');
    if (!updateLocation.trim()) return setError('Current Location is required');

    setSaving(true);
    try {
      await api.post('/api/updates', {
        tracking_id: updateTrackingId.trim(),
        location: updateLocation.trim(),
        update_description: updateDescription.trim() || null,
        status_at_time: updateStatusAtTime,
      });
      setMessage(`Status updated to: ${updateStatusAtTime}`);

      setUpdateDescription('');
      setUpdateLocation('');
      setUpdateStatusAtTime('Packed');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="resultCard">
        <div className="resultHeader">
          <div>
            <div className="resultTitle">Admin Logistics Control</div>
            <div className="subtitle" style={{ marginTop: 6 }}>
              Add parcels and update live delivery status (with tracking history).
            </div>
          </div>
        </div>

        {message ? (
          <div className="status" style={{ color: 'var(--accent-2)', marginTop: 12 }}>
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="status error" role="alert" style={{ marginTop: 12 }}>
            {error}
          </div>
        ) : null}

        <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 16 }}>
            <div className="timelineTitle" style={{ marginBottom: 10 }}>
              Add New Parcels
            </div>

            <form className="form" onSubmit={onAddParcel}>
              <label className="label">Tracking ID</label>
              <input className="input" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />

              <label className="label">Assign to Sender User</label>
              {usersLoading ? (
                <div className="timelineEmpty">Loading users...</div>
              ) : usersError ? (
                <div className="timelineEmpty">{usersError}</div>
              ) : (
                <select
                  className="input"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              )}

              <label className="label">Receiver Name</label>
              <input
                className="input"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />

              <label className="label">Destination</label>
              <input
                className="input"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />

              <label className="label">Initial Status</label>
              <select
                className="input"
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label className="label">Estimated Delivery (YYYY-MM-DD)</label>
              <input
                className="input"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />

              <button className="searchButton" type="submit" disabled={saving || usersLoading}>
                {saving ? 'Saving...' : 'Create Parcel'}
              </button>
            </form>
          </div>

          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 16 }}>
            <div className="timelineTitle" style={{ marginBottom: 10 }}>
              Update Parcel Status
            </div>

            <form className="form" onSubmit={onUpdateStatus}>
              <label className="label">Tracking ID</label>
              <input
                className="input"
                value={updateTrackingId}
                onChange={(e) => setUpdateTrackingId(e.target.value)}
                placeholder="e.g., TRK-RID-999"
              />

              <label className="label">Current Location</label>
              <input
                className="input"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
                placeholder="e.g., Delhi Hub"
              />

              <label className="label">New Status</label>
              <select
                className="input"
                value={updateStatusAtTime}
                onChange={(e) => setUpdateStatusAtTime(e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <label className="label">Update Description (optional)</label>
              <textarea
                className="input"
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                rows={4}
                placeholder="e.g., Parcel is in transit"
              />

              <button className="searchButton" type="submit" disabled={saving}>
                {saving ? 'Updating...' : 'Add Tracking Update'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

