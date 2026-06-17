"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

interface LocationSelectorProps {
  city: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  onChange: (fields: { city: string; area: string; latitude: number | null; longitude: number | null }) => void;
}

export default function LocationSelector({
  city,
  area,
  latitude,
  longitude,
  onChange,
}: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocateError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        try {
          // Fetch reverse geocoding from OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          
          if (!response.ok) throw new Error("Failed to fetch address details");
          
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            
            // Extract area name (neighbourhood, suburb, village, residential, etc.)
            const areaName =
              addr.neighbourhood ||
              addr.suburb ||
              addr.village ||
              addr.residential ||
              addr.subdistrict ||
              "";
              
            // Extract city/town name
            const cityName =
              addr.city ||
              addr.town ||
              addr.city_district ||
              addr.state_district ||
              addr.county ||
              "";

            onChange({
              city: cityName || city,
              area: areaName,
              latitude: lat,
              longitude: lon,
            });
          } else {
            // Fallback if address object is missing
            onChange({
              city: city || "Unknown City",
              area: "Detected Location",
              latitude: lat,
              longitude: lon,
            });
          }
        } catch (err) {
          console.error("GPS Reverse Geocoding Error:", err);
          setLocateError("Could not retrieve area details. Please enter manually.");
          // Update lat/lon anyway so at least they are saved
          onChange({
            city,
            area,
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("GPS Coordinates Error:", error);
        let errorMsg = "Failed to fetch coordinates. Please fill manually.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please search or fill manually.";
        }
        setLocateError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <label className="block text-sm font-semibold text-slate-700">
          Location <span className="text-red-500">*</span>
        </label>
        
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100/80 active:bg-blue-100 disabled:opacity-50 text-blue-600 text-xs font-bold rounded-xl transition-all border border-blue-150 cursor-pointer active:scale-98 shadow-xs"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <Navigation className="h-3.5 w-3.5 fill-blue-600/10" />
              <span>Use Current Location</span>
            </>
          )}
        </button>
      </div>

      {locateError && (
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 animate-in fade-in duration-200">
          ⚠️ {locateError}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={city}
              onChange={(e) => onChange({ city: e.target.value, area, latitude, longitude })}
              placeholder="e.g. Navi Mumbai"
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Area Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">
            Area / Locality <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={area}
              onChange={(e) => onChange({ city, area: e.target.value, latitude, longitude })}
              placeholder="e.g. Nerul"
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {latitude && longitude && (
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1 w-max border border-slate-100">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>Coordinates attached: {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
        </div>
      )}
    </div>
  );
}
