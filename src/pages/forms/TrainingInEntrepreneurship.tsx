import { useState } from "react";
import { TrainingInEntrepreneurshipSchema } from "../../components/Forms/form-schemas/TrainingInEnterprenuershipSchema";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { createFormSubmissionHandler } from "../../services/formSubmissionService";

function TrainingInEntrepreneurship() {
  const [formData, setFormData] = useState<any>({});
  const submitForm = createFormSubmissionHandler('training-in-entrepreneurship');

  const handleSubmit = async (data: any) => {
    try {
      const result = await submitForm(data, {
        submittedBy: data.requestorName || "Unknown"
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
    <div className="container mx-auto px-4 py-8" data-id="training-in-entrepreneurship-page">
      <ServiceRequestForm
        schema={TrainingInEntrepreneurshipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="training-in-entrepreneurship"
      />
    </div>
  );
}

// Export the specific form name
export const TrainingInEntrepreneurshipForm = TrainingInEntrepreneurship;
export default TrainingInEntrepreneurship;
