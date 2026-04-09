import { useState } from 'react';
import { WhitepaperAccessModal } from '../../components/WhitepaperAccessModal';

export function Article3Content() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
        The world has changed. What worked in the past no longer works in today's fast-paced, digitally-driven marketplace. In a world where agility, intelligence, and real-time responsiveness are paramount, traditional organizations — built on outdated models of slow, hierarchical decision-making and rigid structures — are quickly becoming obsolete.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        As this{' '}
        <a 
          href="https://digital-qatalyst.shorthandstories.com/9e1cfaa6-d95f-4c07-af12-2bc59b0e3f1e/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          whitepaper on Economy 4.0
        </a>{' '}
        explains, the next wave of business evolution is already underway. The organizations that will thrive in the new economy are Digital Cognitive Organizations (DCOs) — businesses that combine human insight with machine intelligence to continuously adapt and innovate. In contrast, organizations still operating on traditional models are being left behind.
      </p>

      {/* <ArticleAuthorCard author={author} /> */}

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        Why Traditional Organizations Can't Keep Up
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        For decades, traditional business models have been built around a predictable, linear approach: stable processes, slow decision-making, and a focus on products or services that were once highly profitable. But in today's digital economy, this model no longer holds water. The economy has moved from being driven by capital and manual processes to being driven by intelligence, adaptability, and data-driven insights.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        1. Rigid Hierarchies vs. Networked, Adaptive Structures
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-6">
        <div className="lg:col-span-3">
          <p className="text-gray-700 leading-relaxed mb-6">
            Traditional organizations often rely on top-down, hierarchical decision-making, which slows down response times and inhibits flexibility. Decisions are typically made in centralized departments or through slow-moving management chains. This structure worked in a time when change was slow, but it now cripples organizations when they need to act quickly in a constantly evolving marketplace.
          </p>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Digital Cognitive Organizations, however, operate in a fluid, networked way. Cross-functional teams empowered with real-time data and decision-making rights are central to the DCO model. By breaking down silos and fostering collaboration, DCOs are able to act on new insights as soon as they emerge, adapting swiftly to market shifts and customer needs.
          </p>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <img
              src="/images/McKinsey_Agility.png"
              alt="McKinsey Agility Research"
              className="w-full h-auto rounded-lg mb-3"
            />
            <p className="text-sm text-gray-600 italic text-center leading-relaxed">
              Seventy percent of agile companies rank in the top quartile of organizational health, McKinsey
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        In{' '}
        <a 
          href="https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/why-agility-pays" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          McKinsey's report
        </a>{' '}
        - "Why Agility Pays", companies with agile decision-making structures have 30% higher performance in adapting to market shifts compared to those with rigid hierarchies.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        2. Static Processes vs. Continuous Learning and Adaptation
      </h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        According to a report by{' '}
        <a 
          href="https://www.deloitte.com/us/en/insights/topics/talent/employee-engagement-strategies.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          Deloitte
        </a>, "High-performing learning organizations are 92% more likely to innovate." Additionally, 46% are more likely to be first to market.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        In traditional organizations, change often happens through large-scale transformation projects that occur infrequently. These organizations measure success based on efficiency, output, and cost control, often at the expense of continuous learning and innovation.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        But in Economy 4.0, the only way to stay competitive is by fostering an environment where learning is ongoing and feedback loops are continuous. Digital Cognitive Organizations are built to continuously adapt. They integrate AI and machine learning across their operations to gather real-time insights, predict trends, and improve processes on the fly. Every interaction becomes an opportunity to learn and evolve.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Companies such as Porsche, Verizon, IBM, and Repsol have established innovation labs to make continuous innovation an organizational priority, generate disruptive ideas that make them stand out from their competitors, and build more agile, adaptable teams.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
        3. Product-Centric vs. Experience-Centric Value Delivery
      </h3>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Traditional organizations often focus on delivering products or services based on what is feasible or cost-effective. However, today's customers demand more than just a product—they want personalized, context-driven experiences that evolve based on their needs and preferences{' '}
        <a 
          href="https://www.researchgate.net/profile/Luis-Miguel-3/publication/383006376_The_Influence_of_Personalization_on_Consumer_Satisfaction_Trends_and_Challenges/links/66f6ddc09e6e82486ff50663/The-Influence-of-Personalization-on-Consumer-Satisfaction-Trends-and-Challenges.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-600 underline font-medium"
        >
          (Researchgate, 2024)
        </a>.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Digital Cognitive Organizations don't just deliver products; they deliver value in the form of personalized experiences that are continuously tailored to the customer. With AI and data analytics, DCOs gain a 360-degree view of each customer, allowing them to predict needs, deliver personalized offerings, and ensure a seamless experience across all touchpoints.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        The Digital Business Platform (DBP) framework provides the infrastructure for this shift. It enables the continuous flow of data and insights, allowing organizations to deliver value that evolves with customer needs.
      </p>

      <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl shadow-sm">
        <svg className="w-8 h-8 text-blue-400/40 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p className="text-xl text-gray-900 italic leading-relaxed font-semibold">
          The business environment today is moving too fast for traditional organizations to keep up. Companies that are stuck in outdated models are at risk of being overtaken by those who have embraced the cognitive revolution.
        </p>
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 rounded-full -mr-12 -mt-12"></div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        The Cognitive Advantage: Why DCOs Are Winning
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        Digital Cognitive Organizations are fundamentally different from their traditional counterparts. They are not just using AI and data — they are built around them. Here are some key differentiators:
      </p>
      
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
        <li><strong>Real-Time Decisions:</strong> DCOs leverage AI and machine learning to make decisions instantly, adapting to market conditions and customer needs as they happen.</li>
        <li><strong>Adaptive, Cross-Functional Teams:</strong> DCOs organize around fluid, networked teams that can quickly reconfigure based on context and opportunities.</li>
        <li><strong>Customer-Centric Value Delivery:</strong> DCOs don't simply push products — they continuously deliver personalized experiences based on real-time data and feedback.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        Why Traditional Business Models Are Doomed
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        The business environment today is moving too fast for traditional organizations to keep up. Companies that are stuck in outdated models are at risk of being overtaken by those who have embraced the cognitive revolution. Without the ability to adapt quickly, learn continuously, and deliver personalized, real-time value, traditional businesses will soon find themselves irrelevant in the digital economy.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        The shift to Digital Cognitive Organizations is not just an opportunity — it's a necessity. Organizations that fail to evolve will not just be left behind — they will be overtaken by more agile, data-driven, and intelligent competitors.
      </p>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        What Can Traditional Businesses Do?
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        For organizations that still rely on traditional models, it's crucial to begin the transformation now. Here are a few steps that can help:
      </p>
      
      <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 space-y-2">
        <li><strong>Move Toward Real-Time Data:</strong> Integrate data analytics and machine learning to empower faster decision-making.</li>
        <li><strong>Foster a Culture of Agility:</strong> Break down rigid hierarchies and empower teams to act autonomously based on data insights.</li>
        <li><strong>Shift to Customer-Centricity:</strong> Reimagine business models around personalized, evolving experiences rather than static products.</li>
      </ul>

      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        The Path to Cognitive Transformation: Start Now
      </h2>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        The cost of waiting is no longer incremental — it's existential. The shift to Digital Cognitive Organizations is happening now, and organizations that fail to adapt will find themselves irrelevant in an economy that values speed, intelligence, and adaptability.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        As our whitepaper on{' '}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-primary hover:text-primary-600 underline font-medium cursor-pointer bg-transparent border-none p-0 inline"
        >
          "The Rise of Economy 4.0"
        </button>{' '}
        highlights, the infrastructure of business is shifting. Intelligence — driven by data, AI, and continuous learning — is becoming the foundation for success. Organizations that embed this intelligence into their core processes will be the ones that lead in the new economy.
      </p>
      
      <p className="text-gray-700 leading-relaxed mb-6">
        For those ready to make the leap to a truly cognitive model, the journey starts today.
      </p>

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
            onClick={() => window.location.href = '/dtmi/article/why-traditional-business-models-are-doomed'}
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

          {/* Article 2 */}
          <div 
            className="group cursor-pointer"
            onClick={() => globalThis.location.href = '/dtmi/article/traditional-digital-transformation-is-dead'}
          >
            <div className="relative h-48 overflow-hidden rounded-xl mb-4">
              <img
                src="/images/Article 02_hero image.png"
                alt="Traditional Digital Transformation"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mb-2">
              <span className="text-xs font-semibold text-brand-teal uppercase tracking-wide">
                DIGITAL ECONOMY 4.0
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors line-clamp-2">
              Traditional Digital Transformation is Dead: Meet the Future of Business
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>10 min read</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}