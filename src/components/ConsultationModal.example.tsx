/**
 * Example: Consultation Form in a Modal
 * 
 * This is an example component showing how to use the ConsultationFormCard
 * with the close button in a modal/popup context.
 * 
 * Usage:
 * import { ConsultationModal } from './components/ConsultationModal.example';
 * 
 * function MyPage() {
 *   const [showModal, setShowModal] = useState(false);
 *   
 *   return (
 *     <>
 *       <button onClick={() => setShowModal(true)}>
 *         Request Consultation
 *       </button>
 *       
 *       <ConsultationModal 
 *         isOpen={showModal}
 *         onClose={() => setShowModal(false)}
 *       />
 *     </>
 *   );
 * }
 */

import React from 'react';
import { ConsultationFormCard } from './ConsultationFormCard';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  defaultSector?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  title = "Schedule a Free Consultation",
  defaultSector,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-2xl my-8">
          {/* Consultation Form with Close Button */}
          <ConsultationFormCard
            title={title}
            defaultSector={defaultSector}
            onClose={onClose}
            showCloseButton={true}
            className="animate-modal-in"
          />
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

/**
 * Example: Slide-in Sidebar Consultation Form
 */
export const ConsultationSidebar: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <ConsultationFormCard
            title="Quick Consultation Request"
            onClose={onClose}
            showCloseButton={true}
          />
        </div>
      </div>
    </>
  );
};

/**
 * Example: Fullscreen Consultation Form
 */
export const ConsultationFullscreen: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <ConsultationFormCard
            title="Let's Transform Your Business Together"
            onClose={onClose}
            showCloseButton={true}
            className="shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Example: Popup Trigger Button with Modal
 */
export const ConsultationPopupButton: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
      >
        Request Free Consultation
      </button>

      <ConsultationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

/**
 * Example: Floating Action Button with Sidebar
 */
export const ConsultationFAB: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl hover:bg-primary-600 transition-all hover:scale-110 z-30 flex items-center justify-center"
        aria-label="Open consultation form"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Sidebar Form */}
      <ConsultationSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ConsultationModal;
