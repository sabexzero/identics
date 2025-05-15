"use client";

import { useCallback, useEffect, useState } from "react";

export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const defaultBreakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
};

export function useResponsive(customBreakpoints = {}) {
    const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

    const getCurrentSize = useCallback(() => {
        if (typeof window === "undefined") return "lg" as ScreenSize;

        const width = window.innerWidth;

        if (width < breakpoints.sm) return "xs";
        if (width < breakpoints.md) return "sm";
        if (width < breakpoints.lg) return "md";
        if (width < breakpoints.xl) return "lg";
        if (width < breakpoints["2xl"]) return "xl";
        return "2xl";
    }, [breakpoints]);

    const [screenSize, setScreenSize] = useState<ScreenSize>("lg");
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setScreenSize(getCurrentSize());
        setWidth(window.innerWidth);

        const handleResize = () => {
            setScreenSize(getCurrentSize());
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [getCurrentSize]);

    const isMobile = width < breakpoints.md;
    const isTablet = width >= breakpoints.md && width < breakpoints.lg;
    const isDesktop = width >= breakpoints.lg;

    const lessThan = (size: ScreenSize) => {
        const sizes: ScreenSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
        const currentIndex = sizes.indexOf(screenSize);
        const targetIndex = sizes.indexOf(size);
        return currentIndex < targetIndex;
    };

    const greaterThan = (size: ScreenSize) => {
        const sizes: ScreenSize[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
        const currentIndex = sizes.indexOf(screenSize);
        const targetIndex = sizes.indexOf(size);
        return currentIndex > targetIndex;
    };

    return {
        screenSize,
        width,
        isMobile,
        isTablet,
        isDesktop,
        lessThan,
        greaterThan,
    };
}
