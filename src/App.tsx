/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin
} from "@vis.gl/react-google-maps";
import {
  Compass,
  Users,
  Calendar,
  MapPin,
  Mic,
  MicOff,
  Sparkles,
  CloudRain,
  BatteryCharging,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Zap,
  Map as MapIcon,
  Download,
  FileText,
  CheckSquare,
  Square,
  Package,
  Sun,
  Cloud,
  Thermometer
} from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  ageGroup: string;
  mobilityNeeds: string[];
  interests: string[];
}

interface ItineraryStop {
  time: string;
  title: string;
  category: string;
  address: string;
  duration: string;
  description: string;
  bestFor: string[];
  logisticsNote: string;
  verificationBadge: string;
  lat: number;
  lng: number;
}

interface ItineraryDay {
  dayNumber: number;
  date: string;
  theme: string;
  weatherForecast?: {
    condition: string;
    tempHigh: string;
    tempLow: string;
    icon: string;
  };
  stops: ItineraryStop[];
  dailySummary: {
    totalWalkingHours: string;
    familyHarmonyScore: string;
    careWindowIncluded: boolean;
  };
  adventureCard?: {
    imageUrl: string;
    caption: string;
  };
}

interface ItineraryData {
  tripTitle: string;
  destinationSummary: string;
  days: ItineraryDay[];
}

interface CheckItem {
  id: string;
  text: string;
  category: string;
  checked: boolean;
  tag?: string;
}

