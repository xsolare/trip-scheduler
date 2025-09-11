import type { ICommentRepository } from '../../model/types'
import type { Comment, CreateCommentInput, UpdateCommentInput } from '~/shared/types/models/comment'

const logWarning = (method: string) => console.warn(`SqlCommentRepository.${method} is not implemented.`)

export class CommentRepository implements ICommentRepository {
  async list(_params: { parentId: string, page: number, limit: number }): Promise<{ data: Comment[], total: number }> {
    logWarning('list')
    return { data: [], total: 0 }
  }

  async create(data: CreateCommentInput): Promise<Comment> {
    logWarning('create')
    return { id: '', text: data.text }
  }

  async update(data: UpdateCommentInput): Promise<Comment> {
    logWarning('update')
    return { id: data.commentId, text: data.text }
  }

  async delete(params: { commentId: string }): Promise<Comment> {
    logWarning('delete')
    return { id: params.commentId }
  }
}
