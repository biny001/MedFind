export async function reverseGeocode(lat: string, lon: string) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon}%2C${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
  const response = await fetch(url);
  return response.json();
}
