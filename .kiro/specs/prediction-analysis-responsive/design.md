# Design Document

## Overview

This design addresses responsive layout issues and functionality gaps in the PredictionAnalysisDetail page. The solution focuses on CSS improvements for responsive design, implementing functional CTA buttons with proper event handlers, adding navigation for related articles, and optimizing the scenario analysis section for mobile devices.

## Architecture

The design follows a component-based approach where each issue is addressed through targeted modifications to the existing PredictionAnalysisDetail component. The solution maintains the current component structure while enhancing responsive behavior and adding missing functionality.

### Component Structure
```
PredictionAnalysisDetail
├── Hero Header (responsive padding fixes)
├── CTA Buttons (functional implementations)
├── Content Sections (responsive containers)
├── Scenario Analysis (mobile-optimized tabs)
└── Related Articles (clickable navigation)
```

## Components and Interfaces

### 1. Responsive Layout System

**Container Modifications:**
- Update main container classes to use responsive padding utilities
- Implement proper breakpoint-specific margins for 13.3" screens
- Add overflow prevention for horizontal scrolling

**CSS Classes:**
```typescript
// Current problematic classes
className="max-w-7xl mx-auto px-2 md:px-3 lg:px-4 xl:px-6"

// Enhanced responsive classes
className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
```

### 2. CTA Button Functionality

**Share Button Implementation:**
```typescript
interface ShareData {
  title: string;
  text: string;
  url: string;
}

const handleShare = async () => {
  const shareData: ShareData = {
    title: predictionData.header.title,
    text: predictionData.header.subtitle,
    url: window.location.href
  };
  
  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href);
  }
};
```

**PDF Download Implementation:**
```typescript
const handleDownloadPDF = () => {
  // Use browser's print functionality to generate PDF
  window.print();
};
```

**Social Media Integration:**
```typescript
interface SocialShareUrls {
  linkedin: string;
  twitter: string;
  email: string;
}

const generateSocialUrls = (): SocialShareUrls => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(predictionData.header.title);
  const text = encodeURIComponent(predictionData.header.subtitle);
  
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`
  };
};
```

### 3. Article Navigation System

**Related Articles Click Handler:**
```typescript
const handleArticleClick = (articleId: string) => {
  navigate(`/coming-soon/article-${articleId}`);
};
```

**Enhanced Article Cards:**
```typescript
<motion.div
  className="cursor-pointer hover:shadow-lg transition-all duration-300"
  onClick={() => handleArticleClick(analysis.id)}
  whileHover={{ scale: 1.02 }}
>
  {/* Article content */}
</motion.div>
```

### 4. Responsive Scenario Analysis

**Mobile-First Tab Design:**
```typescript
const ScenarioAnalysis = ({ scenarios }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8">
      {/* Mobile: Stacked tabs with horizontal scroll */}
      <div className="flex overflow-x-auto space-x-1 mb-6 bg-gray-100 p-1 rounded-lg scrollbar-hide">
        {scenarios.map((scenario: any, index: number) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 whitespace-nowrap min-w-fit ${getTabColor(scenario, activeTab === index)}`}
            onClick={() => setActiveTab(index)}
          >
            {getTabIcon(scenario)}
            <span className="hidden sm:inline">{scenario.name}</span>
            <span className="sm:hidden">{scenario.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
      {/* Rest of component */}
    </div>
  );
};
```

## Data Models

### Share Configuration
```typescript
interface ShareConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
}

interface SocialPlatform {
  name: 'linkedin' | 'twitter' | 'email';
  shareUrl: string;
  icon: React.ComponentType;
}
```

### Navigation Context
```typescript
interface ArticleContext {
  id: string;
  title: string;
  category: string;
  source: 'prediction-analysis';
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">prediction-analysis-responsive