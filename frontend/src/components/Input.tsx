import type { ChangeEvent } from "react";

/**
 * Input
 *
 * Reusable controlled input component.
 *
 * Responsibilities:
 * - Render labeled input field
 * - Forward value + onChange
 * - Maintain consistent styling
 *
 * Designed for:
 * - Login / Signup forms
 * - Easy validation extension later
 */
type InputProps = {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        h-10
        w-full
        px-3
        bg-surface
        rounded-md
        placeholder:text-gray-400
        text-text
        border border-border
        focus:outline-none
        focus:ring-1
        focus:ring-accent
        transition
      "
    />
  );
}

export default Input;