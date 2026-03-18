import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  supabase,
  getUserByAuthId,
  updateUserProfile,
} from "../../lib/supabase";
import { User, Briefcase, Tag, Camera, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user, refreshAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userRowId, setUserRowId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    jobTitle: "",
    department: "",
    bio: "",
    websiteUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
  });

  const [topicsOfInterest, setTopicsOfInterest] = useState({
    ai: false,
    cloud: false,
    digitalStrategy: false,
    cybersecurity: false,
    dataAnalytics: false,
    iot: false,
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfessionalInfoChange = (field: string, value: string) => {
    setProfessionalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleTopicToggle = (key: string) => {
    setTopicsOfInterest((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const initials = useMemo(() => {
    const first = personalInfo.firstName?.trim()?.[0] || "";
    const last = personalInfo.lastName?.trim()?.[0] || "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [personalInfo.firstName, personalInfo.lastName]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatarUrl(localUrl);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id || !userRowId) return;

    // Validate email format before saving
    if (personalInfo.email) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(personalInfo.email)) {
        setErrorMessage(
          `Invalid email format: ${personalInfo.email}. Must match pattern: user@domain.com`,
        );
        return;
      }
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let nextAvatarUrl = avatarUrl;
      if (avatarFile) {
        const safeName = avatarFile.name.replace(/[^a-z0-9.]/gi, "-");
        const key = `${userRowId}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("author-avatars")
          .upload(key, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("author-avatars")
          .getPublicUrl(key);
        nextAvatarUrl = data.publicUrl;
      }

      const fullName =
        `${personalInfo.firstName} ${personalInfo.lastName}`.trim();

      await updateUserProfile(userRowId, {
        email: personalInfo.email || undefined,
        name: fullName || personalInfo.email,
        title: professionalInfo.jobTitle || null,
        department: professionalInfo.department || null,
        bio: professionalInfo.bio || null,
        website_url: professionalInfo.websiteUrl || null,
        linkedin_url: professionalInfo.linkedinUrl || null,
        twitter_url: professionalInfo.twitterUrl || null,
        avatar_url: nextAvatarUrl || null,
        phone: personalInfo.phone || null,
        location: personalInfo.location || null,
        topics_of_interest: topicsOfInterest,
      });

      // Refresh avatar in header
      await refreshAvatar();

      setAvatarFile(null);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      setErrorMessage(message);
      console.error("Profile save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const userRow = await getUserByAuthId(user.id);
        if (!userRow || !isMounted) return;

        const [firstName = "", ...rest] = (userRow.name || "").split(" ");
        const lastName = rest.join(" ");

        setUserRowId(userRow.id);
        setAvatarUrl(userRow.avatar_url || null);
        setPersonalInfo({
          firstName: userRow.name ? firstName : user?.givenName || "",
          lastName: userRow.name ? lastName : user?.familyName || "",
          email: userRow.email || user?.email || "",
          phone: (userRow as any).phone || "",
          location: (userRow as any).location || "",
        });
        setProfessionalInfo({
          jobTitle: userRow.title || "",
          department: userRow.department || "",
          bio: userRow.bio || "",
          websiteUrl: userRow.website_url || "",
          linkedinUrl: userRow.linkedin_url || "",
          twitterUrl: userRow.twitter_url || "",
        });
        const topics = (userRow as any).topics_of_interest;
        if (topics && typeof topics === "object") {
          setTopicsOfInterest((prev) => ({
            ...prev,
            ...topics,
          }));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load profile.";
        setErrorMessage(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.email, user?.givenName, user?.familyName]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional Info", icon: Briefcase },
    { id: "topics", label: "Topics of Interest", icon: Tag },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors cursor-pointer">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    handleAvatarChange(event.target.files?.[0] || null)
                  }
                />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-gray-600">{personalInfo.email}</p>
            </div>
          </div>
          {(errorMessage || successMessage) && (
            <div className="mt-4 text-sm">
              {errorMessage && <p className="text-red-600">{errorMessage}</p>}
              {successMessage && (
                <p className="text-green-600">{successMessage}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 sticky top-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-secondary-600 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Personal Info Tab */}
            {activeTab === "personal" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Personal Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Update your personal details and contact information
                </p>

                <div className="space-y-6">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading profile...
                    </div>
                  )}
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) =>
                          handlePersonalInfoChange("firstName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) =>
                          handlePersonalInfoChange("lastName", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        handlePersonalInfoChange("email", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors ${
                        personalInfo.email &&
                        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                          personalInfo.email,
                        )
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                    {personalInfo.email &&
                      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                        personalInfo.email,
                      ) && (
                        <p className="mt-1 text-sm text-red-600">
                          Invalid email format (e.g., user@domain.com)
                        </p>
                      )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        handlePersonalInfoChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) =>
                        handlePersonalInfoChange("location", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Professional Info Tab */}
            {activeTab === "professional" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Professional Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Tell us about your professional background
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={professionalInfo.jobTitle}
                      onChange={(e) =>
                        handleProfessionalInfoChange("jobTitle", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={professionalInfo.department}
                      onChange={(e) =>
                        handleProfessionalInfoChange(
                          "department",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={professionalInfo.bio}
                      onChange={(e) =>
                        handleProfessionalInfoChange("bio", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={professionalInfo.websiteUrl}
                      onChange={(e) =>
                        handleProfessionalInfoChange(
                          "websiteUrl",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={professionalInfo.linkedinUrl}
                        onChange={(e) =>
                          handleProfessionalInfoChange(
                            "linkedinUrl",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter/X URL
                      </label>
                      <input
                        type="url"
                        value={professionalInfo.twitterUrl}
                        onChange={(e) =>
                          handleProfessionalInfoChange(
                            "twitterUrl",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Topics of Interest Tab */}
            {activeTab === "topics" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Topics of Interest
                </h2>
                <p className="text-gray-600 mb-6">
                  Select topics you're interested in to personalize your content
                  feed
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    { key: "ai", label: "Artificial Intelligence" },
                    { key: "cloud", label: "Cloud Computing" },
                    { key: "digitalStrategy", label: "Digital Strategy" },
                    { key: "cybersecurity", label: "Cybersecurity" },
                    { key: "dataAnalytics", label: "Data Analytics" },
                    { key: "iot", label: "Internet of Things" },
                  ].map((topic) => (
                    <label
                      key={topic.key}
                      className="flex items-center gap-3 p-4 border border-gray-200 hover:border-primary/50 rounded-lg cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={
                          topicsOfInterest[
                            topic.key as keyof typeof topicsOfInterest
                          ]
                        }
                        onChange={() => handleTopicToggle(topic.key)}
                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="text-gray-900 font-medium">
                        {topic.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
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

export default ProfilePage;
