/**
 * Input.tsx
 *
 * Reusable controlled input component.
 *
 * Responsibilities:
 * - Render labeled input field
 * - Forward value + onChange
 * - Maintain consistent styling
 * - Support password visibility toggle
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
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
};

function Input({ label, type = "text", value, onChange, error, isPassword = false, showPassword = false, onTogglePassword }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-text font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : type}
          value={value}
          onChange={onChange}
          className={`
        h-10 w-full px-3 pr-10 rounded-md
        bg-surface text-text
        border
        ${error ? "border-red-500" : "border-border"}
        focus:outline-none
        focus:ring-1
        ${error ? "focus:ring-red-500" : "focus:ring-accent"}
        transition
      `}
        />

        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}


export default Input;