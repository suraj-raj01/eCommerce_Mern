export interface ImageType {
  url: string;
  public_id?: string;
}

export interface VariantType {
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
}

export interface SpecificationType {
  material?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  modelNumber?: string;
  originCountry?: string;
}

export interface ReviewType {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ShippingType {
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  freeShipping?: boolean;
}

export interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  price: number;
  discount?: number;
  stock: number;

  images: File[];

  variants: VariantType[];

  specifications: SpecificationType;

  shipping: ShippingType;

  isFeatured: boolean;
  status: "active" | "inactive" | "archived";
}
