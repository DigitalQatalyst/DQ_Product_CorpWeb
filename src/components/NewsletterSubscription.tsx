import React, { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { submitNewsletterSubscription } from '../services/airtableService';

interface NewsletterSubscriptionProps {
  source?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

interface Particle {
  id: number;
  x: number;
  y: number;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  source = 'Website',
  title = 'Get More Insights',
  description = 'Subscribe to our newsletter for weekly digital transformation tips',
  className = '',
  variant = 'default'
}) => {
  const [subscriptionState, setSubscriptionState] = useState<'initial' | 'form' | 'loading' | 'success' | 'error'>('initial');
  const [email, setEmail] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAttracting, setIsAttracting] = useState(false);
  const particlesControl = useAnimation();

  // Initialize particles
  useEffect(() => {
    if (variant === 'default') {
      const newParticles = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 280 - 140, // Spread across card width (~300px)
        y: Math.random() * 120 - 60,  // Spread across card height (~150px)
      }));
      setParticles(newParticles);
    }
  }, [variant]);

  const handleButtonHover = useCallback(async () => {
    if (variant === 'default' && particles.length > 0) {
      setIsAttracting(true);
      await particlesControl.start({
        x: 0,
        y: 20, // Attract to button position (lower in the card)
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      });
    }
  }, [particlesControl, particles.length, variant]);

  const handleButtonLeave = useCallback(async () => {
    if (variant === 'default' && particles.length > 0) {
      setIsAttracting(false);
      await particlesControl.start((i) => ({
        x: particles[i]?.x || 0,
        y: particles[i]?.y || 0,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25,
        },
      }));
    }
  }, [particlesControl, particles, variant]);

  const handleSubscribeClick = () => {
    if (subscriptionState === 'initial') {
      setSubscriptionState('form');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscriptionState('loading');
    
    try {
      // Get additional data for tracking
      const subscriptionData = {
        email: email.trim(),
        source: source,
        ipAddress: '', // Could be populated with actual IP if needed
        userAgent: navigator.userAgent
      };

      await submitNewsletterSubscription(subscriptionData);
      setSubscriptionState('success');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscriptionState('initial');
        setEmail('');
      }, 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionState('error');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscriptionState('form');
      }, 3000);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white ${className}`}>
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-blue-100 text-sm mb-4">{description}</p>
        
        {subscriptionState === 'initial' && (
          <button 
            className="w-full py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
            onClick={handleSubscribeClick}
          >
            Subscribe Now
          </button>
        )}

        {subscriptionState === 'form' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md text-sm hover:bg-gray-100"
              >
                Subscribe
              </button>
              <button
                type="button"
                onClick={() => setSubscriptionState('initial')}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {subscriptionState === 'loading' && (
          <div className="flex items-center justify-center h-11 bg-white/20 rounded-lg">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
            <span className="text-white font-semibold text-sm">Subscribing...</span>
          </div>
        )}

        {subscriptionState === 'success' && (
          <div className="flex items-center justify-center h-11 bg-green-500 rounded-lg">
            <Check size={20} className="text-white mr-2" />
            <span className="text-white font-semibold text-sm">Successfully subscribed!</span>
          </div>
        )}

        {subscriptionState === 'error' && (
          <div className="flex items-center justify-center h-11 bg-red-500 rounded-lg">
            <span className="text-white font-semibold text-sm">Something went wrong. Try again.</span>
          </div>
        )}
      </div>
    );
  }

  // Default variant (for sidebar and other uses)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-secondary to-secondary-600 rounded-xl p-6 text-white shadow-lg border border-secondary-200 ${className}`}>
      {/* Particles - only for default variant */}
      {variant === 'default' && particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          custom={index}
          initial={{ x: particle.x, y: particle.y }}
          animate={particlesControl}
          className={`absolute w-2 h-2 rounded-full bg-white/50 transition-opacity duration-300 ${
            isAttracting ? 'opacity-100' : 'opacity-80'
          }`}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      <div className="relative z-10">
        <div className="mb-4">
          <h3 className="font-bold mb-2 text-lg">{title}</h3>
          <p className="text-sm text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
        
        {subscriptionState === 'initial' && (
          <button 
            className="w-full bg-primary hover:bg-primary-600 text-white font-semibold h-11 text-sm px-8 py-3 rounded-lg transition-all duration-300 shadow-md"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onTouchStart={handleButtonHover}
            onTouchEnd={handleButtonLeave}
            onClick={handleSubscribeClick}
          >
            Subscribe Now
          </button>
        )}

        {subscriptionState === 'form' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md text-sm"
              >
                Subscribe
              </button>
              <button
                type="button"
                onClick={() => setSubscriptionState('initial')}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {subscriptionState === 'loading' && (
          <div className="flex items-center justify-center h-11 bg-primary/80 rounded-lg">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
            <span className="text-white font-semibold text-sm">Subscribing...</span>
          </div>
        )}

        {subscriptionState === 'success' && (
          <div className="flex items-center justify-center h-11 bg-green-500 rounded-lg">
            <Check size={20} className="text-white mr-2" />
            <span className="text-white font-semibold text-sm">Successfully subscribed!</span>
          </div>
        )}

        {subscriptionState === 'error' && (
          <div className="flex items-center justify-center h-11 bg-red-500 rounded-lg">
            <span className="text-white font-semibold text-sm">Something went wrong. Try again.</span>
          </div>
        )}
      </div>
    </div>
  );
};