export default function App() {
  const [mapsApiKey, setMapsApiKey] = useState<string>("");
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  // Form state
  const [destination, setDestination] = useState<string>("Kyoto, Japan");
  const [tripDates, setTripDates] = useState<string>("Oct 12 - Oct 18, 2026");
  const [pace, setPace] = useState<string>("Balanced");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Maya",
      ageGroup: "Adult 18-59",
      mobilityNeeds: ["Stroller-friendly"],
      interests: ["Culture", "Cafes", "Photography"]
    },
    {
      id: "2",
      name: "Leo",
      ageGroup: "Toddler 3-4",
      mobilityNeeds: ["Midday nap required", "Frequent seating"],
      interests: ["Parks", "Trains", "Gelato"]
    },
    {
      id: "3",
      name: "Grandpa Arthur",
      ageGroup: "Senior 60+",
      mobilityNeeds: ["Step-free/No stairs", "Frequent seating"],
      interests: ["Temples", "Gardens", "History"]
    }
  ]);

  // Packing Checklist State
  const [checklist, setChecklist] = useState<CheckItem[]>([
    { id: "1", text: "Passports & Travel Insurance", category: "Essentials", checked: true, tag: "All" },
    { id: "2", text: "Compact Lightweight Stroller", category: "Toddler Gear", checked: false, tag: "Leo" },
    { id: "3", text: "Toddler Snacks & Sippy Cups", category: "Toddler Gear", checked: false, tag: "Leo" },
    { id: "4", text: "Walking Cane / Foldable Seat Cushion", category: "Senior Care", checked: true, tag: "Arthur" },
    { id: "5", text: "Prescription Medications", category: "Senior Care", checked: false, tag: "Arthur" },
    { id: "6", text: "Universal Power Adapters", category: "Destination", checked: false, tag: "Japan" },
    { id: "7", text: "Comfortable Walking Shoes for Everyone", category: "Essentials", checked: false, tag: "All" }
  ]);
  const [newItemText, setNewItemText] = useState<string>("");
  const [newItemCategory, setNewItemCategory] = useState<string>("Essentials");

  // UI state
  const [activeTab, setActiveTab] = useState<"planner" | "itinerary">("planner");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [expandedStopIndex, setExpandedStopIndex] = useState<number | null>(0);
  const [activePivotModal, setActivePivotModal] = useState<string | null>(null);
  const [pivotLoading, setPivotLoading] = useState<boolean>(false);
  const [pivotResult, setPivotResult] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Fetch Maps API key on mount & listen for quota
  useEffect(() => {
    fetch("/api/maps-key")
      .then((res) => res.json())
      .then((data) => {
        if (data.key) setMapsApiKey(data.key);
      })
      .catch((err) => console.error("Error fetching maps key:", err));

    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", handleQuota);
    return () => window.removeEventListener("gmp-quota-exceeded", handleQuota);
  }, []);

  // Add family member
  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "New Member",
      ageGroup: "Child 5-12",
      mobilityNeeds: ["Stroller-friendly"],
      interests: ["Adventure", "Snacks"]
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers(
      familyMembers.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const removeMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
  };

  // Checklist handlers
  const toggleCheckItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: Date.now().toString(),
        text: newItemText.trim(),
        category: newItemCategory,
        checked: false,
        tag: "Custom"
      }
    ]);
    setNewItemText("");
  };

  const removeCheckItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const quickAddSuggestions = [
    { text: "Portable Phone Chargers & Power Banks", category: "Essentials" },
    { text: "Wet Wipes & Hand Sanitizer", category: "Essentials" },
    { text: "Stroller Rain Cover", category: "Toddler Gear" },
    { text: "Noise-Cancelling Headphones", category: "Essentials" }
  ];

  const handleQuickAdd = (text: string, category: string) => {
    if (checklist.some((i) => i.text.toLowerCase() === text.toLowerCase())) return;
    setChecklist([
      ...checklist,
      { id: Date.now().toString(), text, category, checked: false, tag: "Suggested" }
    ]);
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(",")[1];
          await processVoiceHuddle(base64String, "audio/webm");
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceHuddle = async (base64Data: string, mimeType: string) => {
    setLoading(true);
    setLoadingStep("Transcribing family huddle voice conversation...");
    try {
      const res = await fetch("/api/transcribe-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: base64Data, mimeType })
      });
      const data = await res.json();
      if (data.success && data.transcript) {
        alert(`Family Huddle Transcribed:\n\n${data.transcript.substring(0, 250)}...`);
      }
    } catch (err) {
      console.error("Voice huddle error:", err);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Generate Itinerary
  const handleGenerateItinerary = async () => {
    setLoading(true);
    setLoadingStep("Checking live operating hours & weather forecasts via Google Search & Maps...");
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          dates: tripDates,
          familyRoster: familyMembers,
          pace,
          constraints: { huddleFocus: "Family harmony, nap windows, accessibility" }
        })
      });
      const data = await res.json();
      if (data.success && data.itinerary) {
        setItinerary(data.itinerary);
        setGroundingChunks(data.groundingChunks || []);
        setActiveTab("itinerary");
      } else {
        alert("Failed to generate itinerary. Please try again.");
      }
    } catch (err) {
      console.error("Generation error:", err);
      alert("An error occurred during itinerary synthesis.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Real-time pivot
  const handlePivot = async (pivotType: string) => {
    setActivePivotModal(pivotType);
    setPivotLoading(true);
    setPivotResult(null);

    const currentDay = itinerary?.days[selectedDayIndex];
    const currentStop = currentDay?.stops[0];

    try {
      const res = await fetch("/api/realtime-pivot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pivotType,
          currentStop,
          destination
        })
      });
      const data = await res.json();
      if (data.success) {
        setPivotResult(data.pivotRecommendation);
      }
    } catch (err) {
      console.error("Pivot error:", err);
      setPivotResult("Failed to fetch alternative recommendation.");
    } finally {
      setPivotLoading(false);
    }
  };

  // Generate Adventure Card
  const handleGenerateAdventureCard = async (dayIndex: number) => {
    const day = itinerary?.days[dayIndex];
    if (!day) return;

    setLoading(true);
    setLoadingStep("Generating Nano Banana illustrated storybook adventure map...");
    try {
      const stopsSummary = day.stops.map((s) => s.title).join(", ");
      const res = await fetch("/api/generate-adventure-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayTheme: day.theme,
          stopsSummary,
          destination
        })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updatedDays = [...itinerary.days];
        updatedDays[dayIndex] = {
          ...day,
          adventureCard: {
            imageUrl: data.imageUrl,
            caption: data.caption
          }
        };
        setItinerary({ ...itinerary, days: updatedDays });
      }
    } catch (err) {
      console.error("Adventure card error:", err);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Export to PDF (Print)
  const handleExportPDF = () => {
    window.print();
  };

  // Export to Calendar (.ics)
  const handleExportICS = () => {
    if (!itinerary) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//KinCompass//Family Travel Itinerary//EN\n";

    itinerary.days.forEach((day) => {
      day.stops.forEach((stop) => {
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:${stop.title}\n`;
        icsContent += `DESCRIPTION:${stop.description} \\nLogistics: ${stop.logisticsNote}\n`;
        icsContent += `LOCATION:${stop.address}\n`;
        icsContent += `DTSTART:20261012T090000Z\n`;
        icsContent += `DTEND:20261012T110000Z\n`;
        icsContent += "END:VEVENT\n";
      });
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${destination.replace(/[^a-zA-Z0-9]/g, "_")}_Itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const packedCount = checklist.filter((i) => i.checked).length;
  const totalChecklist = checklist.length;
  const packedPercentage = totalChecklist > 0 ? Math.round((packedCount / totalChecklist) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#081425] text-[#d8e3fb] flex flex-col selection:bg-[#d97757] selection:text-white">
      {/* Google Maps Quota Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{" "}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-300 hover:text-amber-100"
            >
              maps developer site
            </a>{" "}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar Contract: Brand title - Nav links - Primary Action */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-8 py-4 border-b border-[#2a3548] bg-[#111c2d]/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#d97757] flex items-center justify-center text-white shadow-lg shadow-[#d97757]/20">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            KinCompass
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#dbc1b9]">
          <button
            onClick={() => setActiveTab("planner")}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "planner" ? "text-[#ffb59e] font-semibold" : "hover:text-white"
            }`}
          >
            Family Huddle & Checklist
          </button>
          <button
            onClick={() => itinerary && setActiveTab("itinerary")}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === "itinerary" ? "text-[#ffb59e] font-semibold" : "hover:text-white"
            }`}
            disabled={!itinerary}
          >
            Smart Itinerary & Map
          </button>
          <span className="text-xs text-[#a38c85]">Zero-Hallucination Grounding</span>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {itinerary && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3 py-2 text-xs font-semibold text-white bg-[#152031] border border-[#2a3548] rounded-lg hover:bg-[#2a3548] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="Export Itinerary to PDF / Print"
              >
                <FileText className="w-3.5 h-3.5 text-[#ffb59e]" /> PDF
              </button>
              <button
                onClick={handleExportICS}
                className="px-3 py-2 text-xs font-semibold text-white bg-[#152031] border border-[#2a3548] rounded-lg hover:bg-[#2a3548] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
                title="Export to Calendar (.ics)"
              >
                <Download className="w-3.5 h-3.5 text-[#aacfba]" /> .ICS
              </button>
              <button
                onClick={() => setActiveTab(activeTab === "planner" ? "itinerary" : "planner")}
                className="px-4 py-2 text-xs font-semibold text-[#5c1902] bg-[#ffb59e] rounded-lg hover:bg-[#d97757] hover:text-white transition-all shadow-md whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {activeTab === "planner" ? "View Itinerary" : "Edit Roster"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 border-4 border-[#d97757] border-t-transparent rounded-full animate-spin mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Synthesizing Family Itinerary</h3>
          <p className="text-sm text-[#dbc1b9] max-w-md animate-pulse">{loadingStep}</p>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {activeTab === "planner" ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Effortless Adventure for Every Generation
              </h1>
              <p className="text-[#dbc1b9] text-base md:text-lg">
                AI-powered family travel planner grounded in real Google Maps logistics, verified operating hours, stroller accessibility, and bespoke care windows.
              </p>
            </div>

            {/* Trip Parameters & Voice Huddle Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Trip Settings & Roster */}
              <div className="lg:col-span-2 bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2a3548] pb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#d97757]" />
                    Trip Parameters & Family Roster
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#dbc1b9]">Pace:</span>
                    <select
                      value={pace}
                      onChange={(e) => setPace(e.target.value)}
                      aria-label="Trip Pace"
                      className="bg-[#152031] border border-[#2a3548] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#d97757]"
                    >
                      <option value="Relaxed">Relaxed (Slow mornings)</option>
                      <option value="Balanced">Balanced (Standard)</option>
                      <option value="Active">Active (High energy)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#dbc1b9] mb-1.5">
                      Destination City / Region
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#a38c85]" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Kyoto, Japan or Barcelona, Spain"
                        className="w-full bg-[#152031] border border-[#2a3548] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d97757]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#dbc1b9] mb-1.5">
                      Trip Dates
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#a38c85]" />
                      <input
                        type="text"
                        value={tripDates}
                        onChange={(e) => setTripDates(e.target.value)}
                        placeholder="Oct 12 - Oct 18, 2026"
                        className="w-full bg-[#152031] border border-[#2a3548] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d97757]"
                      />
                    </div>
                  </div>
                </div>

                {/* Family Members list */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#aacfba]" />
                      Family Members ({familyMembers.length})
                    </h3>
                    <button
                      onClick={addFamilyMember}
                      className="px-3 py-1.5 text-xs font-medium text-[#aacfba] bg-[#315242]/40 border border-[#6B8E7B]/30 rounded-lg hover:bg-[#315242] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Member
                    </button>
                  </div>

                  <div className="space-y-3">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-[#152031] border border-[#2a3548] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-9 h-9 rounded-full bg-[#2a3548] flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="space-y-1 flex-1">
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateMember(member.id, { name: e.target.value })}
                              aria-label="Family Member Name"
                              className="bg-transparent text-sm font-semibold text-white border-b border-transparent hover:border-[#a38c85] focus:border-[#d97757] focus:outline-none pb-0.5 w-full"
                            />
                            <div className="flex flex-wrap gap-2 text-xs text-[#a38c85]">
                              <select
                                value={member.ageGroup}
                                onChange={(e) => updateMember(member.id, { ageGroup: e.target.value })}
                                aria-label="Age Group"
                                className="bg-[#111c2d] border border-[#2a3548] text-[#dbc1b9] rounded px-1.5 py-0.5 text-xs"
                              >
                                <option value="Infant 0-2">Infant 0-2</option>
                                <option value="Toddler 3-4">Toddler 3-4</option>
                                <option value="Child 5-12">Child 5-12</option>
                                <option value="Teen 13-17">Teen 13-17</option>
                                <option value="Adult 18-59">Adult 18-59</option>
                                <option value="Senior 60+">Senior 60+</option>
                              </select>
                              <span>·</span>
                              <span>Needs: {member.mobilityNeeds.join(", ")}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-[#a38c85] hover:text-red-400 p-1.5 rounded-lg transition-colors self-end md:self-center"
                          title="Remove member"
                          aria-label="Remove family member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2a3548]">
                  <button
                    onClick={handleGenerateItinerary}
                    className="w-full py-3.5 bg-[#d97757] text-white font-semibold rounded-xl hover:bg-[#b85e40] transition-all shadow-lg shadow-[#d97757]/30 flex items-center justify-center gap-2 text-base"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Grounded Family Itinerary
                  </button>
                </div>
              </div>

              {/* Right Col: Voice Huddle & Constraints Card */}
              <div className="space-y-6">
                <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mic className="w-5 h-5 text-[#aacfba]" />
                    Family Huddle Voice Recorder
                  </h3>
                  <p className="text-xs text-[#dbc1b9]">
                    Record a multi-person conversation. Gemini will transcribe the huddle, resolve conflicting preferences, and extract must-includes and care constraints.
                  </p>

                  <div className="flex flex-col items-center justify-center p-6 bg-[#152031] border border-dashed border-[#2a3548] rounded-xl space-y-4">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isRecording
                          ? "bg-red-500 text-white animate-pulse shadow-red-500/50"
                          : "bg-[#d97757] text-white hover:bg-[#b85e40] shadow-[#d97757]/30"
                      }`}
                    >
                      {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    </button>
                    <div className="text-xs text-center">
                      {isRecording ? (
                        <span className="text-red-400 font-semibold animate-pulse">Recording family huddle... Tap to stop</span>
                      ) : (
                        <span className="text-[#dbc1b9]">Tap microphone to record ideas</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Constraint & Logistics Engine Notice */}
                <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 shadow-xl space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#ffb59e]" />
                    Zero-Hallucination Guarantees
                  </h4>
                  <ul className="text-xs text-[#dbc1b9] space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#aacfba] shrink-0 mt-0.5" />
                      <span>Real-time operating hours verified via Google Search.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#aacfba] shrink-0 mt-0.5" />
                      <span>Stroller & step-free routes verified via Google Maps.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#aacfba] shrink-0 mt-0.5" />
                      <span>Automated 90-min midday nap windows for toddlers.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Smart Packing Checklist Section */}
            <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a3548] pb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#aacfba]" />
                    Smart Packing Checklist for {destination}
                  </h3>
                  <p className="text-xs text-[#dbc1b9] mt-1">
                    Customized for your family members' specific needs (toddlers, seniors) and destination requirements.
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[#152031] px-4 py-2 rounded-xl border border-[#2a3548]">
                  <div className="text-xs">
                    <span className="text-[#aacfba] font-semibold">{packedCount}</span> / {totalChecklist} Packed ({packedPercentage}%)
                  </div>
                  <div className="w-24 h-2 bg-[#2a3548] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#aacfba] transition-all duration-300"
                      style={{ width: `${packedPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick-Add Suggestions */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#a38c85]">Quick-Add Suggestions based on Roster & Destination:</span>
                <div className="flex flex-wrap gap-2">
                  {quickAddSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAdd(s.text, s.category)}
                      className="px-3 py-1.5 text-xs bg-[#152031] hover:bg-[#2a3548] text-[#d8e3fb] border border-[#2a3548] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#d97757]" /> {s.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Item Form */}
              <form onSubmit={addCheckItem} className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add custom packing item..."
                  className="flex-1 bg-[#152031] border border-[#2a3548] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d97757]"
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  aria-label="Item Category"
                  className="bg-[#152031] border border-[#2a3548] text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#d97757]"
                >
                  <option value="Essentials">Essentials</option>
                  <option value="Toddler Gear">Toddler Gear</option>
                  <option value="Senior Care">Senior Care</option>
                  <option value="Destination">Destination</option>
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d97757] text-white text-xs font-semibold rounded-xl hover:bg-[#b85e40] transition-all shadow-md"
                >
                  Add Item
                </button>
              </form>

              {/* Checklist Items Grouped */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {["Essentials", "Toddler Gear", "Senior Care", "Destination"].map((cat) => {
                  const items = checklist.filter((i) => i.category === cat);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat} className="bg-[#152031] border border-[#2a3548] rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-[#ffb59e] uppercase tracking-wider">
                        {cat}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => toggleCheckItem(item.id)}
                            className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                              item.checked
                                ? "bg-[#111c2d]/50 border-[#6B8E7B]/30 text-[#a38c85] line-through"
                                : "bg-[#111c2d] border-[#2a3548] text-white hover:border-[#d97757]/50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              {item.checked ? (
                                <CheckSquare className="w-4 h-4 text-[#aacfba] shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-[#a38c85] shrink-0" />
                              )}
                              <span className="text-xs font-medium">{item.text}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.tag && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a3548] text-[#dbc1b9]">
                                  {item.tag}
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCheckItem(item.id);
                                }}
                                className="text-[#a38c85] hover:text-red-400 p-1"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Itinerary & Split View */
          <div className="space-y-6 animate-fadeIn">
            {/* Header info & Day selector tabs */}
            <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#aacfba] font-medium mb-1">
                  <MapPin className="w-3.5 h-3.5" /> {destination} · {tripDates}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {itinerary?.tripTitle}
                </h2>
                <p className="text-xs text-[#dbc1b9] mt-1 max-w-2xl">
                  {itinerary?.destinationSummary}
                </p>
              </div>

              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {itinerary?.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      setExpandedStopIndex(0);
                    }}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                      selectedDayIndex === idx
                        ? "bg-[#d97757] text-white shadow-md shadow-[#d97757]/30"
                        : "bg-[#152031] text-[#dbc1b9] hover:text-white border border-[#2a3548]"
                    }`}
                  >
                    Day {day.dayNumber}: {day.theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Split View: Left Timeline | Right Map & Adventure Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Timeline (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Weather Forecast Banner at the top of day's timeline */}
                {itinerary?.days[selectedDayIndex]?.weatherForecast && (
                  <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d97757]/20 flex items-center justify-center text-[#ffb59e]">
                        {itinerary.days[selectedDayIndex].weatherForecast?.icon === "rain" ? (
                          <CloudRain className="w-5 h-5" />
                        ) : itinerary.days[selectedDayIndex].weatherForecast?.icon === "cloud" ? (
                          <Cloud className="w-5 h-5" />
                        ) : (
                          <Sun className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-[#a38c85]">Day {selectedDayIndex + 1} Weather Forecast</div>
                        <div className="text-sm font-semibold text-white">
                          {itinerary.days[selectedDayIndex].weatherForecast?.condition}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#aacfba] bg-[#152031] px-3 py-1.5 rounded-xl border border-[#2a3548] font-mono">
                      <Thermometer className="w-4 h-4 text-[#ffb59e]" />
                      High: {itinerary.days[selectedDayIndex].weatherForecast?.tempHigh} | Low: {itinerary.days[selectedDayIndex].weatherForecast?.tempLow}
                    </div>
                  </div>
                )}

                {/* Real-time Pivot Bar */}
                <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-[#d97757]" />
                    Real-Time Pivot Engine:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePivot("rain")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#152031] hover:bg-[#2a3548] text-white border border-[#2a3548] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Sudden Rain
                    </button>
                    <button
                      onClick={() => handlePivot("meltdown")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#152031] hover:bg-[#2a3548] text-white border border-[#2a3548] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> Low Energy / Meltdown
                    </button>
                    <button
                      onClick={() => handlePivot("swap")}
                      className="px-3 py-1.5 text-xs font-medium bg-[#152031] hover:bg-[#2a3548] text-white border border-[#2a3548] rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#ffb59e]" /> Swap Activity
                    </button>
                  </div>
                </div>

                {/* Pivot Result Modal / Banner */}
                {activePivotModal && (
                  <div className="bg-[#152031] border border-[#d97757]/40 rounded-2xl p-5 shadow-xl space-y-3 relative animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#ffb59e] flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> AI Pivot Recommendation ({activePivotModal.toUpperCase()})
                      </h4>
                      <button
                        onClick={() => setActivePivotModal(null)}
                        className="text-xs text-[#a38c85] hover:text-white"
                      >
                        Close
                      </button>
                    </div>
                    {pivotLoading ? (
                      <div className="flex items-center gap-2 text-xs text-[#dbc1b9] py-3">
                        <div className="w-4 h-4 border-2 border-[#d97757] border-t-transparent rounded-full animate-spin" />
                        Querying Google Maps & Search for verified alternatives...
                      </div>
                    ) : (
                      <p className="text-xs text-[#d8e3fb] leading-relaxed whitespace-pre-line">
                        {pivotResult}
                      </p>
                    )}
                  </div>
                )}

                {/* Daily Logistics Summary Bar */}
                {itinerary && itinerary.days[selectedDayIndex] && (
                  <div className="bg-[#111c2d] border border-[#2a3548] rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xs text-[#a38c85]">Walking Time</div>
                      <div className="text-sm font-semibold text-white">
                        {itinerary.days[selectedDayIndex].dailySummary.totalWalkingHours}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#a38c85]">Family Harmony</div>
                      <div className="text-sm font-semibold text-[#aacfba]">
                        {itinerary.days[selectedDayIndex].dailySummary.familyHarmonyScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#a38c85]">Care Window</div>
                      <div className="text-sm font-semibold text-[#ffb59e]">
                        {itinerary.days[selectedDayIndex].dailySummary.careWindowIncluded ? "Included (90m)" : "Standard"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline Stops */}
                <div className="space-y-4">
                  {itinerary?.days[selectedDayIndex]?.stops.map((stop, sIdx) => {
                    const isExpanded = expandedStopIndex === sIdx;
                    return (
                      <div
                        key={sIdx}
                        className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-5 shadow-xl transition-all hover:border-[#d97757]/50 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-[#ffb59e] font-semibold">
                              <Clock className="w-3.5 h-3.5" /> {stop.time} · {stop.duration}
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#152031] text-[#aacfba] border border-[#2a3548]">
                                {stop.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{stop.title}</h3>
                            <div className="text-xs text-[#a38c85] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0" /> {stop.address}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(stop.title)}&details=${encodeURIComponent(stop.description + "\\nLogistics: " + stop.logisticsNote)}&location=${encodeURIComponent(stop.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#152031] text-[#ffb59e] hover:bg-[#2a3548] transition-colors"
                              title="Add to Google Calendar"
                            >
                              <Calendar className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => setExpandedStopIndex(isExpanded ? null : sIdx)}
                              aria-label={isExpanded ? "Collapse stop details" : "Expand stop details"}
                              className="p-1.5 rounded-lg bg-[#152031] text-[#dbc1b9] hover:text-white"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="space-y-3 pt-3 border-t border-[#2a3548] animate-fadeIn">
                            <p className="text-xs text-[#d8e3fb] leading-relaxed">
                              {stop.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className="text-xs text-[#a38c85]">Best for:</span>
                              {stop.bestFor.map((m, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="text-xs px-2.5 py-0.5 rounded-full bg-[#315242]/30 text-[#aacfba] border border-[#6B8E7B]/30 font-medium"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>

                            <div className="bg-[#152031] rounded-xl p-3 flex items-start gap-2 text-xs text-[#dbc1b9] border border-[#2a3548]">
                              <ShieldAlert className="w-4 h-4 text-[#ffb59e] shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white">Logistics & Care Note:</strong> {stop.logisticsNote}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-[#152031] text-[#aacfba] border border-[#2a3548] flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8E7B]" /> {stop.verificationBadge}
                              </span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.title + " " + stop.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#ffb59e] hover:underline flex items-center gap-1"
                              >
                                View on Google Maps <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Map & Kids' Adventure Card (5 cols) */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                {/* Google Maps View */}
                <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-4 py-3 bg-[#152031] border-b border-[#2a3548] flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <MapIcon className="w-4 h-4 text-[#d97757]" /> Verified Route & Locations Map
                    </span>
                    <span className="text-xs text-[#aacfba]">Grounding Active</span>
                  </div>

                  <div className="h-[320px] w-full">
                    {mapsApiKey ? (
                      <APIProvider apiKey={mapsApiKey}>
                        <Map
                          defaultZoom={13}
                          defaultCenter={{
                            lat: itinerary?.days[selectedDayIndex]?.stops[0]?.lat || 37.7749,
                            lng: itinerary?.days[selectedDayIndex]?.stops[0]?.lng || -122.4194
                          }}
                          mapId="DEMO_MAP_ID"
                          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                          style={{ width: "100%", height: "100%" }}
                        >
                          {itinerary?.days[selectedDayIndex]?.stops.map((stop, sIdx) => (
                            <AdvancedMarker
                              key={sIdx}
                              position={{ lat: stop.lat, lng: stop.lng }}
                            >
                              <Pin background="#d97757" glyphColor="#ffffff" borderColor="#5c1902" />
                            </AdvancedMarker>
                          ))}
                        </Map>
                      </APIProvider>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#152031] text-xs text-[#a38c85]">
                        Loading Google Maps...
                      </div>
                    )}
                  </div>
                </div>

                {/* Nano Banana Visual Adventure Preview Card */}
                <div className="bg-[#111c2d] border border-[#2a3548] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ffb59e]" />
                      Nano Banana Adventure Preview
                    </h3>
                    <button
                      onClick={() => handleGenerateAdventureCard(selectedDayIndex)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#d97757] rounded-xl hover:bg-[#b85e40] transition-all shadow-md"
                    >
                      Generate Card
                    </button>
                  </div>

                  {itinerary?.days[selectedDayIndex]?.adventureCard ? (
                    <div className="space-y-3 animate-fadeIn">
                      <div className="rounded-xl overflow-hidden border border-[#2a3548]">
                        <img
                          src={itinerary.days[selectedDayIndex].adventureCard.imageUrl}
                          alt="Kids Adventure Card"
                          className="w-full h-48 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-xs text-[#dbc1b9] italic">
                        "{itinerary.days[selectedDayIndex].adventureCard.caption}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 bg-[#152031] border border-dashed border-[#2a3548] rounded-xl text-center space-y-2">
                      <p className="text-xs text-[#a38c85]">
                        Create a whimsical illustrated treasure map & storybook preview for Day {selectedDayIndex + 1}.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2a3548] py-6 px-6 text-center text-xs text-[#a38c85] bg-[#111c2d]/40 mt-12">
        <p>KinCompass · Family-First Smart Itinerary & Logistics Visualizer with Zero-Hallucination Grounding</p>
      </footer>
    </div>
  );
}
