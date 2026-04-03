const parcelRepo = require('../db/parcelRepo');

async function createParcel(req, res) {
  const {
    tracking_id,
    sender_id = null,
    receiver_name,
    destination,
    current_status = 'Packed',
    estimated_delivery = null,
  } = req.body || {};

  if (!tracking_id || !receiver_name || !destination) {
    return res.status(400).json({ message: 'tracking_id, receiver_name, and destination are required' });
  }

  const validStatuses = await parcelRepo.listValidStatuses();
  if (current_status && !validStatuses.includes(current_status)) {
    return res.status(400).json({ message: 'Invalid current_status value' });
  }

  try {
    const parcel = await parcelRepo.createParcel({
      tracking_id,
      sender_id,
      receiver_name,
      destination,
      current_status,
      estimated_delivery,
    });

    return res.status(201).json({ parcel });
  } catch (err) {
    // Unique constraint on tracking_id
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createParcel };

