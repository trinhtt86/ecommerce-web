import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import arrL from 'src/assets/icons/arrow-left.svg'

import { ErrorResponse } from 'src/types/utils.type'
import { userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
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
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className='cart-info p-8 rounded-2xl bg-white shadow-custom'>
      <div className='row gy-3'>
        <div className='col-12'>
          <h2 className='cart-info__heading text-xl font-medium flex items-center'>
            <Link to={path.profile}>
              <img src={arrL} alt='' className='icon cart-info__back-arrow w-12 pr-5' />
            </Link>
            Change Password
          </h2>
          <form className='form form-card' onSubmit={onSubmit}>
            <div className='form__row flex gap-8'>
              <div className='form__group flex-1 mt-8'>
                <label htmlFor='email-adress' className='form__label block form-card__label mb-5 text-lg '>
                  Password
                </label>
                <div className='form__text-input relative h-[48px] flex items-center justify-center px-3 rounded-xl border border-[#d2d1d6]'>
                  <Input
                    register={register}
                    name='password'
                    type='password'
                    placeholder='Mật khẩu cũ'
                    errorMessage={errors.password?.message}
                    className='form__input flex-1 w-full h-full text-lg font-medium'
                  />
                </div>
                <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
              </div>

              <div className='form__group flex-1 mt-8'>
                <label htmlFor='email-adress' className='form__label block form-card__label mb-5 text-lg '>
                  New Password
                </label>
                <div className='form__text-input relative h-[48px] flex items-center justify-center px-3 rounded-xl border border-[#d2d1d6]'>
                  <Input
                    register={register}
                    name='new_password'
                    type='password'
                    placeholder='Mật khẩu mới'
                    errorMessage={errors.new_password?.message}
                    className='form__input flex-1 w-full h-full text-lg font-medium'
                  />
                </div>

                <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
              </div>

              <div className='form__group flex-1 mt-8'>
                <label htmlFor='email-adress' className='form__label block form-card__label mb-5 text-lg '>
                  Nhập lại mật khẩu mới
                </label>
                <div className='form__text-input relative h-[48px] flex items-center justify-center px-3 rounded-xl border border-[#d2d1d6]'>
                  <Input
                    register={register}
                    name='confirm_password'
                    type='password'
                    placeholder='Nhập lại mật khẩu'
                    errorMessage={errors.confirm_password?.message}
                    className='form__input flex-1 w-full h-full text-lg font-medium'
                  />
                </div>

                <img src='./assets/icons/form-error.svg' alt='' className='form__input-icon-error' />
              </div>
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
        </div>
      </div>
    </div>
  )
}
