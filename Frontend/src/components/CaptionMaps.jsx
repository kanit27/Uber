import React from 'react';

const CaptionMaps = () => {
    return (
        <div style={{ width: '100%', height: '400px', position: 'relative' }}>
            <iframe
                title="Simple Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=100.5018%2C13.7563%2C100.6018%2C13.8563&layer=mapnik"
                allowFullScreen
            ></iframe>
            <div style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                background: 'rgba(255,255,255,0.8)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px'
            }}>
                Simple Map Display (Bangkok Area)
            </div>
        </div>
    );
};

export default CaptionMaps;