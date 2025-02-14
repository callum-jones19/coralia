import { PropsWithChildren } from "react";

export interface BackgroundCardProps {
  className: string;
}

export default function BackgroundCard({ children, className }: PropsWithChildren<BackgroundCardProps>) {
  return (
    <>
      <div className={`shadow-md ${className}`}>
        {children}
      </div>
    </>
  )
}