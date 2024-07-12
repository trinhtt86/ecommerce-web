import leaf from 'src/assets/leaf-bg.svg'
import leafSvg from 'src/assets/leaf.svg'
import plane from 'src/assets/plane-bg.svg'
import planeSvg from 'src/assets/plane.svg'
import plus from 'src/assets/icons/plus.svg'
import message from 'src/assets/icons/message-2.svg'
import location from 'src/assets/icons/location.svg'
import calling from 'src/assets/icons/calling.svg'
import item1 from 'src/assets/img/product/item-1.png'
import path from 'src/constants/path'
import { Link } from 'react-router-dom'

export default function Profile() {
  return (
    <div className='cart-info'>
      <div className='row gy-3'>
        <div className='col-12'>
          <h2 className='cart-info__heading text-xl font-medium'>My Wallet</h2>
          <p className='cart-info__desc profile__desc my-3 text-[15px]'>Payment methods</p>

          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-4'>
              <article className='payment-card relative z-10 p-5 bg-[#1e2e69] h-full rounded-xl text-white overflow-hidden select-none'>
                <img
                  src={plane}
                  alt=''
                  className='payment-card__img absolute top-0 right-0 -z-10 pointer-events-none'
                />
                <div className='payment-card__top flex items-center gap-2'>
                  <img src={planeSvg} alt='' />
                  <span className='payment-card__type text-sm font-medium'>FeatherCard</span>
                </div>
                <div className='payment-card__number mt-9 text-lg'>1234 4567 8901 2221</div>
                <div className='payment-card__bottom flex mt-5'>
                  <div>
                    <p className='payment-card__label text-[8px] mb-2'>Card Holder</p>
                    <p className='payment-card__value text-[10px]'>Imran Khan</p>
                  </div>
                  <div className='payment-card__expired mr-auto ml-10'>
                    <p className='payment-card__label text-[8px] mb-2'>Expired</p>
                    <p className='payment-card__value text-[10px]'>10/22</p>
                  </div>
                  <div className='payment-card__circle'></div>
                </div>
              </article>
            </div>

            <div className='col-span-4'>
              <article className='payment-card relative z-10 p-5 h-full rounded-xl text-white overflow-hidden select-none bg-[#354151]'>
                <img src={leaf} alt='' className='payment-card__img absolute top-0 right-0 -z-10 pointer-events-none' />
                <div className='payment-card__top flex items-center gap-2'>
                  <img src={leafSvg} alt='' />
                  <span className='payment-card__type text-sm font-medium'>FeatherCard</span>
                </div>
                <div className='payment-card__number mt-9 text-lg'>1234 4567 2221 8901</div>
                <div className='payment-card__bottom flex mt-5'>
                  <div>
                    <p className='payment-card__label text-[8px] mb-2'>Card Holder</p>
                    <p className='payment-card__value text-[10px]'>Imran Khan</p>
                  </div>
                  <div className='payment-card__expired mr-auto ml-10'>
                    <p className='payment-card__label text-[8px] mb-2'>Expired</p>
                    <p className='payment-card__value text-[10px]'>11/22</p>
                  </div>
                  <div className='payment-card__circle'></div>
                </div>
              </article>
            </div>

            <div className='col-span-4'>
              <a
                className='new-card flex flex-col items-center justify-center gap-3 h-full min-h-[170px] rounded-xl border border-[#d2d1d6]'
                href='./add-new-card.html'
              >
                <img src={plus} alt='' className='new-card__icon icon' />
                <p className='new-card__text text-sm'>Add New Card</p>
              </a>
            </div>
          </div>
        </div>

        <div className='col-12 mt-8'>
          <h2 className='cart-info__heading text-xl font-medium'>Account info</h2>
          <p className='cart-info__desc profile__desc my-3 text-[15px]'>Addresses, contact information and password</p>
          <div className='row gy-md-2 row-cols-2 row-cols-lg-1 grid grid-cols-12'>
            <div className='col-span-6'>
              <Link to={path.editProfile}>
                <article className='account-info flex items-center gap-3 p-3 rounded-xl bg-white'>
                  <div className='account-info__icon flex items-center justify-center shrink-0 w-[54px] h-[54px] rounded-lg bg-white'>
                    <img src={message} alt='' className='icon' />
                  </div>
                  <div>
                    <h3 className='account-info__title text-[15px] font-normal'>Email Address</h3>
                    <p className='account-info__desc mt-2 text-sm'>tarek97.ta@gmail.com</p>
                  </div>
                </article>
              </Link>
            </div>
            <div className='col col-span-6'>
              <a href='./edit-personal-info.html'>
                <article className='account-info flex items-center gap-3 p-3 rounded-xl bg-white'>
                  <div className='account-info__icon flex items-center justify-center shrink-0 w-[54px] h-[54px] rounded-lg bg-white'>
                    <img src={calling} alt='' className='icon' />
                  </div>
                  <div>
                    <h3 className='account-info__title text-[15px] font-normal'>Phone number</h3>
                    <p className='account-info__desc mt-2 text-sm'>+000 11122 2345 657</p>
                  </div>
                </article>
              </a>
            </div>
            <div className='col col-span-6'>
              <a href='./edit-personal-info.html'>
                <article className='account-info flex items-center gap-3 p-3 rounded-xl bg-white'>
                  <div className='account-info__icon flex items-center justify-center shrink-0 w-[54px] h-[54px] rounded-lg bg-white'>
                    <img src={location} alt='' className='icon' />
                  </div>
                  <div>
                    <h3 className='account-info__title text-[15px] font-normal'>Add an address</h3>
                    <p className='account-info__desc mt-2 text-sm'>Bangladesh Embassy, Washington, DC 20008</p>
                  </div>
                </article>
              </a>
            </div>
          </div>
        </div>

        <div className='col-12'>
          <h2 className='cart-info__heading text-xl font-medium'>Lists</h2>
          <p className='cart-info__desc profile__desc my-3 text-[15px]'>2 items - Primary</p>

          <article className='favourite-item flex items-center gap-5'>
            <img src={item1} alt='' className='favourite-item__thumb w-[110px]' />
            <div>
              <h3 className='favourite-item__title text-[15px]'>Coffee Beans - Espresso Arabica and Robusta Beans</h3>
              <div className='favourite-item__content flex items-center gap-5 mt-3'>
                <span className='favourite-item__price text-[22px]'>$47.00</span>
                <button className='btn btn--primary prod-info__add-to-cart h-[46px] gap-3 rounded-full py-0 px-5 text-lg  bg-primary'>
                  Add to cart
                </button>
              </div>
            </div>
          </article>

          <div className='cart-info__separate my-8 mx-0 h-[1px] bg-[#d2d1d6]'></div>

          <article className='favourite-item flex items-center gap-5'>
            <img src={item1} alt='' className='favourite-item__thumb w-[110px]' />
            <div>
              <h3 className='favourite-item__title text-[15px]'>Coffee Beans - Espresso Arabica and Robusta Beans</h3>
              <div className='favourite-item__content flex items-center gap-5 mt-3'>
                <span className='favourite-item__price text-[22px]'>$47.00</span>
                <button className='btn btn--primary prod-info__add-to-cart h-[46px] gap-3 rounded-full py-0 px-5 text-lg  bg-primary'>
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
