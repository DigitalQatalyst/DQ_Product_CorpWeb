import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { bookConsultationSchema } from "../../components/Forms/form-schemas/BookConsultation";
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

function BookConsultationForEntrepreneurship() {
  const [formData, setFormData] = useState<any>({});
  const [formStatus, setFormStatus] = useState<"draft" | "submitted">("draft");
  const formConfig = getFormConfig('book-consultation-for-entrepreneurship');

  const handleSubmit = async (data: any) => {
    try {
      console.log("📋 Form data received:", data);
      console.log("📊 Form data keys:", Object.keys(data));
      console.log("📊 Form data values:", Object.values(data));
      
      // Check each field individually
      console.log("🔍 Field-by-field analysis:");
      const fields = [
        'name', 'submittedBy', 'emailAddress1', 'mobileNumber', 'position',
        'companyName', 'compannyNumber', 'consultationType', 'consultationName',
        'existingBusiness', 'businessOwnership', 'worksHere', 'selectedAdvice', 'otherAdvices'
      ];
      
      fields.forEach(field => {
        const value = data[field];
        console.log(`  ${field}: "${value}" (type: ${typeof value})`);
      });

      // Generate UUID
      const azureId = generateUUID();

      // Map form data to Power Apps schema with all required fields
      // Note: 'name' is automatically populated with serviceName from formConfig
      const powerAppsPayload = {
        azureId: azureId,
        name: formConfig.serviceName, // Automatically populated with service name
        submittedBy: safeString(data.submittedBy || ""),
        emailAddress1: safeString(data.emailAddress1 || ""),
        mobileNumber: safeString(data.mobileNumber || ""),
        position: safeString(data.position || ""),
        companyName: safeString(data.companyName || ""),
        compannyNumber: safeString(data.compannyNumber || ""),
        consultationType: safeString(data.consultationType || ""),
        consultationName: safeString(data.consultationName || ""),
        existingBusiness: safeString(data.existingBusiness || ""),
        businessOwnership: safeString(data.businessOwnership || ""),
        worksHere: safeString(data.worksHere || ""),
        selectedAdvice: safeString(data.selectedAdvice || ""),
        otherAdvices: safeString(data.otherAdvices || "no advice"), // Ensure this is never empty
        serviceName: formConfig.serviceName,
        category: formConfig.category, // Automatically from config
        status: "submitted", // Set to "submitted" when form is being submitted
        serviceProvider: "KF"
      };

      console.log("📤 Power Apps payload:", powerAppsPayload);
      console.log("📊 Payload keys:", Object.keys(powerAppsPayload));
      console.log("📊 Payload values:", Object.values(powerAppsPayload));

      // Submit to Power Apps backend
      const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/consultation/book-consultation', {
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
      
      alert("✅ Consultation booking submitted successfully!");
      
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      alert(`❌ Failed to submit consultation booking: ${error.message}`);
      // Status remains "draft" on error
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    // Status remains "draft" when form is saved
  };

  return (
    <div className="container mx-auto px-4 py-8" data-id="book-consultation-for-entrepreneurship-page">
      <ServiceRequestForm
        schema={bookConsultationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="book-consultation-for-entrepreneurship"
      />
    </div>
  );
}

// Export the specific form name
export const BookConsultationForEntrepreneurshipForm =
  BookConsultationForEntrepreneurship;
export default BookConsultationForEntrepreneurship;