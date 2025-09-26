// frontend.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  List,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Building,
  ChevronDown,
  BarChart3,
  DollarSign,
  X, // Added X icon for modal close
} from "lucide-react";
import { useState, Dispatch, SetStateAction } from "react";

import { exportToCSV } from "./csv";

interface Keyword {
  keyword: string;
  type: string;
  difficulty_score: string;
  search_volume: number;
  cpc: number;
  intent: string;
  content_type: string; 
  keyword_density: number;
  // -----------------------------
  content_idea: string;
}

// --- Difficulty Badge Styles ---
const getDifficultyColor = (difficulty: string) => {
  const lower = difficulty.toLowerCase();
  if (lower.includes("easy"))
    return "border-green-500 text-green-600 bg-green-50";
  if (lower.includes("medium"))
    return "border-yellow-500 text-yellow-600 bg-yellow-50";
  if (lower.includes("hard"))
    return "border-red-500 text-red-600 bg-red-50";
  return "border-gray-300 text-gray-600 bg-gray-50";
};

const getDifficultyIcon = (difficulty: string) => {
  const lower = difficulty.toLowerCase();
  if (lower.includes("easy"))
    return <CheckCircle className="text-green-500" size={16} />;
  if (lower.includes("medium"))
    return <AlertCircle className="text-yellow-500" size={16} />;
  if (lower.includes("hard"))
    return <Zap className="text-red-500" size={16} />;
  return <BarChart3 className="text-gray-400" size={16} />;
};

// --- Progress Bar ---
export const ProgressBar = ({
  progress,
  loadingStep,
}: {
  progress: number;
  loadingStep: string;
}) => (
  <div className="mt-6 max-w-xl mx-auto">
    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
    <p className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-2">
      <Clock size={14} className="animate-pulse text-teal-500" />
      {loadingStep}
    </p>
  </div>
);

