export const getVehicleImageUrl = (imageName: string | null | undefined) => {
  if (!imageName) return 'http://localhost:5173/assets/images/default-car.jpg';
  
  // If it's a full URL, return it
  if (imageName.startsWith('http')) return imageName;
  
  // If it starts with a timestamp-like pattern (from our local upload)
  if (/^\d+-/.test(imageName)) {
    return `http://localhost:3000/uploads/${imageName}`;
  }
  
  // Default to public assets on the frontend server
  return `http://localhost:5173/assets/images/${imageName}`;
};
