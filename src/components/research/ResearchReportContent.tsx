import React from 'react';
import ReportSection from './ReportSection';
import DiagnosticAccuracyChart from './charts/DiagnosticAccuracyChart';
import AdoptionTrendChart from './charts/AdoptionTrendChart';
import ApplicationsPieChart from './charts/ApplicationsPieChart';

interface ResearchReportContentProps {
  abstract?: string;
  keywords?: string;
  introduction?: string;
  literatureReview?: string;
  methodology?: string;
  results?: string;
  discussion?: string;
  conclusion?: string;
  references?: string;
  appendices?: string;
  charts?: any;
}

const ResearchReportContent: React.FC<ResearchReportContentProps> = ({
  abstract,
  keywords,
  introduction,
  literatureReview,
  methodology,
  results,
  discussion,
  conclusion,
  references,
  appendices,
  charts
}) => {
  // If no main content props are passed, use the static content as default
  const isDefault = !abstract && !introduction && !methodology;

  const renderContent = (content: string | undefined) => {
    if (!content) return null;

    // Check if content is HTML
    const isHtml = /<[a-z][\s\S]*>/i.test(content);

    if (isHtml) {
      return (
        <div
          className="rich-text-content prose prose-invert max-w-none text-white/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return (
      <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
        {content}
      </div>
    );
  };

  if (isDefault) {
    return (
      <article className="prose prose-invert max-w-none">
        <ReportSection title="Abstract" id="abstract">
          <p>
            This comprehensive study investigates the transformative impact of artificial intelligence (AI)
            on modern healthcare diagnostics across 47 healthcare institutions in North America and Europe.
            Our research analyzed 2.3 million patient cases over a 36-month period (January 2022 – December 2024)
            to evaluate the efficacy of machine learning algorithms in medical imaging interpretation,
            predictive analytics, and clinical decision support systems.
          </p>
          <p>
            Key findings demonstrate that AI-assisted diagnostic systems achieved an average accuracy rate
            of 94.2% compared to 83.7% for traditional methods—representing an 12.5% improvement in diagnostic
            precision. Furthermore, AI integration reduced average diagnosis time by 47% and decreased
            false-positive rates by 31%. These results suggest that AI technologies are not merely supplementary
            tools but are becoming essential components of modern healthcare infrastructure.
          </p>
          <p className="text-sm italic border-l-2 border-primary pl-4">
            <strong>Keywords:</strong> Artificial Intelligence, Healthcare Diagnostics, Machine Learning,
            Medical Imaging, Clinical Decision Support, Deep Learning, Predictive Analytics
          </p>
        </ReportSection>

        <ReportSection title="Introduction" id="introduction">
          <p>
            The integration of artificial intelligence into healthcare represents one of the most significant
            technological shifts in modern medicine. As healthcare systems worldwide face mounting pressures
            from aging populations, increasing chronic disease prevalence, and physician shortages, AI
            technologies offer promising solutions to enhance diagnostic accuracy, improve patient outcomes,
            and optimize resource allocation.
          </p>
          <p>
            The global AI in healthcare market was valued at $15.4 billion in 2023 and is projected to reach
            $187.95 billion by 2030, growing at a compound annual growth rate (CAGR) of 37.5% (Grand View Research, 2024).
            This explosive growth is driven by advances in deep learning architectures, increased availability
            of medical imaging data, and growing acceptance of AI tools among healthcare professionals.
          </p>

          <figure className="my-8">
            <img
              src="/images/doctor-ai-tablet.jpg"
              alt="Healthcare professional using AI-powered diagnostic tablet"
              className="rounded-lg w-full object-cover h-64"
            />
            <figcaption className="text-sm text-muted-foreground mt-2 text-center">
              Figure 1: Healthcare professionals increasingly rely on AI-powered devices for real-time diagnostic support
            </figcaption>
          </figure>

          <p>
            This study aims to address three primary research questions:
          </p>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>How do AI-assisted diagnostic systems compare to traditional methods in terms of accuracy and efficiency?</li>
            <li>What factors influence the successful adoption of AI technologies in clinical settings?</li>
            <li>What are the primary barriers and ethical considerations surrounding AI implementation in healthcare?</li>
          </ol>
        </ReportSection>

        <ReportSection title="Literature Review" id="literature-review">
          <p>
            The application of AI in medical diagnostics has evolved significantly since the first expert systems
            of the 1970s. MYCIN, developed at Stanford University in 1972, demonstrated that rule-based systems
            could diagnose bacterial infections with accuracy comparable to human experts (Shortliffe & Buchanan, 1975).
            However, early systems were limited by their reliance on manually encoded knowledge.
          </p>
          <p>
            The deep learning revolution, catalyzed by AlexNet's success in the 2012 ImageNet competition
            Fundamentally transformed medical imaging analysis. Convolutional neural
            networks (CNNs) demonstrated unprecedented ability to identify patterns in radiological images,
            pathology slides, and dermatological photographs.
          </p>
        </ReportSection>

        <ReportSection title="Methodology" id="methodology">
          <p>
            This multi-center retrospective study employed a mixed-methods approach combining quantitative
            analysis of diagnostic outcomes with qualitative assessment of implementation challenges.
          </p>
        </ReportSection>

        <ReportSection title="Results" id="results">
          <p>
            Our analysis revealed statistically significant improvements in diagnostic accuracy across all
            evaluated medical conditions when AI-assisted systems were employed.
          </p>
          <figure className="my-6 glass-card p-4 rounded-xl">
            <DiagnosticAccuracyChart />
            <figcaption className="text-sm text-muted-foreground mt-4 text-center">
              Figure 2: AI-assisted diagnostics demonstrated superior accuracy across all evaluated conditions
            </figcaption>
          </figure>
          <figure className="my-6 glass-card p-4 rounded-xl">
            <AdoptionTrendChart />
            <figcaption className="text-sm text-muted-foreground mt-4 text-center">
              Figure 3: Global investment and adoption trends in healthcare AI
            </figcaption>
          </figure>
        </ReportSection>

        <ReportSection title="Discussion" id="discussion">
          <p>
            The results of this study provide compelling evidence for the efficacy of AI-assisted diagnostic
            systems in modern healthcare settings.
          </p>
        </ReportSection>

        <ReportSection title="Conclusion" id="conclusion">
          <p>
            This comprehensive study demonstrates that AI-assisted diagnostic systems significantly outperform
            traditional methods across multiple clinical domains.
          </p>
        </ReportSection>

        <ReportSection title="References" id="references">
          <div className="text-sm space-y-3">
            <p>Grand View Research. (2024). AI in Healthcare Market Size Report.</p>
            <p>Gulshan, V., et al. (2016). Deep learning for diabetic retinopathy detection. JAMA.</p>
          </div>
        </ReportSection>
      </article>
    );
  }

  return (
    <article className="prose prose-invert max-w-none">
      {abstract && (
        <ReportSection title="Abstract" id="abstract">
          {renderContent(abstract)}
          {keywords && (
            <p className="text-sm italic border-l-2 border-primary pl-4 mt-6">
              <strong>Keywords:</strong> {keywords}
            </p>
          )}
        </ReportSection>
      )}

      {introduction && (
        <ReportSection title="Introduction" id="introduction">
          {renderContent(introduction)}
        </ReportSection>
      )}

      {literatureReview && (
        <ReportSection title="Literature Review" id="literature-review">
          {renderContent(literatureReview)}
        </ReportSection>
      )}

      {methodology && (
        <ReportSection title="Methodology" id="methodology">
          {renderContent(methodology)}
        </ReportSection>
      )}

      {results && (
        <ReportSection title="Results" id="results">
          {renderContent(results)}
          <figure className="my-6 glass-card p-4 rounded-xl">
            <DiagnosticAccuracyChart />
          </figure>
        </ReportSection>
      )}

      {discussion && (
        <ReportSection title="Discussion" id="discussion">
          {renderContent(discussion)}
        </ReportSection>
      )}

      {conclusion && (
        <ReportSection title="Conclusion" id="conclusion">
          {renderContent(conclusion)}
        </ReportSection>
      )}

      {references && (
        <ReportSection title="References" id="references">
          {renderContent(references)}
        </ReportSection>
      )}

      {appendices && (
        <ReportSection title="Appendices" id="appendices">
          {renderContent(appendices)}
        </ReportSection>
      )}
    </article>
  );
};

export default ResearchReportContent;