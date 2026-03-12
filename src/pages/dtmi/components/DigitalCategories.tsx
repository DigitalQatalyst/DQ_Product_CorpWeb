import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  link: string;
}

interface CategoryGroup {
  id: string;
  title: string;
  categories: Category[];
  isExpanded: boolean;
}

const initialCategories: CategoryGroup[] = [
  {
    id: "digital-front",
    title: "Digital Front",
    categories: [
      {
        id: "digital-channels",
        name: "Digital Channels",
        link: "/marketplace/dtmi?category=Digital%20Channels",
      },
      {
        id: "digital-experience",
        name: "Digital Experience",
        link: "/marketplace/dtmi?category=Digital%20Experience",
      },
      {
        id: "digital-services",
        name: "Digital Services",
        link: "/marketplace/dtmi?category=Digital%20Services",
      },
      {
        id: "digital-marketing",
        name: "Digital Marketing",
        link: "/marketplace/dtmi?category=Digital%20Marketing",
      },
    ],
    isExpanded: false,
  },
  {
    id: "digital-core",
    title: "Digital Core",
    categories: [
      {
        id: "digital-workspace",
        name: "Digital Workspace",
        link: "/marketplace/dtmi?category=Digital%20Workspace",
      },
      {
        id: "digital-core-systems",
        name: "Digital Core",
        link: "/marketplace/dtmi?category=Digital%20Core",
      },
      {
        id: "digital-gprc",
        name: "Digital GPRC",
        link: "/marketplace/dtmi?category=Digital%20GPRC",
      },
      {
        id: "digital-back-office",
        name: "Digital Back-Office",
        link: "/marketplace/dtmi?category=Digital%20Back-Office",
      },
    ],
    isExpanded: true,
  },
  {
    id: "digital-enablers",
    title: "Digital Enablers",
    categories: [
      {
        id: "digital-interops",
        name: "Digital InterOps",
        link: "/marketplace/dtmi?category=Digital%20InterOps",
      },
      {
        id: "digital-security",
        name: "Digital Security",
        link: "/marketplace/dtmi?category=Digital%20Security",
      },
      {
        id: "digital-intelligence",
        name: "Digital Intelligence",
        link: "/marketplace/dtmi?category=Digital%20Intelligence",
      },
      {
        id: "digital-it",
        name: "Digital IT",
        link: "/marketplace/dtmi?category=Digital%20IT",
      },
    ],
    isExpanded: true,
  },
];

export function DigitalCategories() {
  const navigate = useNavigate();
  const [categoryGroups, setCategoryGroups] =
    useState<CategoryGroup[]>(initialCategories);

  const toggleGroup = (groupId: string) => {
    setCategoryGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, isExpanded: !group.isExpanded }
          : group,
      ),
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by Digital Category
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover insights organized by key digital transformation categories
            across front-office, core systems, and enabling technologies.
          </p>
        </div>

        {/* Category Groups */}
        <div className="max-w-4xl mx-auto space-y-4">
          {categoryGroups.map((group) => (
            <div
              key={group.id}
              className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900">
                  {group.title}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${
                    group.isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Category List */}
              {group.isExpanded && (
                <div className="px-6 pb-6 space-y-3">
                  {group.categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => navigate(category.link)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white cursor-pointer transition-all group"
                    >
                      <div className="w-5 h-5 border-2 border-gray-300 rounded group-hover:border-brand-coral transition-colors flex-shrink-0"></div>
                      <span className="text-gray-700 group-hover:text-brand-coral transition-colors font-medium">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
