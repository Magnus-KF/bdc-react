import React from 'react';
import '../styles/mtg-theme.css';

const EventPoster = ({ title, date, description, location }) => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mtg-card">
      <h2 className="mtg-title">{title}</h2>
      <div className="mtg-text">{formatDate(date)}</div>
      <p className="mtg-description">{description}</p>
      <div className="mtg-text">
        <strong className="mtg-label">Location: </strong>
        <span>{location}</span>
      </div>
      <button className="mtg-button">
        Add to Calendar
      </button>
    </div>
  );
};

export default EventPoster;