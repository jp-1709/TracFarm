import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";
import { Search, Plus, Calendar, MapPin, Trash2, Edit3, ArrowDownToLine, Leaf, Droplets, ShieldCheck, Box } from "lucide-react";
import "../../styles/products.css";

function ProductsPage({ products = [], onDeleteProduct, onRefreshProducts }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredProducts(products);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [products]);

  const getBaseUrl = () => {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:3000";
    }
    return "https://farmchainx.netlify.app";
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product from the traceability network?")) {
      if (onDeleteProduct) {
        onDeleteProduct(productId);
      } else {
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        if (onRefreshProducts) onRefreshProducts();
      }
    }
  };

  const downloadQRCode = (id, name) => {
    try {
      const canvas = document.getElementById(`qrcode-${id}`);
      if (!canvas) throw new Error("QR canvas not found");

      const pngUrl = canvas.toDataURL("image/png");
      const safeName = (name || "product")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${safeName}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR:", err);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredProducts(
        products.filter(
          (prod) =>
            prod.cropType.toLowerCase().includes(q) ||
            prod.soilType.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, products]);

  // Statistics calculation for farmer
  const totalCrops = products.length;
  const organicCrops = products.filter(p => p.pesticides?.toLowerCase().includes("none") || p.pesticides?.toLowerCase().includes("organic")).length;
  const pendingShipments = products.filter(p => !p.retailerId).length;

  return (
    <div className="products-page animate-fade-in-up">
      <div className="products-container">
        
        {/* Dashboard Header */}
        <div className="products-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1>Farmer Dashboard</h1>
            <p>Manage crop cultivation, track soil logs, and generate traceability QR codes.</p>
          </div>
          <button
            className="btn-add-product flex items-center gap-2"
            onClick={() => navigate("/add-product")}
          >
            <Plus size={18} />
            <span>Register Harvest</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crops Registered</p>
              <h3 className="text-3xl font-extrabold mt-1">{totalCrops}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Box size={24} />
            </div>
          </div>
          
          <div className="glass-panel p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Organic Ratio</p>
              <h3 className="text-3xl font-extrabold mt-1">
                {totalCrops > 0 ? Math.round((organicCrops / totalCrops) * 100) : 0}%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Leaf size={24} />
            </div>
          </div>

          <div className="glass-panel p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Orders</p>
              <h3 className="text-3xl font-extrabold mt-1">{pendingShipments}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="products-actions glass-panel p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by crop, soil log, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full py-2 bg-transparent border-none focus:outline-none"
            />
          </div>
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Restoring crop entries...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state glass-panel p-16 text-center">
            <div className="empty-state-icon mb-4">📦</div>
            <h3 className="text-xl font-bold">No Crops Registered</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
              You haven't registered any harvests on the TracFarm network yet. Begin by listing your first crop.
            </p>
            <button
              className="btn-add-product mx-auto"
              onClick={() => navigate("/add-product")}
            >
              <Plus size={18} />
              <span>Register Your First Crop</span>
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((prod, index) => (
              <div key={prod.id || index} className="product-card glass-panel flex flex-col">
                
                {/* Product Image Section */}
                <div className="product-image-wrapper relative">
                  <img
                    src={
                      prod.imageUrl ||
                      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={prod.cropType}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  
                  {/* Floating badging */}
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Leaf size={12} />
                    {prod.pesticides?.toLowerCase().includes("none") || prod.pesticides?.toLowerCase().includes("organic")
                      ? "Organic"
                      : "Pesticide Controlled"}
                  </span>
                </div>

                {/* Product Details */}
                <div className="product-content flex-1 flex flex-col p-6 text-left">
                  <h3 className="product-name text-xl font-extrabold mb-4">{prod.cropType}</h3>

                  <div className="space-y-3 flex-1 mb-6">
                    <div className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                      <span className="text-gray-500 flex items-center gap-2"><Droplets size={16} /> Soil Type</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{prod.soilType}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                      <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} /> Harvest Date</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{prod.harvestDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                      <span className="text-gray-500 flex items-center gap-2"><MapPin size={16} /> Coordinate</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {prod.latitude && prod.longitude
                          ? `${parseFloat(prod.latitude).toFixed(2)}°, ${parseFloat(prod.longitude).toFixed(2)}°`
                          : "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center mb-6">
                    <QRCodeCanvas
                      id={`qrcode-${prod.id}`}
                      value={`${getBaseUrl()}/product/${prod.id}`}
                      size={110}
                      level="H"
                      includeMargin={true}
                    />
                    <span className="text-xs text-gray-400 mt-2">Product Traceability Token</span>
                    <button
                      onClick={() => downloadQRCode(prod.id, prod.cropType)}
                      className="mt-3 flex items-center gap-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/10 cursor-pointer"
                    >
                      <ArrowDownToLine size={14} />
                      Download QR Code
                    </button>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2">
                    <button
                      className="btn-edit flex items-center justify-center gap-2"
                      onClick={() => navigate(`/edit-product/${prod.id}`)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button
                      className="btn-delete flex items-center justify-center gap-2"
                      onClick={() => handleDeleteProduct(prod.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
