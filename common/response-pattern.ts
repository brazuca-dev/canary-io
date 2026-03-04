type SuccessResponse<T> = { success: true, data: T };
type ErrorResponse = { success: false, errors: string[] };

export type ResponsePattern<T> = SuccessResponse<T> | ErrorResponse

export const newResponse = {
  success: <T>({ data }: Pick<SuccessResponse<T>, 'data'>) => {
    return {
      success: true,
      data: data
    };
  },
  error: ({ errors }: Pick<ErrorResponse, 'errors'>) => {
    return {
      success: false,
      errors: errors
    }
  }
}
