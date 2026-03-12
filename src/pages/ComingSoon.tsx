import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
export interface ComingSoonProps {
  headline?: string
  subText?: string
  ctaText?: string
  ctaLink?: string
  showTimer?: boolean
  targetDate?: Date
  animationVariant?: 'dots' | 'waves' | 'gradient'
}
export const ComingSoon: React.FC<ComingSoonProps> = ({
  headline = 'Coming Soon',
  ctaText = 'Back',
  showTimer = false,
  targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  // 30 days from now
  animationVariant = 'gradient',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ComingSoonProps | null;
  
  // Use state values if provided, otherwise fall back to props
  const finalHeadline = state?.headline || headline;
  const finalCtaText = state?.ctaText || ctaText;
  const finalShowTimer = state?.showTimer !== undefined ? state.showTimer : showTimer;
  const finalTargetDate = state?.targetDate || targetDate;
  const finalAnimationVariant = state?.animationVariant || animationVariant;

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  function calculateTimeLeft() {
    const difference = +finalTargetDate - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearTimeout(timer)
  })
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-navy text-white">
      <div className="container mx-auto px-4 py-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-brand-coral to-brand-teal bg-clip-text text-transparent"
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            {finalHeadline}
          </motion.h1>

          {finalShowTimer && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
            >
              <TimeUnit
                value={timeLeft.days}
                label="Days"
              />
              <TimeUnit
                value={timeLeft.hours}
                label="Hours"
              />
              <TimeUnit
                value={timeLeft.minutes}
                label="Minutes"
              />
              <TimeUnit
                value={timeLeft.seconds}
                label="Seconds"
              />
            </motion.div>
          )}
          <motion.div
            className="mb-16"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
          >
            {finalAnimationVariant === 'dots' && (
              <DotAnimation />
            )}
            {finalAnimationVariant === 'waves' && (
              <WaveAnimation />
            )}
            {finalAnimationVariant === 'gradient' && (
              <GradientAnimation />
            )}
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.9,
              duration: 0.8,
            }}
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-8 py-4 rounded-full font-medium transition-all bg-brand-coral hover:bg-brand-coral-dark text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ArrowLeftIcon size={18} className="mr-2" />
              {finalCtaText}
            </button>
            <Link
              to="/consultation"
              className="inline-flex items-center px-8 py-4 rounded-full font-medium transition-all bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
      <BackgroundEffect />
    </div>
  )
}
const TimeUnit: React.FC<{
  value: number
  label: string
}> = ({ value, label }) => (
  <div
    className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
  >
    <span className="text-3xl font-bold text-brand-coral">{value}</span>
    <span className="text-sm uppercase tracking-wide text-white/70">{label}</span>
  </div>
)
const DotAnimation: React.FC = () => (
  <div className="flex justify-center space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-4 h-4 rounded-full bg-brand-coral"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
  </div>
)
const WaveAnimation: React.FC = () => (
  <div className="flex justify-center items-end h-16 space-x-1">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className="w-2 rounded-full bg-brand-teal"
        animate={{
          height: [10, 40, 10],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
)
const GradientAnimation: React.FC = () => (
  <motion.div
    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-brand-coral via-brand-teal to-brand-purple"
    animate={{
      rotate: 360,
      scale: [1, 1.1, 1],
    }}
    transition={{
      rotate: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      },
      scale: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    }}
  />
)
const BackgroundEffect: React.FC = () => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
      {/* Brand accent circles */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-brand-coral/10 to-brand-teal/10 blur-3xl"
        style={{ top: '20%', left: '10%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-brand-teal/10 to-brand-purple/10 blur-3xl"
        style={{ bottom: '20%', right: '10%' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.6, 0.3, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </div>
  </div>
)
