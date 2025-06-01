import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '200px',
  borderRadius: '8px'
};

const Map = ({ coordinates, isStatic = false, onClick }) => {
  if (!coordinates?.lat || !coordinates?.lng) {
    return (
      <div 
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666'
        }}
      >
        No location data available
      </div>
    );
  }

  const center = {
    lat: coordinates.lat,
    lng: coordinates.lng
  };

  const options = {
    disableDefaultUI: isStatic,
    zoomControl: !isStatic,
    scrollwheel: !isStatic,
    draggable: !isStatic,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={options}
        onClick={onClick}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map; 