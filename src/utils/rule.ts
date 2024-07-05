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
  confirm_password: yup
    .string()
    .required('Confirm password là bắt buộc')
    .min(6, 'Password có độ dài từ 6-160 ký tự')
    .max(160, 'Password có độ dài từ 6-160 ký tự')
    .oneOf([yup.ref('password')], 'Password không khớp')
})

export const loginSchema = schema.omit(['confirm_password'])

export type Schema = yup.InferType<typeof schema>
