import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi from 'src/apis/users.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponse } from 'src/types/utils.type'
import { userSchema, UserSchema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>

const passwordSchema = userSchema.pick(['password', 'confirm_password', 'new_password'])

export default function ChangPassword() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      confirm_password: '',
      new_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message, {
        autoClose: 1300
      })
      // reset form
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formErrors = error.response?.data.data
        if (formErrors) {
          Object.keys(formErrors).forEach((key) => {
            setError(key as keyof FormData, {
              message: formErrors[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='rounded-sm bg-white px-4 pb-10 md:px-7 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-700'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-green-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:pr-12 md:mt-0'>
          <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                register={register}
                className='relative'
                name='password'
                type='password'
                placeholder='Nhập mật khẩu cũ'
                errorMessages={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                register={register}
                className='relative'
                name='new_password'
                type='password'
                placeholder='Nhập mật khẩu mới'
                errorMessages={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Nhập lại mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                register={register}
                className='relative'
                type='password'
                name='confirm_password'
                placeholder='Nhập lại mật khẩu mới'
                errorMessages={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='flex items-center h-9 px-5 bg-orange text-center text-white hover:bg-orange/80 rounded-sm'
              >
                Lưu thông tin
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
