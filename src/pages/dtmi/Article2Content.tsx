import { useState } from 'react';
import { ArticleAuthorCard } from './ArticleAuthorCard.tsx';
import { WhitepaperAccessModal } from '../../components/WhitepaperAccessModal';

export function Article2Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const author = {
    name: 'Dr. Stéphane Niango',
    title: 'Expert in DCOs & Strategic Transformation',
    avatar: '/images/Stephane_Avatar.png',
    bio: 'Dr. Niango is a globally recognized Digital Transformation Architect and Founder of DigitalQatalyst, specializing in the evolution of Digital Cognitive Organizations and AI-driven strategic transformation.',
    slug: 'stephane-niango'
  };

  return <>
      <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
        For the past decade, "digital transformation" has been the battle cry for businesses looking to modernize and stay competitive. Migrate to the cloud, automate processes, use data analytics, and you'll unlock efficiency and growth. But here's the truth: digital transformation as we once knew it is no longer enough. The landscape has changed. Traditional digital transformation strategies are dead because they're based on outdated assumptions about what it means to be "digital."
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        In the age of rapid disruption, business leaders need to embrace something much more profound: Digital Cognitive Organizations (DCOs). This is not just about introducing new technology; it's about fundamentally reshaping how businesses operate, think, and adapt to the fast-moving world around them. As the whitepaper on Economy 4.0 clearly demonstrates, DCOs are not just "digital" in the traditional sense — they are built around cognitive intelligence, enabling them to continuously evolve and thrive in complexity.
      </p>

      <ArticleAuthorCard author={author} />

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        Why Traditional Digital Transformation Is No Longer Enough
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        <a 
          href="https://link.springer.com/article/10.1007/s10796-021-10186-w?trk=public_post_comment-text" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          This research journal
        </a>{' '}
        published in the Springer Nature Link shows that businesses that focus solely on digitizing their processes without embedding cognitive intelligence into their operations experience diminishing returns and fail to fully capitalize on the potential of AI and data-driven decision-making.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Digital transformation used to be seen as the holy grail — the key to surviving in an increasingly digital world. Businesses would digitize their operations, implement automation, and move to the cloud. But here's the catch: digitization is not the same as intelligence. Transforming your organization digitally doesn't guarantee that your systems will be adaptive, agile, or capable of learning and evolving at the pace required by today's market.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Traditional digital transformation largely focuses on tools and technology — it's about replacing old systems with new ones. However, this approach overlooks the culture, structure, and continuous adaptability that is required for a business to thrive in Economy 4.0.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        The Cognitive Revolution: Why DCOs Are the Future
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Digital Cognitive Organizations are the next evolution of business, built not just around digital tools, but around continuous learning, real-time decision-making, and human-machine collaboration. While traditional digital transformation simply upgrades existing processes, DCOs fundamentally change the way an organization thinks and operates.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Here's what makes DCOs different:
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        Real-Time Decision-Making
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        In traditional organizations, decisions are often based on historical data or slow-moving quarterly reports. But the pace of business today demands real-time intelligence. DCOs leverage AI, machine learning, and big data to make decisions on the fly — responding to shifts in customer behavior, market conditions, or operational needs as they happen. The Digital Business Platform (DBP) enables this transformation by providing organizations with the real-time data flows necessary for adaptive decision-making.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        <a 
          href="https://www.burrus.com/the-new-rules-of-disruption/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          Burrus Research
        </a>{' '}
        notes that companies using AI-driven decision-making see a 50% improvement in operational efficiency compared to those relying on traditional methods.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        Continuous Learning and Adaptation
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        A traditional organization might innovate once every few years, often as a result of a significant change initiative. DCOs, on the other hand, are designed to continuously learn from every interaction, transaction, and data point. In DCOs, AI systems learn, adapt, and refine their processes in real time, constantly improving performance and customer experience. This continuous feedback loop makes DCOs more resilient to change and better equipped to lead in the fast-moving digital economy.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        Agility, Not Bureaucracy
      </h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        Traditional organizations rely on slow, hierarchical decision-making processes and rigid structures. In contrast, DCOs are built to be agile and adaptive. They foster fluid, cross-functional teams that can reconfigure based on context, opportunities, and challenges. This allows them to be more responsive to customer needs, faster to innovate, and better able to scale with changing demands. The Digital Canvas — a key part of DQ's internal framework — helps organizations visualize their capabilities and align them with the agile, adaptive operating models that are essential for a DCO.
      </p>

      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl shadow-sm">
        <svg className="w-8 h-8 text-blue-400/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p className="text-xl text-gray-900 italic leading-relaxed font-semibold">
          Traditional businesses are caught in a vicious cycle of reacting to disruption, rather than anticipating and driving it. DCOs don't just rely on technology for automation—they leverage AI and data-driven insights to continually evolve.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-12 -mt-12"></div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        Why Traditional Digital Transformation Will Fail to Keep Up
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        The challenge is clear: traditional businesses are caught in a vicious cycle of reacting to disruption, rather than anticipating and driving it. The reliance on legacy systems, slow decision-making, and siloed functions means that traditional organizations are ill-equipped to thrive in a world where change is the only constant.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Consider this: while many organizations are still struggling to implement basic digital tools, cognitive organizations are already redefining the future of business. DCOs don't just rely on technology for automation—they leverage AI and data-driven insights to continually evolve, improve, and offer value that adapts to customer needs in real time.
      </p>

      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
        <li><strong>Evolving Markets:</strong> In today's economy, if a company can't anticipate shifts in customer preferences or market trends, it risks being left behind. Traditional digital transformation doesn't provide the dynamic, continuous evolution that organizations need to thrive.</li>
        <li><strong>Innovation is the Key:</strong> DCOs embrace innovation not as a one-off event but as an ongoing, embedded process. Traditional businesses, by contrast, often rely on periodic innovation cycles, missing out on the long-term benefits of constant learning and improvement.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        The Shift to Cognitive Organizations: What You Can Do
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        So, how can traditional organizations evolve to become Digital Cognitive Organizations? It's not about simply adopting new technology — it's about fundamentally rethinking how the organization operates.
      </p>
      
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
        <li><strong>Reframe Decision-Making:</strong> Enable real-time decision-making by integrating AI and machine learning into every aspect of the business.</li>
        <li><strong>Promote Cross-Functional Teams:</strong> Break down silos and create adaptive, collaborative teams that can respond quickly to emerging opportunities or challenges.</li>
        <li><strong>Make Continuous Learning Part of Your Culture:</strong> Build systems that allow for constant feedback loops and iterative improvement.</li>
        <li><strong>Adopt an Agile Operating Model:</strong> Move away from rigid, top-down hierarchies and adopt agile frameworks that allow teams to adapt and innovate in real time.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        The Cognitive Future: The Time to Act is Now
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Our white paper on{' '}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-primary hover:text-primary-600 underline font-medium cursor-pointer bg-transparent border-none p-0 inline"
        >
          "The Rise of Economy 4.0"
        </button>{' '}
        clearly shows that businesses that cling to traditional models risk missing out on the profound benefits of cognitive organizations. Economy 4.0 demands agility, intelligence, and adaptability. In this new landscape, traditional digital transformation is a thing of the past. The future belongs to businesses that understand that true transformation comes from building cognitive intelligence into their operations, from the very foundation up.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        If you want to learn more about how your organization can become a Digital Cognitive Organization and lead the way in the cognitive revolution, read the full whitepaper.
      </p>

      <div className="bg-gradient-to-r from-[#1E3C8B] to-cyan-400 px-6 py-6 rounded-2xl my-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-3 text-white leading-tight">
          Read the Full Whitepaper
        </h3>
        <p className="text-base mb-4 text-white/95 leading-relaxed max-w-3xl">
          To learn more about the cognitive revolution and how Digital Cognitive Organizations will reshape your industry, read the full whitepaper, "The Rise of Economy 4.0"
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all shadow-md w-fit"
        >
          Read Whitepaper
        </button>
      </div>

      <WhitepaperAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whitepaperUrl="https://digital-qatalyst.shorthandstories.com/9e1cfaa6-d95f-4c07-af12-2bc59b0e3f1e/index.html"
        whitepaperTitle="The Rise of Economy 4.0"
      />

      {/* Topics Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          TOPICS
        </h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            Digital Economy 4.0
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            Cognitive Organizations
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            Business Transformation
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
            AI Strategy
          </span>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article 1 */}
          <div 
            className="group cursor-pointer"
            onClick={() => window.location.href = '/dtmi/articles/why-traditional-business-models-are-doomed'}
          >
            <div className="relative h-48 overflow-hidden rounded-xl mb-4">
              <img
                src="/images/Article 01_hero image.png"
                alt="Digital Transformation"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2">
              <span className="text-xs font-semibold text-brand-teal uppercase tracking-wide">
                DIGITAL ECONOMY 4.0
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
              Why Traditional Business Models Are Doomed in the Age of Cognitive Organizations
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>8 min read</span>
            </div>
          </div>

          {/* Article 3 */}
          <div 
            className="group cursor-pointer"
            onClick={() => window.location.href = '/dtmi/articles/why-traditional-organizations-are-obsolete'}
          >
            <div className="relative h-48 overflow-hidden rounded-xl mb-4">
              <img
                src="/images/Article 03_hero image.png"
                alt="Traditional Organizations"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2">
              <span className="text-xs font-semibold text-brand-teal uppercase tracking-wide">
                DIGITAL ECONOMY 4.0
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
              Why Traditional Organizations Are Obsolete in Today's Digital Economy
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>7 min read</span>
            </div>
          </div>

          {/* Prediction Analysis */}
          <div 
            className="group cursor-pointer"
            onClick={() => window.location.href = '/marketplace/knowledge-hub/prediction-analysis'}
          >
            <div className="relative h-48 overflow-hidden rounded-xl mb-4">
              <img
                src="/images/prediction-hero.jpg"
                alt="Prediction Analysis"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2">
              <span className="text-xs font-semibold text-brand-teal uppercase tracking-wide">
                PREDICTION ANALYSIS
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
              The Rise of Digital Cognitive Organizations: 2025-2030 Outlook
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>15 min read</span>
            </div>
          </div>
        </div>
      </div>
    </>;
}