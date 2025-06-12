export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageURL?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISEO {
  metaTitle: string;
  slug: string;
  metaDescription: string;
}

export interface INews {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  SEO: ISEO;
  shortDescription?: string;
  isFeatured: boolean;
  cardImage?: string;
}

export interface IOption {
  _id?: string;
  text: string;
  score: number;
}

export interface IQuestion {
  _id?: string;
  text: string;
  type: "multiple" | "boolean";
  options: IOption[];
  order: number;
}

export interface IScreening {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive" | "draft";
  imageURL?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}
