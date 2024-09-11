import * as React from "react"
import clsx from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "icon"
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "outline"
          ? "border border-gray-300 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200",
        size === "icon" ? "h-10 w-10 p-0" : "h-10 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
