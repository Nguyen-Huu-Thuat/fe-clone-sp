import { Link, NavLink } from 'react-router-dom'
import { path } from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'
import classNames from 'classnames'
import lock_icon from 'src/assets/lock.svg'
import list_order_icon from 'src/assets/listorder.svg'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <div className=''>
      <div className='flex items-center border-b border-b-gray-300 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'>
          <img src={getAvatarUrl(profile?.avatar)} alt='' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>nhthuat</div>
          <Link to={path.profile} className='flex items-center capitalize text-gray-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5 mr-1'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
            Sửa hồ sơ
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            classNames('flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='flex mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' className='w-full h-full' alt='' />
          </div>
          Tài khoản của tôi
        </NavLink>
        <NavLink
          to={path.changPassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='flex mr-3 h-[22px] w-[22px]'>
            <img src={lock_icon} className='w-full h-full' alt='' />
          </div>
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='flex mr-3 h-[22px] w-[22px]'>
            <img src={list_order_icon} className='w-full h-full' alt='' />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}
