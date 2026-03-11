import { FiCheck } from 'react-icons/fi';

// Variant selector component for product variant options
interface Variant {
  _id: string;
  name: string;
  options?: Array<{
    _id: string;
    value: string;
  }>;
}

interface VariantSelectorProps {
  variants?: Variant[];
  selectedOptions?: Record<string, string>;
  onOptionSelect: (variantId: string, optionId: string) => void;
  disabled?: boolean;
  className?: string;
}

const VariantSelector = ({
  variants = [],
  selectedOptions = {},
  onOptionSelect,
  disabled = false,
  className = '',
}: VariantSelectorProps) => {
  // Handle option click
  const handleOptionClick = (variantId: string, optionId: string) => {
    if (disabled) return;
    onOptionSelect(variantId, optionId);
  };

  // Check if option is selected
  const isOptionSelected = (variantId: string, optionId: string) => {
    return selectedOptions[variantId] === optionId;
  };

  if (!variants || variants.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-gray-500">No variants available</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {variants.map((variant) => (
        <div key={variant._id} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Choose {variant.name}
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {variant.options?.map((option) => {
              const isSelected = isOptionSelected(variant._id, option._id);

              return (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => handleOptionClick(variant._id, option._id)}
                  disabled={disabled}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                    ${
                      isSelected
                        ? 'border-brand-primary bg-brand-tint text-brand-primary shadow-md'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-brand-primary hover:bg-brand-primary/5'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {option.value}
                  {isSelected && (
                    <FiCheck className="absolute -top-1 -right-1 h-4 w-4 bg-brand-primary text-white rounded-full p-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {!selectedOptions[variant._id] && (
            <p className="text-xs text-gray-500">
              Please select a {variant.name.toLowerCase()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default VariantSelector;
