import { type ReactElement } from "react";

export function Sidebaritem({
  text,
  icon,
  onClick,
  isActive = false,
}: {
  text: string;
  icon: ReactElement;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <div 
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-all duration-150 ${
        isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={onClick} 
    >
      <div className="text-xl">{icon}</div>
      <div className="text-sm font-medium">{text}</div>
    </div>
  );
}
