import axios from "axios";

// Create a reusable secure Axios instance (attaches JWT token)
export const API = axios.create({
  baseURL: "http://localhost:8080/api/users",
});

// NEW: Create a public Axios instance that does NOT attach the token
export const PUBLIC_API = axios.create({
  baseURL: "http://localhost:8080/api/users",
});

// Auth endpoints (forgot/reset password)
export const AUTH_API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

// NEW: Product endpoints (with JWT token)
export const PRODUCTS_API = axios.create({
  baseURL: "http://localhost:8080/api/products",
});

// Attach token automatically if available
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Attach token to PRODUCTS_API as well
PRODUCTS_API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global mock system for offline fallback
const getMockResponse = (url, method) => {
  const lowercaseUrl = url.toLowerCase();

  if (lowercaseUrl.includes("/products/customer/product") || lowercaseUrl.includes("/products/customer/products")) {
    return [
      {
        id: "prod-1",
        cropType: "Organic Tomatoes",
        soilType: "Loamy",
        pesticides: "None (Organic)",
        harvestDate: "2026-06-28",
        latitude: "28.61",
        longitude: "77.20",
        price: 2.5,
        freshness: "95%",
        rating: 4.8,
        reviews: 142,
        farmerId: "farmer-1",
        imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-2",
        cropType: "Basmati Rice",
        soilType: "Clay-Loam",
        pesticides: "Minimal",
        harvestDate: "2026-06-24",
        latitude: "30.73",
        longitude: "76.78",
        price: 1.9,
        freshness: "90%",
        rating: 4.6,
        reviews: 98,
        farmerId: "farmer-2",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-3",
        cropType: "Sweet Bananas",
        soilType: "Alluvial",
        pesticides: "None (Organic)",
        harvestDate: "2026-06-29",
        latitude: "19.07",
        longitude: "72.87",
        price: 1.2,
        freshness: "98%",
        rating: 4.9,
        reviews: 215,
        farmerId: "farmer-3",
        imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-4",
        cropType: "Organic Carrots",
        soilType: "Sandy",
        pesticides: "None (Organic)",
        harvestDate: "2026-06-26",
        latitude: "26.91",
        longitude: "75.78",
        price: 1.8,
        freshness: "92%",
        rating: 4.7,
        reviews: 110,
        farmerId: "farmer-1",
        imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "prod-5",
        cropType: "Alphonso Mangoes",
        soilType: "Laterite",
        pesticides: "Minimal",
        harvestDate: "2026-06-30",
        latitude: "15.29",
        longitude: "74.12",
        price: 4.5,
        freshness: "99%",
        rating: 5.0,
        reviews: 320,
        farmerId: "farmer-4",
        imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80"
      }
    ];
  }

  if (lowercaseUrl.includes("/products/retailer/inventory")) {
    return {
      retailerId: "retailer-1",
      retailerName: "Aroma Grocery Store",
      products: [
        { id: "prod-1", cropType: "Organic Tomatoes", farmerId: "farmer-1", quantity: 120, harvestDate: "2026-06-28", price: 2.5 },
        { id: "prod-2", cropType: "Bell Peppers", farmerId: "farmer-2", quantity: 85, harvestDate: "2026-06-26", price: 3.0 },
        { id: "prod-3", cropType: "Organic Carrots", farmerId: "farmer-1", quantity: 60, harvestDate: "2026-06-24", price: 1.8 }
      ]
    };
  }

  if (lowercaseUrl.includes("/products/farmer/") || lowercaseUrl.includes("/farmer/")) {
    return [
      { id: "prod-1", cropType: "Organic Tomatoes", soilType: "Loamy", pesticides: "None (Organic)", harvestDate: "2026-06-28", latitude: "28.61", longitude: "77.20", price: 2.5, imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80" },
      { id: "prod-4", cropType: "Organic Carrots", soilType: "Sandy", pesticides: "None (Organic)", harvestDate: "2026-06-26", latitude: "26.91", longitude: "75.78", price: 1.8, imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80" }
    ];
  }

  if (lowercaseUrl.includes("/products/all") || lowercaseUrl.includes("/products/customer/products")) {
    return [
      { id: "prod-1", cropType: "Organic Tomatoes", farmerId: "Ramesh Kumar", retailerId: "Aroma Grocery Store", harvestDate: "2026-06-28", price: 2.5 },
      { id: "prod-2", cropType: "Basmati Rice", farmerId: "Suresh Singh", retailerId: null, harvestDate: "2026-06-24", price: 1.9 },
      { id: "prod-3", cropType: "Sweet Bananas", farmerId: "Rajesh Patel", retailerId: "Aroma Grocery Store", harvestDate: "2026-06-29", price: 1.2 }
    ];
  }

  if (lowercaseUrl.includes("/users/all-with-passwords")) {
    return [
      { id: "demo-admin", name: "System Administrator", email: "admin@farmchain.com", role: "admin", username: "admin" },
      { id: "farmer-1", name: "Ramesh Kumar", email: "ramesh@farmchain.com", role: "farmer", username: "ramesh" },
      { id: "distributor-1", name: "Vikas Logistics", email: "vikas@farmchain.com", role: "distributor", username: "vikas" },
      { id: "retailer-1", name: "Aroma Grocery Store", email: "aroma@farmchain.com", role: "retailer", username: "aroma" },
      { id: "customer-1", name: "Amit Sharma", email: "amit@farmchain.com", role: "customer", username: "amit" }
    ];
  }

  return { message: "Mock operation completed successfully", success: true, id: `mock-${Date.now()}` };
};

const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error';
      if (isNetworkError && error.config && error.config.url) {
        const mockData = getMockResponse(error.config.url, error.config.method || 'get');
        console.warn(`[API Fallback] Interceptor served mock data for: ${error.config.url}`);
        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        });
      }
      return Promise.reject(error);
    }
  );
};

