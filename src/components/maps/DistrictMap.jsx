import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { maharashtraDistrictsGeoJSON } from '../../data/geoData';
import { districts, mockProjects } from '../../data/mockData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DistrictMap = ({ state = 'Maharashtra', onDistrictSelect }) => {
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [showProjects, setShowProjects] = useState(true);

    const districtData = districts[state] || [];
    const stateProjects = mockProjects.filter(p => p.state === state);

    const getDistrictColor = (districtName) => {
        const district = districtData.find(d => d.name === districtName);
        if (!district) return '#E5E7EB';

        // Color based on progress
        if (district.progress >= 70) return '#10B981';
        if (district.progress >= 50) return '#F59E0B';
        return '#EF4444';
    };

    const onEachDistrict = (feature, layer) => {
        const districtName = feature.properties.name;
        const district = districtData.find(d => d.name === districtName);

        layer.setStyle({
            fillColor: getDistrictColor(districtName),
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.6
        });

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({
                    weight: 3,
                    color: '#000080',
                    fillOpacity: 0.8
                });
            },
            mouseout: (e) => {
                e.target.setStyle({
                    weight: 2,
                    color: 'white',
                    fillOpacity: 0.6
                });
            },
            click: (e) => {
                setSelectedDistrict(districtName);
                if (onDistrictSelect) {
                    onDistrictSelect(districtName);
                }
            }
        });

        if (district) {
            layer.bindPopup(`
        <div style="font-family: var(--font-primary); padding: 8px;">
          <h3 style="margin: 0 0 8px 0; color: var(--color-navy); font-size: 16px;">
            ${districtName} District
          </h3>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Projects:</strong> ${district.projects}
          </p>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Progress:</strong> ${district.progress}%
          </p>
          <p style="margin: 4px 0; font-size: 14px;">
            <strong>Fund Allocated:</strong> ₹${(district.fundAllocated / 10000000).toFixed(2)} Cr
          </p>
        </div>
      `);
        }
    };

    // Create custom icons for different project types
    const getProjectIcon = (component) => {
        const colors = {
            'Adarsh Gram': '#FF9933',
            'GIA (Grant-in-Aid)': '#138808',
            'Hostel': '#000080'
        };

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
        background-color: ${colors[component] || '#3B82F6'};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
    };

    return (
        <div className="map-container">
            <MapContainer
                center={[18.5204, 73.8567]}
                zoom={8}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <GeoJSON
                    data={maharashtraDistrictsGeoJSON}
                    onEachFeature={onEachDistrict}
                />

                {/* Project Markers */}
                {showProjects && stateProjects.map(project => (
                    <Marker
                        key={project.id}
                        position={project.coordinates}
                        icon={getProjectIcon(project.component)}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'var(--font-primary)', minWidth: '250px' }}>
                                <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-navy)', fontSize: '14px' }}>
                                    {project.name}
                                </h3>
                                <div style={{ fontSize: '12px' }}>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Component:</strong> {project.component}
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Status:</strong>
                                        <span className={`badge badge-${project.status.toLowerCase()}`} style={{ marginLeft: '4px' }}>
                                            {project.status}
                                        </span>
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Progress:</strong> {project.progress}%
                                    </p>
                                    <div className="progress-bar" style={{ margin: '8px 0' }}>
                                        <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Fund Allocated:</strong> ₹{(project.fundAllocated / 100000).toFixed(2)} L
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Department:</strong> {project.department}
                                    </p>
                                    <p style={{ margin: '4px 0' }}>
                                        <strong>Agency:</strong> {project.agency}
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                        Last Updated: {project.lastUpdate}
                                    </p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                backgroundColor: 'var(--bg-primary)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 1000
            }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={showProjects}
                        onChange={(e) => setShowProjects(e.target.checked)}
                    />
                    <span style={{ fontSize: 'var(--text-sm)' }}>Show Projects</span>
                </label>
            </div>

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
                    Legend
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div>
                        <strong style={{ fontSize: 'var(--text-xs)', display: 'block', marginBottom: 'var(--space-2)' }}>
                            District Progress
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#10B981', borderRadius: 'var(--radius-sm)' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>≥70%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#F59E0B', borderRadius: 'var(--radius-sm)' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>50-70%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{ width: '20px', height: '20px', backgroundColor: '#EF4444', borderRadius: 'var(--radius-sm)' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>&lt;50%</span>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-3)' }}>
                        <strong style={{ fontSize: 'var(--text-xs)', display: 'block', marginBottom: 'var(--space-2)' }}>
                            Project Types
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#FF9933', borderRadius: '50%', border: '2px solid white' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>Adarsh Gram</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#138808', borderRadius: '50%', border: '2px solid white' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>GIA</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: '#000080', borderRadius: '50%', border: '2px solid white' }} />
                            <span style={{ fontSize: 'var(--text-xs)' }}>Hostel</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistrictMap;
