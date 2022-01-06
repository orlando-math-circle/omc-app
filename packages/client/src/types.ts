import { Ref } from '@nuxtjs/composition-api'

/**
 * Maybe it's a ref, or not.
 *
 * ```ts
 * type MaybeRef<T> = T | Ref<T>
 * ```
 */
export type MaybeRef<T> = T | Ref<T>
