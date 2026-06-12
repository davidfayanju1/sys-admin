// types/settings.ts
export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  bio: string;
  timezone: string;
  language: string;
  avatar: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  timezone: string;
}

export interface BrandSettings {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
}

export interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  lowStock: boolean;
  customerFeedback: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface SettingsData {
  profile: ProfileSettings;
  store: StoreSettings;
  brand: BrandSettings;
  notifications: NotificationSettings;
  security?: SecuritySettings;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
