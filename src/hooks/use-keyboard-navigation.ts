import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableTabTrapping?: boolean;
  enableEscapeKey?: boolean;
  onEscape?: () => void;
}

export const useKeyboardNavigation = (
  containerRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    enableArrowKeys = false,
    enableTabTrapping = false,
    enableEscapeKey = false,
    onEscape,
  } = options;

  const focusableElements = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])',
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(selectors)) as HTMLElement[];
  }, [containerRef]);

  const updateFocusableElements = useCallback(() => {
    focusableElements.current = getFocusableElements();
  }, [getFocusableElements]);

  const focusNext = useCallback(() => {
    const elements = focusableElements.current;
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % elements.length;
    elements[nextIndex]?.focus();
  }, []);

  const focusPrevious = useCallback(() => {
    const elements = focusableElements.current;
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
    const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    elements[prevIndex]?.focus();
  }, []);

  const focusFirst = useCallback(() => {
    const elements = focusableElements.current;
    elements[0]?.focus();
  }, []);

  const focusLast = useCallback(() => {
    const elements = focusableElements.current;
    elements[elements.length - 1]?.focus();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey, ctrlKey, metaKey } = event;

    // Handle escape key
    if (enableEscapeKey && key === 'Escape') {
      onEscape?.();
      return;
    }

    // Handle arrow key navigation
    if (enableArrowKeys) {
      switch (key) {
        case 'ArrowDown':
          event.preventDefault();
          focusNext();
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusPrevious();
          break;
        case 'Home':
          if (ctrlKey || metaKey) {
            event.preventDefault();
            focusFirst();
          }
          break;
        case 'End':
          if (ctrlKey || metaKey) {
            event.preventDefault();
            focusLast();
          }
          break;
      }
    }

    // Handle tab trapping
    if (enableTabTrapping && key === 'Tab') {
      const elements = focusableElements.current;
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [
    enableArrowKeys,
    enableTabTrapping,
    enableEscapeKey,
    onEscape,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateFocusableElements();

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'aria-hidden'],
    });

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [containerRef, handleKeyDown, updateFocusableElements]);

  return {
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    updateFocusableElements,
  };
};

// Hook for managing focus restoration
export const useFocusRestore = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
};

// Hook for managing focus within modals/dialogs
export const useModalFocus = (isOpen: boolean) => {
  const modalRef = useRef<HTMLElement>(null);
  const { saveFocus, restoreFocus } = useFocusRestore();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      
      // Focus the modal container or first focusable element
      const focusModal = () => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector(
            'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      };

      // Use setTimeout to ensure modal is rendered
      setTimeout(focusModal, 0);
    } else {
      restoreFocus();
    }
  }, [isOpen, saveFocus, restoreFocus]);

  const { focusNext, focusPrevious } = useKeyboardNavigation(modalRef, {
    enableTabTrapping: isOpen,
    enableEscapeKey: isOpen,
  });

  return { modalRef, focusNext, focusPrevious };
};

// Hook for announcing content changes to screen readers
export const useAnnouncement = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear the message after it's been announced
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }, []);

  const announceError = useCallback((message: string) => {
    announce(`Error: ${message}`, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  const announceNavigation = useCallback((pageName: string) => {
    announce(`Navigated to ${pageName}`, 'polite');
  }, [announce]);

  return {
    announce,
    announceError,
    announceSuccess,
    announceNavigation,
  };
}; 