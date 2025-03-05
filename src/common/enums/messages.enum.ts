export enum AuthMessages {
    // Başarı Mesajları
    USER_CREATED_SUCCESS = 'Kullanıcı başarıyla oluşturuldu',
    EMAIL_VERIFIED_SUCCESS = 'E-posta başarıyla doğrulandı',
    VERIFICATION_EMAIL_SENT = 'Doğrulama e-postası gönderildi',
    LOGIN_SUCCESS = 'Kullanıcı başarıyla giriş yaptı',
    PASSWORD_CHANGED_SUCCESS = 'Şifre başarıyla değiştirildi',
    PASSWORD_RESET_EMAIL_SENT = 'Şifre sıfırlama e-postası gönderildi',
    PASSWORD_RESET_SUCCESS = 'Şifre başarıyla sıfırlandı',
    TOKEN_VALID = 'Token geçerli',
    ACCOUNT_DEACTIVATED = 'Bu hesap devre dışı bırakılmış. Lütfen yöneticiniz ile iletişime geçin',
  
    // Hata Mesajları
    EMAIL_ALREADY_REGISTERED = 'E-posta zaten kayıtlı',
    INVALID_CREDENTIALS = 'Geçersiz kimlik bilgileri',
    INVALID_VERIFICATION_TOKEN = 'Geçersiz doğrulama tokeni veya token süresi dolmuş',
    EMAIL_ALREADY_VERIFIED = 'E-posta zaten doğrulandı',
    USER_NOT_FOUND = 'Kullanıcı bulunamadı',
    INVALID_PASSWORD = 'Geçersiz şifre',
    SAME_PASSWORD = 'Yeni şifreniz eski şifreniz ile aynı olamaz',
    SOCIAL_USER_EXISTS = 'Farklı bir sağlayıcıyla kullanıcı mevcut',
    INVALID_SOCIAL_TOKEN = 'Geçersiz Google token veya token doğrulama başarısız',
    UNAUTHORIZED_ACCESS = 'Yetkisiz erişim - JWT token gerekli',
    INVALID_RESET_TOKEN = 'Geçersiz veya süresi dolmuş şifre sıfırlama tokeni',

    // Provider Hata Mesajları
    SIGN_IN_WITH_PROVIDER = 'Lütfen {provider} ile giriş yapın',
    CANNOT_CHANGE_PASSWORD_FOR_PROVIDER = '{provider} hesabı için şifre değiştirilemez',
    CANNOT_VERIFY_EMAIL_FOR_PROVIDER = '{provider} hesabı için e-posta doğrulanamaz',
    CANNOT_RESET_PASSWORD_FOR_PROVIDER = '{provider} hesabı için şifre sıfırlanamaz',

    // Sistem Hata Mesajları
    USER_OR_ROLE_NOT_FOUND = 'Kullanıcı veya kullanıcı rolü bulunamadı',
    ERROR_TRANSFORMING_USER_DATA = 'Kullanıcı verisi dönüştürülürken hata oluştu',
    DEFAULT_MANAGER_ROLE_NOT_FOUND = 'Varsayılan MANAGER rolü bulunamadı'
  }
  
  export enum UserMessages {
    // Başarı Mesajları
    PROFILE_UPDATED_SUCCESS = 'Profil başarıyla güncellendi',
    USER_DELETED_SUCCESS = 'Kullanıcı başarıyla silindi',
    PHONE_VERIFIED_SUCCESS = 'Telefon numarası başarıyla doğrulandı',
    PHONE_VERIFICATION_SENT = 'Telefon doğrulama kodu gönderildi',
  
    // Hata Mesajları
    USER_NOT_FOUND = 'Kullanıcı bulunamadı',
    INVALID_PHONE_CODE = 'Geçersiz telefon doğrulama kodu',
    PHONE_ALREADY_VERIFIED = 'Telefon numarası zaten doğrulandı',
    PHONE_ALREADY_EXISTS = 'Telefon numarası zaten kayıtlı',
    EMAIL_ALREADY_EXISTS = 'E-posta zaten kayıtlı',
    INVALID_USER_DATA = 'Geçersiz kullanıcı verisi sağlandı',
    UNAUTHORIZED_ACCESS = 'Bu kaynağa erişim yetkiniz yok'
  }
  
  export enum RoleMessages {
    // Başarı Mesajları
    ROLE_CREATED_SUCCESS = 'Rol başarıyla oluşturuldu',
    ROLE_UPDATED_SUCCESS = 'Rol başarıyla güncellendi',
    ROLE_DELETED_SUCCESS = 'Rol başarıyla silindi',
    PRIVILEGES_UPDATED_SUCCESS = 'Yetkiler başarıyla güncellendi',
  
    // Hata Mesajları
    ROLE_NOT_FOUND = 'Rol bulunamadı',
    ROLE_ALREADY_EXISTS = 'Rol zaten mevcut',
    INVALID_ROLE_DATA = 'Geçersiz rol verisi sağlandı',
    CANNOT_DELETE_DEFAULT_ROLE = 'Varsayılan rol silinemez',
    INVALID_PRIVILEGE = 'Geçersiz yetki sağlandı',
    ROLE_IN_USE = 'Rol, kullanıcılar tarafından atanmış durumda ve silinemez'
  }
  
  export enum MailMessages {
    // Başarı Mesajları
    EMAIL_SENT_SUCCESS = 'E-posta başarıyla gönderildi',
    TEMPLATE_CREATED_SUCCESS = 'E-posta şablonu başarıyla oluşturuldu',
    TEMPLATE_UPDATED_SUCCESS = 'E-posta şablonu başarıyla güncellendi',
    AUTH_URL_RETRIEVED_SUCCESS = 'Gmail API yetkilendirme URL\'i başarıyla getirildi',
    TOKENS_RETRIEVED_SUCCESS = 'Gmail API token\'ları başarıyla alındı',
  
    // Hata Mesajları
    EMAIL_SEND_FAILED = 'E-posta gönderimi başarısız oldu',
    INVALID_EMAIL_ADDRESS = 'Geçersiz e-posta adresi sağlandı',
    TEMPLATE_NOT_FOUND = 'E-posta şablonu bulunamadı',
    INVALID_TEMPLATE_DATA = 'Geçersiz şablon verisi sağlandı',
    SMTP_CONNECTION_ERROR = 'SMTP sunucusuna bağlanılamadı',
    TEMPLATE_RENDERING_ERROR = 'E-posta şablonu işleme başarısız oldu'
  }
  
  export enum CompanyMessages {
    NOT_FOUND = 'Company not found',
    ALREADY_EXISTS = 'User already has an active company. Please delete the existing company before creating a new one.',
    CREATED = 'Şirket başarıyla oluşturuldu',
    UPDATED = 'Şirket başarıyla güncellendi',
    DELETED = 'Şirket başarıyla silindi',
  }
  
  export enum LocationMessages {
    // Başarı Mesajları
    CITIES_RETRIEVED_SUCCESS = 'Şehirler başarıyla getirildi',
    DISTRICTS_RETRIEVED_SUCCESS = 'İlçeler başarıyla getirildi',
    NEIGHBORHOODS_RETRIEVED_SUCCESS = 'Mahalleler başarıyla getirildi',
    ADDRESS_CREATED_SUCCESS = 'Adres başarıyla oluşturuldu',
    ADDRESS_RETRIEVED_SUCCESS = 'Adres başarıyla getirildi',
    ADDRESS_DELETED_SUCCESS = 'Adres başarıyla silindi',

    // Hata Mesajları
    CITY_NOT_FOUND = 'Şehir bulunamadı',
    DISTRICT_NOT_FOUND = 'İlçe bulunamadı',
    NEIGHBORHOOD_NOT_FOUND = 'Mahalle bulunamadı',
    ADDRESS_NOT_FOUND = 'Adres bulunamadı',
    INVALID_CITY_ID = 'Geçersiz şehir ID',
    INVALID_DISTRICT_ID = 'Geçersiz ilçe ID',
    INVALID_ADDRESS_ID = 'Geçersiz adres ID'
  }
  
  export enum EmployeeMessages {
    USER_NOT_IN_COMPANY = 'Personel davet etmek için önce firma tanımlaması yapmalısınız',
    USER_ALREADY_IN_COMPANY = 'Bu kullanıcı zaten bir şirketin üyesi',
    USER_ALREADY_EXISTS = 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten mevcut',
    PENDING_INVITATION_EXISTS = 'Bu e-posta için bekleyen bir davet zaten mevcut',
    INVITATION_SENT = 'Davet başarıyla gönderildi',
    INVITATION_RESENT = 'Davet başarıyla yeniden gönderildi',
    INVITATION_NOT_FOUND = 'Bu e-posta için davet bulunamadı',
    EMPLOYEE_NOT_FOUND = 'Çalışan bulunamadı',
    EMPLOYEE_REMOVED = 'Çalışan başarıyla kaldırıldı',
    EMPLOYEE_UPDATED = 'Çalışan bilgileri başarıyla güncellendi',
    ROLE_NOT_FOUND = 'Rol bulunamadı veya şirkete ait değil'
  }
  