import React from 'react';
import {BuildingIcon} from 'lucide-react';
import {profileConfig} from '../utils/profileConfig';

interface WelcomeData {
    tradeName?: string;
    industry?: string;
    companyStage?: string;
    contactName?: string;
    email?: string;
    phone?: string;
}

export function WelcomeStep({
                                formData,
                                isRevisit,
                            }: {
    formData: WelcomeData;
    isRevisit?: boolean;
}) {
    const companyStageInfo = profileConfig.companyStages.find(
        stage => stage.id === formData.companyStage
    ) || profileConfig.companyStages[0];

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <div className="bg-blue-100 p-5 rounded-full">
                    <BuildingIcon size={44} className="text-blue-600"/>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {isRevisit ? 'Review Your Onboarding Information' : 'Welcome to Enterprise Journey'}
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    {isRevisit
                        ? 'You can review your onboarding information here.'
                        : 'We already have some information from your sign-up. Please review it and complete a few additional details to get started.'}
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-medium text-gray-800">Your Information</h3>
                </div>

                <div className="space-y-4">
                    {[
                        {key: 'tradeName', label: 'Company Name'},
                        {key: 'industry', label: 'Industry'},
                        {key: 'companyStage', label: 'Company Stage', special: 'stage'},
                        {key: 'contactName', label: 'Contact Name'},
                        {key: 'email', label: 'Email'},
                        {key: 'phone', label: 'Phone'},
                    ].map(item => (
                        <div key={item.key} className="flex justify-between">
                            <span className="text-sm font-medium text-gray-500">{item.label}:</span>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-800 flex items-center">
                                    {item.special === 'stage' ? (
                                        <>
                                            {companyStageInfo.label || 'Not provided'}
                                            <span
                                                className={`ml-2 inline-block w-2 h-2 rounded-full ${companyStageInfo.color}`}/>
                                        </>
                                    ) : (
                                        // Access typed fields safely
                                        (formData as WelcomeData)[item.key as keyof WelcomeData] || 'Not provided'
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                <p className="text-sm text-blue-700">
                    {isRevisit
                        ? 'You can navigate through all steps to review and update your information. Your changes will be saved automatically.'
                        : "We'll guide you through a few steps to complete your business profile. Your progress will be saved automatically."}
                </p>
            </div>
        </div>
    );
}