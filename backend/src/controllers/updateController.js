const parcelRepo = require('../db/parcelRepo');
const trackingRepo = require('../db/trackingRepo');

async function updateParcelStatus(req, res) {
  const {
    parcel_id = null,
    tracking_id = null,
    location,
    update_description = null,
    status_at_time,
    update_time = null,
  } = req.body || {};

  if (!location || !status_at_time) {
    return res.status(400).json({ message: 'location and status_at_time are required' });
  }

  try {
    const validStatuses = await parcelRepo.listValidStatuses();
    if (!validStatuses.includes(status_at_time)) {
      return res.status(400).json({ message: 'Invalid status_at_time value' });
    }

    let parcel = null;
    if (parcel_id) {
      parcel = await parcelRepo.getParcelById(parcel_id);
    } else if (tracking_id) {
      parcel = await parcelRepo.getParcelByTrackingId(tracking_id);
    } else {
      return res.status(400).json({ message: 'parcel_id or tracking_id is required' });
    }

    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    const result = await trackingRepo.addUpdateAndSetParcelStatus({
      parcel_id: parcel.id,
      location,
      update_description,
      status_at_time,
      update_time,
    });

    if (result.affected === 0) return res.status(404).json({ message: 'Parcel not found' });

    return res.status(201).json({
      updateId: result.updateId,
      current_status: status_at_time,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { updateParcelStatus };

