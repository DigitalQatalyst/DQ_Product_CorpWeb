import React, {useCallback, useEffect, useRef, useState} from "react";
import {TabSection} from "./TabSection";
import {TableSection} from "./TableSection";
import {DocumentSection} from "./DocumentSection";
import {mockDocuments, mockMultiEntryData} from "../../utils/mockData";
import {useSidebar} from "../../context/SidebarContext.tsx";
import {
    AlertTriangleIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ImageIcon,
    MenuIcon,
    MoreHorizontalIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import {checkMandatoryFieldsCompletion, getCompanyStageById, profileConfig,} from "../../utils/config";
import {
    calculateMandatoryCompletion,
    calculateSectionCompletion,
    fetchBusinessProfileData,
} from "../../services/DataverseService";

type ProfileData = {
    companyStage?: string | null;
    sections?: Record<string, any>;
    name?: string;
    companyType?: string;
    companySize?: string;
};

export function BusinessProfile({activeSection = "profile"}) {
    const {isOpen: sidebarOpen, toggleSidebar} = useSidebar();
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [showTabsMenu, setShowTabsMenu] = useState(false);
    const [logoUrl, setLogoUrl] = useState("");
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sectionCompletions, setSectionCompletions] = useState({});
    const [mandatoryCompletions, setMandatoryCompletions] = useState({});
    const [missingMandatoryFields, setMissingMandatoryFields] = useState([]);
    const [visibleTabIds, setVisibleTabIds] = useState<string[]>([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const tabsRef = useRef<HTMLDivElement | null>(null);

    const updateVisibleTabs = useCallback(() => {
        if (!tabsRef.current) return;

        const container = tabsRef.current;
        const containerRect = container.getBoundingClientRect();
        const visible: string[] = [];

        // querySelectorAll typed as HTMLButtonElement
        Array.from(container.querySelectorAll<HTMLButtonElement>('button[role="tab"]')).forEach(
            (tab) => {
                const tabRect = tab.getBoundingClientRect();
                // Check if tab is fully visible
                if (
                    tabRect.left >= containerRect.left &&
                    tabRect.right <= containerRect.right
                ) {
                    visible.push(tab.id.replace("tab-", ""));
                }
            }
        );

        setVisibleTabIds(visible);
    }, []);

    const updateScrollButtons = useCallback(() => {
        if (!tabsRef.current) return;
        const {scrollLeft, scrollWidth, clientWidth} = tabsRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding
        updateVisibleTabs();
    }, [updateVisibleTabs]);

    useEffect(() => {
        const loadProfileData = async () => {
            setLoading(true);
            try {
                const data = await fetchBusinessProfileData();
                setProfileData(data);

                const completions = {};
                const mandatoryStats = {};

                profileConfig.tabs.forEach((tab) => {
                    const sectionData = data.sections[tab.id] || {fields: {}};
                    completions[tab.id] = calculateSectionCompletion(sectionData);
                    mandatoryStats[tab.id] = calculateMandatoryCompletion(
                        sectionData,
                        tab.id,
                        data.companyStage,
                        profileConfig
                    );
                });

                setSectionCompletions(completions);
                setMandatoryCompletions(mandatoryStats);

                const mandatoryFieldsCheck = checkMandatoryFieldsCompletion(
                    data,
                    data.companyStage
                );
                setMissingMandatoryFields(mandatoryFieldsCheck.missing);
            } catch (error) {
                console.error("Error loading profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfileData();
    }, []);

    const scrollLeft = () => {
        if (tabsRef.current) {
            const el = tabsRef.current as HTMLElement & { scrollBy?: any };
            if (typeof el.scrollBy === "function") {
                el.scrollBy({left: -200, behavior: "smooth"});
            } else {
                // fallback
                el.scrollLeft = Math.max(0, el.scrollLeft - 200);
            }
        }
    };

    const scrollRight = () => {
        if (tabsRef.current) {
            const el = tabsRef.current as HTMLElement & { scrollBy?: any };
            if (typeof el.scrollBy === "function") {
                el.scrollBy({left: 200, behavior: "smooth"});
            } else {
                // fallback
                el.scrollLeft = Math.min(el.scrollWidth, el.scrollLeft + 200);
            }
        }
    };

    useEffect(() => {
        const handleResize = () => updateScrollButtons();
        const tabsEl = tabsRef.current as HTMLElement | null;

        if (tabsEl) {
            tabsEl.addEventListener("scroll", updateScrollButtons as EventListener);
        }

        window.addEventListener("resize", handleResize);
        const timeoutId = window.setTimeout(() => {
            updateScrollButtons(); // Initial check
        }, 0);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (tabsEl) {
                tabsEl.removeEventListener("scroll", updateScrollButtons as EventListener);
            }
            clearTimeout(timeoutId);
        };
    }, [activeSection, showAll, profileData, updateScrollButtons]); // Re-run when tabs change

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === "string") {
                    setLogoUrl(e.target.result);
                    setIsUploadingLogo(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const getAllSections = () => {
        return profileConfig.tabs.map((tab) => ({
            id: tab.id,
            title: tab.title,
            completion: sectionCompletions[tab.id] || 0,
            mandatoryCompletion: mandatoryCompletions[tab.id] || {percentage: 0},
        }));
    };

    const getSectionsToDisplay = () => {
        const allSections = getAllSections();
        if (activeSection === "overview") {
            return allSections.slice(0, 3);
        } else if (activeSection === "profile") {
            return allSections;
        } else {
            return [
                {
                    id: activeSection,
                    title:
                        profileConfig.tabs.find((tab) => tab.id === activeSection)?.title ||
                        "Vision & Strategy",
                    completion: sectionCompletions[activeSection] || 0,
                    mandatoryCompletion: mandatoryCompletions[activeSection] || {
                        percentage: 0,
                    },
                },
            ];
        }
    };

    const sectionsToDisplay = getSectionsToDisplay();

    const overallMandatoryCompletion =
        profileData && profileData.companyStage
            ? Math.round(
                (checkMandatoryFieldsCompletion(
                        profileData,
                        profileData.companyStage
                    ).completed /
                    checkMandatoryFieldsCompletion(
                        profileData,
                        profileData.companyStage
                    ).total) *
                100
            )
            : 0;

    const getCurrentSectionTitle = () => {
        return sectionsToDisplay[activeTabIndex]?.title || "";
    };

    const companyStage =
        profileData && profileData.companyStage
            ? getCompanyStageById(profileData.companyStage)
            : null;

    return (
        <div className="flex-1 min-w-0 overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-20 py-3 px-3 sm:px-4 lg:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center min-w-0">
                        <button
                            className="lg:hidden mr-3 text-gray-600 flex-shrink-0 z-40"
                            onClick={toggleSidebar}
                            // onClick={() => {
                            //   console.log('Hamburger clicked, current sidebarOpen:', sidebarOpen);
                            //   toggleSidebar();
                            // }}

                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? <XIcon size={20}/> : <MenuIcon size={20}/>}
                        </button>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                            {activeSection === "overview"
                                ? "Business Overview"
                                : activeSection === "profile"
                                    ? "Company Profile"
                                    : activeSection.charAt(0).toUpperCase() +
                                    activeSection.slice(1)}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        {missingMandatoryFields.length > 0 && (
                            <div className="flex items-center text-amber-600 min-w-0">
                <span className="flex items-center text-xs sm:text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 flex-shrink-0"></span>
                  <span className="hidden sm:inline truncate">
                    {missingMandatoryFields.length} missing mandatory fields
                  </span>
                  <span className="sm:hidden">
                    {missingMandatoryFields.length} missing
                  </span>
                </span>
                            </div>
                        )}
                        <div className="flex items-center bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full min-w-0">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline mr-2">
                Completion:
              </span>
                            <div className="w-16 sm:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        overallMandatoryCompletion === 100
                                            ? "bg-green-500"
                                            : overallMandatoryCompletion >= 70
                                                ? "bg-blue-500"
                                                : overallMandatoryCompletion >= 30
                                                    ? "bg-yellow-500"
                                                    : "bg-red-500"
                                    }`}
                                    style={{width: `${overallMandatoryCompletion}%`}}
                                ></div>
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 ml-2">
                {overallMandatoryCompletion}%
              </span>
                        </div>
                        {activeSection === "profile" && (
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => setShowAll(!showAll)}
                            >
                                {showAll ? "Show tabs" : "Show all"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mx-3 sm:mx-4 lg:mx-6">
                    {/* Company Logo Section */}
                    <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="relative flex-shrink-0">
                                {logoUrl ? (
                                    <div
                                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 group">
                                        <img
                                            src={logoUrl}
                                            alt="Company Logo"
                                            className="w-full h-full object-contain"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button
                                                className="p-1 bg-white rounded-full text-gray-700 hover:text-red-500"
                                                onClick={() => setLogoUrl("")}
                                            >
                                                <XIcon size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer ${
                                            isUploadingLogo
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                        }`}
                                        onClick={() => setIsUploadingLogo(true)}
                                    >
                                        {isUploadingLogo ? (
                                            <div className="flex flex-col items-center">
                                                <UploadIcon size={16} className="text-blue-500 mb-1"/>
                                                <span className="text-xs text-blue-500">Upload</span>
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        ) : (
                                            <ImageIcon size={20} className="text-gray-400"/>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                                        <h2 className="text-lg sm:text-xl font-medium text-gray-800 truncate">
                                            {profileData?.name || "Company Name"}
                                        </h2>
                                        {companyStage && (
                                            <span
                                                className={`text-xs font-medium text-white px-2 py-1 rounded-full ${companyStage.color} self-start`}
                                            >
                        {companyStage.label}
                      </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-3 break-words">
                                    {profileData?.companyType || "Industry"} • {profileData?.companySize || "Company Size"}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    Mandatory fields:
                  </span>
                                    <div
                                        className="w-16 sm:w-20 h-1 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${
                                                overallMandatoryCompletion === 100
                                                    ? "bg-green-500"
                                                    : overallMandatoryCompletion >= 70
                                                        ? "bg-blue-500"
                                                        : overallMandatoryCompletion >= 30
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                            }`}
                                            style={{width: `${overallMandatoryCompletion}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                    {overallMandatoryCompletion}%
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Section Selector */}
                    {activeSection === "profile" && !showAll && (
                        <div className="md:hidden border-b border-gray-200 bg-gray-50 p-3 sticky top-[73px] z-10">
                            <div className="relative">
                                <button
                                    className="w-full px-3 py-2 text-left text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm flex justify-between items-center min-w-0"
                                    onClick={() => setShowTabsMenu(!showTabsMenu)}
                                >
                                    <span className="truncate">{getCurrentSectionTitle()}</span>
                                    <ChevronDownIcon size={16} className="flex-shrink-0 ml-2"/>
                                </button>
                                {showTabsMenu && (
                                    <div
                                        className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                                        {sectionsToDisplay.map((section, index) => (
                                            <button
                                                key={section.id}
                                                className={`w-full text-left px-3 py-3 text-sm flex items-center justify-between min-w-0 ${
                                                    activeTabIndex === index
                                                        ? "bg-blue-50 text-blue-600"
                                                        : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                                onClick={() => {
                                                    setActiveTabIndex(index);
                                                    setShowTabsMenu(false);
                                                }}
                                            >
                                                <span className="truncate flex-1">{section.title}</span>
                                                <div className="flex items-center ml-2 flex-shrink-0">
                                                    {section.mandatoryCompletion.percentage === 100 ? (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                              <CheckCircleIcon size={12} className="mr-1"/>
                                                            {section.completion}%
                            </span>
                                                    ) : section.mandatoryCompletion.percentage > 0 ? (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                                                            {section.completion}%
                            </span>
                                                    ) : (
                                                        <span
                                                            className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1"></span>
                                                            {section.completion}%
                            </span>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Desktop Tabs */}
                    {activeSection === "profile" && !showAll && (
                        <div className="hidden md:block border-b border-gray-200 bg-gray-50">
                            <div className="relative py-3 md:py-4 max-w-full">
                                <div className="flex items-center px-4">
                                    {/* Left Arrow */}
                                    <button
                                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors mr-2"
                                        onClick={scrollLeft}
                                        disabled={!canScrollLeft}
                                        aria-label="Scroll tabs left"
                                    >
                                        <ChevronLeftIcon size={16}/>
                                    </button>

                                    {/* Scrollable Tabs Container */}
                                    <div
                                        ref={tabsRef}
                                        className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth min-w-0"
                                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
                                        role="tablist"
                                    >
                                        <div className="flex space-x-1 min-w-max">
                                            {sectionsToDisplay.map((section, index) => (
                                                <button
                                                    key={section.id}
                                                    className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap flex items-center rounded-lg transition-all duration-200 ${
                                                        activeTabIndex === index
                                                            ? "bg-white text-blue-600 shadow-sm border border-blue-200"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                    }`}
                                                    onClick={() => setActiveTabIndex(index)}
                                                    role="tab"
                                                    aria-selected={activeTabIndex === index}
                                                    id={`tab-${section.id}`}
                                                    aria-controls={`panel-${section.id}`}
                                                >
                          <span className="truncate max-w-[120px] md:max-w-none">
                            {section.title}
                          </span>
                                                    <div className="flex items-center ml-1 md:ml-2 flex-shrink-0">
                                                        {section.mandatoryCompletion.percentage === 100 ? (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                <CheckCircleIcon
                                    size={12}
                                    className="mr-0.5 md:mr-1"
                                />
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        ) : section.mandatoryCompletion.percentage > 0 ? (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                <span className="w-2 h-2 rounded-full bg-amber-500 mr-0.5 md:mr-1"></span>
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        ) : (
                                                            <span
                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-gray-400 mr-0.5 md:mr-1"></span>
                                <span className="hidden sm:inline">
                                  {section.completion}%
                                </span>
                              </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Arrow */}
                                    <button
                                        className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors ml-2"
                                        onClick={scrollRight}
                                        disabled={!canScrollRight}
                                        aria-label="Scroll tabs right"
                                    >
                                        <ChevronRightIcon size={16}/>
                                    </button>

                                    {/* More Menu with Dropdown */}
                                    <div className="relative flex-shrink-0 ml-2">
                                        <button
                                            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-white rounded-full shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
                                            onClick={() => setShowTabsMenu(!showTabsMenu)}
                                            aria-label="Show hidden tabs"
                                            aria-expanded={showTabsMenu}
                                        >
                                            <MoreHorizontalIcon size={16}/>
                                        </button>
                                        {showTabsMenu && (
                                            <div
                                                className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                                <div className="py-1 max-h-64 overflow-y-auto">
                                                    {sectionsToDisplay
                                                        .filter(
                                                            (section) => !visibleTabIds.includes(section.id)
                                                        )
                                                        .map((section) => {
                                                            // Find the correct index in the full sectionsToDisplay array
                                                            const actualIndex = sectionsToDisplay.findIndex(
                                                                (s) => s.id === section.id
                                                            );
                                                            return (
                                                                <button
                                                                    key={section.id}
                                                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                                                                        activeTabIndex === actualIndex
                                                                            ? "bg-blue-50 text-blue-600"
                                                                            : "text-gray-700 hover:bg-gray-100"
                                                                    }`}
                                                                    onClick={() => {
                                                                        setActiveTabIndex(actualIndex);
                                                                        setShowTabsMenu(false);
                                                                        const tabElement = document.getElementById(
                                                                            `tab-${section.id}`
                                                                        );
                                                                        if (tabElement) {
                                                                            tabElement.scrollIntoView({
                                                                                behavior: "smooth",
                                                                                block: "nearest",
                                                                                inline: "center",
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    <span>{section.title}</span>
                                                                    <div className="flex items-center">
                                                                        {section.mandatoryCompletion.percentage ===
                                                                        100 ? (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                        <CheckCircleIcon
                                            size={14}
                                            className="mr-1"
                                        />
                                                                                {section.completion}%
                                      </span>
                                                                        ) : section.mandatoryCompletion.percentage >
                                                                        0 ? (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span>
                                                                                {section.completion}%
                                      </span>
                                                                        ) : (
                                                                            <span
                                                                                className="flex items-center text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                                                                                {section.completion}%
                                      </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    {sectionsToDisplay.filter(
                                                        (s) => !visibleTabIds.includes(s.id)
                                                    ).length === 0 && (
                                                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                                                            All tabs visible
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="p-3 sm:p-4 md:p-6 min-w-0">
                        {sectionsToDisplay.map((section, index) => (
                            <div
                                key={section.id}
                                className={
                                    activeSection === "profile" &&
                                    !showAll &&
                                    activeTabIndex !== index
                                        ? "hidden"
                                        : "block min-w-0"
                                }
                                role="tabpanel"
                                id={`panel-${section.id}`}
                                aria-labelledby={`tab-${section.id}`}
                            >
                                {(() => {
                                    const tabCfg = profileConfig.tabs.find((tab) => tab.id === section.id);
                                    if (!tabCfg) return null;
                                    return (
                                        <TabSection
                                            config={tabCfg.groups}
                                            data={profileData?.sections?.[section.id] || {fields: {}, status: {}}}
                                            completion={section.completion}
                                            companyStage={profileData?.companyStage}
                                            mandatoryCompletion={section.mandatoryCompletion}
                                        />
                                    );
                                })()}

                                {mockMultiEntryData[section.id] &&
                                    mockMultiEntryData[section.id].map((tableData: any, idx: number) => (
                                        <div key={idx} className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                                            <TableSection
                                                title={tableData.title}
                                                columns={tableData.columns}
                                                data={tableData.data}
                                            />
                                        </div>
                                    ))}

                                {mockDocuments[section.id] && (
                                    <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8">
                                        <DocumentSection
                                            title="Section Documents"
                                            documents={mockDocuments[section.id]}
                                        />
                                    </div>
                                )}

                                {!mockMultiEntryData[section.id] &&
                                    !mockDocuments[section.id] &&
                                    (!(profileData?.sections?.[section.id]?.fields) ||
                                        Object.keys(
                                            profileData?.sections?.[section.id]?.fields || {}
                                        ).length === 0) && (
                                        <div
                                            className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-center py-6 sm:py-8 md:py-10 lg:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <div className="flex flex-col items-center px-4">
                                                <div className="p-3 bg-gray-100 rounded-full mb-4">
                                                    <AlertTriangleIcon
                                                        size={24}
                                                        className="text-gray-400"
                                                    />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                                                    No {section.title} Data
                                                </h3>
                                                <p className="text-sm text-gray-500 max-w-md break-words text-center">
                                                    This section doesn't have any data yet. Use the Edit
                                                    Section button in each group to add information.
                                                </p>
                                                {profileData?.companyStage && (
                                                    <div
                                                        className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md max-w-md w-full">
                                                        <p className="text-sm text-amber-700 break-words">
                                                            <span className="font-medium">Note:</span> Some
                                                            fields in this section are mandatory for your
                                                            company's {companyStage?.label} stage.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
