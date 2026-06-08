import { create } from 'zustand';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface CheckoutState {
  currentStep: number;

  // Step 1: Product
  selectedProductId: string | null;
  selectedProductName: string | null;
  selectedPackage: 'basic' | 'standard' | 'premium';
  productPrice: number;

  // Step 2: Style
  selectedStyleId: string | null;
  selectedStyleName: string | null;
  stylePrice: number;

  // Step 3: Requirements
  requirements: string;
  designSize: string;
  fileFormat: string;
  referenceUrl: string;

  // Step 4: Uploads
  uploadedFiles: UploadedFile[];

  // Step 5: Order
  customerEmail: string;
  customerName: string;
  notes: string;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  setProduct: (id: string, name: string, price: number) => void;
  setPackage: (pkg: 'basic' | 'standard' | 'premium', priceModifier: number) => void;

  setStyle: (id: string, name: string, price: number) => void;

  setRequirements: (req: string) => void;
  setDesignSize: (size: string) => void;
  setFileFormat: (format: string) => void;
  setReferenceUrl: (url: string) => void;

  addUploadedFile: (file: UploadedFile) => void;
  removeUploadedFile: (id: string) => void;

  setCustomerInfo: (email: string, name: string, notes: string) => void;

  getTotalPrice: () => number;
  getOrderSummary: () => {
    productName: string;
    packageType: string;
    styleName: string;
    requirements: string;
    fileCount: number;
    totalPrice: number;
  };
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  selectedProductId: null,
  selectedProductName: null,
  selectedPackage: 'standard' as const,
  productPrice: 0,
  selectedStyleId: null,
  selectedStyleName: null,
  stylePrice: 0,
  requirements: '',
  designSize: '',
  fileFormat: '',
  referenceUrl: '',
  uploadedFiles: [],
  customerEmail: '',
  customerName: '',
  notes: '',
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),

  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  setProduct: (id, name, price) => set({
    selectedProductId: id,
    selectedProductName: name,
    productPrice: price,
  }),

  setPackage: (pkg, priceModifier) => set((state) => ({
    selectedPackage: pkg,
    productPrice: state.productPrice + priceModifier,
  })),

  setStyle: (id, name, price) => set({
    selectedStyleId: id,
    selectedStyleName: name,
    stylePrice: price,
  }),

  setRequirements: (req) => set({ requirements: req }),

  setDesignSize: (size) => set({ designSize: size }),

  setFileFormat: (format) => set({ fileFormat: format }),

  setReferenceUrl: (url) => set({ referenceUrl: url }),

  addUploadedFile: (file) => set((state) => ({
    uploadedFiles: [...state.uploadedFiles, file],
  })),

  removeUploadedFile: (id) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
  })),

  setCustomerInfo: (email, name, notes) => set({
    customerEmail: email,
    customerName: name,
    notes: notes,
  }),

  getTotalPrice: () => {
    const state = get();
    return state.productPrice + state.stylePrice;
  },

  getOrderSummary: () => {
    const state = get();
    const packagePrices = {
      basic: 100,
      standard: 200,
      premium: 300,
    };

    return {
      productName: state.selectedProductName || 'N/A',
      packageType: state.selectedPackage,
      styleName: state.selectedStyleName || 'N/A',
      requirements: state.requirements,
      fileCount: state.uploadedFiles.length,
      totalPrice: state.productPrice + state.stylePrice,
    };
  },

  reset: () => set(initialState),
}));
