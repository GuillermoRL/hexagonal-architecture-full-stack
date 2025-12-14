import { Avatar } from "./ui/avatar";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black">
            <span className="text-xl font-bold text-white">E</span>
          </div>
        </div>

        {/* Avatar */}
        <Avatar />
      </div>
    </header>
  );
}
