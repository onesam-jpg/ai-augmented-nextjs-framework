/**
 * Google Maps Distance Matrix API Service
 * Calculates travel time and distance between locations
 */

import { Client } from "@googlemaps/google-maps-services-js";

const mapsClient = new Client({});

/**
 * Calculate travel time between two locations
 * @param {string} origin - Starting location (address or place name)
 * @param {string} destination - Ending location (address or place name)
 * @param {string} mode - Travel mode: 'driving', 'walking', 'bicycling', 'transit'
 * @returns {Promise<{duration: number, distance: number, durationText: string, distanceText: string}>}
 */
export async function calculateTravelTime(origin, destination, mode = 'driving') {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  if (!origin || !destination) {
    return null;
  }

  try {
    const response = await mapsClient.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        mode: mode,
        key: process.env.GOOGLE_MAPS_API_KEY,
        departure_time: 'now' // Use current traffic conditions
      }
    });

    const result = response.data.rows[0]?.elements[0];

    if (!result || result.status !== 'OK') {
      console.warn('Distance Matrix API error:', result?.status);
      return null;
    }

    return {
      duration: result.duration.value, // in seconds
      distance: result.distance.value, // in meters
      durationText: result.duration.text, // e.g., "15 mins"
      distanceText: result.distance.text, // e.g., "5.2 km"
      durationInTraffic: result.duration_in_traffic?.value || result.duration.value
    };
  } catch (error) {
    console.error('Error calculating travel time:', error.message);
    return null;
  }
}

/**
 * Get Google Maps link for directions
 * @param {string} origin - Starting location
 * @param {string} destination - Ending location
 * @returns {string} Google Maps URL
 */
export function getDirectionsLink(origin, destination) {
  const originEncoded = encodeURIComponent(origin);
  const destEncoded = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${destEncoded}`;
}

/**
 * Geocode an address to get coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number, formattedAddress: string}>}
 */
export async function geocodeAddress(address) {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  try {
    const response = await mapsClient.geocode({
      params: {
        address: address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    const result = response.data.results[0];

    if (!result) {
      return null;
    }

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address
    };
  } catch (error) {
    console.error('Error geocoding address:', error.message);
    return null;
  }
}

/**
 * Add travel buffer time to a task start time
 * @param {Date} taskStartTime - When the task is scheduled
 * @param {number} travelDurationSeconds - Travel time in seconds
 * @returns {Date} Adjusted start time accounting for travel
 */
export function adjustTaskStartTime(taskStartTime, travelDurationSeconds) {
  const adjustedTime = new Date(taskStartTime);
  adjustedTime.setSeconds(adjustedTime.getSeconds() - travelDurationSeconds);
  return adjustedTime;
}

/**
 * Format travel time for display
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "15 min", "1 hr 30 min")
 */
export function formatTravelDuration(seconds) {
  if (!seconds || seconds === 0) return '0 min';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  }

  return `${minutes} min`;
}
