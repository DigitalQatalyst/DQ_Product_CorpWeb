import { PortableTextBlock } from '../api/types';

interface PortableTextRendererProps {
  blocks: PortableTextBlock[];
  className?: string;
}

export const PortableTextRenderer = ({ blocks, className = '' }: PortableTextRendererProps) => {
  if (!blocks || blocks.length === 0) return null;

  // Group blocks into sections (h2 followed by paragraphs)
  const sections: { heading?: PortableTextBlock; paragraphs: PortableTextBlock[] }[] = [];
  let currentSection: { heading?: PortableTextBlock; paragraphs: PortableTextBlock[] } = { paragraphs: [] };

  blocks.forEach((block) => {
    if (block._type === 'block') {
      if (block.style === 'h2') {
        // Start a new section
        if (currentSection.heading || currentSection.paragraphs.length > 0) {
          sections.push(currentSection);
        }
        currentSection = { heading: block, paragraphs: [] };
      } else if (block.style === 'normal') {
        currentSection.paragraphs.push(block);
      }
    }
  });

  // Push the last section
  if (currentSection.heading || currentSection.paragraphs.length > 0) {
    sections.push(currentSection);
  }

  const renderText = (block: PortableTextBlock) => {
    return block.children.map((child) => child.text).join('');
  };

  return (
    <div className={`space-y-6 text-gray-700 text-sm leading-relaxed ${className}`}>
      {sections.map((section, sectionIndex) => (
        <section key={sectionIndex}>
          {section.heading && (
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {renderText(section.heading)}
            </h2>
          )}
          {section.paragraphs.map((paragraph, pIndex) => (
            <p key={paragraph._key} className={pIndex < section.paragraphs.length - 1 ? 'mb-3' : ''}>
              {renderText(paragraph)}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
};
