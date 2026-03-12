import { useState } from "react";
import { FormLayout } from "../../components/layouts/FormLayout";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { RequestForFundingSchema } from "../../components/Forms/form-schemas/RequestForFundingSchema";
import { getFormConfig } from "../../config/formConfig";

function RequestForFunding() {
  const [formData, setFormData] = useState<any>({});
  const [formStatus, setFormStatus] = useState<"draft" | "submitted">("draft");
  const formConfig = getFormConfig('request-for-funding');

  // Custom submission handler for Request for Funding to match Power Apps backend schema
  const handleSubmit = async (data: any) => {
    try {
      // Generate a UUID for azureId (in production, this should come from user authentication)
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Helper function to safely convert values to strings
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

      // Map form data to Power Apps backend schema (all values as strings)
      // Note: 'name' is automatically populated with serviceName from formConfig
      const powerAppsPayload = {
        azureId: generateUUID(),
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.emailAddress || "Unknown"), // Use email as fallback since no submittedBy field
        emailAddress: safeString(data.emailAddress),
        telephoneNumber: safeString(data.telephoneNumber),
        companyName: safeString(data.companyName),
        companyNumber: safeString(data.companyNumber),
        position: safeString(data.position),
        fundingProgram: safeString(data.fundingProgram),
        projectName: safeString(data.projectName),
        currentInvestment: safeString(data.currentInvestment || "0"),
        loanAmount: safeString(data.loanAmount || "0"),
        minContribution: safeString(data.minContribution || "0"),
        TradeLicence: safeString(data.TradeLicence),
        scoredReport: safeString(data.scoredReport),
        consentAcknowledgement: data.consentAcknowledgement ? "I confirm" : "",
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KFS"
      };

      console.log("📤 Submitting Request for Funding:", powerAppsPayload);

      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/funding/requestfunding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(powerAppsPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("✅ API response:", result);
      
      // Update status to "submitted" only after successful submission
      setFormStatus("submitted");
      console.log("✅ Form status updated to: submitted");
      alert("Funding request submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error.message);
      alert(`Failed to submit funding request: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    // Status remains "draft" when form is saved
  };

  return (
    <div className="container mx-auto px-4 py-8" data-id="request-for-funding-page">
      <ServiceRequestForm
        schema={RequestForFundingSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-for-funding"
      />
    </div>
  );
}

// Export the specific form name
export const RequestForFundingForm = RequestForFunding;
export default RequestForFunding;
