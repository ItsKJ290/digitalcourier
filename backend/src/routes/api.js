const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

const VALID_STATUSES = new Set(['Packed', 'Shipped', 'On Way', 'Delivered']);

function formatEstimatedDelivery(value) {
  if (!value) return null;
  // mysql2 may return DATE as string (YYYY-MM-DD) or Date depending on config.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

function formatUpdateTime(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    // MySQL TIMESTAMP often comes as: "YYYY-MM-DD HH:mm:ss"
    const isoLike = value.replace(' ', 'T');
    const dt = new Date(isoLike);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }
  return value;
}

router.get('/track/:tracking_id', async (req, res) => {
  const { tracking_id } = req.params;

  try {
    const [parcelRows] = await pool.execute(
      `SELECT
        id,
        tracking_id,
        sender_id,
        receiver_name,
        destination,
        current_status,
        estimated_delivery
      FROM parcels
      WHERE tracking_id = ?`,
      [tracking_id]
    );

    if (parcelRows.length === 0) {
      return res.status(404).json({ message: 'Parcel not found' });
    }

    const parcel = parcelRows[0];

    const [updateRows] = await pool.execute(
      `SELECT
        id,
        location,
        update_description,
        status_at_time,
        update_time
      FROM tracking_updates
      WHERE parcel_id = ?
      ORDER BY update_time ASC, id ASC`,
      [parcel.id]
    );

    const updates = updateRows.map((u) => ({
      ...u,
      update_time: formatUpdateTime(u.update_time),
    }));

    res.json({
      parcel: {
        ...parcel,
        estimated_delivery: formatEstimatedDelivery(parcel.estimated_delivery),
      },
      updates,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/parcels', async (req, res) => {
  const {
    tracking_id,
    sender_id = null,
    receiver_name,
    destination,
    current_status = 'Packed',
    estimated_delivery = null,
  } = req.body || {};

  if (!tracking_id || !receiver_name || !destination) {
    return res
      .status(400)
      .json({ message: 'tracking_id, receiver_name, and destination are required' });
  }

  if (current_status && !VALID_STATUSES.has(current_status)) {
    return res.status(400).json({ message: 'Invalid current_status value' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO parcels
        (tracking_id, sender_id, receiver_name, destination, current_status, estimated_delivery)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        tracking_id,
        sender_id,
        receiver_name,
        destination,
        current_status,
        estimated_delivery,
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM parcels WHERE id = ?', [result.insertId]);
    const parcel = rows[0];

    res.status(201).json({
      parcel: {
        ...parcel,
        estimated_delivery: formatEstimatedDelivery(parcel.estimated_delivery),
      },
    });
  } catch (err) {
    // e.g. duplicate tracking_id (unique constraint)
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/updates', async (req, res) => {
  const {
    parcel_id,
    location,
    update_description = null,
    status_at_time,
    update_time = null,
  } = req.body || {};

  if (!parcel_id || !location || !status_at_time) {
    return res
      .status(400)
      .json({ message: 'parcel_id, location, and status_at_time are required' });
  }

  if (!VALID_STATUSES.has(status_at_time)) {
    return res.status(400).json({ message: 'Invalid status_at_time value' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let insertSql =
      'INSERT INTO tracking_updates (parcel_id, location, update_description, status_at_time';
    let insertParams = [parcel_id, location, update_description, status_at_time];

    if (update_time) {
      insertSql += ', update_time)';
      insertSql += ' VALUES (?, ?, ?, ?, ?)';
      insertParams = [parcel_id, location, update_description, status_at_time, update_time];
    } else {
      insertSql += ') VALUES (?, ?, ?, ?)';
    }

    const [insertResult] = await conn.execute(insertSql, insertParams);

    const [updateResult] = await conn.execute('UPDATE parcels SET current_status = ? WHERE id = ?', [
      status_at_time,
      parcel_id,
    ]);

    if (updateResult.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Parcel not found' });
    }

    await conn.commit();

    res.status(201).json({
      updateId: insertResult.insertId,
      current_status: status_at_time,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {
      // ignore rollback errors
    }
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;

