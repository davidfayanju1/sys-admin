export interface StaffAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface StaffActions {
  canEdit: boolean;
  canDeactivate: boolean;
  canActivate: boolean;
  canDelete: boolean;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  address?: StaffAddress;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  actions: StaffActions;
}

export interface StaffRole {
  value: string;
  label: string;
}

export interface StaffListResponse {
  status: string;
  message: string;
  data: {
    users: StaffUser[];
    roles: StaffRole[];
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface StaffSingleResponse {
  data: {
    user: StaffUser;
    roles: StaffRole[];
  };
}

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface UpdateStaffPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  avatar?: string;
  address?: StaffAddress;
  isActive?: boolean;
}
