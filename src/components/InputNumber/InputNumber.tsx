/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, InputHTMLAttributes, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessages?: string
  classNameInput?: string
  classNameError?: string
}
export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessages,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChane = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (/^\d+$/.test(value) || value === '') {
      //Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(e)
      //Cập nhật giá trị mới vào state
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} value={value || localValue} onChange={handleChane} ref={ref} />
      <div className={classNameError}>{errorMessages}</div>
    </div>
  )
})
