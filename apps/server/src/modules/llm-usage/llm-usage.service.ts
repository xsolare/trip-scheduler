import { llmUsageRepository } from '~/repositories/llm-usage.repository'

export const llmUsageService = {
  /**
   * Gets the token usage history for a specific user.
   * @param userId The ID of the user.
   * @returns A list of token usage records.
   */
  async getHistory(userId: string) {
    return await llmUsageRepository.findByUserId(userId)
  },

  /**
   * Gets the token usage summary for a specific user.
   * @param userId The ID of the user.
   * @returns An object with total input and output tokens.
   */
  async getSummary(userId: string) {
    return await llmUsageRepository.getSummaryByUserId(userId)
  },
}
