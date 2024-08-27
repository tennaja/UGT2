import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
  MarkerF,
} from "@react-google-maps/api";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Icon } from "leaflet";
import markerIcon from "../assets/marker-icon.png";

//default location on map @EGAT
const defaultLocation = { lat: 13.8118140871364, lng: 100.50564502457443 };

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  iconSize: [25, 40],
});

const Map = (props) => {
  const mapRef = useRef(null);
  const {
    isCanZoom = true,
    locationList = [],
    zoom = 13,
    iconType = 1,
    isGotoLatLon = false,
    className = "w-full h-[180px] justify-items-center z-0",
  } = props;

  useEffect(() => {
    if (mapRef.current && isGotoLatLon) {
      mapRef.current.setView(locationList?.[0], zoom);
    }
  }, [locationList]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(locationList?.[0], zoom);
    }
  }, [locationList.length]);

  useEffect(() => {
    // code to run after render goes here
    //for display goto location in info page
    if (mapRef.current && isGotoLatLon) {
      mapRef.current.setView(locationList?.[0], zoom);
    }
  });

  const { isLoaded } = useLoadScript({
    // id: "google-map-script",
    googleMapsApiKey: "AIzaSyDKlZiyK-EwCDdm4yEFAGv_3osfCGaJp8s",
  });

  const getIcon = (index) => {
    // console.log('index',index)
    if (index <= 1) {
      if (iconType === 1) {
        return defaultIcon;
      } else if (iconType === 2) {
        return L.divIcon({
          iconSize: [20, 20],
          iconAnchor: [20 / 2, 20 + 9],
          className: `mymarker border-2 border-solid w-[50px] h-[50px] ${
            index === 0 ? "bg-red-800" : "bg-green-500"
          } `,
          html: "<div></div>",
        });
      }
    } else {
      return L.divIcon({
        iconSize: [20, 20],
        iconAnchor: [20 / 2, 20 + 9],
        className: ``,
        html: "<div></div>",
      });
    }
  };
  const getCenter = () => {
    if (locationList?.length > 0) {
      return locationList?.[0];
    } else {
      return defaultLocation;
    }
  };

  return isLoaded ? (
    <>
      <div className="w-full h-full z-0">
        <div className="flex justify-center">
          <MapContainer
            ref={mapRef}
            attributionControl={false}
            zoomControl={false}
            // center={locationList?.[0]}
            // center={ { lat: 13.7728006, lng: 100.6509764 }}
            center={getCenter()}
            zoom={zoom}
            className={className}
            touchZoom={isCanZoom}
            scrollWheelZoom={isCanZoom}
            doubleClickZoom={isCanZoom}
            // className="w-full h-[450px] justify-items-center"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locationList.length > 0 &&
              locationList?.map((loca, index) => {
                if (loca?.lat != 0 && loca?.lng != 0)
                  return (
                    <Marker
                      key={index}
                      position={[loca?.lat, loca?.lng]}
                      icon={getIcon(index)}
                    >
                      {/* <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup> */}
                    </Marker>
                  );
              })}
          </MapContainer>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default React.memo(Map);
