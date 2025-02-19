import { PropsWithChildren } from "react";

export interface BackgroundCardProps {
  className: string;
}

export default function BackgroundCard({ children, className }: PropsWithChildren<BackgroundCardProps>) {
  return (
    <>
      <div
        className={`shadow-md ${className} dark:shadow-none dark:bg-neutral-800 dark:text-white`}
      >
        {children}
      </div>
    </>
  )
}