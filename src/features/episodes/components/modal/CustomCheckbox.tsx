import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  id?: string;
}

/**
 * Custom checkbox component
 * Styled checkbox with check icon when selected
 */
export function CustomCheckbox({ checked, onChange, id }: CustomCheckboxProps) {
  return (
    <div className="flex-shrink-0">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onClick={onChange}
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={id}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
  );
}
