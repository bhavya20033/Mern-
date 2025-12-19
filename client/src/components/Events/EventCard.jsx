import React from 'react';
import { Link } from 'react-router-dom';
import './Events.css';

const EventCard = ({ event }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const spotsLeft = event.capacity - event.currentAttendees;
  const isAlmostFull = spotsLeft <= event.capacity * 0.2;

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-image">
        <img src={event.imageUrl} alt={event.title} />
        <span className={`category-badge ${event.category.toLowerCase()}`}>
          {event.category}
        </span>
      </div>
      
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-description">
          {event.description.substring(0, 100)}...
        </p>
        
        <div className="event-details">
          <div className="detail-item">
            <span className="icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="detail-item">
            <span className="icon">🕐</span>
            <span>{event.time}</span>
          </div>
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>{event.location}</span>
          </div>
        </div>

        <div className="event-footer">
          <div className={`capacity-info ${isAlmostFull ? 'almost-full' : ''}`}>
            <span className="icon">👥</span>
            <span>{spotsLeft} spots left</span>
          </div>
          <span className="view-details">View Details →</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
