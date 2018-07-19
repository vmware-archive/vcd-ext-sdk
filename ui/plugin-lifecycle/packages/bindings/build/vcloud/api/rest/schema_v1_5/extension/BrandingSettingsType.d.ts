import { ResourceType } from "./../ResourceType";
export declare class BrandingSettingsType extends ResourceType {
    companyName?: string;
    loginPageCustomizationTheme?: string[];
    theme?: string;
    previewCustomTheme?: string[];
    finalCustomTheme?: string[];
    aboutCompanyUrl?: string;
    supportUrl?: string;
    signUpUrl?: string;
    forgotUserNameOrPasswordURL?: string;
}
export declare namespace BrandingSettingsType {
    class Fields extends ResourceType.Fields {
        static readonly COMPANY_NAME: "companyName";
        static readonly LOGIN_PAGE_CUSTOMIZATION_THEME: "loginPageCustomizationTheme";
        static readonly THEME: "theme";
        static readonly PREVIEW_CUSTOM_THEME: "previewCustomTheme";
        static readonly FINAL_CUSTOM_THEME: "finalCustomTheme";
        static readonly ABOUT_COMPANY_URL: "aboutCompanyUrl";
        static readonly SUPPORT_URL: "supportUrl";
        static readonly SIGN_UP_URL: "signUpUrl";
        static readonly FORGOT_USER_NAME_OR_PASSWORD_UR_L: "forgotUserNameOrPasswordURL";
    }
}
