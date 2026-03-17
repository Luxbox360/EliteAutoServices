import { UPLOADS_BASE_URL } from '../config';

export const getVehicleImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return '/assets/images/default-car.jpg';
  
  // If it's a full URL, return it
  if (imageName.startsWith('http')) return imageName;
  
  // If it starts with a timestamp-like pattern (from our local upload)
  // Our filenames look like: 1773646192856-68601887.jpg
  if (/^\d+-/.test(imageName)) {
    return `${UPLOADS_BASE_URL}/${imageName}`;
  }
  
  // Default to public assets on the current origin
  return `/assets/images/${imageName}`;
};
