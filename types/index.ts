export interface Category {
  id: number;
  name_en: string;
  name_zh: string;
  created_at: string;
}

export interface Tag {
  id: number;
  name_en: string;
  name_zh: string;
  created_at: string;
}

export interface Article {
  id: number;
  directory: string;
  title_en: string;
  title_zh: string;
  address: string;
  thumbnail: string;
  preview?: string;
  description_en?: string;
  description_zh?: string;
  content?: string;
  categories?: number[];
  tags?: number[];
  date: string;
  flag: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ArticleWithRelations extends Omit<Article, 'categories' | 'tags'> {
  categories?: Category[];
  tags?: Tag[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
