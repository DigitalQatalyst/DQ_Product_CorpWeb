import React from 'react';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, children, id }) => {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold mb-4">
        <span className="section-highlight">{title}</span>
      </h2>
      <div className="text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
};

export default ReportSection;