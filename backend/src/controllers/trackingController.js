const parcelRepo = require('../db/parcelRepo');
const trackingRepo = require('../db/trackingRepo');
const { geocodeLocation } = require('../services/geocode');

function formatEstimatedDelivery(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function formatUpdateTime(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const isoLike = value.replace(' ', 'T');
    const dt = new Date(isoLike);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }
  return value;
}

async function getTracking(req, res) {
  const { tracking_id } = req.params;

  try {
    const parcel = await parcelRepo.getParcelByTrackingId(tracking_id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    const updates = await trackingRepo.getTrackingUpdatesByParcelId(parcel.id);
    const formattedUpdates = updates.map((u) => ({
      ...u,
      update_time: formatUpdateTime(u.update_time),
    }));

    const latest = formattedUpdates[formattedUpdates.length - 1] || null;
    const latestLocationText = latest?.location || null;
    const latestCoords = latestLocationText ? geocodeLocation(latestLocationText) : { lat: 0, lng: 0, source: 'none' };

    res.json({
      parcel: {
        ...parcel,
        estimated_delivery: formatEstimatedDelivery(parcel.estimated_delivery),
      },
      updates: formattedUpdates,
      map: latestCoords.lat !== undefined ? { ...latestCoords, locationText: latestLocationText } : null,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getTracking };

