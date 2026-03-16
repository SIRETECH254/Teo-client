import { FaWhatsapp } from 'react-icons/fa';

/**
 * Floating WhatsApp button for customer support.
 * Positioned fixed at the bottom right.
 */
const WhatsAppButton = () => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '254792491246';
  const defaultMessage = "Hello TEO KICKS, I'd like to make an inquiry.";
  const encodedMessage = encodeURIComponent(defaultMessage);
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10" />
      
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
        Chat with us
      </span>
    </a>
  );
};

export default WhatsAppButton;
