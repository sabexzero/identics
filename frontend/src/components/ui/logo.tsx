import { FileCheck } from "lucide-react";

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <div
            className={`flex items-center justify-center bg-primary text-primary-foreground rounded-lg p-2 ${className}`}
        >
            <FileCheck className="h-6 w-6" />
        </div>
    );
}
