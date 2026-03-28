/**
 * Input.tsx
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
  error?: string;
};

function Input({ label, type = "text", value, onChange, error }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-text font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`
      h-10 w-full px-3 rounded-md
      bg-surface text-text
      border
      ${error ? "border-red-500" : "border-border"}
      focus:outline-none
      focus:ring-1
      ${error ? "focus:ring-red-500" : "focus:ring-accent"}
      transition
    `}
      />

      {error && (
        <p className="text-red-500 text-sm mt-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}


export default Input;