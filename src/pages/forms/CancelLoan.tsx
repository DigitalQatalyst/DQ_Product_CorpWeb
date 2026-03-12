import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { loanCancellationSchema } from "../../components/Forms/form-schemas/CancelLoans";
import { getFormConfig } from "../../config/formConfig";

function CancelLoan() {
  const [formData, setFormData] = useState<any>({});
  const [formStatus, setFormStatus] = useState<"draft" | "submitted">("draft");
  const formConfig = getFormConfig('cancel-loan');

  // Custom submission handler for Cancel Loan to match Power Apps backend schema
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

      // Generate sequence number (in production, this should come from a sequence generator)
      const generateSequenceNumber = () => {
        return Math.floor(Math.random() * 9000) + 1000; // Random number between 1000-9999
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
        sequenceNumber: generateSequenceNumber(),
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.submittedBy || "Unknown"),
        emailAddress: safeString(data.emailAddress),
        telephoneNumber: safeString(data.telephoneNumber),
        companyName: safeString(data.companyName),
        companyNumber: safeString(data.companyNumber),
        position: safeString(data.position),
        fundingNumber: safeString(data.fundingNumber),
        cancellationDetails: safeString(data.cancellationDetails),
        consentAcknowledgement: data.consentAcknowledgement ? "consent" : "",
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KFS"
      };

      console.log("📤 Submitting Cancel Loan Request:", powerAppsPayload);

      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/loan/cancel-loan', {
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
      
      alert("Loan cancellation request submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error.message);
      alert(`Failed to submit loan cancellation request: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("💾 Form saved:", data);
    setFormData(data);
    // Status remains "draft" when form is saved
  };

  return (
    <div className="container mx-auto px-4 py-8" data-id="cancel-loan-page">
      <ServiceRequestForm
        schema={loanCancellationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="cancel-loan"
      />
    </div>
  );
}

export const CancelLoanForm = CancelLoan;
export default CancelLoan;
