import { Outlet } from 'react-router-dom'
import UserSideNav from '../../components/UserSideNav'

export default function UserLayout() {
  return (
    <main className='profile mb-12'>
      <div className='container'>
        <div className='profile-container mt-8'>
          <div className='grid grid-cols-12 gap-14'>
            <div className='col-span-3 '>
              <UserSideNav />
            </div>
            <div className='col-span-9'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
