import { UPLOADS_BASE_URL } from '../config';

export const getVehicleImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/assets/images/default-car.jpg';
  
  // If it's a full URL, return it
  if (imageName.startsWith('http')) return imageName;
  
  // If it starts with a timestamp-like pattern (from our local upload)
  if (/^\d+-/.test(imageName)) {
    return `${UPLOADS_BASE_URL}/${imageName}`;
  }
  
  // Default to public assets on the frontend server
  return `/assets/images/${imageName}`;
};
