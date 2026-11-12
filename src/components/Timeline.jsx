
function Timeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="timeline-empty">
        <p>Nu există evenimente în cronologia acestui caz.</p>
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) =>
    a.time.localeCompare(b.time)
  );

  return (
    <div className="timeline">
      {sortedEvents.map((event) => (
        <div className="timeline-item" key={event.id}>
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <span className="timeline-time">{event.time}</span>
            <p>{event.event}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