// --- Input Field ---
export const InputField = ({
  icon,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500">
      {icon}
    </div>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 shadow-sm transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

// --- Header ---
export const GeneratorHeader = ({
  topic,
  setTopic,
  industry,
  setIndustry,
  audience,
  setAudience,
  loading,
  handleGenerateKeywords,
  progress,
  loadingStep,
}: {
  topic: string;
  setTopic: (val: string) => void;
  industry: string;
  setIndustry: (val: string) => void;
  audience: string;
  setAudience: (val: string) => void;
  loading: boolean;
  handleGenerateKeywords: () => void;
  progress?: number;
  loadingStep?: string;
}) => (
  <div className="bg-gradient-to-r pt-30 from-white via-gray-50 to-white py-12 text-center shadow-sm border-b border-gray-200">
    <div className="container mx-auto relative z-10">
      <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 flex items-center justify-center gap-2">
        <Sparkles className="text-teal-500" size={28} />
        AI-Powered Keyword Generator
        <Sparkles className="text-emerald-400" size={28} />
      </h1>
      <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
        Fuel your content strategy with intelligent keyword insights tailored to
        your business.
      </p>

      <div className="mt-8 max-w-3xl mx-auto w-full bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InputField
            icon={<Target size={18} />}
            placeholder="Primary Topic"
            value={topic}
            onChange={setTopic}
            disabled={loading}
          />
          <InputField
            icon={<Building size={18} />}
            placeholder="Industry"
            value={industry}
            onChange={setIndustry}
            disabled={loading}
          />
          <InputField
            icon={<Users size={18} />}
            placeholder="Target Audience"
            value={audience}
            onChange={setAudience}
            disabled={loading}
          />
        </div>
        <motion.button
          onClick={handleGenerateKeywords}
          disabled={loading || !topic || !industry || !audience}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className={`mx-auto px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 text-white transition-all duration-300 ${
            loading || !topic || !industry || !audience
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg"
          }`}
        >
          {loading ? <Clock size={20} className="animate-spin" /> : <Search size={20} />}
          {loading ? "Generating..." : "Generate Keywords"}
        </motion.button>
      </div>

      <AnimatePresence>
        {loading && progress !== undefined && loadingStep && (
          <ProgressBar progress={progress} loadingStep={loadingStep} />
        )}
      </AnimatePresence>
    </div>
  </div>
);

// --- Helper for Detail View ---
const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-1">
    <div className="text-teal-500 mt-0.5 flex-shrink-0">{icon}</div>
    <div>
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-500">{value}</span>
    </div>
  </div>
);


// --- NEW: KeywordDetailModal Component ---
const KeywordDetailModal = ({
  keyword,
  onClose,
}: {
  keyword: Keyword;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    // MODIFIED: Added backdrop-blur-sm
    className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:"#00000061"}}
    onClick={onClose} // Close on backdrop click
  >
    <motion.div
      initial={{ scale: 0.9, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 50 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-auto"
      onClick={(e) => e.stopPropagation()} // Prevent close on modal content click
    >
      <div className="flex justify-between items-start border-b pb-3 mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 break-words pr-4">
          {keyword.keyword}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
              keyword.difficulty_score
            )} flex items-center gap-1 flex-shrink-0`}
          >
            {getDifficultyIcon(keyword.difficulty_score)}
            {keyword.difficulty_score}
          </span>
          <span className="text-sm font-medium text-gray-500">
            Type: {keyword.type}
          </span>
        </div>

        <div className="pt-2 space-y-3">
          <DetailRow 
            icon={<Search size={16} />}
            label="Search Volume"
            value={keyword.search_volume.toLocaleString()}
          />
          <DetailRow 
            icon={<DollarSign size={16} />}
            label="CPC"
            value={`$${keyword.cpc.toFixed(2)}`}
          />
          <DetailRow 
            icon={<Target size={16} />}
            label="Intent"
            value={keyword.intent}
          />
          <DetailRow 
            icon={<List size={16} />}
            label="Content Type"
            value={keyword.content_type}
          />
          <DetailRow 
            icon={<BarChart3 size={16} />}
            label="Keyword Density"
            value={`${keyword.keyword_density.toFixed(1)}%`}
          />
          <DetailRow 
            icon={<Sparkles size={16} />}
            label="Content Idea"
            value={<p className="text-gray-600 italic mt-0.5">{keyword.content_idea}</p>}
          />
        </div>
      </div>
    </motion.div>
  </motion.div>
);


// --- Modified KeywordCard Component to open Modal ---
export const KeywordCard = ({
  keyword,
  index,
  onOpenModal, // New prop to open the modal
}: {
  keyword: Keyword;
  index: number;
  onOpenModal: (keyword: Keyword) => void;
}) => (
  <motion.div
    layout // Keeps layout for smooth reordering/filtering
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
    className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg hover:border-teal-300 cursor-pointer"
    onClick={() => onOpenModal(keyword)} // Open modal on click
  >
    {/* --- Card Content --- */}
    <div className="flex justify-between items-start gap-3">
      <h4 className="font-semibold text-gray-800 text-base sm:text-lg flex-1">
        {keyword.keyword}
      </h4>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
          keyword.difficulty_score
        )} flex items-center gap-1 flex-shrink-0`}
      >
        {getDifficultyIcon(keyword.difficulty_score)}
        {keyword.difficulty_score}
      </span>
    </div>
    
    <div className="flex justify-between items-center mt-3">
      <span className="text-xs font-medium text-gray-500">Type: {keyword.type}</span>
      <div className="flex items-center text-teal-500 text-sm font-medium">
        View Details <ArrowRight size={16} className="ml-1" />
      </div>
    </div>
  </motion.div>
);

// --- Keyword Results with Tabs ---
export const KeywordResults = ({
  topic,
  keywords,
}: {
  topic: string;
  keywords: Keyword[];
}) => {
  // const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set()); // Removed expansion state
  const [activeTab, setActiveTab] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [modalKeyword, setModalKeyword] = useState<Keyword | null>(null); // New state for modal

  // const toggleCard = (keywordString: string) => { /* Removed toggleCard */ };

  const filtered = keywords.filter((k) =>
    k.difficulty_score.toLowerCase().includes(activeTab.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <List size={24} /> Keyword Report for "{topic}"
          </h2>

          <button
  onClick={() => exportToCSV(keywords, `${topic}-keywords.csv`)}
  className="ml-auto bg-white text-teal-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 text-sm font-medium transition"
>
  ⬇ Download CSV
</button>
        </div>

        <div className="flex gap-3 mt-4">
          {(["Easy", "Medium", "Hard"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-white text-teal-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        className="p-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filtered.map((keyword, i) => (
           <KeywordCard
            key={keyword.keyword}
            keyword={keyword}
            index={i}
            onOpenModal={setModalKeyword} // Pass setModalKeyword to open the modal
          />
        ))}
      </motion.div>

      {/* --- Keyword Detail Modal (Popup) --- */}
      <AnimatePresence>
        {modalKeyword && (
          <KeywordDetailModal 
            keyword={modalKeyword} 
            onClose={() => setModalKeyword(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};