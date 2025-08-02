export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageURL?: string;
  highSchool?: {
    name: string;
    _id: string;
  };
  country?: string;
  countryCode?: string;
  role: "admin" | "user";
}

export interface ICategory {
  _id: string;
  name: string;
  description?: string;
  // icon?:string;
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

export interface IWeightOption {
  _id?: string;
  weight: string;
  score: number;
}

export interface IHeightOption {
  _id?: string;
  height: string;
  weights: IWeightOption[];
}

export interface IOption {
  _id?: string;
  text: string;
  score: number;
}

export interface IQuestion {
  _id?: string;
  text: string;
  type:
    | "multiple"
    | "text"
    | "number"
    | "date"
    | "textarea"
    | "dropdown"
    | "radio"
    | "height-weight";
  options: IOption[];
  heightOptions?: IHeightOption[];
  order: number;
}

export interface ILevel {
  _id: string;
  name: string;
  proposedSolution: string;
  from: number;
  to: number;
}

export interface IScreening {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  overview?: string;
  purpose?: string;
  duration?: string;
  benefits?: string[];
  status: "active" | "inactive" | "draft";
  imageURL?: string;
  questions: IQuestion[];
  interpretations: ILevel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IContestOption {
  _id: string;
  text: string;
  score: number;
}

export interface IContestQuestion {
  _id: string;
  text: string;
  type: "multiple" | "dropdown";
  options: IOption[];
  order: number;
}

export interface IContest {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  imageURL?: string;
  questions: IContestQuestion[];
  fromDate: Date;
  fromTime: string;
  toDate: Date;
  toTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventSEO {
  metaTitle: string;
  slug: string;
  metaDescription: string;
}

export interface IEvent {
  _id: string;
  title: string;
  summary: string;
  content?: string;
  image: string;
  cardImage: string;
  type: "virtual" | "physical";
  location?: string;
  isFeatured: boolean;
  eventDate: Date;
  status: "publish" | "draft";
  registrationLink?: string;
  createdAt: Date;
  updatedAt: Date;
  SEO: IEventSEO;
}

export interface IRegistration {
  registrationNumber: string;
  event: IEvent;
  user: IUser;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource {
  _id: string;
  categoryId: IResourceCategory;
  name: string;
  shortDescription: string;
  url: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIndependentCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIndependentResource {
  _id: string;
  categoryId: IIndependentCategory;
  name: string;
  shortDescription: string;
  url: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResearchRegistration {
  _id: string;
  firstName: string;
  language: string;
  grade: string;
  highSchool: string;
  country: {
    name: string;
    code: string;
  };
  city: string;
  selectedResearch: string;
  createdAt: Date;
  updatedAt: Date;
}
