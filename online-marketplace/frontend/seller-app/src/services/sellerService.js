import axios from "axios";

const API_URL = "http://localhost:3000/api/seller";

const getConfig = () => {
  const token =
    localStorage.getItem("token") ||
    document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  // Some setups store in localStorage, others in cookies.
  // Assuming localStorage for simplicity if auth context does so, or cookie if browser handles it automatically.
  // If using httpOnly cookies, we don't need to send header manually usually.
  // But axios needs 'withCredentials: true' for cookies.
  return {
    withCredentials: true,
    headers: {
      // 'Authorization': \`Bearer \${token}\` // Uncomment if using Bearer tokens
    },
  };
};

const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, getConfig());
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await axios.put(
    `${API_URL}/profile`,
    profileData,
    getConfig()
  );
  return response.data;
};

const sellerService = {
  getProfile,
  updateProfile,
};

export default sellerService;
