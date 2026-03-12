import {
  loadDataIndexedDB,
  loadProgressIndexedDB,
  loadStatusIndexedDB,
  resetOnboardingIndexedDB,
  saveDataIndexedDB,
  saveProgressIndexedDB,
} from "./idbOnboarding";

// Onboarding form data interface
interface OnboardingFormData {
  formId?: string;
  userId?: string;
  companyName?: string;
  industry?: string;
  businessType?: string;
  companyStage?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  establishmentDate?: string;
  businessSize?: string;
  businessPitch?: string;
  problemStatement?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  employeeCount?: number;
  founders?: string;
  foundingYear?: string;
  initialCapitalUsd?: number;
  fundingNeedsUsd?: number;
  businessRequirements?: string;
  businessNeeds?: string;
  id?: string;
  updatedAt?: string;
}

// Check if user has completed onboarding
export const checkOnboardingStatus = async (): Promise<boolean> => {
  try {
    const status = await loadStatusIndexedDB();
    if (status) return Boolean(status.isComplete);
    const result = await mockCheckStatus();
    return result.isComplete;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};
// Save onboarding progress (intermediate state)
export const saveOnboardingProgress = async (
  formData: OnboardingFormData
): Promise<boolean> => {
  // Try IndexedDB first
  try {
    const ok = await saveProgressIndexedDB(formData);
    if (ok) return true;
  } catch (error) {
    console.error("IndexedDB save failed, falling back to mock API:", error);
  }

  // Fallback to mock API/localStorage
  try {
    const result: { success: boolean; message: string } =
      await mockSaveProgress(formData);
    return result.success;
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    return false;
  }
};
// Save onboarding data (final submission)
export const saveOnboardingData = async (
  formData: OnboardingFormData
): Promise<boolean> => {
  // Try IndexedDB first
  try {
    const ok = await saveDataIndexedDB(formData);
    if (ok) {
      // If local IndexedDB save succeeded for final submission, clear stored onboarding data
      try {
        await resetOnboardingIndexedDB();
      } catch (e) {
        console.error(
          "Failed to clear onboarding IndexedDB after local save:",
          e
        );
      }
      return true;
    }
  } catch (error) {
    console.error("IndexedDB save failed, falling back to mock API:", error);
  }

  // Fallback to mock API/localStorage
  try {
    const result: { success: boolean; message: string } = await mockSaveData(
      formData
    );
    if (result.success) {
      // On successful remote save, clear any local copies in IndexedDB/localStorage
      try {
        await resetOnboardingIndexedDB();
      } catch (e) {
        console.error(
          "Failed to clear onboarding IndexedDB after remote save:",
          e
        );
      }
    }
    return result.success;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    return false;
  }
};

// Load onboarding data
export const loadOnboardingData =
  async (): Promise<OnboardingFormData | null> => {
    try {
      const data = await loadDataIndexedDB();
      if (data) return data;
      return await mockLoadData();
    } catch (error) {
      console.error("Error loading onboarding data:", error);
      try {
        return await mockLoadData();
      } catch (e) {
        console.error("Fallback load data failed", e);
        return null;
      }
    }
  };

// Load onboarding progress
export const loadOnboardingProgress =
  async (): Promise<OnboardingFormData | null> => {
    try {
      const data = await loadProgressIndexedDB();
      if (data) return data;
      return await mockLoadProgress();
    } catch (error) {
      console.error("Error loading onboarding progress:", error);
      try {
        return await mockLoadProgress();
      } catch (e) {
        console.error("Fallback load progress failed", e);
        return null;
      }
    }
  };

// Mock functions for fallback when IndexedDB is not available
const mockCheckStatus = async (): Promise<{ isComplete: boolean }> => {
  try {
    const status = localStorage.getItem("onboardingComplete");
    return { isComplete: status === "true" };
  } catch {
    return { isComplete: false };
  }
};

const mockSaveProgress = async (
  formData: OnboardingFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    localStorage.setItem(
      "onboardingProgress",
      JSON.stringify({
        ...formData,
        updatedAt: new Date().toISOString(),
      })
    );
    return { success: true, message: "Progress saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save progress" };
  }
};

const mockSaveData = async (
  formData: OnboardingFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    localStorage.setItem(
      "onboardingData",
      JSON.stringify({
        ...formData,
        updatedAt: new Date().toISOString(),
        id: formData.id || Date.now().toString(),
      })
    );
    localStorage.setItem("onboardingComplete", "true");
    return { success: true, message: "Data saved successfully" };
  } catch (error) {
    return { success: false, message: "Failed to save data" };
  }
};

const mockLoadData = async (): Promise<OnboardingFormData | null> => {
  try {
    const data = localStorage.getItem("onboardingData");
    if (data) return JSON.parse(data);
    const progress = localStorage.getItem("onboardingProgress");
    return progress ? JSON.parse(progress) : null;
  } catch {
    return null;
  }
};

const mockLoadProgress = async (): Promise<OnboardingFormData | null> => {
  try {
    const progress = localStorage.getItem("onboardingProgress");
    return progress ? JSON.parse(progress) : null;
  } catch {
    return null;
  }
};
