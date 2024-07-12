import { Link } from 'react-router-dom'
import Popover from '../Popover'
import path from 'src/constants/path'
import { useMutation, useQuery } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { formatCurrency } from 'src/utils/utils'
import buySVG from '../../assets/icons/buy.svg'
import sunSVG from '../../assets/icons/sun.svg'
import avatar from '../../assets/img/avatar/avatar-3.png'
import arrowDown from '../../assets/icons/arrow-down-2.svg'

import authApi from 'src/apis/auth.api'
import { queryClient } from 'src/main'

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, setProfile, profile } = useContext(AppContext)
  const MAX_PURCHASE = 3

  const { data: purchaseInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })
  const purchaseInCart = purchaseInCartData?.data.data
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
  return (
    <div>
      <Popover
        placement='bottom-end'
        className=''
        renderPopover={
          <div className='act-dropdown w-min-500px-100vw'>
            <div className='act-dropdown__inner p-3 rounded-lg bg-white'>
              {purchaseInCart ? (
                <div className='act-dropdown__inner p-7 rounded-lg bg-white'>
                  <div className='act-dropdown__top flex items-center justify-between mb-5'>
                    <h2 className='act-dropdown__title text-2xl font-medium'>
                      You have {purchaseInCart.length} item(s)
                    </h2>
                    <Link to={path.cart} className='act-dropdown__view-all text-lg text-viewall'>
                      See All
                    </Link>
                  </div>
                  <div className='row row-cols-3 gx-2 act-dropdown__list grid grid-cols-3  gap-4 pb-2.5  overflow-x-auto'>
                    {purchaseInCart.slice(0, MAX_PURCHASE).map((purchase) => (
                      <div key={purchase._id} className='col flex-grow flex-shrink-0'>
                        <article className='cart-preview-item text-left'>
                          <div className='cart-preview-item__img-wrap relative  border border-slate-300 rounded-lg pt-full'>
                            <img
                              src={purchase.product.image}
                              alt={purchase.product.name}
                              className='cart-preview-item__thumb absolute top-0 left-0 w-full h-full object-contain'
                            />
                          </div>
                          <h3 className='cart-preview-item__title text-sm mt-3.5 truncate'>{purchase.product.name}</h3>
                          <p className='cart-preview-item__price mt-1.5 text-base font-medium'>
                            {formatCurrency(purchase.product.price)}đ
                          </p>
                        </article>
                      </div>
                    ))}
                    <div>
                      {purchaseInCart.length > MAX_PURCHASE ? purchaseInCart.length - MAX_PURCHASE : ''}them hang vao
                      gio
                    </div>
                  </div>
                  <div className='act-dropdown__bottom my-5 mx-0 py-5 px-0 border-y border-x-0 border-grey border-slate-300 border-solid'>
                    <div className='act-dropdown__row flex items-center justify-between '>
                      <span className='act-dropdown__label text-lg'>Subtotal</span>
                      <span className='act-dropdown__value text-lg'>$415.99</span>
                    </div>
                    <div className='act-dropdown__row mt-2.5 flex items-center justify-between'>
                      <span className='act-dropdown__label text-lg'>Texes</span>
                      <span className='act-dropdown__value text-lg'>Free</span>
                    </div>
                    <div className='act-dropdown__row mt-2.5 flex items-center justify-between'>
                      <span className='act-dropdown__label text-lg'>Shipping</span>
                      <span className='act-dropdown__value text-lg'>$10.00</span>
                    </div>
                    <div className='act-dropdown__row mt-2.5 flex items-center justify-between font-medium act-dropdown__row--bold'>
                      <span className='act-dropdown__label text-lg'>Total Price</span>
                      <span className='act-dropdown__value text-lg'>$425.99</span>
                    </div>
                  </div>
                  <div className='act-dropdown__checkout flex justify-end'>
                    <button className='btn btn--primary btn--rounded act-dropdown__checkout-btn min-w-72 flex items-center justify-center gap-2.5 h-11 py-0 px-5 rounded-full bg-primary text-lg font-medium whitespace-nowrap select-none hover:opacity-90'>
                      Check Out All
                    </button>
                  </div>
                </div>
              ) : (
                <div>khong co san pham</div>
              )}
            </div>
          </div>
        }
      >
        <Link to='/' className='top-act__btn flex items-center gap-2.5 py-3.5 px-5'>
          <img src={buySVG} alt='top-act__icon' />
          <span className='top-act__title text-sm font-medium'>$68.68</span>
        </Link>
      </Popover>
      <Popover
        placement='bottom-end'
        className='top-act__btn flex items-center py-3.5 px-5 rounded-lg bg-white shadow-custom min-w-12 h-12'
        renderPopover={
          <div className='bg-white shadow-md rounded-sm border border-gray-200'>
            <div className='flex flex-col py-2 px-3'>
              <button className='py-2 px-3 hover:text-orange'>Tieng viet</button>
              <button className='py-2 px-3 hover:text-orange mt-2'>Tieng anh</button>
            </div>
          </div>
        }
      >
        <img src={buySVG} alt='top-act__icon' />
        <span className='top-act__title text-sm font-medium ml-2.5'>Tiếng việt</span>
        <img src={arrowDown} alt='' className='icon navbar__arrow mt-0.5 ml-1' />
      </Popover>
      <Popover
        placement='bottom-end'
        className='top-act__user'
        renderPopover={
          <div className='act-dropdown relative top-act__dropdown w-72 '>
            <div className='act-dropdown__inner user-menu p-7 rounded-lg bg-white'>
              <div className='user-menu__top flex items-center justify-between mb-5'>
                <img src={avatar} alt='' className='user-menu__avatar w-14 h-14 object-cover' />
                <div>
                  <p className='user-menu__name mb-2 text-lg font-medium '>John Smith</p>
                  <p>{profile?.email}</p>
                </div>
              </div>

              <ul className='user-menu__list mt-7'>
                <li>
                  <Link to='/profile' className='user-menu__link flex items-center justify-between gap-10 py-3.5'>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to='./favourite.html'
                    className='user-menu__link flex items-center justify-between gap-10 py-3.5'
                  >
                    Favourite list
                  </Link>
                </li>
                <li className='user-menu__separate mt-10 border-t border-gray-900'>
                  <a
                    href='#!'
                    className='user-menu__link flex items-center justify-between gap-10 py-3.5'
                    id='switch-theme-btn'
                  >
                    <span>Dark mode</span>
                    <img src={sunSVG} alt='' className='icon user-menu__icon' />
                  </a>
                </li>
                <li>
                  <Link to='#!' className='user-menu__link flex items-center justify-between gap-10 py-3.5'>
                    Settings
                  </Link>
                </li>
                <li className='user-menu__separate'>
                  <button
                    onClick={handleLogout}
                    className='user-menu__link flex items-center justify-between gap-10 py-3.5'
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        }
      >
        <img src={avatar} alt='' className='top-act__avatar w-12 h-12 rounded-lg' />
      </Popover>
    </div>
  )
}
