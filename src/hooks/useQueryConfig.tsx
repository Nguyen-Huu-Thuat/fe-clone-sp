import { ProductListConfig } from 'src/types/product.type'
import useQueryParams from './useQueryParams'
import { isUndefined, omitBy } from 'lodash'

export type QueryConfig = {
  [key in keyof ProductListConfig]?: string
}

export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 20,
      exclude: queryParams.exclude,
      name: queryParams.name,
      price_min: queryParams.price_min,
      price_max: queryParams.price_max,
      rating_filter: queryParams.rating_filter,
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      category: queryParams.category
    },
    isUndefined
  )

  return queryConfig
}
