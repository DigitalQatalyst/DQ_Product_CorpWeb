import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { RequestForMembershipSchema } from "../../components/Forms/form-schemas/RequestForMembershipSchema";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";

function RequestForMembership() {
  const [formData, setFormData] = useState<any>({});
  const submitForm = createFormSubmissionHandler('request-for-membership');

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.applicantFullName || data.name || "Unknown"
      });
      
      console.log("✅ API response:", result);
    } catch (error: any) {
      console.error("❌ Submission error:", error.message);
    }
  };

  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
  };

  return (
    <div className="container mx-auto px-4 py-8" data-id="request-for-membership-page">
      <ServiceRequestForm
        schema={RequestForMembershipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-for-membership"
      />
    </div>
  );
}

// Export the specific form name
export const RequestForMembershipForm = RequestForMembership;
export default RequestForMembership;
