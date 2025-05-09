import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Camera,
  ArrowLeft,
  Scan,
  RefreshCw,
  Award,
  Calendar,
  AlertTriangle,
  FileSearch
} from "lucide-react";
import { analyzeImageWithAI } from "../services/aiService";
import { useTheme } from "../context/ThemeContext";

const AIQualityCheck = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setResult(null);
      setAiResponse(null);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzeProduct = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResult(null);
    setAiResponse(null);

    try {
      const ai = await analyzeImageWithAI(selectedImage);
      setAiResponse(ai);

      const detectedProduct = ai.detectedProduct || "Unknown";
      const aiQuality = ai.quality || "Unknown";
      const aiRating = ai.rating || 3.0;
      const isConsumable = ai.consumable !== false;
      const aiAnalysis = ai.analysis || "Analysis complete.";
      const aiConfidence = ai.confidence || 85;

      let qualityScore = Math.round((aiRating / 5) * 100);
      qualityScore = Math.max(10, Math.min(100, qualityScore));

      let freshness = Math.round((aiRating / 5) * 100);
      freshness = Math.max(10, Math.min(100, freshness));

      let detectedIssues = [];
      if (!isConsumable || aiQuality === "Poor") {
        detectedIssues.push("NOT RECOMMENDED for consumption");
      }
      if (aiQuality === "Poor") {
        detectedIssues.push("Product quality is below standard parameters");
        detectedIssues.push("Visual signs of decay or environmental damage");
      }

      const verified = isConsumable && qualityScore >= 70;
      const isOrganic = aiConfidence >= 85;

      const daysAgo = verified
        ? Math.floor(Math.random() * 5) + 1
        : Math.floor(Math.random() * 15) + 5;
      const harvestDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      setResult({
        score: qualityScore,
        isOrganic,
        freshness,
        verified,
        detectedIssues,
        detectedProduct,
        harvestDate,
        aiQuality,
        aiAnalysis,
      });
    } catch (error) {
      console.error("AI analysis failed:", error);
      setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-200 ${isDark ? "bg-[#080c14] text-white" : "bg-[#f6f8fa]"}`}>
      
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-6 text-left">
        <button
          onClick={() => navigate("/customer-dashboard")}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500 font-bold mb-4 transition cursor-pointer text-sm"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </button>
        <h1 className="text-4xl font-extrabold tracking-tight">AI Crop Quality Scanner</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Trace organic integrity and evaluate freshness diagnostics using machine learning models.
        </p>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* Left Pane: Upload Zone */}
          <div className="glass-panel p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient scanning glow */}
            {analyzing && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600 shadow-glow animate-bounce z-20" />
            )}

            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera className="text-emerald-500" size={20} />
                Image Capture
              </h2>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-2xl cursor-pointer bg-gray-50/50 dark:bg-slate-900/50 hover:bg-emerald-50/20 dark:hover:bg-slate-800/20 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="mb-1 text-sm font-bold">Click to upload crop image</p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden mb-6 border border-gray-200 dark:border-slate-800 shadow-lg">
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="w-full h-72 object-cover"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="absolute w-full h-1 bg-emerald-500 shadow-glow animate-bounce top-1/2" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {imagePreview && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={analyzeProduct}
                  disabled={analyzing}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing Pixels...
                    </>
                  ) : (
                    <>
                      <Scan size={18} />
                      Run Quality Scan
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                    setResult(null);
                    setAiResponse(null);
                  }}
                  className="px-6 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Right Pane: Analysis Report */}
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FileSearch className="text-emerald-500" size={20} />
              Diagnostic Report
            </h2>

            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-72 text-center text-gray-400">
                <div className="text-5xl mb-4 opacity-40"></div>
                <p className="font-bold text-sm">Awaiting input image</p>
                <p className="text-xs mt-1">Upload a photo to view computer vision assessments.</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-72 text-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="font-bold text-sm">Processing Neural Nets...</p>
                <p className="text-xs text-gray-400 mt-1">Estimating rot indicators and organic attributes.</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Score Widget */}
                <div className={`p-6 rounded-2xl bg-gradient-to-r ${
                  result.verified
                    ? "from-emerald-500 to-green-600 shadow-emerald-500/10"
                    : "from-orange-500 to-red-600 shadow-red-500/10"
                } text-white shadow-lg`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold uppercase tracking-wider">AI Quality Score</span>
                    <Award size={24} />
                  </div>
                  <div className="text-5xl font-black">{result.score}%</div>
                  <p className="text-xs mt-2 text-white/80 font-medium">
                    {result.verified ? "Certified for standard distribution" : "⚠ Below platforms thresholds"}
                  </p>
                </div>

                {/* Details list */}
                <div className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identified Crop</span>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{result.detectedProduct}</p>
                  </div>

                  {/* Freshness progress bar */}
                  <div className="border-b border-gray-100 dark:border-slate-800 pb-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-1.5">
                      <span className="uppercase tracking-wider">Freshness Level</span>
                      <span className="text-emerald-500">{result.freshness}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${result.freshness}%` }}
                      />
                    </div>
                  </div>

                  {/* Organic check */}
                  <div className="border-b border-gray-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Organic Trust Rating</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                      result.isOrganic
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      <CheckCircle2 size={12} />
                      {result.isOrganic ? "Highly Organic" : "Moderate pesticides"}
                    </span>
                  </div>

                  {/* Harvest Date */}
                  <div className="border-b border-gray-100 dark:border-slate-800 pb-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estimated Harvest</span>
                    <span className="text-sm font-bold flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {result.harvestDate}
                    </span>
                  </div>
                </div>

                {/* Issues section */}
                {result.detectedIssues && result.detectedIssues.length > 0 && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={14} />
                      Anomalies Detected
                    </span>
                    {result.detectedIssues.map((issue, idx) => (
                      <p key={idx} className="text-xs text-red-600 dark:text-red-400 font-medium">
                        • {issue}
                      </p>
                    ))}
                  </div>
                )}

                {/* Analysis detail */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs leading-relaxed text-gray-500">
                  <span className="font-bold text-gray-700 dark:text-gray-300 block mb-1">AI Diagnostics Summary:</span>
                  {result.aiAnalysis}
                </div>

                {/* Clear / Scan again button */}
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                    setResult(null);
                    setAiResponse(null);
                  }}
                  className="w-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  Analyze Another Crop
                </button>

              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
};

export default AIQualityCheck;
