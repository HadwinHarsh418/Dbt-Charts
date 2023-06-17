import { Role } from './role';

export class User {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  full_name?: string;
  avatar?: string;
  role?: Role;
  token?: string;
  is_locked?: any;
  locked_at?: any;
  sponsor_name?: any;
  username?: any;
  wrong_login_attempts?: any;
  _id?: any;
  isAdmin?: any;
  two_fa_actived?: string = '0';
  profile_picture?: any;
  is_vip?: any;
  is_identity_approved?: any = '0';
  is_identified?: any = '0';
  discriminatory_zone?: any = 0;
  dscm_zone_name?: any = '';
  antiPhishingActive?: any = false;
}


export class UserProfileData {
  address?: string = '';
  avoid_retention?: number = 0;
  city?: string = '';
  company_id?: any = null;
  company_name?: any = null;
  country?: string = '';
  date_of_birth?: string = '';
  full_name?: string = '';
  id_passport?: string = '';
  is_company?: number = 0;
  lang_pref?: string = '';
  phone?: string = '';
  postcode?: string = '';
  two_fa_actived?: string = '0';
  profile_picture?: string = '';
  first_name?: string = '';
  last_name?: string = '';
  driving_licence?: string = '';
  username?: string = '';
}