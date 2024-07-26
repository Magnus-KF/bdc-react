import React from 'react';
import '../styles/EventPoster.css';

const EventPoster = ({ title, date, description, location }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="event-poster">
      <div className="event-poster-content">
        <div className="event-date">{formatDate(date)}</div>
        <h2 className="event-title">{title}</h2>
        <p className="event-description">{description}</p>
        <div className="event-location">
          <span className="event-location-label">Location: </span>
          <span>{location}</span>
        </div>
        <button className="event-button" type="button">
          Legg til i kalender
        </button>
      </div>
    </div>
  );
};

export default EventPoster;