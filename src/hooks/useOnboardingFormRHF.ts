/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { onboardingSchema } from "../pages/dashboard/onboarding/validationSchemas";
import { useAuth } from "../contexts/AuthContext";
import {
  loadOnboardingData,
  loadOnboardingProgress,
} from "../services/onboardingService";
import { resetOnboardingIndexedDB } from "../services/idbOnboarding";

interface Step {
  id: string;
  title: string;
  type: string;
  sections?: Array<{
    title: string;
    description?: string;
    fields?: Array<{
      fieldName: string;
      required?: boolean;
    }>;
  }>;
  fields?: Array<{
    fieldName: string;
    required?: boolean;
  }>;
}

export function useOnboardingFormRHF(steps: Step[], onComplete: () => void) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStepsDropdown, setShowStepsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stepValidationStatus, setStepValidationStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [stepValidationTriggers, setStepValidationTriggers] = useState<{
    [key: number]: () => Promise<boolean>;
  }>({});

  const stepsDropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Initialize React Hook Form with combined schema
  const form = useForm({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      // Required fields from API schema
      formId: uuidv4(),
      userId: user?.id || "",
      companyName: "",
      industry: "",
      businessType: "",
      companyStage: "",
      contactName: "",
      email: "",
      phone: "",

      // Business Details
      registrationNumber: "",
      establishmentDate: "",
      businessSize: "",

      // Business Profile
      businessPitch: "",
      problemStatement: "",

      // Location & Contact
      address: "",
      city: "",
      country: "",
      website: "",

      // Operations
      employeeCount: 0,
      founders: "",
      foundingYear: "",

      // Funding
      initialCapitalUsd: 0,
      fundingNeedsUsd: 0,
      businessRequirements: "",
      businessNeeds: "",
    },
    mode: "onChange",
  });

  const {
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = form;

  // Subscribe to form values via react-hook-form so we get updates
  // only when fields change. Avoid calling getValues() every render
  // because that returns a new object and can cause excessive re-renders.
  const currentFormData = watch();

  // Load initial data and ensure user ID and formId are set
  useEffect(() => {
    const loadData = async () => {
      const currentValues = getValues();

      // Ensure user ID is set when user becomes available
      if (user?.id) {
        const currentUserId = currentValues.userId;
        if (!currentUserId || currentUserId === "") {
          console.log("Setting userId from auth:", user.id);
          setValue("userId", user.id);
        }
      }

      // Ensure formId is set
      if (!currentValues.formId || currentValues.formId === "") {
        const newFormId = uuidv4();
        console.log("Setting formId:", newFormId);
        setValue("formId", newFormId);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, user]); // Removed getValues from dependencies to prevent infinite loop

  // Load saved progress/data from storage (IndexedDB/localStorage/mockAPI)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const progress = await loadOnboardingProgress();
        const data = progress || (await loadOnboardingData());
        if (!data || cancelled) return;

        // Restore values into the form
        Object.entries(data).forEach(([key, value]) => {
          if (key === "currentStep") {
            const stepNum = Number(value || 0);
            setCurrentStep(stepNum);
          } else {
            try {
              setValue(key as any, value);
            } catch (e) {
              // Ignore unknown fields
            }
          }
        });

        console.log("Restored onboarding data from storage", data);
      } catch (e) {
        console.error("Failed to load saved onboarding progress:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        stepsDropdownRef.current &&
        !stepsDropdownRef.current.contains(event.target)
      ) {
        setShowStepsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Validate current step
  const validateCurrentStep = async () => {
    if (currentStep === 0) return true; // Welcome step - always valid
    if (currentStep === steps.length - 1) return true; // Review step

    console.log("Validating step:", currentStep);
    console.log("Step validation triggers:", stepValidationTriggers);
    console.log("Step validation status:", stepValidationStatus);

    // Use the step's own validation trigger if available
    const stepTrigger = stepValidationTriggers[currentStep];
    if (stepTrigger) {
      const result = await stepTrigger();
      console.log("Step trigger result:", result);
      return result;
    }

    // Fallback to checking step validation status
    const statusResult = stepValidationStatus[currentStep];
    console.log("Step validation status result:", statusResult);
    return statusResult;
  };

  // Get step completion status
  const getStepCompletionStatus = (stepIndex: number): boolean => {
    if (stepIndex === 0 || stepIndex === steps.length - 1) return true;

    const step = steps[stepIndex];
    const fields: Array<{ fieldName: string; required?: boolean }> = [];

    if (step.sections) {
      step.sections.forEach((section) => {
        if (section.fields) fields.push(...section.fields);
      });
    } else if (step.fields) {
      fields.push(...step.fields);
    }

    return fields.every((field) => {
      if (!field.required) return true;

      const value: any = getValues(field.fieldName as any);
      return (
        value && (typeof value !== "string" || (value as string).trim() !== "")
      );
    });
  };

  // Handle step data change
  const handleStepDataChange = useCallback(
    (stepData: any) => {
      Object.entries(stepData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    },
    [setValue]
  );

  // Handle step validation change
  const handleStepValidationChange = useCallback(
    (isValid: boolean) => {
      // Track individual step validation status
      setStepValidationStatus((prev) => ({
        ...prev,
        [currentStep]: isValid,
      }));
    },
    [currentStep]
  );

  // Register step validation trigger
  const registerStepValidationTrigger = useCallback(
    (triggerFn: () => Promise<boolean>) => {
      setStepValidationTriggers((prev) => ({
        ...prev,
        [currentStep]: triggerFn,
      }));
    },
    [currentStep]
  );

  // Simple form submission function
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);

      // Get all form data and generate new UUID for this submission
      const formData = getValues();
      formData.formId = uuidv4(); // Generate new UUID for each submission
      formData.userId = user?.id || ""; // Ensure we have the current user ID

      console.log("formData", formData);

      // Simple API call - replace with your actual endpoint
      const response = await fetch(
        "https://kfrealexpressserver.vercel.app/api/v1/auth/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Success - complete onboarding
        onComplete();
        await resetOnboardingIndexedDB();
      } else {
        // Handle error
        console.error("Submission failed:", await response.json());
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getValues, onComplete, user]);

  // Handle jump to step
  const handleJumpToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex !== currentStep) {
        setCurrentStep(stepIndex);
        window.scrollTo(0, 0);
        setShowStepsDropdown(false);
      }
    },
    [currentStep]
  );

  return {
    // Form state
    currentStep,
    formData: currentFormData,
    errors,
    isValid,
    showStepsDropdown,
    loading,
    stepsDropdownRef,

    // Form methods
    form,
    watch,
    setValue,
    getValues,

    // Actions
    setCurrentStep,
    setShowStepsDropdown,
    validateCurrentStep,
    handleStepDataChange,
    handleStepValidationChange,
    registerStepValidationTrigger,
    handleSubmit,
    handleJumpToStep,
    getStepCompletionStatus,
  };
}
