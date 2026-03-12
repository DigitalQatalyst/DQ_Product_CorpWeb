import React from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertCircleIcon } from "lucide-react";
import { businessDetailsSchema } from "./validationSchemas";

interface FormData {
  formId: string;
  userId: string;
  companyName: string;
  industry: string;
  businessType: string;
  companyStage: string;
  contactName: string;
  email: string;
  phone: string;
  registrationNumber: string;
  establishmentDate: string;
  businessSize: string;
}

interface Step1Props {
  formData: FormData;
  onDataChange: (data: FormData) => void;
  onValidationChange: (isValid: boolean) => void;
  onValidationTrigger?: (triggerFn: () => Promise<boolean>) => void;
}

export function Step1({
  formData,
  onDataChange,
  onValidationChange,
  onValidationTrigger,
}: Step1Props) {
  const {
    control,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(businessDetailsSchema) as Resolver<FormData>,
    defaultValues: {
      formId: formData.formId || "",
      userId: formData.userId || "",
      companyName: formData.companyName || "",
      industry: formData.industry || "",
      businessType: formData.businessType || "",
      companyStage: formData.companyStage || "",
      contactName: formData.contactName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      registrationNumber: formData.registrationNumber || "",
      establishmentDate: formData.establishmentDate || "",
      businessSize: formData.businessSize || "",
    },
    mode: "onBlur",
  });

  // Watch for form changes and update parent
  React.useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as FormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  // Update validation status when errors change
  React.useEffect(() => {
    console.log("Step1 validation status:", isValid, "Errors:", errors);
    onValidationChange(isValid);
  }, [isValid, onValidationChange, errors]);

  // Expose validation trigger function to parent
  React.useEffect(() => {
    if (onValidationTrigger) {
      onValidationTrigger(async () => {
        const result = await trigger();
        console.log("Step1 validation trigger result:", result);
        return result;
      });
    }
  }, [trigger, onValidationTrigger]);

  const renderTooltip = (tooltipText: string) => {
    return (
      <div className="group relative inline-block ml-1">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-400 cursor-help"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <div className="absolute z-10 w-64 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-1 pointer-events-none">
          {tooltipText}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Business Details
        </h2>
        <p className="text-gray-600">
          Please provide the following essential details
        </p>
      </div>

      <div className="space-y-10">
        {/* Company Identity Section */}
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-2">
            <h3 className="text-lg font-medium text-gray-800">
              Company Identity
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Basic information about your business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Company Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your company name"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.companyName && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.companyName.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your official company name
              </p>
            </div>

            {/* Industry Field */}
            <div className="space-y-2">
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-gray-700"
              >
                Industry
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="industry"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your industry"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.industry
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.industry && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.industry.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The industry your business operates in
              </p>
            </div>

            {/* Business Type Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-700"
              >
                Business Type
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="businessType"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessType
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select business type</option>
                    <option value="Technology">Technology</option>
                    <option value="Retail">Retail</option>
                    <option value="Services">Services</option>
                    <option value="Others">Others</option>
                  </select>
                )}
              />
              {errors.businessType && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessType.message}</span>
                </div>
              )}
            </div>

            {/* Company Stage Field */}
            <div className="space-y-2">
              <label
                htmlFor="companyStage"
                className="block text-sm font-medium text-gray-700"
              >
                Company Stage
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="companyStage"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.companyStage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select company stage</option>
                    <option value="Start Up">Start Up</option>
                    <option value="Scale Up">Scale Up</option>
                    <option value="Expansion">Expansion</option>
                  </select>
                )}
              />
              {errors.companyStage && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.companyStage.message}</span>
                </div>
              )}
            </div>

            {/* Contact Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="contactName"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="contactName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter contact person name"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.contactName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.contactName && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.contactName.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Primary contact person for this application
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.email.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Primary email address for communication
              </p>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    placeholder="Enter phone number"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.phone && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.phone.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Primary phone number for contact
              </p>
            </div>

            {/* Registration Number Field */}
            <div className="space-y-2">
              <label
                htmlFor="registrationNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Registration Number
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your registration number"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.registrationNumber
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.registrationNumber && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.registrationNumber.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Your official business registration number
              </p>
            </div>

            {/* Establishment Date Field */}
            <div className="space-y-2">
              <label
                htmlFor="establishmentDate"
                className="block text-sm font-medium text-gray-700"
              >
                Establishment Date
                <span className="ml-1 text-red-500">*</span>
              </label>
              <Controller
                name="establishmentDate"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    placeholder="YYYY-MM-DD"
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.establishmentDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">YYYY-MM-DD</p>
              {errors.establishmentDate && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.establishmentDate.message}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                The date your company was officially established
              </p>
            </div>

            {/* Business Size Field */}
            <div className="space-y-2">
              <label
                htmlFor="businessSize"
                className="block text-sm font-medium text-gray-700 items-center"
              >
                Business Size
                <span className="ml-1 text-red-500">*</span>
                {renderTooltip(
                  "Business size determines eligibility for certain programs and support services"
                )}
              </label>
              <Controller
                name="businessSize"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.businessSize
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select business size</option>
                    <option value="Micro (1-9 employees)">
                      Micro (1-9 employees)
                    </option>
                    <option value="Small (10-49 employees)">
                      Small (10-49 employees)
                    </option>
                    <option value="Medium (50-249 employees)">
                      Medium (50-249 employees)
                    </option>
                    <option value="Large (250+ employees)">
                      Large (250+ employees)
                    </option>
                  </select>
                )}
              />
              {errors.businessSize && (
                <div className="text-red-500 text-sm mt-1 flex items-start">
                  <AlertCircleIcon
                    size={14}
                    className="mr-1.5 flex-shrink-0 mt-0.5"
                  />
                  <span>{errors.businessSize.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
