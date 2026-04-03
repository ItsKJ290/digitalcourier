const parcelRepo = require('../db/parcelRepo');

async function listMyParcels(req, res) {
  const sender_id = req.user.id;

  try {
    const parcels = await parcelRepo.listParcelsBySenderId(sender_id);
    return res.json({ parcels });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listMyParcels };

