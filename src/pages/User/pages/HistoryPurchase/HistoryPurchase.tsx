import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import { path } from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  {
    status: purchaseStatus.all,
    label: 'Tất cả'
  },
  {
    status: purchaseStatus.waitForConfirmation,
    label: 'Chờ xác nhận'
  },
  {
    status: purchaseStatus.waitForGetting,
    label: 'Chờ lấy hàng'
  },
  {
    status: purchaseStatus.inProgress,
    label: 'Đang giao hàng'
  },
  {
    status: purchaseStatus.delivered,
    label: 'Đã giao hàng'
  },
  {
    status: purchaseStatus.cancelled,
    label: 'Đã hủy'
  }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchaseStatus.all
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchase({ status: status as PurchaseListStatus })
  })

  const purchasesData = purchasesInCartData?.data.data

  return (
    <>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {purchaseTabs.map((tab, key) => (
          <Link
            key={key}
            to={{
              pathname: path.historyPurchase,
              search: createSearchParams({
                status: String(tab.status)
              }).toString()
            }}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
              'border-b-orange text-orange': status === tab.status,
              'border-b-black/10 text-gray-700': status !== tab.status
            })}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div>
        <div className='overflow-x-auto'>
          <div className='min-w-[700px]'>
            {purchasesData?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-600 shadow-sm'>
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img src={purchase.product.image} alt={purchase.product.name} className='h-20 w-20 object-cover' />
                  </div>
                  <div className='ml-3 mt-2 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 mt-2 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-xl text-orange'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
