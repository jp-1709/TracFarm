import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  BadgeCheck,
  X,
  CheckCircle2,
  Filter,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Info
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axiosInstance";

// USD to INR conversion constants
const USD_TO_INR = 83;
const formatINR = (usd) => {
  const inr = Number(usd) * USD_TO_INR;
  const roundedINR = Math.round(inr);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedINR);
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // State for products from backend
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const WHITELIST = [
    "apple", "banana", "basmati", "carrot", "chilli", "corn",
    "grapes", "mango", "onion", "potato", "rotten_potato",
    "strawberry", "straberry", "tomato", "wheat",
  ];

  const getProductLogo = (product) => {
    const name = (product?.name || product?.cropType || "").toLowerCase();
    if (name.includes("tomato")) return "🍅";
    if (name.includes("carrot")) return "🥕";
    if (name.includes("banana")) return "🍌";
    if (name.includes("straw") || name.includes("berry")) return "🍓";
    if (name.includes("lettuce") || name.includes("spinach") || name.includes("leaf")) return "🥬";
    if (name.includes("corn")) return "🌽";
    if (name.includes("grape")) return "🍇";
    if (name.includes("mango")) return "🥭";
    if (name.includes("onion")) return "🧅";
    if (name.includes("potato")) return "🥔";
    if (name.includes("apple")) return "🍎";
    if (name.includes("wheat") || name.includes("rice") || name.includes("basmati")) return "🌾";
    if (name.includes("chilli") || name.includes("chili") || name.includes("pepper")) return "🌶️";
    if (name.includes("cucumber")) return "🥒";
    if (name.includes("avocado")) return "🥑";
    return "🥬";
  };

  // Get crop category for filtering
  const getProductCategory = (product) => {
    const name = (product?.name || product?.cropType || "").toLowerCase();
    if (name.includes("apple") || name.includes("banana") || name.includes("grape") || name.includes("mango") || name.includes("berry") || name.includes("strawberry")) {
      return "fruits";
    }
    if (name.includes("wheat") || name.includes("rice") || name.includes("basmati") || name.includes("corn")) {
      return "grains";
    }
    return "vegetables"; // carrots, tomatoes, onions, potatoes, etc.
  };

  const extractProducts = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.products)) return payload.products;
    return [];
  };

  const toDisplayProducts = (rawProducts) => {
    const mappedProducts = (rawProducts || []).map((product) => ({
      id: product.id,
      name: product.cropType,
      price: product.price || 2.5,
      rating: 4.8,
      reviews: Math.floor(Math.random() * 80) + 40,
      freshness: Math.floor(Math.random() * 20) + 80 + "%",
      displayIcon: getProductLogo(product),
      category: getProductCategory(product),
      imageUrl: product.imageUrl || null,
      ...product,
    }));

    const seenIds = new Map();
    return mappedProducts.filter((product) => {
      if (seenIds.has(product.id)) return false;
      seenIds.set(product.id, true);
      return true;
    });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const loadProducts = async (path) => {
      const response = await axiosInstance.get(path);
      return toDisplayProducts(extractProducts(response.data));
    };

    try {
      const productsFromApi = await loadProducts("/api/products/customer/products");
      setProducts(productsFromApi);
    } catch (primaryError) {
      console.log("[CustomerDashboard] primary fetch error", primaryError);
      setError({
        status: primaryError?.status ?? 0,
        message: primaryError?.message || "Failed to load products from backend",
        data: primaryError?.data,
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleAIModalTrigger = () => setShowAIModal(true);
    window.addEventListener("openAIQualityCheck", handleAIModalTrigger);
    return () => window.removeEventListener("openAIQualityCheck", handleAIModalTrigger);
  }, []);

  const addToCart = (product) => {
    const icon = product.displayIcon || getProductLogo(product);
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, image: icon, quantity: 1 }]);
    }
  };

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const token = localStorage.getItem("token") || "local-demo-token";
      await axiosInstance.post(
        "/api/orders",
        {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        "Order placed successfully! 🎉\n\nYour fresh produce has been registered for delivery.\nTrack your shipment history on the chain.",
      );
      setCart([]);
    } catch (error) {
      const errorMessage = error.message || "Failed to place order";
      alert(`Order failed: ${errorMessage}`);
    }
  };

  const cartTotalINR = cart.reduce(
    (sum, item) => sum + item.price * item.quantity * USD_TO_INR,
    0,
  );

  const dedupedProducts = Array.from(
    new Map((products || []).map((p) => [p.id ?? `${p.cropType}`, p])),
  ).map(([, v]) => v);

  const filteredProducts = selectedCategory === "all"
    ? dedupedProducts
    : dedupedProducts.filter(p => p.category === selectedCategory);

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${isDark ? "bg-[#080c14] text-white" : "bg-[#f6f8fa]"}`}>
      
      {/* AI Quality Check Trigger Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full overflow-hidden transform transition-all animate-fade-in-up">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    AI Quality Check
                  </h3>
                  <p className="text-emerald-100 mt-1 text-sm">
                    Computer Vision Crop Diagnostic
                  </p>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 text-left">
              <p className="mb-4 font-bold text-sm text-gray-700 dark:text-gray-300">
                Our neural networks verify:
              </p>
              <div className="space-y-3">
                {[
                  "Harvest freshness indicators & rot indexes",
                  "Organic verification & herbicide residue warnings",
                  "Platform-backed traceability validations",
                  "Crop health and packaging safety metrics"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  navigate("/ai-quality-check");
                }}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Scan Product Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-left">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Marketplace</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Purchase traceable organic products directly from verified local farms.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Marketplace Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Banner Card */}
            <div className="glass-panel p-8 overflow-hidden relative text-left bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 border border-emerald-500/20">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl font-extrabold mb-3">Farm Fresh & Fully Traceable</h2>
                <p className="text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">
                  Every product listed on TracFarm holds a cryptographic footprint. Scan QR codes on arrivals to trace soil history, harvesting date, and GPS farm locations.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 bg-emerald-500/10 rounded-full px-4 py-2 border border-emerald-500/20 text-emerald-600">
                    <BadgeCheck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">100% Certified</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 rounded-full px-4 py-2 border border-emerald-500/20 text-emerald-600">
                    <Truck size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Logistics Monitored</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Category Row */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-emerald-500" />
                <span className="font-bold text-sm text-gray-500 uppercase tracking-wider">Filter Crops</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All Items" },
                  { id: "vegetables", label: "Vegetables" },
                  { id: "fruits", label: "Fruits" },
                  { id: "grains", label: "Grains & Seeds" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                        : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products grid */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Fetching marketplace listings...</p>
              </div>
            )}

            {error && (
              <div className="glass-panel p-6 border-red-500/20 text-left flex justify-between items-center bg-red-500/5">
                <div>
                  <h4 className="font-bold text-red-600">Failed to load crops</h4>
                  <p className="text-xs text-red-500 mt-1">{error.message}</p>
                </div>
                <button
                  onClick={fetchProducts}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="glass-panel p-16 text-center">
                <p className="text-gray-500 font-medium">No products listed in this category.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="glass-panel overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform"
                >
                  {/* Image/Visual wrapper */}
                  <div className="h-44 bg-gradient-to-br from-emerald-100/50 to-green-200/50 flex items-center justify-center relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">{product.displayIcon || "🥬"}</span>
                    )}

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-md hover:scale-110 transition cursor-pointer"
                    >
                      <Heart
                        size={18}
                        className={
                          wishlist.find((item) => item.id === product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }
                      />
                    </button>
                  </div>

                  {/* Info Content */}
                  <div className="p-6 flex-1 flex flex-col text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold">{product.name}</h4>
                      <span className="bg-emerald-500/10 text-emerald-600 text-xs font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
                    </div>

                    {/* Freshness Indicator */}
                    <div className="mb-6 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-500">
                        <span>FRESHNESS</span>
                        <span className="text-emerald-500">{product.freshness}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: product.freshness }}
                        />
                      </div>
                    </div>

                    {/* Price and Add button */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                      <div>
                        <span className="text-2xl font-black text-emerald-500">
                          {formatINR(product.price)}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/ kg</span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/10 cursor-pointer transition active:scale-95"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Cart sidebar pane */}
          <div className="lg:col-span-1">
            <div className="glass-panel overflow-hidden sticky top-24 shadow-2xl flex flex-col">
              
              <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-emerald-500" />
                  Cart ({cart.length})
                </h3>
              </div>

              {cart.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <ShoppingCart size={44} className="mx-auto mb-4 opacity-30 text-gray-500" />
                  <p className="font-bold text-sm">Your shopping basket is empty</p>
                  <p className="text-xs mt-1">Crops added to your cart will appear here.</p>
                </div>
              ) : (
                <>
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800">
                    {cart.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4 text-left hover:bg-gray-50/30 dark:hover:bg-slate-900/30 transition">
                        <span className="text-3xl flex-shrink-0">{item.image}</span>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-sm truncate">{item.name}</h5>
                          <p className="text-xs text-gray-400 mt-0.5">{formatINR(item.price)} / kg</p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 border border-gray-200 dark:border-slate-700">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-slate-700 font-bold text-sm flex items-center justify-center cursor-pointer"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-slate-700 font-bold text-sm flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-red-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-left space-y-4">
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{formatINR(cartTotalINR / USD_TO_INR)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traceability Delivery Fee</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">{formatINR(3)}</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-slate-700">
                        <span>Total Sum</span>
                        <span className="text-emerald-500">{formatINR(cartTotalINR / USD_TO_INR + 3)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
                    >
                      Checkout Order
                      <ArrowRight size={16} />
                    </button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 text-center">
                      <Info size={12} className="text-emerald-500" />
                      <span>Secured farm-to-consumer traceability logs.</span>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default CustomerDashboard;
