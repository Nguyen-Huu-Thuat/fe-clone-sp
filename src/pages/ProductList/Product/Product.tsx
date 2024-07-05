import { Link } from 'react-router-dom'

export default function Product() {
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.0625rem] hover:shadow-md duration-100 transition-transform'>
        <div className='w-full pt-[100%] relative'>
          <img
            src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltah5dscsqe158'
            className='absolute top-0 left-0 bg-white w-full h-full object-cover'
            alt=''
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[1.75rem] line-clamp-2 text-sm'>
            Dây Sạc Tự Ngắt - Dây Cáp Sạc Dữ Liệu Sạc Nhanh 100W Micro USB Type C 3 Trong 1 6A
          </div>
        </div>
      </div>
    </Link>
  )
}
