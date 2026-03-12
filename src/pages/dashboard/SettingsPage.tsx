import { useState } from "react";
import { Settings, Globe, Mail, Shield, Trash2, ChevronRight } from "lucide-react";

const SettingsPage = () => {
  const [language, setLanguage] = useState("English");
  const [emails, setEmails] = useState([
    { id: 1, email: "sarah@company.com", isPrimary: true },
    { id: 2, email: "sarah.chen@personal.com", isPrimary: false },
  ]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleRemoveEmail = (id: number) => {
    setEmails(emails.filter((email) => email.id !== id));
  };

  const handleDeleteAccount = () => {
    console.log("Account deletion requested");
    setShowDeleteConfirmation(false);
    // Add account deletion logic here
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="text-primary" size={28} />
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            </div>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>

          <div className="space-y-6">
            {/* Preferred Language */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Preferred Language
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Choose your preferred language for the DQ platform
                  </p>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>English</option>
                    <option>Arabic</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Chinese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Email Addresses */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Addresses
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage email addresses associated with your account
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {emails.map((emailItem) => (
                  <div
                    key={emailItem.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-gray-400" />
                      <div>
                        <div className="text-gray-900">{emailItem.email}</div>
                        {emailItem.isPrimary && (
                          <span className="text-xs text-primary font-medium">Primary</span>
                        )}
                      </div>
                    </div>
                    {!emailItem.isPrimary && (
                      <button
                        onClick={() => handleRemoveEmail(emailItem.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Remove email"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
                <span className="text-xl">+</span>
                <span>Add Email Address</span>
              </button>
            </div>

            {/* Privacy and Cookie Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Privacy and Cookie Settings
                  </h2>
                  <p className="text-sm text-gray-600">
                    Control how we use your data and manage cookie preferences
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Privacy Settings</div>
                    <div className="text-sm text-gray-600">Manage your privacy preferences</div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Cookie Preferences</div>
                    <div className="text-sm text-gray-600">Control cookie settings</div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">Data Download</div>
                    <div className="text-sm text-gray-600">Download a copy of your data</div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Delete My DQ Account */}
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="text-red-600" size={20} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Delete My DQ Account
                  </h2>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Account
              </button>
            </div>
          </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Delete Account?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete your account? This will permanently remove all your data,
              saved items, and preferences. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
