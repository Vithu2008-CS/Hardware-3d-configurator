"use client";

import React, { useState } from "react";
import { useConfigStore, LEDMode } from "@/store/configStore";
import { useAuthContext } from "@asgardeo/auth-react";
import {
  Palette,
  Cpu,
  Check,
  Lock,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  Database,
} from "lucide-react";

const CASE_COLORS = [
  { name: "Void Black", hex: "#0a0a0a" },
  { name: "Cyber Orange", hex: "#ff5500" },
  { name: "Neon Cyan", hex: "#00f0ff" },
  { name: "Pure White", hex: "#ffffff" },
];

const COOLING_LIQUIDS = [
  { name: "Cryo Blue", hex: "#004cff" },
  { name: "Acid Green", hex: "#39ff14" },
  { name: "Plasma Purple", hex: "#bd00ff" },
  { name: "Hot Pink", hex: "#ff007f" },
];

const LED_MODES: { mode: LEDMode; label: string }[] = [
  { mode: "Off", label: "Off" },
  { mode: "Static", label: "Static" },
  { mode: "Breathe", label: "Breathe" },
  { mode: "Rainbow", label: "Rainbow" },
];

const INSIDE_STYLES = [
  { name: "Chrome Silver", value: "chrome-silver" as const },
  { name: "Matte Black", value: "matte-black" as const },
  { name: "Gold Cyberpunk", value: "gold-cyberpunk" as const },
];

