import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { amendExistingLoanSchema } from "../../components/Forms/form-schemas/AmendExistingLoanSchema";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";

function RequestToAmendExistingLoanDetails() {
  const [formData, setFormData] = useState<any>({});
  const submitForm = createFormSubmissionHandler('request-to-amend-existing-loan-details');

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.applicantName || data.name || "Unknown"
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
    <div className="container mx-auto px-4 py-8" data-id="request-to-amend-existing-loan-details-page">
      <ServiceRequestForm
        schema={amendExistingLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-to-amend-existing-loan-details"
      />
    </div>
  );
}

// Export the specific form name
export const RequestToAmendExistingLoanDetailsForm =
  RequestToAmendExistingLoanDetails;
export default RequestToAmendExistingLoanDetails;
