
export type CategoryType = 'course' | 'blog'

export interface Category {
    name: string,
    type: CategoryType,
    slug:string
}