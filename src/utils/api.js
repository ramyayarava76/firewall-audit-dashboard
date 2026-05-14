// Placeholder for utility functions
export const apiCall = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};
