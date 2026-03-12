import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { Step4 } from "./step4";
import { Step5 } from "./step5";
import { ProgressIndicator } from "./progressIndicator";

import { ArrowLeftIcon } from "lucide-react";
import { onboardingSteps } from "../../../config/onboardingSteps";
import { useAutoSave } from "../../../hooks/useAutoSave";
import { useOnboardingFormRHF } from "../../../hooks/useOnboardingFormRHF";
import { ReviewStep } from "../../../steps/ReviewStep";
import { WelcomeStep } from "../../../steps/WelcomeStep";
import { StepNavigation } from "../../../components/NavigationButtons";
import { useCallback, useMemo } from "react";

interface OnboardingFormProps {
  onComplete: () => void;
  isRevisit?: boolean;
}

export function OnboardingForm({
  onComplete,
  isRevisit = false,
}: OnboardingFormProps) {
  // Custom hooks for state management
  const {
    currentStep,
    formData,
    loading,
    showStepsDropdown,
    setCurrentStep,
    setShowStepsDropdown,
    validateCurrentStep,
    handleStepDataChange,
    handleStepValidationChange,
    registerStepValidationTrigger,
    handleSubmit: submitForm,
    getStepCompletionStatus,
  } = useOnboardingFormRHF(onboardingSteps, onComplete);

  const { autoSaving, progressSaved, saveProgress } = useAutoSave(
    formData,
    currentStep
  );

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      await saveProgress();
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    } else {
      // Scroll to first error field
      const firstErrorElement = document.querySelector(".border-red-300");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [validateCurrentStep, saveProgress, currentStep, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep, setCurrentStep]);

  const handleSubmit = useCallback(async () => {
    if (isRevisit) {
      onComplete();
    } else {
      await submitForm();
    }
  }, [isRevisit, onComplete, submitForm]);

  // Memoize step data objects to prevent unnecessary re-renders
  const step1FormData = useMemo(
    () => ({
      formId: String(formData.formId || ""),
      userId: String(formData.userId || ""),
      companyName: String(formData.companyName || ""),
      industry: String(formData.industry || ""),
      businessType: String(formData.businessType || ""),
      companyStage: String(formData.companyStage || ""),
      contactName: String(formData.contactName || ""),
      email: String(formData.email || ""),
      phone: String(formData.phone || ""),
      registrationNumber: String(formData.registrationNumber || ""),
      establishmentDate: String(formData.establishmentDate || ""),
      businessSize: String(formData.businessSize || ""),
    }),
    [
      formData.formId,
      formData.userId,
      formData.companyName,
      formData.industry,
      formData.businessType,
      formData.companyStage,
      formData.contactName,
      formData.email,
      formData.phone,
      formData.registrationNumber,
      formData.establishmentDate,
      formData.businessSize,
    ]
  );

  const step2FormData = useMemo(
    () => ({
      businessPitch: String(formData.businessPitch || ""),
      problemStatement: String(formData.problemStatement || ""),
    }),
    [formData.businessPitch, formData.problemStatement]
  );

  const step3FormData = useMemo(
    () => ({
      address: String(formData.address || ""),
      city: String(formData.city || ""),
      country: String(formData.country || ""),
      website: String(formData.website || ""),
    }),
    [formData.address, formData.city, formData.country, formData.website]
  );

  const step4FormData = useMemo(
    () => ({
      employeeCount: Number(formData.employeeCount) || 0,
      founders: String(formData.founders || ""),
      foundingYear: String(formData.foundingYear || ""),
    }),
    [formData.employeeCount, formData.founders, formData.foundingYear]
  );

  const step5FormData = useMemo(
    () => ({
      initialCapitalUsd: Number(formData.initialCapitalUsd) || 0,
      fundingNeedsUsd: Number(formData.fundingNeedsUsd) || 0,
      businessRequirements: String(formData.businessRequirements || ""),
      businessNeeds: String(formData.businessNeeds || ""),
    }),
    [
      formData.initialCapitalUsd,
      formData.fundingNeedsUsd,
      formData.businessRequirements,
      formData.businessNeeds,
    ]
  );

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];
    switch (step.type) {
      case "welcome":
        return (
          <WelcomeStep
            formData={{
              tradeName: String(formData.companyName || ""),
              industry: String(formData.industry || ""),
              companyStage: String(formData.companyStage || ""),
              contactName: String(formData.contactName || ""),
              email: String(formData.email || ""),
              phone: String(formData.phone || ""),
            }}
            isRevisit={isRevisit}
          />
        );

      case "review":
        return <ReviewStep formData={formData} isRevisit={isRevisit} />;

      case "form":
        // Use specific step components based on step ID
        switch (step.id) {
          case "business":
            return (
              <Step1
                formData={step1FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );
          case "profile":
            return (
              <Step2
                formData={step2FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "location":
            return (
              <Step3
                formData={step3FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "operations":
            return (
              <Step4
                formData={step4FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );

          case "funding":
            return (
              <Step5
                formData={step5FormData}
                onDataChange={handleStepDataChange}
                onValidationChange={handleStepValidationChange}
                onValidationTrigger={registerStepValidationTrigger}
              />
            );
          default:
            return null;
        }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 md:py-20">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
        {/* Back to Dashboard button (only when revisiting) */}
        {isRevisit && (
          <div className="mb-6">
            <button
              onClick={onComplete}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon size={16} className="mr-1" />
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Progress Indicator */}
        <ProgressIndicator
          steps={onboardingSteps}
          currentStep={currentStep}
          showStepsDropdown={showStepsDropdown}
          autoSaving={autoSaving}
          progressSaved={progressSaved}
          onToggleDropdown={() => setShowStepsDropdown(!showStepsDropdown)}
          getStepCompletionStatus={getStepCompletionStatus}
        />

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10 relative">
          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={onboardingSteps.length}
            loading={loading}
            isRevisit={isRevisit}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSaveProgress={saveProgress}
            onSubmit={handleSubmit}
            savingProgress={autoSaving}
          />
        </div>
      </div>
    </div>
  );
}
