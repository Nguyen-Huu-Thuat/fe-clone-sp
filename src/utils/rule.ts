/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc'
    },
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: 'Email không đúng định dạng'
    },
    maxLength: {
      value: 160,
      message: 'Email có độ dài từ 5-160 ký tự'
    },
    minLength: {
      value: 5,
      message: 'Email có độ dài từ 5-160 ký tự'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Password có độ dài từ 6-160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Password có độ dài từ 6-160 ký tự'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password là bắt buộc'
    },
    maxLength: {
      value: 160,
      message: 'Password có độ dài từ 6-160 ký tự'
    },
    minLength: {
      value: 6,
      message: 'Password có độ dài từ 6-160 ký tự'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Password không khớp' : undefined
  }
})

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_min, price_max } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_min) <= Number(price_max)
  }
  return price_min !== '' || price_max !== ''
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(6, 'Password có độ dài từ 6-160 ký tự')
    .max(160, 'Password có độ dài từ 6-160 ký tự')
    .oneOf([yup.ref(refString)], 'Password không khớp')
}

export const schema = yup.object({
  email: yup
    .string()
    .email('Email không đúng định dạng')
    .required('Email là bắt buộc')
    .min(5, 'Email có độ dài từ 5-160 ký tự')
    .max(160, 'Email có độ dài từ 5-160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Password có độ dài từ 6-160 ký tự')
    .max(160, 'Password có độ dài từ 6-160 ký tự'),
  confirm_password: handleConfirmPasswordYup('password'),
  price_min: yup.string().test({
    name: 'price-not-allow',
    message: 'Giá không hợp lệ',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allow',
    message: 'Giá không hợp lệ',
    test: testPriceMinMax
  }),
  name: yup.string().required('Tên là bắt buộc').trim()
})

export const userSchema = yup.object({
  name: yup.string().max(160, 'Tên có độ dài tối đa 160 ký tự'),
  phone: yup.string().max(20, 'Số điện thoại có độ dài tối đa 20 ký tự'),
  address: yup.string().max(160, 'Địa chỉ có độ dài tối đa 160 ký tự'),
  avatar: yup.string().max(1000, 'Avatar có độ dài tối đa 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày sinh phải trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema,
  new_password: schema.fields['password'] as yup.StringSchema,
  confirm_password: handleConfirmPasswordYup('new_password')
})

export const loginSchema = schema.omit(['confirm_password', 'price_max', 'price_min', 'name'])

export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
