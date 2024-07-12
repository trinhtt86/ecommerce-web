import { useState } from 'react'
import InputNumber, { InputNumberProps } from '../InputNumber'

import minus from 'src/assets/icons/minus.svg'
import plus from 'src/assets/icons/plus.svg'
interface Props extends InputNumberProps {
  max?: number
  value?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}
export default function QuantityController({
  max,
  value,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  classNameWrapper = '',
  ...rest
}: Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }

    onType && onType(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }
  return (
    <div
      className={
        'flex justify-between items-center  gap-3 h-[44px] px-5 rounded-xl border border-solid border-[#d2d1d6] text-sm' +
        classNameWrapper
      }
    >
      <button type='button' className='' onClick={increase}>
        <img className='icon ' src={plus} alt='' />
      </button>
      <InputNumber
        onChange={handleChange}
        value={value || localValue}
        onBlur={handleBlur}
        className=''
        classNameError='hidden'
        classNameInput='w-[30px]  text-center'
        {...rest}
      />
      <button type='button' className='' onClick={decrease}>
        <img className='icon ' src={minus} alt='' />
      </button>
    </div>
  )
}