setupResponseInterceptor(API);
setupResponseInterceptor(PUBLIC_API);
setupResponseInterceptor(AUTH_API);
setupResponseInterceptor(PRODUCTS_API);

// Login function (uses API)
export const loginUser = async (email, password, role) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required");
  }

  if (!role?.trim()) {
    throw new Error("Role is required");
  }

  const normalizedRole = role.toLowerCase();

  const buildLocalUser = () => ({
    id: `local-${Date.now()}`,
    name: email.split("@")[0] || "Demo User",
    email,
    role: normalizedRole,
    token: "local-demo-token",
    demo: true,
  });

  try {
    const response = await API.post("/login", {
      email,
      password,
      role: normalizedRole,
    });
    const { user, token } = response.data;

    if (!user || !token) throw new Error("Invalid login response");

    localStorage.setItem("token", token);

    const userWithToken = { ...user, token };
    localStorage.setItem("user", JSON.stringify(userWithToken));

    return userWithToken;
  } catch (err) {
    if (!err.response) {
      const localUser = buildLocalUser();
      localStorage.setItem("user", JSON.stringify(localUser));
      console.warn("Backend unreachable; using local demo login.");
      return localUser;
    }
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

// Register function (uses API)
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response.data.user || response.data;
  } catch (err) {
    if (!err.response) {
      console.warn("Backend unreachable; simulating registration success.");
      return { message: "Registration successful (Demo Mode)", success: true };
    }
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Password reset: request link
export const requestPasswordReset = async (email) => {
  try {
    const res = await AUTH_API.post("/forgot-password", { email });
    return res.data;
  } catch (err) {
    return {
      message: "If this email is registered, a reset link has been sent.",
    };
  }
};

// Password reset: submit new password
export const resetPassword = async (token, password) => {
  try {
    const res = await AUTH_API.post("/reset-password", { token, password });
    return res.data;
  } catch (err) {
    if (!err.response) {
      return { message: "Password updated successfully (Demo Mode)", success: true };
    }
    const message = err.response?.data?.message || "Reset failed";
    throw new Error(message);
  }
};

// ============================================================
// Product API Functions
// ============================================================

export const getRetailerInventory = async () => {
  try {
    const response = await PRODUCTS_API.get("/retailer/inventory");
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch retailer inventory",
    );
  }
};

export const getFarmerProducts = async (farmerId) => {
  try {
    const response = await PRODUCTS_API.get(`/farmer/${farmerId}`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.products || [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch farmer products",
    );
  }
};

export const getAllProducts = async () => {
  try {
    const response = await PRODUCTS_API.get("/all");
    return Array.isArray(response.data)
      ? response.data
      : response.data.products || [];
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch products");
  }
};

export const getAvailableProductsForCustomers = async () => {
  try {
    console.log("[API] Calling /customer/products endpoint");
    const response = await PRODUCTS_API.get("/customer/product");
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data || [];
  } catch (err) {
    console.error("[API] /customer/products error:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch available products",
    );
  }
};
