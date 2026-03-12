import { useState } from "react";
import { Mail, Bell } from "lucide-react";

const EmailSubscriptionsPage = () => {
  const [deliveryFrequency, setDeliveryFrequency] = useState("daily");
  const [subscriptions, setSubscriptions] = useState({
    weeklyNewsletter: true,
    digitalTransformation: true,
    newContentAlerts: false,
    eventInvitations: true,
    productUpdates: false,
    personalizedRecommendations: true,
  });

  const [industrySectors, setIndustrySectors] = useState({
    agility: false,
    experience: true,
    farming: false,
    government: false,
    hospitality: false,
    infrastructure: false,
    logistics: false,
    plant: false,
    retail: true,
    service: true,
    wellness: false,
  });

  const [digitalDomains, setDigitalDomains] = useState({
    digitalChannels: false,
    digitalExperience: true,
    digitalServices: false,
    digitalMarketing: true,
    digitalWorkspace: false,
    digitalCore: false,
    digitalGPRC: false,
    digitalBackOffice: false,
    digitalInterOps: false,
    digitalSecurity: false,
    digitalIntelligence: true,
    digitalIT: false,
  });

  const handleToggle = (key: string) => {
    setSubscriptions((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSectorToggle = (key: string) => {
    setIndustrySectors((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleDomainToggle = (key: string) => {
    setDigitalDomains((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const selectedSectorsCount = Object.values(industrySectors).filter(Boolean).length;
  const selectedDomainsCount = Object.values(digitalDomains).filter(Boolean).length;

  const handleUnsubscribeAll = () => {
    if (
      window.confirm(
        "Are you sure you want to unsubscribe from all emails? You can always re-subscribe later."
      )
    ) {
      setSubscriptions({
        weeklyNewsletter: false,
        digitalTransformation: false,
        newContentAlerts: false,
        eventInvitations: false,
        productUpdates: false,
        personalizedRecommendations: false,
      });
    }
  };

  const subscriptionsList = [
    {
      key: "weeklyNewsletter",
      title: "DQ Weekly Newsletter",
      description: "Get the latest insights and articles delivered every week",
      frequency: "Weekly",
    },
    {
      key: "digitalTransformation",
      title: "Digital Transformation Updates",
      description: "Stay informed about new trends and best practices",
      frequency: "Bi-weekly",
    },
    {
      key: "newContentAlerts",
      title: "New Content Alerts",
      description: "Be the first to know when new content is published",
      frequency: "As published",
    },
    {
      key: "eventInvitations",
      title: "Event Invitations",
      description: "Receive invitations to webinars, workshops, and events",
      frequency: "Monthly",
    },
    {
      key: "productUpdates",
      title: "Product Updates",
      description: "Learn about new features and product improvements",
      frequency: "Monthly",
    },
    {
      key: "personalizedRecommendations",
      title: "Personalized Recommendations",
      description: "Get content recommendations based on your interests",
      frequency: "Weekly",
    },
  ];

  const categories = [
    { id: "newsletters", label: "Newsletters", icon: Mail },
    { id: "sectors", label: "Industry Sectors", icon: Bell },
    { id: "domains", label: "Digital Domains", icon: Bell },
  ];

  const [activeCategory, setActiveCategory] = useState("newsletters");

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-primary" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Email Subscriptions</h1>
            </div>
            <p className="text-gray-600">
              Manage your email preferences and stay updated with content you care about
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sticky top-4">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? "bg-secondary-600 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Newsletters Tab */}
              {activeCategory === "newsletters" && (
                <>
                  {/* Email Delivery Settings */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Bell className="text-primary mt-1" size={24} />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      Email Delivery Settings
                    </h2>
                    <p className="text-sm text-gray-600">
                      Choose how often you'd like to receive emails from us
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setDeliveryFrequency("asHappen")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      deliveryFrequency === "asHappen"
                        ? "bg-secondary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    As they happen
                  </button>
                  <button
                    onClick={() => setDeliveryFrequency("daily")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      deliveryFrequency === "daily"
                        ? "bg-secondary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Daily digest
                  </button>
                  <button
                    onClick={() => setDeliveryFrequency("weekly")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      deliveryFrequency === "weekly"
                        ? "bg-secondary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Weekly digest
                  </button>
                </div>
              </div>

              {/* Your Subscriptions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Your Subscriptions</h2>

                <div className="space-y-4">
                  {subscriptionsList.map((sub) => (
                    <div
                      key={sub.key}
                      className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{sub.title}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {sub.frequency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{sub.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(sub.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ml-4 flex-shrink-0 ${
                          subscriptions[sub.key as keyof typeof subscriptions]
                            ? "bg-primary"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            subscriptions[sub.key as keyof typeof subscriptions]
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unsubscribe from All */}
              <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
                <h3 className="font-bold text-gray-900 mb-2">Unsubscribe from All</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You'll stop receiving all emails from DQ. You can always re-subscribe later.
                </p>
                <button
                  onClick={handleUnsubscribeAll}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Unsubscribe from All Emails
                </button>
              </div>
                </>
              )}

              {/* Industry Sectors Tab */}
              {activeCategory === "sectors" && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Industry Sectors</h2>
                  <p className="text-gray-600 mb-6">
                    Select the industry sectors you're interested in to receive relevant content
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { key: "agility", label: "Agility 4.0" },
                      { key: "experience", label: "Experience 4.0" },
                      { key: "farming", label: "Farming 4.0" },
                      { key: "government", label: "Government 4.0" },
                      { key: "hospitality", label: "Hospitality 4.0" },
                      { key: "infrastructure", label: "Infrastructure 4.0" },
                      { key: "logistics", label: "Logistics 4.0" },
                      { key: "plant", label: "Plant 4.0" },
                      { key: "retail", label: "Retail 4.0" },
                      { key: "service", label: "Service 4.0" },
                      { key: "wellness", label: "Wellness 4.0" },
                    ].map((sector) => (
                      <label
                        key={sector.key}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={industrySectors[sector.key as keyof typeof industrySectors]}
                          onChange={() => handleSectorToggle(sector.key)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-gray-900">{sector.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedSectorsCount} sectors selected
                      </p>
                      <p className="text-sm text-gray-600">
                        You'll receive content related to these sectors
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Digital Domains Tab */}
              {activeCategory === "domains" && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Digital Domains</h2>
                  <p className="text-gray-600 mb-6">
                    Choose the digital domains you want to follow and receive updates about
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { key: "digitalChannels", label: "Digital Channels" },
                      { key: "digitalExperience", label: "Digital Experience" },
                      { key: "digitalServices", label: "Digital Services" },
                      { key: "digitalMarketing", label: "Digital Marketing" },
                      { key: "digitalWorkspace", label: "Digital Workspace" },
                      { key: "digitalCore", label: "Digital Core" },
                      { key: "digitalGPRC", label: "Digital GPRC" },
                      { key: "digitalBackOffice", label: "Digital Back-Office" },
                      { key: "digitalInterOps", label: "Digital InterOps" },
                      { key: "digitalSecurity", label: "Digital Security" },
                      { key: "digitalIntelligence", label: "Digital Intelligence" },
                      { key: "digitalIT", label: "Digital IT" },
                    ].map((domain) => (
                      <label
                        key={domain.key}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={digitalDomains[domain.key as keyof typeof digitalDomains]}
                          onChange={() => handleDomainToggle(domain.key)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-gray-900">{domain.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedDomainsCount} domains selected
                      </p>
                      <p className="text-sm text-gray-600">
                        You'll receive content related to these digital domains
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default EmailSubscriptionsPage;
