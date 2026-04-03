const pool = require('./pool');

const VALID_STATUSES = ['Packed', 'Shipped', 'On Way', 'Delivered'];

async function createParcel({
  tracking_id,
  sender_id = null,
  receiver_name,
  destination,
  current_status = 'Packed',
  estimated_delivery = null,
}) {
  const [result] = await pool.execute(
    `INSERT INTO parcels
      (tracking_id, sender_id, receiver_name, destination, current_status, estimated_delivery)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [tracking_id, sender_id, receiver_name, destination, current_status, estimated_delivery]
  );

  const [rows] = await pool.execute('SELECT * FROM parcels WHERE id = ?', [result.insertId]);
  return rows[0] || null;
}

async function getParcelByTrackingId(tracking_id) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      tracking_id,
      sender_id,
      receiver_name,
      destination,
      current_status,
      estimated_delivery
     FROM parcels
     WHERE tracking_id = ? LIMIT 1`,
    [tracking_id]
  );
  return rows[0] || null;
}

async function getParcelById(parcel_id) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      tracking_id,
      sender_id,
      receiver_name,
      destination,
      current_status,
      estimated_delivery
     FROM parcels
     WHERE id = ? LIMIT 1`,
    [parcel_id]
  );
  return rows[0] || null;
}

async function listParcelsBySenderId(sender_id) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      tracking_id,
      sender_id,
      receiver_name,
      destination,
      current_status,
      estimated_delivery,
      created_at
     FROM parcels
     WHERE sender_id = ?
     ORDER BY created_at DESC`,
    [sender_id]
  );
  return rows;
}

async function listValidStatuses() {
  return VALID_STATUSES.slice();
}

async function setCurrentStatus(parcel_id, status) {
  const [result] = await pool.execute('UPDATE parcels SET current_status = ? WHERE id = ?', [status, parcel_id]);
  return result.affectedRows;
}

module.exports = {
  createParcel,
  getParcelByTrackingId,
  getParcelById,
  listParcelsBySenderId,
  setCurrentStatus,
  listValidStatuses,
};

