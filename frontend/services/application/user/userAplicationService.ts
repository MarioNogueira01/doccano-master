import { Page } from '~/domain/models/page'
import { UserItem } from '~/domain/models/user/user'
import { APIUserRepository, SearchQuery } from '~/repositories/user/apiUserRepository'

export interface SearchQueryData {
  limit: string
  offset: string
  q?: string
  sortBy?: string
  sortDesc?: string
}

export class UserApplicationService {
  constructor(private readonly repository: APIUserRepository) {}

  public async list(q: SearchQueryData): Promise<Page<UserItem>> {
    try {
      const query = new SearchQuery(q.limit, q.offset, q.q, q.sortBy, q.sortDesc)
      return await this.repository.list(query)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async findById(id: string): Promise<UserItem> {
    return await this.repository.findById(id)
  }

  public async create(username: string, isSuperuser: boolean, isStaff: boolean): Promise<UserItem> {
    try {
      const user = new UserItem(0, username, isSuperuser, isStaff) // id 0 porque será gerado no backend
      return await this.repository.create(user)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async edit(userId: number, updatedData: Partial<UserItem>): Promise<UserItem> {
    try {
      return await this.repository.edit(userId, updatedData)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async delete(userId: number): Promise<void> {
    try {
      await this.repository.delete(userId)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }
}
