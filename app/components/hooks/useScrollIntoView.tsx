import { useEffect, useRef } from 'react';

/**
 * Scrolls into view of the returned ref when the given dependencies change
 * @param dependencies
 */
export const useScrollIntoView = <T extends HTMLElement>(dependencies: any[]): React.RefObject<T> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (ref.current) {
            // ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            ref.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    }, dependencies);

    return ref;
};

// export const useScrollIntoView = <T extends HTMLElement>(dependencies: any[], offset = 0): React.RefObject<T> => {
//     const ref = useRef<T>(null);
//
//     useEffect(() => {
//         if (ref.current) {
//             const element = ref.current;
//             const rect = element.getBoundingClientRect();
//             const absoluteElementTop = rect.top + window.scrollY;
//             const scrollToPosition = absoluteElementTop - offset;
//             window.scrollTo({
//                 top: scrollToPosition,
//                 behavior: 'smooth',
//             });
//         }
//     }, [...dependencies, offset]);
//
//     return ref;
// };
