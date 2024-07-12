import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import logoSVG from '../../assets/icons/logo.svg'
import arrowDown from '../../assets/icons/arrow-down-2.svg'
import searchSVG from '../../assets/icons/search.svg'
import buySVG from '../../assets/icons/buy.svg'
import sunSVG from '../../assets/icons/sun.svg'
import Popover from '../Popover'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { schema, Schema } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'

import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import { formatCurrency, getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
import Button from '../Button'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])

export default function Header() {
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const MAX_PURCHASE = 3
  const queryClient = useQueryClient()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })
  const navigate = useNavigate()

  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
    }
  })
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })

  const { data: purchaseInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })
  const purchaseInCart = purchaseInCartData?.data.data

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }
  return (
    <div className='bg-[#eee]'>
      <div className='container py-5'>
        <div className='top-bar flex items-center justify-between '>
          <Link to={path.home} className='logo flex items-center gap-3.5'>
            <img src={logoSVG} alt='grocerymart' className='logo__img' />
            <h1 className='logo__title text-22px font-medium md:text-xl'>grocerymart</h1>
          </Link>
          <nav className=' navbar ml-36 mr-auto'>
            <ul className='flex items-center gap-8'>
              <li>
                <a href='#!' className='navbar__link flex items-center text-15px gap-1 font-light'>
                  Departments
                  <img src={arrowDown} alt='' className='icon navbar__arrow mt-0.5 ml-1' />
                </a>
              </li>
              <li>
                <a href='#!' className='navbar__link flex items-center text-15px gap-1 font-light'>
                  Grocery
                  <img src={arrowDown} alt='' className='icon navbar__arrow mt-0.5 ml-1' />
                </a>
              </li>
              <li>
                <a href='#!' className='navbar__link flex items-center text-15px gap-1 font-light'>
                  Beauty
                  <img src={arrowDown} alt='' className='icon navbar__arrow mt-0.5 ml-1' />
                </a>
              </li>
            </ul>
          </nav>
          {isAuthenticated && (
            <div className='top-act flex items-center gap-5'>
              <form className='' onSubmit={onSubmitSearch}>
                <div className='top-act__group flex items-center rounded-lg bg-white boxShadow border border-grey min-w-12 h-12 '>
                  <input
                    {...register('name')}
                    type='text'
                    className='pl-3.5 text-sm font-normal'
                    placeholder='Free Ship Đơn Từ 0Đ'
                    autoComplete='name'
                  />
                  <button className='top-act__btn flex items-center p-3.5'>
                    <img src={searchSVG} alt='top-act__icon' />
                  </button>
                </div>
              </form>

              <div className='flex items-center h-12 w-[226px] px-3 py-5 gap-5 bg-white boxShadow rounded-lg'>
                <Popover
                  placement='bottom-end'
                  renderPopover={
                    <div className='act-dropdown w-min-500px-100vw'>
                      <div className='act-dropdown__inner p-3 rounded-lg bg-white'>
                        {purchaseInCart && purchaseInCart.length > 0 ? (
                          <div className='act-dropdown__inner p-7 rounded-lg bg-white'>
                            <div className='act-dropdown__top flex items-center justify-between mb-5'>
                              <h2 className='act-dropdown__title text-xl font-normal'>
                                You have {purchaseInCart.length} item(s)
                              </h2>
                              <Link to={path.cart} className='act-dropdown__view-all text-lg text-viewall'>
                                See All
                              </Link>
                            </div>
                            <div className='row row-cols-3 gx-2 act-dropdown__list grid grid-cols-3  gap-4 pb-2.5  '>
                              {purchaseInCart.slice(0, MAX_PURCHASE).map((purchase) => (
                                <div key={purchase._id} className='col flex-grow flex-shrink-0 '>
                                  <article className='cart-preview-item text-left'>
                                    <div className='cart-preview-item__img-wrap relative border border-slate-300 rounded-lg pt-full'>
                                      <img
                                        src={purchase.product.image}
                                        alt={purchase.product.name}
                                        className='cart-preview-item__thumb absolute top-0 left-0 w-full h-full object-contain rounded-lg'
                                      />
                                    </div>
                                    <h3 className='cart-preview-item__title text-sm mt-3.5 truncate'>
                                      {purchase.product.name}
                                    </h3>
                                    <p className='cart-preview-item__price mt-1.5 text-base font-normal'>
                                      {formatCurrency(purchase.product.price)}đ
                                    </p>
                                  </article>
                                </div>
                              ))}
                            </div>
                            <div className='text-sm font-medium'>
                              {purchaseInCart.length > MAX_PURCHASE ? purchaseInCart.length - MAX_PURCHASE : ''} Thêm
                              vào giỏ hàng
                            </div>
                            <div className='act-dropdown__bottom my-5 mx-0 py-5 px-0 border-y border-x-0 border-grey border-slate-300 border-solid'>
                              <div className='act-dropdown__row flex items-center justify-between font-normal '>
                                <span className='act-dropdown__label text-lg font-light'>Subtotal</span>
                                <span className='act-dropdown__value text-lg font-light'>$415.99</span>
                              </div>
                              <div className='act-dropdown__row mt-2.5 flex items-center justify-between'>
                                <span className='act-dropdown__label text-lg font-light'>Texes</span>
                                <span className='act-dropdown__value text-lg font-light'>Free</span>
                              </div>
                              <div className='act-dropdown__row mt-2.5 flex items-center justify-between'>
                                <span className='act-dropdown__label text-lg font-light'>Shipping</span>
                                <span className='act-dropdown__value text-lg font-light'>$10.00</span>
                              </div>
                              <div className='act-dropdown__row mt-2.5 flex items-center justify-between font-medium act-dropdown__row--bold'>
                                <span className='act-dropdown__label text-lg '>Total Price</span>
                                <span className='act-dropdown__value text-lg '>$425.99</span>
                              </div>
                            </div>
                            <div className='act-dropdown__checkout flex justify-end'>
                              <button className='btn btn--primary btn--rounded act-dropdown__checkout-btn min-w-72 flex items-center justify-center gap-2.5 h-11 py-0 px-5 rounded-full bg-primary text-lg font-medium whitespace-nowrap select-none hover:opacity-90'>
                                Check Out All
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>Không có sản phẩm nào</div>
                        )}
                      </div>
                    </div>
                  }
                >
                  <Link to='/' className='top-act__btn flex items-center gap-2'>
                    <img src={buySVG} alt='top-act__icon' />
                    <span className='top-act__title text-sm font-normal'>$68.68</span>
                  </Link>
                </Popover>
                <Popover
                  placement='bottom-end'
                  renderPopover={
                    <div className='bg-white boxShadow rounded-sm '>
                      <div className='flex flex-col py-2 px-3'>
                        <button
                          className='py-2 px-3 text-sm font-normal hover:text-orange'
                          onClick={() => changeLanguage('vi')}
                        >
                          Tiếng việt
                        </button>
                        <button
                          className='py-2 px-3 text-sm font-normal hover:text-orange mt-2'
                          onClick={() => changeLanguage('en')}
                        >
                          Tiếng anh
                        </button>
                      </div>
                    </div>
                  }
                >
                  <div className='top-act__btn flex items-center gap-2'>
                    <span className='top-act__title text-sm font-normal ml-2.5'>{currentLanguage}</span>
                    <img src={arrowDown} alt='' className='icon navbar__arrow mt-0.5 ml-1' />
                  </div>
                </Popover>
              </div>
              <Popover
                placement='bottom-end'
                className='top-act__user'
                renderPopover={
                  <div className='act-dropdown relative top-act__dropdown w-72 '>
                    <div className='act-dropdown__inner user-menu p-7 rounded-lg bg-white'>
                      <div className='user-menu__top flex items-center justify-between mb-5'>
                        <img
                          src={getAvatarUrl(profile?.avatar)}
                          alt=''
                          className='user-menu__avatar w-14 h-14 object-cover'
                        />
                        <div>
                          <p className='user-menu__name mb-2 text-lg font-medium '>{profile?.name}</p>
                          <p>{profile?.email}</p>
                        </div>
                      </div>

                      <ul className='user-menu__list mt-7'>
                        <li>
                          <Link
                            to={path.profile}
                            className='user-menu__link flex items-center justify-between gap-10 py-4 font-normal'
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to='./favourite.html'
                            className='user-menu__link flex items-center justify-between gap-10 py-4 font-normal'
                          >
                            Favourite list
                          </Link>
                        </li>
                        <li className='user-menu__separate border-t border-gray-400'>
                          <a
                            href='#!'
                            className='user-menu__link flex items-center justify-between gap-10 py-4 font-normal'
                            id='switch-theme-btn'
                          >
                            <span>Dark mode</span>
                            <img src={sunSVG} alt='' className='icon user-menu__icon' />
                          </a>
                        </li>
                        <li>
                          <Link
                            to='#!'
                            className='user-menu__link flex items-center justify-between gap-10 py-4 font-normal'
                          >
                            Settings
                          </Link>
                        </li>
                        <li className='user-menu__separate border-t border-gray-400'>
                          <button
                            onClick={handleLogout}
                            className='user-menu__link flex items-center justify-between gap-10 py-4 font-normal'
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                }
              >
                <img src={getAvatarUrl(profile?.avatar)} alt='' className='top-act__avatar w-12 h-12 rounded-lg' />
              </Popover>
            </div>
          )}
          {!isAuthenticated && (
            <div className='top-act relative gap-5 ml-auto flex'>
              <Link
                to={path.login}
                className='btn btn--text d-md-none flex items-center justify-center gap-2.5 h-[46px] py-0 px-5 rounded-md bg-transparent text-lg font-normal whitespace-nowrap select-none hover:opacity-90'
              >
                Sign In
              </Link>
              <Button
                onClick={() => navigate(path.register)}
                className='top-act__sign-up btn btn--primary ml-5 flex items-center justify-center gap-2.5 h-[46px] py-0 px-5 rounded-md bg-primary text-lg font-normal whitespace-nowrap select-none hover:opacity-90'
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
