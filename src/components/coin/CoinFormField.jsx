import { classNames } from '../../helpers/classNames'

export const CoinFormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  hint,
  value,
  onChange,
  required = false,
  prefix,
  suffix,
}) => {
  const inputId = `field-${name}`

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium font-display text-brand-text">
        {label}{required && ' *'}
      </label>
      <div className="mt-1">
        {(prefix || suffix) ? (
          <div className="flex rounded-lg">
            {prefix && (
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-brand-border bg-brand-bg text-brand-muted text-sm">
                {prefix}
              </span>
            )}
            <input
              type={type}
              name={name}
              id={inputId}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={classNames(
                'focus:ring-brand-accent focus:border-brand-accent flex-1 block sm:text-sm border-brand-border bg-brand-bg text-brand-text placeholder-brand-muted',
                prefix ? 'rounded-none rounded-r-lg border-l-0' : 'rounded-lg'
              )}
            />
          </div>
        ) : (
          <input
            type={type}
            name={name}
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="focus:ring-brand-accent focus:border-brand-accent block w-full rounded-lg sm:text-sm border-brand-border bg-brand-bg text-brand-text placeholder-brand-muted"
          />
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  )
}
