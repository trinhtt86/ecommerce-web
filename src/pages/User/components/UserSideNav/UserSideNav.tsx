import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import profileSVG from 'src/assets/icons/profile.svg'
import location from 'src/assets/icons/location.svg'
import message2 from 'src/assets/icons/message-2.svg'
import download from 'src/assets/icons/download.svg'
import heart from 'src/assets/icons/heart.svg'
import gift2 from 'src/assets/icons/gift-2.svg'
import shield from 'src/assets/icons/shield.svg'
import info from 'src/assets/icons/info.svg'
import danger from 'src/assets/icons/danger.svg'
import { getAvatarUrl } from 'src/utils/utils'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import classNames from 'classnames'
export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <aside className='profile__sidebar pb-8 rounded-2xl bg-white shadow-custom overflow-hidden'>
      <div className='profile-user flex items-center flex-col text-white pt-10 px-5 pb-5 bg-cover-image bg-no-repeat bg-center bg-cover '>
        <Link to={path.profile}>
          <img
            src={getAvatarUrl(profile?.avatar)}
            alt=''
            className='profile-user__avatar w-[121px] h-[121px] object-cover shadow-2xl border-4 border-solid border-[#ffffff33] rounded-full box-content'
          />
        </Link>
        <h1 className='profile-user__name mt-4 text-base font-medium'>Imran Khan</h1>
        <p className='profile-user__desc mt-1 text-[15px] mb-4'>Registered: 17th May 2022</p>
      </div>

      <div className='profile-menu mt-7 px-8'>
        <h3 className='profile-menu__title text-lg font-normal'>Manage Account</h3>
        <ul className='profile-menu__list mt-3'>
          <li>
            <NavLink
              to={path.profile}
              className={({ isActive }) =>
                classNames('profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]', {
                  'bg-black text-white': isActive,
                  'text-gray-600': !isActive
                })
              }
            >
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={profileSVG} alt='' className='icon ' />
              </span>
              Personal info
            </NavLink>
          </li>
          <li>
            <NavLink
              to={path.changePassword}
              className={({ isActive }) =>
                classNames('profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]', {
                  'bg-black text-white': isActive,
                  'text-gray-600': !isActive
                })
              }
            >
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={location} alt='' className='icon' />
              </span>
              changePassword
            </NavLink>
          </li>
          <li>
            <NavLink
              to={path.historyPurchase}
              className={({ isActive }) =>
                classNames('profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]', {
                  'bg-black text-white': isActive,
                  'text-gray-600': !isActive
                })
              }
            >
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={message2} alt='' className='icon' />
              </span>
              historyPurchase
            </NavLink>
          </li>
        </ul>
      </div>

      <div className='profile-menu mt-7 px-8'>
        <h3 className='profile-menu__title text-lg font-normal'>My items</h3>
        <ul className='profile-menu__list mt-3'>
          <li>
            <Link
              to={path.historyPurchase}
              className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'
            >
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={download} alt='' className='icon' />
              </span>
              Reorder
            </Link>
          </li>
          <li>
            <Link to='#!' className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'>
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={heart} alt='' className='icon' />
              </span>
              Lists
            </Link>
          </li>
          <li>
            <Link to='#!' className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'>
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={gift2} alt='' className='icon' />
              </span>
              Registries
            </Link>
          </li>
        </ul>
      </div>

      <div className='profile-menu mt-7 px-8'>
        <h3 className='profile-menu__title text-lg font-normal'>Subscriptions & plans</h3>
        <ul className='profile-menu__list mt-3'>
          <li>
            <Link to='#!' className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'>
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={shield} alt='' className='icon' />
              </span>
              Protection plans
            </Link>
          </li>
        </ul>
      </div>

      <div className='profile-menu mt-7 px-8'>
        <h3 className='profile-menu__title text-lg font-normal'>Customer Service</h3>
        <ul className='profile-menu__list mt-3'>
          <li>
            <Link to='#!' className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'>
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={info} alt='' className='icon' />
              </span>
              Help
            </Link>
          </li>
          <li>
            <Link to='#!' className='profile-menu__link flex items-center gap-3 h-[32px] px-1 rounded text-[15px]'>
              <span className='profile-menu__icon flex items-center justify-center w-[24px] h-full'>
                <img src={danger} alt='' className='icon' />
              </span>
              Terms of Use
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
