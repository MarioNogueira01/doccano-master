import { Page } from '@/domain/models/page'
import { UserItem } from '@/domain/models/user/user'
import ApiService from '@/services/api.service'

const sortableFieldList = ['username', 'isSuperuser', 'isStaff'] as const
type SortableFields = (typeof sortableFieldList)[number]

export class SearchQuery {
  readonly limit: number = 10
  readonly offset: number = 0
  readonly q: string = ''
  readonly sortBy: SortableFields = 'username'
  readonly sortDesc: boolean = false

  constructor(_limit: string, _offset: string, _q?: string, _sortBy?: string, _sortDesc?: string) {
    this.limit = /^\d+$/.test(_limit) ? parseInt(_limit) : 10
    this.offset = /^\d+$/.test(_offset) ? parseInt(_offset) : 0
    this.q = _q || ''
    this.sortBy = (
      _sortBy && sortableFieldList.includes(_sortBy as SortableFields) ? _sortBy : 'username'
    ) as SortableFields
    this.sortDesc = _sortDesc === 'true'
  }
}

function toModel(item: { [key: string]: any }): UserItem {
  return new UserItem(item.id, item.username, item.is_superuser, item.is_staff)
}

function toPayload(item: UserItem): { [key: string]: any } {
  return {
    id: item.id,
    username: item.username,
    is_superuser: item.isSuperuser,
    is_staff: item.isStaff
  }
}

export class APIUserRepository {
  constructor(private readonly request = ApiService) {}

  async list(query: SearchQuery): Promise<Page<UserItem>> {
    const fieldMapper = {
      username: 'username',
      isSuperuser: 'is_superuser',
      isStaff: 'is_staff'
    }
    const sortBy = fieldMapper[query.sortBy]
    const ordering = query.sortDesc ? `-${sortBy}` : `${sortBy}`
    const url = `/users?limit=${query.limit}&offset=${query.offset}&q=${query.q}&ordering=${ordering}`
    const response = await this.request.get(url)
    return new Page(
      response.data.count,
      response.data.next,
      response.data.previous,
      response.data.results.map((user: { [key: string]: any }) => toModel(user))
    )
  }

  async findById(id: string): Promise<UserItem> {
    const url = `/users/${id}`
    const response = await this.request.get(url)
    return toModel(response.data)
  }

  async create(item: UserItem): Promise<UserItem> {
    const url = `/users`
    const payload = toPayload(item)
    const response = await this.request.post(url, payload)
    return toModel(response.data)
  }

  async edit(userId: number, updatedData: Partial<UserItem>): Promise<UserItem> {
    const url = `/users/${userId}`
    const response = await this.request.patch(url, updatedData)
    return toModel(response.data)
  }

  async delete(userId: number): Promise<void> {
    const url = `/users/${userId}`
    await this.request.delete(url)
  }
}
