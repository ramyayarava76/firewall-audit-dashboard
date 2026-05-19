const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Upload a firewall log file to the backend.
 * @param {File} file - The file to upload.
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { data: null, error: errorText || `Server error: ${response.status}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { data: null, error: 'Network error. Please check your connection.' };
  }
};

/**
 * Generic GET request helper.
 * @param {string} endpoint - API endpoint (e.g. '/api/results').
 * @returns {Promise<{data: any, error: string|null}>}
 */
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      return { data: null, error: `Server error: ${response.status}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API error:', error);
    return { data: null, error: 'Network error. Please check your connection.' };
  }
};
