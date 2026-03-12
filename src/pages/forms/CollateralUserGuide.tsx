import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { collateralGuideSchema } from "../../components/Forms/form-schemas/CollateralUserGuide";
import { getFormConfig } from "../../config/formConfig";

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to convert any value to string safely
const safeString = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    // Handle file objects
    if (value instanceof File) {
      return value.name || "";
    }
    // Handle other objects
    return JSON.stringify(value);
  }
  return String(value);
};

function CollateralUserGuide() {
  const [formData, setFormData] = useState<any>({});
  const [formStatus, setFormStatus] = useState<"draft" | "submitted">("draft");
  const formConfig = getFormConfig('collateral-user-guide');

  const handleSubmit = async (data: any) => {
    try {
      console.log("📋 Form data received:", data);

      // Generate UUID
      const azureId = generateUUID();

      // Map form data to Power Apps schema
      // Note: 'name' is automatically populated with serviceName from formConfig
      const powerAppsPayload = {
        azureId: azureId,
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.submittedBy || ""),
        emailAddress: safeString(data.emailAddress || ""),
        telephoneNumber: safeString(data.telephoneNumber || ""),
        companyName: safeString(data.companyName || ""),
        companyNumber: safeString(data.companyNumber || ""),
        position: safeString(data.position || ""),
        assetName: safeString(data.assetName || ""),
        assetNumber: safeString(data.assetNumber || ""),
        additionalDetails: safeString(data.additionalDetails || ""),
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KF"
      };

      console.log("📤 Power Apps payload:", powerAppsPayload);

      // Submit to Power Apps backend
      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/collateral/create-collateraluserguide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(powerAppsPayload),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`API Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API response:", result);
      
      // Update status to "submitted" only after successful submission
      setFormStatus("submitted");
      console.log("✅ Form status updated to: submitted");
      
      alert("✅ Collateral user guide request submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      alert(`❌ Failed to submit collateral user guide request: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    // Status remains "draft" when form is saved
  };

  return (
    <div className="container mx-auto px-4 py-8" data-id="collateral-user-guide-page">
      <ServiceRequestForm
        schema={collateralGuideSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="collateral-user-guide"
      />
    </div>
  );
}

// Export the specific form name
export const CollateralUserGuideForm = CollateralUserGuide;
export default CollateralUserGuide;