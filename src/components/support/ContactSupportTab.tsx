import React, { useState } from 'react';
import {
    PaperclipIcon,
    SendIcon,
    PhoneIcon,
    MessageSquareIcon,
    MailIcon,
} from 'lucide-react';
import { PrimaryButton } from '../PageLayout';
import { getFormConfig } from '../../config/formConfig';

export default function ContactSupportTab() {
    const formConfig = getFormConfig('contact-support');
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
        attachments: [] as File[],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            setFormData((prev) => ({
                ...prev,
                attachments: [...prev.attachments, ...fileList],
            }));
        }
    };
    const removeAttachment = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };
    const submitToPowerApps = async (data: typeof formData) => {
        try {
            // Generate a UUID for azureId (in production, this should come from user authentication)
            const generateUUID = () => {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            // Convert file attachments to URLs (in production, upload files first and get URLs)
            const attachmentUrls = data.attachments.map(file => 
                `https://example.com/uploads/${file.name}` // Placeholder URL
            );

            // Map form data to Power Apps backend schema
            const powerAppsPayload = {
                azureId: generateUUID(),
                fullName: data.fullName || "",
                emailAddress: data.emailAddress || "",
                subject: data.subject || "",
                category: data.category === 'technical' ? 'Technical Issue' : 
                         data.category === 'billing' ? 'Billing Question' :
                         data.category === 'account' ? 'Account Management' :
                         data.category === 'feature' ? 'Feature Request' : 'Other',
                priority: data.priority === 'critical' ? 'Critical' :
                         data.priority === 'high' ? 'High' :
                         data.priority === 'medium' ? 'Medium' : 'Low',
                message: data.message || "",
                attachments: attachmentUrls,
                serviceName: formConfig.serviceName,
                category: formConfig.category, // Automatically from config
                status: "submitted"
            };

            console.log("📤 Submitting Support Request:", powerAppsPayload);

            const response = await fetch('https://kfrealexpressserver.vercel.app/api/v1/support/create-support-request', {
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

            return await response.json();
        } catch (error) {
            console.error('Error submitting to Power Apps:', error);
            throw error;
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // Submit to Power Apps backend
            const result = await submitToPowerApps(formData);
            console.log("✅ Support request submitted successfully:", result);
            setIsSubmitted(true);
            
            // Reset form
            setFormData({
                fullName: '',
                emailAddress: '',
                subject: '',
                category: '',
                priority: 'medium',
                message: '',
                attachments: [],
            });
        } catch (error: any) {
            setSubmitError(
                `There was an error submitting your request: ${error.message}. Please try again.`,
            );
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-md flex flex-col items-center text-center">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 sm:mb-3">
                        <PhoneIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        Phone Support
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Available Monday-Friday, 9 AM - 5 PM
                    </p>
                    <a
                        href="tel:+18001234567"
                        className="mt-1 sm:mt-2 text-blue-600 font-medium text-sm sm:text-base"
                    >
                        (800) 123-4567
                    </a>
                </div>
                <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-md flex flex-col items-center text-center">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 sm:mb-3">
                        <MessageSquareIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        Live Chat
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Get instant help from our support agents
                    </p>
                    <button 
                        className="mt-1 sm:mt-2 text-blue-600 font-medium text-sm sm:text-base hover:text-blue-800 transition-colors"
                        onClick={() => window.location.href = '/dashboard/chat-support'}
                    >
                        Start Chat Session
                    </button>
                </div>
                <div className="bg-white p-3 sm:p-4 border border-gray-200 rounded-md flex flex-col items-center text-center sm:col-span-2 lg:col-span-1">
                    <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2 sm:mb-3">
                        <MailIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                        Email Support
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        We usually respond within 24 hours
                    </p>
                    <a
                        href="mailto:support@example.com"
                        className="mt-1 sm:mt-2 text-blue-600 font-medium text-sm sm:text-base"
                    >
                        support@ejp.com
                    </a>
                </div>
            </div>
            {/* Support Ticket Form */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                        Submit a Support Ticket
                    </h3>
                </div>
                {isSubmitted ? (
                    <div className="p-4 sm:p-6 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Ticket Submitted Successfully
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Thank you for contacting us. Your ticket has been received and
                            we'll respond as soon as possible.
                        </p>
                        <div className="mt-5">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setIsSubmitted(false)}
                            >
                                Submit Another Ticket
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Jimmy"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="emailAddress"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="emailAddress"
                                    id="emailAddress"
                                    required
                                    value={formData.emailAddress}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="jameswafula2002@gmail.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                required
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Support"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    required
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select a category</option>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="account">Account Management</option>
                                    <option value="feature">Feature Request</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    id="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Message
                            </label>
                            <textarea
                                name="message"
                                id="message"
                                rows={5}
                                required
                                value={formData.message}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="new login credentials"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attachments (Optional)
                            </label>
                            <div className="flex items-center">
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PaperclipIcon className="h-4 w-4 mr-2" />
                                    Attach Files
                                </label>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    multiple
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                                <span className="ml-2 text-xs sm:text-sm text-gray-500">
                                    Max 5 files, 10MB each
                                </span>
                            </div>
                            {formData.attachments.length > 0 && (
                                <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {formData.attachments.map((file, index) => (
                                        <li
                                            key={index}
                                            className="pl-3 pr-4 py-2 flex items-center justify-between text-sm"
                                        >
                                            <div className="w-0 flex-1 flex items-center">
                                                <PaperclipIcon className="flex-shrink-0 h-4 w-4 text-gray-400" />
                                                <span className="ml-2 flex-1 w-0 truncate">
                                                    {file.name}
                                                </span>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="font-medium text-red-600 hover:text-red-500 text-xs sm:text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {submitError && (
                            <div className="rounded-md bg-red-50 p-3 sm:p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{submitError}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="pt-2 flex justify-end sm:justify-end">
                            <PrimaryButton
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <SendIcon className="h-4 w-4 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
