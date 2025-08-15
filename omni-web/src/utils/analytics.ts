/**
 * Analytics utilities for Umami
 * Privacy-first analytics without cookies
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Track a custom event in Umami
 * @param eventName - Name of the event to track
 * @param eventData - Optional data to attach to the event
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
};

/**
 * Track a goal conversion
 * @param goalName - Name of the goal (e.g., 'Newsletter Signup', 'Contact Form')
 */
export const trackGoal = (goalName: string) => {
  trackEvent(goalName);
};

/**
 * Track an outbound link click
 * @param url - The URL being clicked
 */
export const trackOutboundLink = (url: string) => {
  trackEvent('Outbound Link: Click', { url });
};

/**
 * Track a file download
 * @param fileName - Name of the file being downloaded
 */
export const trackDownload = (fileName: string) => {
  trackEvent('File Download', { file: fileName });
};

/**
 * Track a 404 error
 * @param path - The path that resulted in a 404
 */
export const track404 = (path: string) => {
  trackEvent('404', { path });
};

/**
 * Track form interactions
 */
export const trackForm = {
  start: (formName: string) => trackEvent(`${formName}: Start`),
  submit: (formName: string) => trackEvent(`${formName}: Submit`),
  error: (formName: string, error: string) => trackEvent(`${formName}: Error`, { error }),
};

/**
 * Track engagement metrics
 */
export const trackEngagement = {
  scroll: (percentage: number) => {
    if (percentage >= 90) {
      trackEvent('Scroll: 90%');
    } else if (percentage >= 50) {
      trackEvent('Scroll: 50%');
    } else if (percentage >= 25) {
      trackEvent('Scroll: 25%');
    }
  },
  timeOnPage: (seconds: number) => {
    if (seconds >= 300) {
      trackEvent('Time on Page: 5+ minutes');
    } else if (seconds >= 60) {
      trackEvent('Time on Page: 1+ minute');
    }
  },
};