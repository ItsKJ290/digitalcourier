const pool = require('./pool');

async function getTrackingUpdatesByParcelId(parcel_id) {
  const [rows] = await pool.execute(
    `SELECT
      id,
      parcel_id,
      location,
      update_description,
      status_at_time,
      update_time
     FROM tracking_updates
     WHERE parcel_id = ?
     ORDER BY update_time ASC, id ASC`,
    [parcel_id]
  );
  return rows;
}

async function addUpdateAndSetParcelStatus({
  parcel_id,
  location,
  update_description = null,
  status_at_time,
  update_time = null,
}) {
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
      return { affected: 0 };
    }

    await conn.commit();
    return { affected: 1, updateId: insertResult.insertId };
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {
      // ignore rollback errors
    }
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  getTrackingUpdatesByParcelId,
  addUpdateAndSetParcelStatus,
};

