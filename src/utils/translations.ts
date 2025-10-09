import { SupportedLanguage } from '../contexts';

/**
 * Translation dictionary for static text in the app
 * Key = English text, Value = object containing translations
 */
export const translations: Record<string, Record<SupportedLanguage, string>> = {
        // Common
        welcome: {
                en: 'Welcome',
                fi: 'Tervetuloa',
                vi: 'Chào mừng',
        },
        home: {
                en: 'Home',
                fi: 'Koti',
                vi: 'Trang chủ',
        },
        profile: {
                en: 'Profile',
                fi: 'Profiili',
                vi: 'Hồ sơ',
        },
        settings: {
                en: 'Settings',
                fi: 'Asetukset',
                vi: 'Cài đặt',
        },
        save: {
                en: 'Save',
                fi: 'Tallenna',
                vi: 'Lưu',
        },
        cancel: {
                en: 'Cancel',
                fi: 'Peruuta',
                vi: 'Hủy',
        },
        ok: {
                en: 'OK',
                fi: 'OK',
                vi: 'Đồng ý',
        },
        yes: {
                en: 'Yes',
                fi: 'Kyllä',
                vi: 'Có',
        },
        no: {
                en: 'No',
                fi: 'Ei',
                vi: 'Không',
        },
        loading: {
                en: 'Loading...',
                fi: 'Ladataan...',
                vi: 'Đang tải...',
        },
        error: {
                en: 'Error',
                fi: 'Virhe',
                vi: 'Lỗi',
        },
        success: {
                en: 'Success',
                fi: 'Onnistui',
                vi: 'Thành công',
        },

        // Auth
        login: {
                en: 'Login',
                fi: 'Kirjaudu sisään',
                vi: 'Đăng nhập',
        },
        signup: {
                en: 'Sign Up',
                fi: 'Rekisteröidy',
                vi: 'Đăng ký',
        },
        logout: {
                en: 'Logout',
                fi: 'Kirjaudu ulos',
                vi: 'Đăng xuất',
        },
        email: {
                en: 'Email',
                fi: 'Sähköposti',
                vi: 'Email',
        },
        password: {
                en: 'Password',
                fi: 'Salasana',
                vi: 'Mật khẩu',
        },
        forgotPassword: {
                en: 'Forgot Password?',
                fi: 'Unohditko salasanan?',
                vi: 'Quên mật khẩu?',
        },

        // Account
        account: {
                en: 'Account',
                fi: 'Tili',
                vi: 'Tài khoản',
        },
        editProfile: {
                en: 'Edit Profile',
                fi: 'Muokkaa profiilia',
                vi: 'Chỉnh sửa hồ sơ',
        },
        language: {
                en: 'Language',
                fi: 'Kieli',
                vi: 'Ngôn ngữ',
        },
        changeLanguage: {
                en: 'Change Language',
                fi: 'Vaihda kieli',
                vi: 'Đổi ngôn ngữ',
        },

        // Analytics
        analytics: {
                en: 'Analytics',
                fi: 'Analytiikka',
                vi: 'Phân tích',
        },
        diary: {
                en: 'Diary',
                fi: 'Päiväkirja',
                vi: 'Nhật ký',
        },
        scan: {
                en: 'Scan',
                fi: 'Skannaa',
                vi: 'Quét',
        },

        // Profile
        name: {
                en: 'Name',
                fi: 'Nimi',
                vi: 'Tên',
        },
        age: {
                en: 'Age',
                fi: 'Ikä',
                vi: 'Tuổi',
        },
        height: {
                en: 'Height',
                fi: 'Pituus',
                vi: 'Chiều cao',
        },
        weight: {
                en: 'Weight',
                fi: 'Paino',
                vi: 'Cân nặng',
        },
        gender: {
                en: 'Gender',
                fi: 'Sukupuoli',
                vi: 'Giới tính',
        },
        male: {
                en: 'Male',
                fi: 'Mies',
                vi: 'Nam',
        },
        female: {
                en: 'Female',
                fi: 'Nainen',
                vi: 'Nữ',
        },

        // Account Screen
        manageSubscription: {
                en: 'Manage Subscription',
                fi: 'Hallinnoi tilausta',
                vi: 'Quản lý gói đăng ký',
        },
        changePassword: {
                en: 'Change Password',
                fi: 'Vaihda salasana',
                vi: 'Đổi mật khẩu',
        },
        darkMode: {
                en: 'Dark Mode',
                fi: 'Tumma tila',
                vi: 'Chế độ tối',
        },
        notifications: {
                en: 'Notifications',
                fi: 'Ilmoitukset',
                vi: 'Thông báo',
        },
        sendRequest: {
                en: 'Send Request',
                fi: 'Lähetä pyyntö',
                vi: 'Gửi yêu cầu',
        },
        rateApp: {
                en: 'Rate Calog',
                fi: 'Arvostele Calog',
                vi: 'Đánh giá Calog',
        },
        followCalog: {
                en: 'Follow Calog',
                fi: 'Seuraa Calogia',
                vi: 'Theo dõi Calog',
        },
        termsOfUse: {
                en: 'Terms of Use',
                fi: 'Käyttöehdot',
                vi: 'Điều khoản sử dụng',
        },
        privacyPolicy: {
                en: 'Privacy Policy',
                fi: 'Tietosuojakäytäntö',
                vi: 'Chính sách bảo mật',
        },
        deleteAccount: {
                en: 'Delete Account',
                fi: 'Poista tili',
                vi: 'Xóa tài khoản',
        },
        signOut: {
                en: 'Sign Out',
                fi: 'Kirjaudu ulos',
                vi: 'Đăng xuất',
        },
        selectLanguage: {
                en: 'Select Language',
                fi: 'Valitse kieli',
                vi: 'Chọn ngôn ngữ',
        },
        free: {
                en: 'Free',
                fi: 'Ilmainen',
                vi: 'Miễn phí',
        },
        premium: {
                en: 'Premium',
                fi: 'Premium',
                vi: 'Cao cấp',
        },

        // Auth screens
        welcomeBack: {
                en: 'Welcome Back',
                fi: 'Tervetuloa takaisin',
                vi: 'Chào mừng trở lại',
        },
        consistencyBuilds: {
                en: 'Consistency builds strength – log in and keep pushing forward.',
                fi: 'Johdonmukaisuus rakentaa voimaa – kirjaudu sisään ja jatka eteenpäin.',
                vi: 'Sự kiên định tạo nên sức mạnh – đăng nhập và tiếp tục phấn đấu.',
        },
        enterYourEmail: {
                en: 'Enter your email',
                fi: 'Syötä sähköpostisi',
                vi: 'Nhập email của bạn',
        },
        enterYourPassword: {
                en: 'Enter your password',
                fi: 'Syötä salasanasi',
                vi: 'Nhập mật khẩu của bạn',
        },
        signIn: {
                en: 'Sign In',
                fi: 'Kirjaudu sisään',
                vi: 'Đăng nhập',
        },
        rememberMe: {
                en: 'Remember me',
                fi: 'Muista minut',
                vi: 'Nhớ mật khẩu',
        },
        forgotPasswordQuestion: {
                en: 'Forgot password?',
                fi: 'Unohditko salasanan?',
                vi: 'Quên mật khẩu?',
        },
        or: {
                en: 'OR',
                fi: 'TAI',
                vi: 'HOẶC',
        },
        dontHaveAccount: {
                en: "Don't have an account?",
                fi: 'Eikö sinulla ole tiliä?',
                vi: 'Chưa có tài khoản?',
        },
        signUp: {
                en: 'Sign up',
                fi: 'Rekisteröidy',
                vi: 'Đăng ký',
        },

        // Home screen
        welcomeToCalog: {
                en: 'Welcome to Calog!',
                fi: 'Tervetuloa Calogiin!',
                vi: 'Chào mừng đến Calog!',
        },
        trackYourNutrition: {
                en: 'Track your nutrition and fitness journey',
                fi: 'Seuraa ravintoa ja kuntoilumatkaasi',
                vi: 'Theo dõi hành trình dinh dưỡng và thể dục',
        },
        dailyCalorieGoal: {
                en: 'Daily Calorie Goal',
                fi: 'Päivittäinen kalorimitavoite',
                vi: 'Mục tiêu calo hàng ngày',
        },
        caloriesPerDay: {
                en: 'calories per day',
                fi: 'kaloria päivässä',
                vi: 'calo mỗi ngày',
        },
        loseWeight: {
                en: 'Lose Weight',
                fi: 'Laihdu',
                vi: 'Giảm cân',
        },
        gainWeight: {
                en: 'Gain Weight',
                fi: 'Nousee painoa',
                vi: 'Tăng cân',
        },
        maintainWeight: {
                en: 'Maintain Weight',
                fi: 'Ylläpidä paino',
                vi: 'Duy trì cân nặng',
        },
        target: {
                en: 'Target',
                fi: 'Tavoite',
                vi: 'Mục tiêu',
        },
        rate: {
                en: 'Rate',
                fi: 'Nopeus',
                vi: 'Tốc độ',
        },
        plan: {
                en: 'Plan',
                fi: 'Suunnitelma',
                vi: 'Gói',
        },

        // Tab navigation
        help: {
                en: 'Help',
                fi: 'Apu',
                vi: 'Trợ giúp',
        },
};

/**
 * Helper function to get static translation
 * @param key - Key in translation dictionary
 * @param language - Input language
 * @returns Translation string
 */
export const getStaticTranslation = (key: string, language: SupportedLanguage): string => {
        const translation = translations[key];
        if (!translation) {
                console.warn(`Translation key "${key}" not found`);
                return key;
        }
        return translation[language] || translation.en;
};
