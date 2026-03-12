import React, { useEffect, useState } from 'react'

interface DigitalQatalystAttributionProps {
  'data-id'?: string
  variant?: 'minimal' | 'subtle' | 'footer' | 'corner'
}

const DigitalQatalystAttribution: React.FC<DigitalQatalystAttributionProps> = ({
  'data-id': dataId,
  variant = 'minimal',
}) => {
  const [isVisible, setIsVisible] = useState(false)

  // Fade in the attribution with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Render different variants
  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}
          >
            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
              <img
                src="/logo/dq-logo.png"
                alt="DigitalQatalyst"
                className="w-auto h-4 object-contain"
              />
              <span className="ml-2 text-sm text-black">
                Powered by DigitalQatalyst
              </span>
            </div>
          </div>
        )
      case 'subtle':
        return (
          <div
            className={`fixed top-4 right-4 transition-opacity duration-500 ${isVisible ? 'opacity-70 hover:opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
              <span className="text-xs text-black mr-1.5">Powered by</span>
              <img
                src="/logo/dq-logo.png"
                alt="DigitalQatalyst"
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
        )
      case 'footer':
        return (
          <div
            className={`fixed bottom-0 w-full py-2 bg-gray-100 border-t border-gray-200 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="container mx-auto flex justify-center items-center">
              <span className="text-xs text-black mr-2">Powered by</span>
              <img
                src="/logo/dq-logo.png"
                alt="DigitalQatalyst"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-1 text-xs font-medium text-black">
                DigitalQatalyst
              </span>
            </div>
          </div>
        )
      case 'corner':
        return (
          <div
            className={`fixed bottom-0 right-0 transition-opacity duration-500 ${isVisible ? 'opacity-80 hover:opacity-100' : 'opacity-0'}`}
          >
            <div className="flex items-center bg-primary/5 px-3 py-2 border-l border-t border-primary/20 rounded-tl-md">
              <img
                src="/logo/dq-logo.png"
                alt="DigitalQatalyst"
                className="w-5 h-5 object-contain"
              />
              <span className="ml-2 text-xs text-primary">
                Powered by DigitalQatalyst
              </span>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return <div data-id={dataId}>{renderVariant()}</div>
}

export default DigitalQatalystAttribution
