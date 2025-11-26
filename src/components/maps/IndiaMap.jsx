import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { indiaGeoJSON } from '../../data/geoData';
import { states } from '../../data/mockData';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map content component
const MapContent = ({ onEachState }) => {
    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
                data={indiaGeoJSON}
                onEachFeature={onEachState}
            />
        </>
    );
};

const IndiaMap = ({ onStateSelect }) => {
    const [selectedState, setSelectedState] = useState(null);

    const getStateColor = (stateName) => {
        const stateData = states.find(s => s.name === stateName);
        if (!stateData) return '#E5E7EB';

        // Color based on number of projects
        if (stateData.projects > 300) return '#138808';
        if (stateData.projects > 200) return '#FF9933';
        return '#3B82F6';
    };

    const onEachState = (feature, layer) => {
        const stateName = feature.properties.name;
        const stateData = states.find(s => s.name === stateName);

        layer.setStyle({
            fillColor: getStateColor(stateName),
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        });

        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: '#000080',
                    fillOpacity: 0.9
                });
            },
            mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: 'white',
                    fillOpacity: 0.7
                });
            },
            click: (e) => {
                setSelectedState(stateName);
                if (onStateSelect) {
                    onStateSelect(stateName);
                }
            }
        });

        if (stateData) {
            layer.bindPopup(`
        <div style="font-family: var(--font-primary); padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: var(--color-navy); font-size: 16px;">
            ${stateName}
          </h3>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Districts:</strong> ${stateData.districts}
          </p>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Projects:</strong> ${stateData.projects}
          </p>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Fund Allocated:</strong> ₹${(stateData.fundAllocated / 10000000).toFixed(2)} Cr
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: var(--color-primary);">
            Click to view districts →
          </p>
        </div>
      `);
        }
    };

    return (
        <div className="map-container">
            <MapContainer
                center={[22.5, 78.9]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <MapContent onEachState={onEachState} />
            </MapContainer>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: 'var(--space-4)',
                left: 'var(--space-4)',
                backgroundColor: 'var(--bg-primary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 1000
            }}>
                <h4 style={{ margin: '0 0 var(--space-3) 0', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                    Projects by State
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#138808', borderRadius: 'var(--radius-sm)' }} />
                        <span style={{ fontSize: 'var(--text-xs)' }}>300+ projects</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#FF9933', borderRadius: 'var(--radius-sm)' }} />
                        <span style={{ fontSize: 'var(--text-xs)' }}>200-300 projects</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#3B82F6', borderRadius: 'var(--radius-sm)' }} />
                        <span style={{ fontSize: 'var(--text-xs)' }}>&lt;200 projects</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndiaMap;
