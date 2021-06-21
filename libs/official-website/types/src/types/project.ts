import type { IAPIResponseProps } from './api';

export interface IProjectPost {
  slug: string;
  title: string;
  coverImage: string;
  excerpt: string;
  content: string;
}

export type ProjectPostAPIResponseProps = IAPIResponseProps<
  Partial<IProjectPost>
>;
