export type SiteSettings = {
  facebook?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
  maps_url?: string | null;
  business_hours?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_image_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  footer_text?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  financing_text?: string | null;
  warranty_text?: string | null;
  trade_in_text?: string | null;
  show_prices?: boolean | null;
  show_reserved_vehicles?: boolean | null;
  show_financing_section?: boolean | null;
  show_testimonials?: boolean | null;
};

export type Store = {
  id: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  instagram?: string | null;
  about?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  site_settings?: SiteSettings | null;
};

export type Vehicle = {
  id: string;
  brand?: string | null;
  model?: string | null;
  version?: string | null;
  year?: number | null;
  km?: number | null;
  transmission?: string | null;
  fuel?: string | null;
  color?: string | null;
  price?: number | null;
  description?: string | null;
  photos?: string[] | null;
  featured?: boolean | null;
  status?: string | null;
  created_at?: string | null;
};

export type Catalog = {
  store: Store;
  vehicles: Vehicle[];
  updated_at?: string | null;
};