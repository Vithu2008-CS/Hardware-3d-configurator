import { create } from 'zustand';

export type LEDMode = 'Off' | 'Static' | 'Breathe' | 'Rainbow';

export interface HardwareConfig {
  caseColor: string;
  caseColorHex: string;
  coolingColor: string;
  coolingColorHex: string;
  ledMode: LEDMode;
  ledColor: string;
  insideStyle: 'matte-black' | 'chrome-silver' | 'gold-cyberpunk';
  gpu: 'RTX 5080' | 'RTX 5090';
  ram: '32GB' | '64GB' | '128GB';
  coolingType: 'Air' | 'AIO' | 'Custom Loop';
}

export interface SavedConfiguration {
  id: string;
  name: string;
  date: string;
  config: HardwareConfig;
  totalPrice: number;
}

export interface ConfigStore extends HardwareConfig {
  // Viewport Settings
  autoRotate: boolean;
  basePrice: number;
  totalPrice: number;
  
  // Actions
  setCaseColor: (name: string, hex: string) => void;
  setCoolingColor: (name: string, hex: string) => void;
  setLedMode: (mode: LEDMode) => void;
  setLedColor: (color: string) => void;
  setInsideStyle: (style: 'matte-black' | 'chrome-silver' | 'gold-cyberpunk') => void;
  setGpu: (gpu: 'RTX 5080' | 'RTX 5090') => void;
  setRam: (ram: '32GB' | '64GB' | '128GB') => void;
  setCoolingType: (type: 'Air' | 'AIO' | 'Custom Loop') => void;
  toggleAutoRotate: () => void;
  
  // Saved Configurations
  savedConfigs: SavedConfiguration[];
  saveCurrentConfig: (name: string) => void;
  loadConfig: (config: HardwareConfig) => void;
}

const GPU_PRICES = {
  'RTX 5080': 999,
  'RTX 5090': 1999,
};

const RAM_PRICES = {
  '32GB': 150,
  '64GB': 300,
  '128GB': 600,
};

const COOLING_PRICES = {
  'Air': 50,
  'AIO': 180,
  'Custom Loop': 400,
};

const BASE_PRICE = 1200;

const calculateTotal = (gpu: 'RTX 5080' | 'RTX 5090', ram: '32GB' | '64GB' | '128GB', cooling: 'Air' | 'AIO' | 'Custom Loop') => {
  return BASE_PRICE + GPU_PRICES[gpu] + RAM_PRICES[ram] + COOLING_PRICES[cooling];
};

export const useConfigStore = create<ConfigStore>((set) => ({
  // Default values
  caseColor: 'Void Black',
  caseColorHex: '#0a0a0a',
  coolingColor: 'Cryo Blue',
  coolingColorHex: '#004cff',
  ledMode: 'Rainbow',
  ledColor: '#00ffff',
  insideStyle: 'chrome-silver',
  gpu: 'RTX 5080',
  ram: '32GB',
  coolingType: 'Custom Loop',
  
  autoRotate: true,
  basePrice: BASE_PRICE,
  totalPrice: calculateTotal('RTX 5080', '32GB', 'Custom Loop'),
  savedConfigs: [],

  setCaseColor: (name, hex) => set(() => ({
    caseColor: name,
    caseColorHex: hex
  })),

  setCoolingColor: (name, hex) => set(() => ({
    coolingColor: name,
    coolingColorHex: hex
  })),

  setLedMode: (mode) => set(() => ({
    ledMode: mode
  })),

  setLedColor: (color) => set(() => ({
    ledColor: color
  })),

  setInsideStyle: (style) => set(() => ({
    insideStyle: style
  })),

  setGpu: (gpu) => set((state) => {
    const nextTotal = calculateTotal(gpu, state.ram, state.coolingType);
    return { gpu, totalPrice: nextTotal };
  }),

  setRam: (ram) => set((state) => {
    const nextTotal = calculateTotal(state.gpu, ram, state.coolingType);
    return { ram, totalPrice: nextTotal };
  }),

  setCoolingType: (type) => set((state) => {
    const nextTotal = calculateTotal(state.gpu, state.ram, type);
    return { coolingType: type, totalPrice: nextTotal };
  }),

  toggleAutoRotate: () => set((state) => ({
    autoRotate: !state.autoRotate
  })),

  saveCurrentConfig: (name) => set((state) => {
    const currentConfig: HardwareConfig = {
      caseColor: state.caseColor,
      caseColorHex: state.caseColorHex,
      coolingColor: state.coolingColor,
      coolingColorHex: state.coolingColorHex,
      ledMode: state.ledMode,
      ledColor: state.ledColor,
      insideStyle: state.insideStyle,
      gpu: state.gpu,
      ram: state.ram,
      coolingType: state.coolingType,
    };
    
    const newSaved: SavedConfiguration = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      config: currentConfig,
      totalPrice: state.totalPrice,
    };

    return {
      savedConfigs: [newSaved, ...state.savedConfigs]
    };
  }),

  loadConfig: (config) => set(() => ({
    ...config,
    totalPrice: calculateTotal(config.gpu, config.ram, config.coolingType)
  }))
}));
