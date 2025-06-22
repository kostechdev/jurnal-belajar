import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="size-8 rounded-md" />
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight">Sistem Jurnal Belajar</span>
            </div>
        </>
    );
}
