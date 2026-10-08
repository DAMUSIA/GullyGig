"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";

interface LocationSelectorProps {
  city: string;
  area: string;
  address?: string;
  latitude: number | null;
  longitude: number | null;
  onChange: (fields: {
    city: string;
    area: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
}

/**
 * Renders location fields and lets the user attach the current GPS position.
 *
 * @param city - The selected city
 * @param area - The selected area or locality
 * @param address - The custom full address or landmark
 * @param latitude - The selected latitude
 * @param longitude - The selected longitude
 * @param onChange - Called when any location field changes
 */
export default function LocationSelector({
  city,
  area,
  address = "",
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
        let data;
        let isNominatim = false;
        try {
          try {
            // Attempt Nominatim reverse geocoding with a 3-second timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              { signal: controller.signal },
            );
            clearTimeout(timeoutId);

            if (response.ok) {
              data = await response.json();
              isNominatim = true;
            } else {
              throw new Error("Nominatim status not OK");
            }
          } catch (nominatimErr) {
            console.warn(
              "Nominatim reverse geocode failed, attempting BigDataCloud fallback...",
              nominatimErr,
            );
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
              );
              if (response.ok) {
                data = await response.json();
              } else {
                throw new Error("BigDataCloud status not OK");
              }
            } catch (bdcErr) {
              console.error("All reverse geocoding services failed:", bdcErr);
            }
          }

          if (data) {
            let cityName = "";
            let areaName = "";
            let fullAddress = "";

            if (isNominatim && data.address) {
              const addr = data.address;
              areaName =
                addr.neighbourhood ||
                addr.suburb ||
                addr.village ||
                addr.residential ||
                addr.subdistrict ||
                "";
              cityName =
                addr.city ||
                addr.town ||
                addr.city_district ||
                addr.state_district ||
                addr.county ||
                "";
              fullAddress = data.display_name || "";
            } else if (data.locality !== undefined) {
              cityName = data.city || data.locality || "";
              const informative = data.localityInfo?.informative || [];
              const areaItem = informative.find(
                (i: { name: string; description?: string }) =>
                  [
                    "suburb",
                    "neighbourhood",
                    "subdistrict",
                    "locality",
                  ].includes(i.description?.toLowerCase() || ""),
              );
              areaName = areaItem?.name || data.locality || "";
              fullAddress = `${areaName}, ${cityName}`;
            }

            onChange({
              city: cityName || city,
              area: areaName || area,
              address: address || fullAddress,
              latitude: lat,
              longitude: lon,
            });
          } else {
            // Fallback if address object is missing
            onChange({
              city: city || "Unknown City",
              area: area || "Detected Location",
              address,
              latitude: lat,
              longitude: lon,
            });
          }
        } catch (err) {
          console.error("GPS Reverse Geocoding Error:", err);
          setLocateError(
            "Could not retrieve area details. Please enter manually.",
          );
          // Update lat/lon anyway so at least they are saved
          onChange({
            city,
            area,
            address,
            latitude: lat,
            longitude: lon,
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(
          "GPS Coordinates Error:",
          error?.message || error?.code || String(error),
        );
        let errorMsg = "Failed to fetch coordinates. Please fill manually.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            "Location permission denied or disabled by permissions policy. Please fill manually.";
        } else if (error.message) {
          errorMsg = `${error.message} Please fill manually.`;
        }
        setLocateError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <label className="block text-sm font-bold text-slate-800">
            Location &amp; Address <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter your city, locality, and custom address or service coverage area freely.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100/80 active:bg-blue-100 disabled:opacity-50 text-blue-600 text-xs font-bold rounded-xl transition-all border border-blue-150 cursor-pointer active:scale-98 shadow-xs shrink-0"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <Navigation className="h-3.5 w-3.5 fill-blue-600/10" />
              <span>Use GPS Location</span>
            </>
          )}
        </button>
      </div>

      {locateError && (
        <p className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 animate-in fade-in duration-200 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{locateError}</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">
            City / Town <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={city}
              onChange={(e) =>
                onChange({ city: e.target.value, area, address, latitude, longitude })
              }
              placeholder="e.g. Navi Mumbai, Delhi, Bengaluru..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        {/* Area Input */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">
            Area / Locality / Sector{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={area}
              onChange={(e) =>
                onChange({ city, area: e.target.value, address, latitude, longitude })
              }
              placeholder="e.g. Nerul, Koramangala, Sector 15..."
              className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Custom Full Address / Street / Landmark */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-600">
          Full Address / Landmark / Office / Coaching Center{" "}
          <span className="text-slate-400 font-normal">(Optional - Manual custom address)</span>
        </label>
        <textarea
          value={address}
          onChange={(e) =>
            onChange({ city, area, address: e.target.value, latitude, longitude })
          }
          rows={2}
          placeholder="e.g. Flat 302, Sunshine Arcade, Opposite City Mall, Near Metro Station, or Online / Pan-India"
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none"
        />
      </div>

      {latitude && longitude && (
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1 w-max border border-slate-100">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          <span>
            Coordinates attached: {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        </div>
      )}
    </div>
  );
}
