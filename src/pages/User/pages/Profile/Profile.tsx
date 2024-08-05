import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import userApi from 'src/apis/users.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
// eslint-disable-next-line import/no-named-as-default
import InputNumber from 'src/components/InputNumber'
import { userSchema, UserSchema } from 'src/utils/rule'
import DateSelect from '../../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { Omit } from 'lodash'
import InputFile from 'src/components/InputFile'

type FormData = Pick<UserSchema, 'address' | 'name' | 'phone' | 'date_of_birth' | 'avatar'>

type FormDataErrors = Omit<FormData, 'date_of_birth'> & { date_of_birth?: string }

const profileSchema = userSchema.pick(['address', 'name', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const methods = useForm<FormData>({
    defaultValues: {
      address: '',
      name: '',
      phone: '',
      date_of_birth: new Date(1990, 0, 1),
      avatar: ''
    },
    resolver: yupResolver(profileSchema)
  })
  const {
    watch,
    setValue,
    handleSubmit,
    control,
    register,
    setError,
    formState: { errors }
  } = methods
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  useEffect(() => {
    if (profile) {
      setValue('address', profile.address)
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  const avatar = watch('avatar')

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    try {
      let avatarName = avatar
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        console.log(formData)
        const UploadRes = await uploadAvatarMutation.mutateAsync(formData)
        avatarName = UploadRes.data.data
        setValue('avatar', avatarName)
      }
      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      refetch()
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      toast.success(res.data.message, {
        autoClose: 1300
      })
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataErrors>>(error)) {
        const formErrors = error.response?.data.data
        if (formErrors) {
          Object.keys(formErrors).forEach((key) => {
            setError(key as keyof FormDataErrors, {
              message: formErrors[key as keyof FormDataErrors],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const onHandleChangeFile = (file?: File) => {
    setFile(file)
  }

  return (
    <div className='rounded-sm bg-white px-4 pb-10 md:px-7 md:pb-20 shadow'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-700'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-green-700'>Quản lí thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:pr-12 md:mt-0'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <Info />
            <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder='Nhập địa chỉ của bạn'
                  errorMessages={errors.address?.message}
                />
              </div>
            </div>
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessages={errors.date_of_birth?.message}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
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
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  className='w-full h-full rounded-full object-cover'
                  alt=''
                />
              </div>
              <InputFile onChange={onHandleChangeFile} />
              <div className='mt-3 text-gray-400 text-sm'>
                <div>Dung lượng file tối đa 1MB</div>
                <div>Định dạng JPEG, PNG</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

function Info() {
  const methods = useFormContext<FormData>()
  const {
    register,
    control,
    formState: { errors }
  } = methods
  return (
    <>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
            register={register}
            name='name'
            placeholder='Nhập tên của bạn'
            errorMessages={errors.name?.message}
          />
        </div>
      </div>
      <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
        <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-md focus:shadow-sm'
                placeholder='Nhập số điện thoại của bạn'
                errorMessages={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </>
  )
}
