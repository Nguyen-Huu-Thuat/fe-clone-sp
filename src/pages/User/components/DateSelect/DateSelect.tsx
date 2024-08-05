import { range } from 'lodash'
import { useEffect, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessages?: string
}

export default function DateSelect({ errorMessages, onChange, value }: Props) {
  const [date, setDate] = useState({
    date: Number(value?.getDate) || 1,
    month: Number(value?.getMonth) || 0,
    year: Number(value?.getFullYear) || 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value.getDate(),
        month: value.getMonth(),
        year: value.getFullYear()
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = e.target
    const newDate = {
      date: Number(value?.getDate) || date.date,
      month: Number(value?.getMonth) || date.month,
      year: Number(value?.getFullYear) || date.year,
      [name]: valueFromSelect
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
      <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((month) => (
              <option key={month} value={month}>
                {month + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] rounded-sm border border-black/10 px-3 hover:border-orange cursor-pointer'
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2025).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-3 text-red-600 min-h-[1rem] text-sm'>{errorMessages}</div>
      </div>
    </div>
  )
}
