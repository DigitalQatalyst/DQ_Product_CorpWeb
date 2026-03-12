import React from "react";
import {
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { FadeInUpOnScroll, useInView } from "./AnimationUtils";

const CallToActionSimple: React.FC = () => {
  const [ref] = useInView({
    threshold: 0.2,
  });

  return (
    <div
      ref={ref}
      className="bg-secondary-900 py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/Form_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-secondary-900/75"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <FadeInUpOnScroll>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-4">
                OUR APPROACH
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Your Path to Digital Transformation Starts Here
              </h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
                At DQ, we unlock innovative solutions that drive impactful change. Our approach blends cutting-edge technology and expertise, ensuring sustainable growth for your business.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FadeInUpOnScroll delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Unlock Efficiency
                </h3>
                <p className="text-white/80 text-sm">
                  Streamline your operations and maximize productivity.
                </p>
              </div>
            </FadeInUpOnScroll>

            <FadeInUpOnScroll delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Drive Innovation
                </h3>
                <p className="text-white/80 text-sm">
                  Leverage the latest technology to stay ahead of the competition.
                </p>
              </div>
            </FadeInUpOnScroll>

            <FadeInUpOnScroll delay={0.3}>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Achieve Sustainable Growth
                </h3>
                <p className="text-white/80 text-sm">
                  Build long-term success with scalable digital strategies.
                </p>
              </div>
            </FadeInUpOnScroll>
          </div>

          {/* CTA Button */}
          <FadeInUpOnScroll delay={0.4}>
            <div className="text-center">
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold text-lg rounded-lg hover:bg-primary-600 transition-all shadow-lg"
              >
                Contact Us
                <ArrowRight size={20} />
              </a>
            </div>
          </FadeInUpOnScroll>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSimple;
