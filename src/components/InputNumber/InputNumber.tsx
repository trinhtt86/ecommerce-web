import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    onChange,
    value = '',
    classNameError = 'form__error text-left text-sm font-medium mt-1 text-error',
    classNameInput = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }
  return (
    <div>
      <span className={className}>
        <input className={classNameInput} {...rest} ref={ref} value={value || localValue} onChange={handleChange} />
      </span>
      <p className={classNameError}>{errorMessage}</p>
    </div>
  )
})

export default InputNumber
