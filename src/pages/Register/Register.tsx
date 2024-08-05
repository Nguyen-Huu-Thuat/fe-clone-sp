/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Schema

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, 'confirm_password')
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formErrors = error.response?.data.data
          if (formErrors) {
            Object.keys(formErrors).forEach((key) => {
              setError(key as keyof FormData, {
                message: formErrors[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formErrors?.email) {
          //   setError('email', { message: formErrors.email, type: 'Server' })
          // }
          // if (formErrors?.password) {
          //   setError('password', { message: formErrors.password, type: 'Server' })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                className='mt-8'
                errorMessages={errors.email?.message}
                type='email'
                name='email'
                placeholder='Email'
                register={register}
              />
              <Input
                className='mt-4'
                errorMessages={errors.password?.message}
                type='password'
                name='password'
                placeholder='Password'
                register={register}
                autoComplete='on'
              />
              <Input
                className='mt-4'
                errorMessages={errors.confirm_password?.message}
                type='password'
                name='confirm_password'
                placeholder='Nhập lại Password'
                register={register}
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  className='w-full text-center px-4 py-2 uppercase rounded bg-red-500 text-white text-sm hover:bg-red-600 flex items-center justify-center'
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-400'>Bạn đã có tài khoản?&#160;</span>
                  <Link to='/login' className='text-red-400'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
