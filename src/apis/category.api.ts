import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/https'

const URL = 'categories'

const categoryApi = {
  getCategory() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
