import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePageOverflowOptions {
    maxHeightMm?: number; // Default A4 height minus margins
}

export const usePageOverflow = (options: UsePageOverflowOptions = {}) => {
    const { maxHeightMm = 267 } = options; // A4 height (297mm) - 1.5cm top - 1cm bottom = ~267mm
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Function to check overflow - used both by ResizeObserver and for manual checks
    const checkOverflow = useCallback(() => {
        if (!containerRef.current) return;

        // Convert mm to pixels (approximate: 1mm ≈ 3.78px at 96dpi)
        const maxHeightPx = maxHeightMm * 3.78;
        const height = containerRef.current.getBoundingClientRect().height;

        setContentHeight(height);
        setIsOverflowing(height > maxHeightPx);
    }, [maxHeightMm]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Do an initial check immediately
        checkOverflow();

        // Convert mm to pixels (approximate: 1mm ≈ 3.78px at 96dpi)
        const maxHeightPx = maxHeightMm * 3.78;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const height = entry.contentRect.height;
                setContentHeight(height);
                setIsOverflowing(height > maxHeightPx);
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [maxHeightMm, checkOverflow]);

    return {
        containerRef,
        isOverflowing,
        contentHeight,
        maxHeightMm,
        checkOverflow, // Expose for manual rechecks if needed
    };
};
