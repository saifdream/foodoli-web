import React, {useRef, useEffect, useState, memo} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    mapContainer: {
        // position: 'absolute',
        // top: 0,
        // right: 0,
        // left: 0,
        // bottom: 0,
        height: 400,
        width: 'auto',
    },
    sidebar: {
        backgroundColor: 'rgba(35, 55, 75, 0.9)',
        color: '#ffffff',
        padding: '6px 12px',
        font: '15px/24px monospace',
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        margin: '12px',
        borderRadius: '4px',
    }
}));

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken = 'pk.eyJ1IjoicmVzdGF1cmFudGFwcCIsImEiOiJuVzJzUFNVIn0.MJem7NMlFcpN4pywxung8w';

const Map = memo(
    ({restaurant}) => {
        const classes = useStyles();
        const mapContainer = useRef();
        const [lng, setLng] = useState(restaurant?.lng);
        const [lat, setLat] = useState(restaurant?.lat);
        const [zoom, setZoom] = useState(16);

        useEffect(() => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });

            new mapboxgl.Marker({color: '#00a651'})
                .setLngLat([lng, lat])
                .addTo(map);

            map.on('move', () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });

            return () => map.remove();
        }, []);

        return (
            <div>
                <div className={classes.sidebar}>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div className={classes.mapContainer} ref={mapContainer}/>
            </div>
        );
    }
);

export default Map;
