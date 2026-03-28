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
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ label, type = "text", value, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-1">

      <label className="text-sm text-text font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="
          h-10
          w-full
          px-3
          bg-surface
          rounded-md
          text-text
          border border-border
          focus:outline-none
          focus:ring-1
          focus:ring-accent
          transition
        "
      />
    </div>
  );
}


export default Input;