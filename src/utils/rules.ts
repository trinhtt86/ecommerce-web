import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'
type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email is not in correct format'
    },
    maxLength: {
      value: 160,
      message: 'Email must be between 5 and 160 characters'
    },
    minLength: {
      value: 5,
      message: 'Email must be between 5 and 160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Password must be between 6 and 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Password must be between 6 and 160 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password is required'
    },
    maxLength: {
      value: 160,
      message: 'Password must be between 6 and 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Password must be between 6 and 160 characters'
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || 'Password confirmation does not match'
        : undefined
  }
})
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is not in correct format')
    .min(5, 'Email must be between 5 and 160 characters')
    .max(160, 'Email must be between 5 and 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Email must be between 6 and 160 characters')
    .max(160, 'Email must be between 6 and 160 characters'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Email must be between 6 and 160 characters')
    .max(160, 'Email must be between 6 and 160 characters')
    .oneOf([yup.ref('password')], 'Password confirmation does not match'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Gia khong hop le',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Gia khong hop le',
    test: testPriceMinMax
  }),
  name: yup.string().trim().required('')
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa là 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be between 6 and 160 characters')
    .max(160, 'Password must be between 6 and 160 characters'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(6, 'New password must be between 6 and 160 characters')
    .max(160, 'New password must be between 6 and 160 characters'),
  confirm_password: handleConfirmPasswordYup('new_password')
})

export type UserSchema = yup.InferType<typeof userSchema>

export type Schema = yup.InferType<typeof schema>
