import Timeline from './Timeline.jsx';
import LocationMap from './LocationMap.jsx';

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

export default function TrackingResult({ data }) {
  const parcel = data?.parcel;
  const updates = data?.updates || [];
  const map = data?.map || null;

  if (!parcel) return null;

  return (
    <section className="resultCard">
      <div className="resultHeader">
        <div>
          <div className="resultTitle">Tracking Result</div>
          <div className="metaLine">
            <span className="metaLabel">Tracking ID:</span>
            <span className="metaValue">{safeString(parcel.tracking_id)}</span>
          </div>
          <div className="metaLine">
            <span className="metaLabel">Current status:</span>
            <span className="metaValue">{safeString(parcel.current_status)}</span>
          </div>
          {parcel.estimated_delivery ? (
            <div className="metaLine">
              <span className="metaLabel">Estimated delivery:</span>
              <span className="metaValue">{safeString(parcel.estimated_delivery)}</span>
            </div>
          ) : null}
        </div>

        <div className="parcelBox">
          <div className="metaLine">
            <span className="metaLabel">Receiver:</span>
            <span className="metaValue">{safeString(parcel.receiver_name)}</span>
          </div>
          <div className="metaLine">
            <span className="metaLabel">Destination:</span>
            <span className="metaValue">{safeString(parcel.destination)}</span>
          </div>
        </div>
      </div>

      <div className="timelineSection">
        <div className="timelineTitle">Delivery timeline</div>
        <Timeline updates={updates} />
      </div>

      {map ? (
        <div className="timelineSection">
          <div className="timelineTitle">Current Location Map</div>
          <LocationMap map={map} />
        </div>
      ) : null}
    </section>
  );
}

