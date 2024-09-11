import { ThemeSwitch } from "./UI/Toggle";

const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h2 className="md:text-2xl text-md font-bold text-gray-900 dark:text-white">SOL Airdrop</h2>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-300 md:text-lg text-sm md:mr-32 mr-12">
                            <span className="md:inline block">developed by</span>
                            <a href="https://github.com/ShaileshIshere">
                                <span className="md:inline block md:ml-1 font-semibold text-center hover:underline">
                                    Shailesh
                                </span>
                            </a>
                        </span>
                    </div>
                    <div>
                        <ThemeSwitch />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;