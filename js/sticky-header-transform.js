(function () {

	var $debugBar = $('.debug-bar');
	var lastScrollTop = 0;
	
	// Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be run after it stops being called for N milliseconds.
	// If `immediate` is passed truthy, trigger the function on the leading edge, instead of the trailing.
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	var stickyHeader = function (e) {
		var scrollY = e.currentTarget.scrollY;
		
		if(scrollY > 40) {
			$debugBar.addClass('unsticky');
		}
		else {
			$debugBar.removeClass('unsticky');
		}
	};

	var stickyHeaderOnScrollUpwards = function (e) {
		var scrollY = e.currentTarget.scrollY;

		$debugBar.text(scrollY);

		if (scrollY < 40) {
			$debugBar.removeClass('unsticky');
		}
		else if (scrollY > lastScrollTop) {
			// USER SCROLLING DOWN
			$debugBar.addClass('unsticky');
		}
		else {
			// USER SCROLLING UP
			$debugBar.removeClass('unsticky');
		}

		lastScrollTop = scrollY;
	};

	var stickyHeaderOnScrollUpwardsDebounce = debounce(stickyHeaderOnScrollUpwards, 250);


	$(window).on('scroll', stickyHeaderOnScrollUpwardsDebounce);

})()