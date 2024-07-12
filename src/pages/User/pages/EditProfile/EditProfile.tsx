import arrL from 'src/assets/icons/arrow-left.svg'
import avatar from 'src/assets/img/avatar/avatar-3.png'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { useMutation, useQuery } from '@tanstack/react-query'
import userApi from 'src/apis/user.api'
import { UserSchema, userSchema } from 'src/utils/rules'
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { Link } from 'react-router-dom'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import InputFile from 'src/components/InputFile'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { setProfileToLS } from 'src/utils/auth'

type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'avatar'>
type FormDataError = FormData
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar'])

function Info() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormData>()

  return (
    <Fragment>
      <div className='form__group flex-1 mt-8'>
        <label htmlFor='full-name' className='form__label block form-card__label mb-5 text-lg  '>
          Full name
        </label>
        <div className='form__text-input relative h-[48px] flex items-center px-3 rounded-xl border border-[#d2d1d6]'>
          <Input
            register={register}
            name='name'
            placeholder='Full name'
            errorMessage={errors.name?.message}
            className='form__input flex-1 w-full h-full text-lg font-medium'
          />
          <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
        </div>
      </div>

      <div className='form__row flex gap-8'>
        <div className='form__group flex-1 mt-8'>
          <label htmlFor='phone-number' className='form__label block form-card__label mb-5 text-lg '>
            Phone Number
          </label>
          <div className='form__text-input relative h-[48px] flex items-center px-3 rounded-xl border border-[#d2d1d6]'>
            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <InputNumber
                  placeholder='Phone number'
                  errorMessage={errors.phone?.message}
                  className='form__input flex-1 w-full h-full text-lg font-medium'
                  {...field}
                  onChange={field.onChange}
                />
              )}
            />
            <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
          </div>
        </div>
      </div>
    </Fragment>
  )
}
export default function ChangePassword() {
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])

  const methods = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: ''
    },
    resolver: yupResolver(profileSchema)
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setError
  } = methods
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutaion = useMutation({
    mutationFn: userApi.uploadAvatar
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }

      const res = await updateProfileMutation.mutateAsync({ ...data, avatar: avatarName })
      const updatedUser = res.data
      setProfile(updatedUser.data)
      setProfileToLS(updatedUser.data)
      refetch()
      toast.success(updatedUser.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  const handleChangeFile = (file?: File) => {
    setFile(file)
  }
  return (
    <div className='cart-info p-8 rounded-2xl bg-white shadow-custom'>
      <div className='row gy-3'>
        <div className='col-12'>
          <h2 className='cart-info__heading text-xl font-medium flex items-center'>
            <Link to={path.profile}>
              <img src={arrL} alt='' className='icon cart-info__back-arrow w-12 pr-5' />
            </Link>
            Personal info
          </h2>
          <FormProvider {...methods}>
            <form className='form form-card' onSubmit={onSubmit}>
              <div className='form__row flex gap-8'>
                <Info />

                <div className='form__group flex-1 mt-8'>
                  <label htmlFor='email-adress' className='form__label block form-card__label mb-5 text-lg '>
                    Address
                  </label>
                  <div className='form__text-input relative h-[48px] flex items-center justify-center px-3 rounded-xl border border-[#d2d1d6]'>
                    <Input
                      register={register}
                      name='address'
                      placeholder='Address'
                      errorMessage={errors.address?.message}
                      className='form__input flex-1 w-full h-full text-lg font-medium'
                    />

                    <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
                  </div>
                </div>
              </div>

              <div className='form__group flex-1 mt-8'>
                <label htmlFor='passowrd' className='form__label block form-card__label mb-5 text-lg '>
                  Upload
                </label>
                <div className='form__text-input relative h-[48px] flex items-center px-3 rounded-xl border border-[#d2d1d6]'>
                  <InputFile onChange={handleChangeFile} />
                </div>
              </div>
              <img src={previewImage || getAvatarUrl(avatar)} alt='' className='form__input-icon-error' />
              <div className='mt-3 text-gray-400'>
                <div>Dụng lượng file tối đa 1 MB</div>
                <div>Định dạng:.JPEG, .PNG</div>
                In
              </div>
              <div className='form-card__bottom flex items-center justify-end mt-8'>
                <a className='btn btn--text mr-4' href={path.profile}>
                  Cancel
                </a>
                <Button
                  type='submit'
                  className='btn btn--primary prod-info__add-to-cart h-[46px] gap-3 rounded-full py-0 px-5 text-lg  bg-primary'
                >
                  Save
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
