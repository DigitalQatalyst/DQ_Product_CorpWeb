import React from 'react';

const sections = [
  { id: 'abstract', title: 'Abstract' },
  { id: 'introduction', title: 'Introduction' },
  { id: 'literature-review', title: 'Literature Review' },
  { id: 'methodology', title: 'Methodology' },
  { id: 'results', title: 'Results' },
  { id: 'discussion', title: 'Discussion' },
  { id: 'conclusion', title: 'Conclusion' },
  { id: 'references', title: 'References' },
  { id: 'appendices', title: 'Appendices' },
];

interface ResearchTableOfContentsProps {
  activeSections?: string[];
}

const ResearchTableOfContents: React.FC<ResearchTableOfContentsProps> = ({ activeSections }) => {
  const displaySections = activeSections
    ? sections.filter(s => activeSections.includes(s.id))
    : sections;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="glass-card rounded-xl p-6 sticky top-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Table of Contents</h3>
      <ul className="space-y-2">
        {displaySections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 text-left w-full py-1"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ResearchTableOfContents;