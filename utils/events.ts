/**
 * Utility functions for dispatching custom events throughout the application
 */

/**
 * Dispatch a custom event to trigger resource stats refresh
 */
export function triggerResourceStatsUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resourceStatsUpdate'))
  }
}

/**
 * Dispatch a custom event when a new resource is created/inserted
 */
export function triggerNewResourceAdded() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('newResourceAdded'))
  }
}

/**
 * Dispatch a custom event when a resource is deleted
 */
export function triggerResourceDeleted() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resourceDeleted'))
  }
}

/**
 * Dispatch a custom event when resources are modified (for other components)
 */
export function triggerResourcesUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('resourcesUpdated'))
  }
}

/**
 * Add an event listener for new resource additions only
 */
export function onNewResourceAdded(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('newResourceAdded', callback)
    return () => window.removeEventListener('newResourceAdded', callback)
  }
  return () => {}
}

/**
 * Add an event listener for resource deletions
 */
export function onResourceDeleted(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('resourceDeleted', callback)
    return () => window.removeEventListener('resourceDeleted', callback)
  }
  return () => {}
}

/**
 * Add an event listener for resource updates (for resource lists)
 */
export function onResourcesUpdated(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener('resourcesUpdated', callback)
    return () => window.removeEventListener('resourcesUpdated', callback)
  }
  return () => {}
}
