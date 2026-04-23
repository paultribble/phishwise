"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

interface AnalysisResult {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  verdict: string;
  redFlags: string[];
  explanation: string;
}

export default function ScanPage() {
  const { data: session, status } = useSession();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setImage(file);
    setError("");
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = (e.target?.result as string).split(",")[1];

        const response = await fetch("/api/scan/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            imageType: image.type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.error);
        }

        setResult(data.analysis);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setLoading(false);
    };

    reader.readAsDataURL(image);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "text-green-400";
      case "MEDIUM":
        return "text-yellow-400";
      case "HIGH":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "bg-green-500/10 border-green-500/30";
      case "MEDIUM":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "HIGH":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-slate-500/10 border-slate-500/30";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "LOW":
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case "MEDIUM":
        return <AlertCircle className="h-6 w-6 text-yellow-400" />;
      case "HIGH":
        return <AlertTriangle className="h-6 w-6 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#060a10] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-cyan-300 bg-clip-text text-transparent">
            Phishing Scanner
          </h1>
          <p className="text-slate-400">
            Upload a screenshot of an email or text message to analyze it for phishing indicators
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 text-center transition-colors hover:border-cyan-500 hover:bg-slate-900/70 cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-slate-700"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setPreview("");
                    setResult(null);
                  }}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500/80 p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              <p className="text-sm text-slate-300">{image?.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-slate-500" />
              <div>
                <p className="font-medium text-slate-200">
                  Drag and drop your screenshot here
                </p>
                <p className="text-sm text-slate-400">or click to browse</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        {image && !result && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full rounded-lg bg-cyan-600 px-6 py-3 text-center font-medium text-white hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Analyzing..." : "Analyze Screenshot"}
          </button>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Risk Level Card */}
            <div
              className={`rounded-lg border p-6 ${getRiskBgColor(result.riskLevel)}`}
            >
              <div className="flex items-center gap-4">
                {getRiskIcon(result.riskLevel)}
                <div className="flex-1">
                  <p className="text-sm text-slate-400">Risk Level</p>
                  <p className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskLevel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Confidence</p>
                  <p className="text-lg font-semibold text-cyan-400">
                    {(result.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400 mb-1">Verdict</p>
              <p className={`text-lg font-semibold ${getRiskColor(result.riskLevel)}`}>
                {result.verdict}
              </p>
            </div>

            {/* Explanation */}
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400 mb-3">Analysis</p>
              <p className="text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Red Flags */}
            {result.redFlags.length > 0 && (
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400 mb-3 font-medium">
                  Red Flags Detected
                </p>
                <ul className="space-y-2">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* New Scan Button */}
            <button
              onClick={() => {
                setImage(null);
                setPreview("");
                setResult(null);
                setError("");
              }}
              className="w-full rounded-lg border border-slate-700 px-6 py-3 text-center font-medium text-slate-300 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Scan Another Screenshot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
