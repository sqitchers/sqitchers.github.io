// Simple JavaScript to polyfill TOC details/summary support when the browser
// doesn't support it. https://github.com/rstacruz/details-polyfill (MIT)
void (function (root, factory) {
	if (typeof define === 'function' && define.amd) define(factory)
	else if (typeof exports === 'object') module.exports = factory()
	else factory()
} (this, function () {
	if (supportsDetails()) {
		// Install listeners on open that close on any click.
		var elems = document.getElementsByClassName('toc')
		for (var i = 0; i < elems.length; i++) {
			deets = elems[i].firstElementChild
			deets.addEventListener("toggle", function(e) {
				if (deets.open) setupUnfocus(deets)
			})
		}
	} else {
		// Add class, event listener, and meta classes.
		document.documentElement.className += ' no-details'
		window.addEventListener('click', clickHandler)
		injectStyle('details-polyfill-style',
			'html.no-details details:not([open]) > :not(summary) { display: none; }\n' +
			'html.no-details details[open] > summary:before {}')
	}

	// Click handler to close TOC details.
	function setupUnfocus(deets) {
		var unfocus = function (e) {
			removeEventListener('click', unfocus);
			if (!deets.open || e.target.nodeName.toLowerCase() === 'summary') return
			deets.open = false
			deets.removeAttribute('open')
		}
		addEventListener('click', unfocus)
	}

	// Click handler for `<summary>` tags
	function clickHandler (e) {
		if (e.target.nodeName.toLowerCase() === 'summary') {
			var details = e.target.parentNode
			if (!details) return
			if (details.getAttribute('open')) {
				details.open = false
				details.removeAttribute('open')
			} else {
				details.open = true
				details.setAttribute('open', 'open')
				setupUnfocus(details)
			}
	  	}
	}
  
	// https://mathiasbynens.be/notes/html5-details-jquery (MIT)
	function supportsDetails () {
		var el = document.createElement('details');
		var fake;
		if (!('open' in el)) return false
		var root = document.body || (function() {
			var de = document.documentElement;
			fake = true;
			return de.insertBefore(document.createElement('body'), de.firstElementChild || de.firstChild);
		}());
		el.innerHTML = '<summary>a</summary>b';
		el.style.display = 'block';
		root.appendChild(el);
		var diff = el.offsetHeight;
		el.open = true;
		diff = diff != el.offsetHeight;
		root.removeChild(el);
		if (fake) root.parentNode.removeChild(root)
		return diff;    
	}
  
	// Injects styles (idempotent)
	function injectStyle (id, style) {
		if (document.getElementById(id)) return
		var el = document.createElement('style')
		el.id = id
		el.innerHTML = style
		document.getElementsByTagName('head')[0].appendChild(el)
	}
}));