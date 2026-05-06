import React from 'react';
import IsometricDeckSifter from './IsometricDeckSifter';

const Premium2DIsometricDepthCarousel = ({ suggestedConnections, onConnect, onRemove }) => {
  return (
    <div className="premium-2d-carousel-section">
      <IsometricDeckSifter 
        connections={suggestedConnections} 
        onConnect={onConnect} 
        onRemove={onRemove} 
      />
    </div>
  );
};

export default Premium2DIsometricDepthCarousel;
