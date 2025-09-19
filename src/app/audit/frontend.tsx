"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 70) return "text-teal-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

export const ScoreCard = ({ label, score }: { label: string; score: number }) => (
  <motion.div whileHover={{ scale: 1.05 }}
    className="bg-white shadow-lg rounded-xl p-6 text-center border border-gray-100">
    <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
    <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</p>
  </motion.div>
);

export const DetailedAnalysis = ({ text }: { text?: string }) => (
  <div className="bg-gray-900 text-gray-100 rounded-xl p-6 lg:p-8 shadow-lg mb-12">
    <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
    <ReactMarkdown>{text ?? "No analysis available"}</ReactMarkdown>
  </div>
);

export const Recommendations = ({ list }: { list?: { text: string; priority: string }[] }) => {
  if (!list) return null;
  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((rec, idx) => (
          <motion.div key={idx} whileHover={{ scale: 1.03 }}
            className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-teal-500">
            <h4 className="text-lg font-medium text-gray-800">{rec.text}</h4>
            <p className={`mt-1 text-sm font-semibold ${
              rec.priority === "High"
                ? "text-red-600"
                : rec.priority === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}>
              Priority: {rec.priority}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
