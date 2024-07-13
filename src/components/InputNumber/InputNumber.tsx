/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errorMessages?: string
  classNameInput?: string
  classNameError?: string
}
export const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessages,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1rem] text-sm',
    onChange,
    ...rest
  },
  ref
) {
  const handleChane = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if ((/^\d+$/.test(value) || value === '') && onChange) {
      onChange(e)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} onChange={handleChane} ref={ref} />
      <div className={classNameError}>{errorMessages}</div>
    </div>
  )
})
