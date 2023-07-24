export type LogTransactionId = {
  transactionId: string
}

export interface LogDataError extends LogTransactionId {
  stack: string
}

export interface LogRepository {
  logError<T extends LogDataError>(data: T): Promise<void>
  logInfo<T extends LogTransactionId>(data: T): Promise<void>
}
