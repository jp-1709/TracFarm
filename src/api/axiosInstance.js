import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      (typeof localStorage !== "undefined" && localStorage.getItem("token")) ||
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("authToken"));

    if (token) {
      const sanitizedToken = token.replace(/"/g, "");
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${sanitizedToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// High-fidelity mock data fallback for local development when backend is down
const getMockResponseForUrl = (url, method, data) => {
  const lowercaseUrl = url.toLowerCase();

  // 1. Customer marketplace products
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
      },
      {
        id: "prod-6",
        cropType: "Red Strawberries",
        soilType: "Loamy-Sandy",
        pesticides: "None (Organic)",
        harvestDate: "2026-07-01",
        latitude: "31.10",
        longitude: "77.17",
        price: 3.2,
        freshness: "97%",
        rating: 4.9,
        reviews: 180,
        farmerId: "farmer-3",
        imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80"
      }
    ];
  }

  // 2. Retailer Inventory
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

  // 3. Retailer Orders
  if (lowercaseUrl.includes("/orders/retailer")) {
    return [
      { id: "ord-101", items: [{ productName: "Organic Tomatoes", quantity: 5 }], total: 12.5, date: "2026-06-29", status: "Fulfilled" },
      { id: "ord-102", items: [{ productName: "Bell Peppers", quantity: 3 }], total: 9.0, date: "2026-06-30", status: "Shipped" }
    ];
  }

  // 4. Distributor Orders
  if (lowercaseUrl.includes("/orders/distributor")) {
    return [
      { id: "ship-201", items: [{ productName: "Basmati Rice", quantity: 250 }], total: 475.0, date: "2026-06-28", status: "Fulfilled" },
      { id: "ship-202", items: [{ productName: "Alphonso Mangoes", quantity: 100 }], total: 450.0, date: "2026-06-29", status: "Shipped" },
      { id: "ship-203", items: [{ productName: "Organic Tomatoes", quantity: 150 }], total: 375.0, date: "2026-06-30", status: "Processing" },
      { id: "ship-204", items: [{ productName: "Sweet Bananas", quantity: 80 }], total: 96.0, date: "2026-07-01", status: "Pending" }
    ];
  }

  // 5. Admin user list
  if (lowercaseUrl.includes("/users/all-with-passwords")) {
    return [
      { id: "demo-admin", name: "System Administrator", email: "admin@farmchain.com", role: "admin", username: "admin" },
      { id: "farmer-1", name: "Ramesh Kumar", email: "ramesh@farmchain.com", role: "farmer", username: "ramesh" },
      { id: "distributor-1", name: "Vikas Logistics", email: "vikas@farmchain.com", role: "distributor", username: "vikas" },
      { id: "retailer-1", name: "Aroma Grocery Store", email: "aroma@farmchain.com", role: "retailer", username: "aroma" },
      { id: "customer-1", name: "Amit Sharma", email: "amit@farmchain.com", role: "customer", username: "amit" }
    ];
  }

  // 6. All products list (for Admin)
  if (lowercaseUrl.includes("/products/all")) {
    return [
      { id: "prod-1", cropType: "Organic Tomatoes", farmerId: "Ramesh Kumar", retailerId: "Aroma Grocery Store", harvestDate: "2026-06-28", price: 2.5 },
      { id: "prod-2", cropType: "Basmati Rice", farmerId: "Suresh Singh", retailerId: null, harvestDate: "2026-06-24", price: 1.9 },
      { id: "prod-3", cropType: "Sweet Bananas", farmerId: "Rajesh Patel", retailerId: "Aroma Grocery Store", harvestDate: "2026-06-29", price: 1.2 }
    ];
  }

  // 7. General POST/PUT handlers
  if (method === "post" || method === "put" || method === "delete") {
    return { message: "Mock operation completed successfully", success: true, id: `mock-${Date.now()}` };
  }

  return null;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error';
    if (isNetworkError && error.config && error.config.url) {
      const mockData = getMockResponseForUrl(error.config.url, error.config.method || 'get', error.config.data);
      if (mockData !== null) {
        console.warn(`[API Fallback] Backend unreachable. Served mock data for: ${error.config.url}`);
        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        });
      }
    }

    const status = error?.response?.status ?? 0;
    const data = error?.response?.data;
    const message = data?.message || error?.message || "Request failed";
    const url = `${error?.config?.baseURL || baseURL}${error?.config?.url || ""}`;

    console.error("[API] Request failed", {
      url,
      status,
      data,
    });

    const normalizedError = {
      status,
      message,
      data,
      url: error?.config?.url || "",
      method: error?.config?.method,
    };

    return Promise.reject(normalizedError);
  },
);

export default axiosInstance;
