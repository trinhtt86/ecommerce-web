import introSVG from '../../assets/img/auth/intro.svg'
import arrowSVG from '../../assets/img/auth/intro-arrow.svg'
import logoSVG from '../../assets/icons/logo.svg'
// import messageSVG from '../../assets/icons/message.svg'
import googleSVG from '../../assets/icons/google.svg'
import lockSVG from '../../assets/icons/lock.svg'

import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { schema, Schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'

import Input from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'

import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
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
  })

  return (
    <main className='auth min-h-screen md:flex'>
      <Helmet>
        <title>Sign In | Grocery Mart</title>
        <meta name='description' content='day la trang log in' />
      </Helmet>
      <div className=' auth__intro md:flex-1 z-20  min-h-screen flex flex-col items-center justify-center gap-12 bg-white relative py-0 px-7'>
        <Link
          to='./'
          className='logo md:hidden flex items-center gap-2.5 md:gap-3.5 absolute top-20 left-1/2 -translate-x-2/4'
        >
          <img src={logoSVG} alt='grocerymart' className='logo__img w-6 md:w-full' />
          <h1 className='logo__title text-lg font-bold md:text-xl'>grocerymart</h1>
        </Link>
        <img src={introSVG} alt='' className='auth__intro-img w-min-424' />
        <p className='auth__intro-text max-w-412 text-center text-auth_intro_text_color font-medium text-sm md:text-lg'>
          The best of luxury brand values, high quality products, and innovative services
        </p>
        <button className='md:hidden auth__intro-next absolute bottom-12 left-1/2 -translate-x-2/4'>
          <img src={arrowSVG} alt='' />
        </button>
      </div>
      <div className=' auth__content md:flex-1 md:static fixed z-10 inset-0 flex items-center justify-center py-0 px-7 bg-white overflow-y-auto'>
        <div className='auth__content-inner flex flex-col items-center text-center w-min-460 py-8 px-0 md:py-12 md:px-0'>
          <Link to='./' className='logo flex items-center gap-2.5 md:gap-3.5'>
            <img src={logoSVG} alt='grocerymart' className='logo__img w-6 md:w-full' />
            <h1 className='logo__title text-lg font-bold md:text-xl'>grocerymart</h1>
          </Link>
          <div className='auth__heading mt-10 text-xl font-medium text-auth_heading_color md:text-3xl md:mt-12'>
            Hello Again!
          </div>
          <p className='auth__desc mt-2.5 px-5 text-15px font-normal text-desc'>
            Welcome back to sign in. As a returning customer, you have access to your previously saved all information.
          </p>
          <form className='form auth__form w-full md:mt-8' onSubmit={onSubmit} noValidate>
            <div className='form__text-input mb-3 flex items-center px-3 py-0 rounded-lg border border-gray-300 focus-within:border-teal-200 h-12'>
              <Input
                name='email'
                register={register}
                type='email'
                className='w-full flex'
                errorMessage={errors.email?.message}
                placeholder='Email'
                // icon={messageSVG}
              />
            </div>
            <div className='form__text-input flex items-center px-3 py-0 rounded-lg border border-gray-300 focus-within:border-teal-200 h-12'>
              <Input
                name='password'
                register={register}
                type='password'
                className=' w-full flex '
                errorMessage={errors.password?.message}
                placeholder='Password'
                icon={lockSVG}
              />
            </div>

            <div className='form__group mt-5 md:mt-8 form__group--inline flex items-center justify-between'>
              <label className='form__checkbox flex items-center gap-2.5 select-none'>
                <input type='checkbox' name='' id='' className='form__checkbox-input d-none' />
                <span className='form__checkbox-label text-sm text-slate-400'>Set as default card</span>
              </label>
              <a href='./reset-password.html' className='auth__link text-sm text-cyan-400'>
                Forgot password?
              </a>
            </div>
            <div className='form__group mt-5 md:mt-8 flex flex-col gap-5 md:gap-8'>
              <Button
                className='btn btn--primary auth__btn form__submit-btn text-zinc-950 flex items-center justify-center gap-2.5 h-11 py-0 px-5 rounded-md bg-nut text-base md:text-lg font-medium whitespace-nowrap select-none hover:opacity-90 w-full'
                // isLoading={loginMutation.isLoading}
                // disabled={loginMutation.isLoading}
              >
                Sign In
              </Button>
              <Button className='btn btn--outline auth__btn btn--no-margin bg-transparent border border-gray-300 flex items-center justify-center gap-2.5 h-11 py-0 px-5 rounded-md bg-nut text-base md:text-lg font-medium whitespace-nowrap select-none hover:opacity-90 w-full'>
                <img src={googleSVG} alt='' className='btn__icon icon' />
                Sign in with Google
              </Button>
            </div>
          </form>
          <p className='auth__text text-sm md:text-base m-10 md:mt-28'>
            You have an account yet?
            <Link to='/register' className='auth__link auth__text-link text-cyan-400 ml-1'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
