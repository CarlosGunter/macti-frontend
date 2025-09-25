interface Success<T> {
  data: T
  error: null
  success: true
}

interface Failure<E> {
  data: null
  error: E
  success: false
}

type Result<T, E = Error> = Success<T> | Failure<E>

// Main wrapper function
export async function tryCatch<T, E = Error> (
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise
    return { data, error: null, success: true }
  } catch (error) {
    return { data: null, error: error as E, success: false }
  }
}
