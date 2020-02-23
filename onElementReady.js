// ORIGINAL CODE BY sidneys: https://gist.githubusercontent.com/raw/ee7a6b80315148ad1fb6847e72a22313/
// change single pass to first change

/**
 * ESLint
 *
 * @exports
 */
/* exported onElementReady */
/* exported waitForKeyElements */

/**
 * @private
 *
 * Query for new DOM nodes matching a specified selector.
 *
 * @param {string} selector - CSS Selector
 * @param {Function} callback - Callback
 */
const queryForElements = (selector, callback = () => {}) => {
	// console.debug('queryForElements', 'selector:', selector)

	// Remember already-found elements via this attribute
	const attributeName = 'was-queried'

	// Search for elements by selector
	const elementList = document.querySelectorAll(selector) || []
	elementList.forEach((element) => {
		if (element.hasAttribute(attributeName)) { return }
		element.setAttribute(attributeName, 'true')
		callback(element)
	})
}

let found = false

/**
 * @public
 *
 * Wait for Elements with a given CSS selector to enter the DOM.
 * Returns a Promise resolving with new Elements, and triggers a callback for every Element.
 *
 * @param {string} selector - CSS Selector
 * @param {boolean} findOnce - Stop querying after finding first changed element
 * @param {Function} callback - Callback with Element
 * @returns {Promise<Element>} - Resolves with Element
 */
const onElementReady = (selector, findOnce = false, callback = () => { }) => (
// console.debug('onElementReady', 'findOnce:', findOnce)
	new Promise((resolve) => {
		// Initial Query
		queryForElements(selector, (element) => {
			resolve(element)
			callback(element)
		})

		// Continuous Query
		const observer = new MutationObserver(() => {
			// DOM Changes detected
			queryForElements(selector, (element) => {
				if (!findOnce) {
					resolve(element)
					callback(element)
				} else if (!found) {
					found = true
					resolve(element)
					callback(element)
					observer.disconnect()
				}
			})
		})

		// Observe DOM Changes
		observer.observe(document.documentElement, {
			attributes: false,
			childList: true,
			subtree: true,
		})
	})
)

/**
 * @public
 * @deprecated
 *
 * waitForKeyElements Polyfill
 *
 * @param {string} selector - CSS selector of elements to search / monitor ('.comment')
 * @param {Function} callback - Callback executed on element detection (called with element as argument)
 * @param {boolean} findOnce - Stop lookup after the last currently available element has been found
 * @returns {Promise<Element>} - Element
 */
const waitForKeyElements = (selector, callback, findOnce = false) => onElementReady(selector, findOnce, callback)