export default function ConfigPanel() {
  const [activeTab, setActiveTab] = useState<"aesthetics" | "specs" | "profile">("aesthetics");
  const [configName, setConfigName] = useState("");
  const { state: authState, signIn } = useAuthContext();

  const store = useConfigStore();

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configName.trim()) return;
    store.saveCurrentConfig(configName);
    setConfigName("");
  };

  const currentPrices = {
    base: store.basePrice,
    gpu: store.gpu === "RTX 5080" ? 999 : 1999,
    ram: store.ram === "32GB" ? 150 : store.ram === "64GB" ? 300 : 600,
    cooling: store.coolingType === "Air" ? 50 : store.coolingType === "AIO" ? 180 : 400,
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/45 backdrop-blur-xl border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-950/5">
      {/* ================= TAB CONTROLS ================= */}
      <div className="flex border-b border-zinc-800/60 bg-zinc-950/80">
        <button
          onClick={() => setActiveTab("aesthetics")}
          className={`flex-1 py-4 text-xs font-mono tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 ${
            activeTab === "aesthetics"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/35"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          AESTHETICS
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 py-4 text-xs font-mono tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 ${
            activeTab === "specs"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/35"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          SPECS
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-4 text-xs font-mono tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all duration-300 ${
            activeTab === "profile"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/10"
              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/35"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          PROFILES
          {authState.isAuthenticated && store.savedConfigs.length > 0 && (
            <span className="bg-cyan-500 text-zinc-950 font-bold rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
              {store.savedConfigs.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= TAB CONTENTS ================= */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {/* ================= AESTHETICS TAB ================= */}
        {activeTab === "aesthetics" && (
          <div className="space-y-6">
            {/* 1. Case Color Options */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 flex items-center gap-2 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                Case Chassis Finish
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CASE_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => store.setCaseColor(color.name, color.hex)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 ${
                      store.caseColor === color.name
                        ? "border-cyan-500/80 bg-cyan-950/20 text-cyan-300"
                        : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80 hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-700/80 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium tracking-wide truncate">{color.name}</span>
                    {store.caseColor === color.name && (
                      <Check className="w-3.5 h-3.5 ml-auto text-cyan-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Interior Metal Options */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 flex items-center gap-2 uppercase">
                <Layers className="w-3.5 h-3.5 text-cyan-500" />
                Interior Alloy Structure
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INSIDE_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => store.setInsideStyle(style.value)}
                    className={`p-2.5 rounded-lg border text-center transition-all duration-300 flex flex-col items-center gap-2 ${
                      store.insideStyle === style.value
                        ? "border-cyan-500/80 bg-cyan-950/20 text-cyan-300"
                        : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80"
                    }`}
                  >
                    <span className="text-2xs font-mono tracking-wider truncate uppercase w-full">
                      {style.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Liquid Loop Color (Guarded by Custom Loop state) */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 flex items-center justify-between uppercase">
                <span className="flex items-center gap-2">
                  <Thermometer className="w-3.5 h-3.5 text-cyan-500" />
                  Liquid Coolant Hue
                </span>
                {store.coolingType === "Air" && (
                  <span className="text-[9px] text-yellow-500/80 font-mono tracking-normal normal-case">
                    (Disabled on Air Cooling)
                  </span>
                )}
              </label>
              <div className={`grid grid-cols-2 gap-3 ${store.coolingType === "Air" ? "opacity-35 pointer-events-none" : ""}`}>
                {COOLING_LIQUIDS.map((liquid) => (
                  <button
                    key={liquid.name}
                    onClick={() => store.setCoolingColor(liquid.name, liquid.hex)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 ${
                      store.coolingColor === liquid.name
                        ? "border-cyan-500/80 bg-cyan-950/20 text-cyan-300"
                        : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80 hover:border-zinc-700"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-zinc-700/80 flex-shrink-0"
                      style={{ backgroundColor: liquid.hex }}
                    />
                    <span className="text-xs font-medium tracking-wide truncate">{liquid.name}</span>
                    {store.coolingColor === liquid.name && (
                      <Check className="w-3.5 h-3.5 ml-auto text-cyan-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. RGB LED System Mode */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 flex items-center gap-2 uppercase">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-500" />
                RGB Ambient Lighting
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LED_MODES.map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => store.setLedMode(item.mode)}
                    className={`py-2 rounded-lg border text-center transition-all duration-300 text-xs font-mono ${
                      store.ledMode === item.mode
                        ? "border-cyan-500/80 bg-cyan-950/20 text-cyan-300 font-bold"
                        : "border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* RGB LED custom color picker (Only show when Static or Breathe) */}
              {(store.ledMode === "Static" || store.ledMode === "Breathe") && (
                <div className="flex items-center gap-4 p-3 bg-zinc-900/30 border border-zinc-850 rounded-lg animate-fade-in">
                  <div className="flex-1">
                    <div className="text-2xs font-mono text-zinc-500">CUSTOM COLOR</div>
                    <div className="text-xs text-zinc-300 font-mono">{store.ledColor.toUpperCase()}</div>
                  </div>
                  <input
                    type="color"
                    value={store.ledColor}
                    onChange={(e) => store.setLedColor(e.target.value)}
                    className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* 5. Viewport Controls */}
            <div className="pt-2 flex items-center justify-between border-t border-zinc-900">
              <span className="text-[11px] font-mono tracking-wider text-zinc-500">AUTO-ROTATE VIEWPORT</span>
              <button
                onClick={() => store.toggleAutoRotate()}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  store.autoRotate ? "bg-cyan-500" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow ring-0 transition duration-200 ease-in-out ${
                    store.autoRotate ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ================= SPECIFICATIONS TAB ================= */}
        {activeTab === "specs" && (
          <div className="space-y-6">
            {/* 1. GPU */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">GPU Block</label>
              <div className="space-y-2">
                {[
                  { name: "RTX 5080" as const, desc: "NVIDIA 16GB GDDR7 • Base Engine", addPrice: 999 },
                  { name: "RTX 5090" as const, desc: "NVIDIA 32GB GDDR7 • Extreme Engine", addPrice: 1999 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => store.setGpu(item.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-300 ${
                      store.gpu === item.name
                        ? "border-cyan-500 bg-cyan-950/15 text-cyan-100"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold">{item.name}</div>
                      <div className="text-2xs text-zinc-500">{item.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-cyan-400">
                      ${item.addPrice}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. RAM */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">Memory Sticks</label>
              <div className="space-y-2">
                {[
                  { name: "32GB" as const, desc: "2x 16GB DDR6 6400MHz RGB", addPrice: 150 },
                  { name: "64GB" as const, desc: "4x 16GB DDR6 6400MHz RGB", addPrice: 300 },
                  { name: "128GB" as const, desc: "4x 32GB DDR6 6800MHz RGB", addPrice: 600 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => store.setRam(item.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-300 ${
                      store.ram === item.name
                        ? "border-cyan-500 bg-cyan-950/15 text-cyan-100"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold">{item.name} DDR6</div>
                      <div className="text-2xs text-zinc-500">{item.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-cyan-400">
                      ${item.addPrice}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Thermal Loop Type */}
            <div className="space-y-3">
              <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">Thermal Block</label>
              <div className="space-y-2">
                {[
                  { name: "Air" as const, desc: "Triple Fan Blackout Heatsink", addPrice: 50 },
                  { name: "AIO" as const, desc: "Closed Loop 360mm Dual Fluid", addPrice: 180 },
                  { name: "Custom Loop" as const, desc: "Custom Hardline Tubing Reservoir System", addPrice: 400 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => store.setCoolingType(item.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-300 ${
                      store.coolingType === item.name
                        ? "border-cyan-500 bg-cyan-950/15 text-cyan-100"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold">{item.name} Cooling</div>
                      <div className="text-2xs text-zinc-500">{item.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-cyan-400">
                      ${item.addPrice}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROFILES TAB (OIDC SAVED CONFIGURATIONS) ================= */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {!authState.isAuthenticated ? (
              /* Guarded configuration panel for unauthenticated user */
              <div className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-5 text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
                  <Lock className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-mono tracking-wider font-semibold text-zinc-200">CONFIGURATION LOCK</h3>
                  <p className="text-2xs text-zinc-500 leading-normal max-w-xs mx-auto">
                    Saving configurations to your cloud profile and loading custom builds requires an authenticated session.
                  </p>
                </div>
                <button
                  onClick={() => signIn()}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold text-xs tracking-wider transition-all duration-300 shadow-lg shadow-cyan-950/20 hover:scale-102"
                >
                  SIGN IN WITH ASGARDEO
                </button>
              </div>
            ) : (
              /* Authenticated User Panel */
              <div className="space-y-6">
                <div className="bg-zinc-900/10 border border-cyan-500/10 rounded-xl p-4 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div className="text-2xs font-mono text-zinc-400">
                    WSO2 ASGARDEO SHIELD: <span className="text-cyan-400">SESSION AUTHENTICATED</span>
                  </div>
                </div>

                {/* Save Current Build Form */}
                <form onSubmit={handleSaveConfig} className="space-y-3">
                  <label className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase block">
                    Save Current Configuration
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Neon Quantum Rig"
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                      maxLength={24}
                      className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/20 font-mono text-zinc-100"
                    />
                    <button
                      type="submit"
                      disabled={!configName.trim()}
                      className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-zinc-950 py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* List of Saved Builds */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                    Your Configuration Profile
                  </h4>
                  {store.savedConfigs.length === 0 ? (
                    <div className="text-2xs text-zinc-500 text-center font-mono py-8 bg-zinc-900/15 rounded-lg border border-zinc-900/60 border-dashed">
                      NO SAVED CONFIGURATIONS IN PROFILE
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {store.savedConfigs.map((saved) => (
                        <div
                          key={saved.id}
                          className="p-3 bg-zinc-900/30 border border-zinc-900/80 rounded-lg flex items-center justify-between group hover:border-zinc-800 transition-all duration-300"
                        >
                          <div>
                            <div className="text-xs font-mono font-semibold text-zinc-200">{saved.name}</div>
                            <div className="text-[9px] font-mono text-zinc-500 mt-1 uppercase flex items-center gap-1.5">
                              <span>{saved.date}</span>
                              <span>•</span>
                              <span className="text-cyan-500/80">${saved.totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => store.loadConfig(saved.config)}
                            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-500/80 text-zinc-400 hover:text-cyan-400 flex items-center justify-center transition-all duration-300"
                            title="Load Rig"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= REAL-TIME PRICE ENGINE PANEL ================= */}
      <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/80 relative">
        {/* Neon Glow strip behind price */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">RUNNING TOTAL</div>
              <div className="text-3xl font-mono font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mt-0.5">
                ${store.totalPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-mono text-zinc-500 uppercase">Est. Build Time</div>
              <div className="text-xs font-mono font-semibold text-cyan-400 mt-0.5">7-10 BUSINESS DAYS</div>
            </div>
          </div>

          {/* Pricing detail collapse preview */}
          <div className="p-3 bg-zinc-950/40 rounded-lg border border-zinc-900/60 space-y-1.5 font-mono text-[9px] text-zinc-500">
            <div className="flex justify-between">
              <span>BASE QUANTUM CHASSIS</span>
              <span className="text-zinc-400">${currentPrices.base}</span>
            </div>
            <div className="flex justify-between">
              <span>{store.gpu.toUpperCase()} ACCELERATOR</span>
              <span className="text-zinc-400">+${currentPrices.gpu}</span>
            </div>
            <div className="flex justify-between">
              <span>{store.ram} CORE SYNC MEMORY</span>
              <span className="text-zinc-400">+${currentPrices.ram}</span>
            </div>
            <div className="flex justify-between">
              <span>{store.coolingType.toUpperCase()} LIQUID RADIATOR</span>
              <span className="text-zinc-400">+${currentPrices.cooling}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
