(function () {
	
	/*
		TWO VARIANTS: toggle sticky header on coord or on scroll direction upwards
		- With debounce (sticky behavior happens N ms after scroll event is done), for perfomance reasons
		- The y coordinate seems to update fine on iOS, even when accelerated swipe
		- When rubber scrolling on iOS, above top is a negative y coord
		- Dont mess with padding on body during animation, it will be jerky on iOS
		- Observe the css classes, their position states
		- Use CSS animations (not transition, not jQuery animate)
	*/
	

	var $debugBar = $('.debug-bar');
	var lastScrollTop = 0;

	// Returns a function, that, as long as it continues to be invoked, will not be triggered.
	// The function will be run after it stops being called for N milliseconds.
	// If `immediate` is passed, trigger the function on the leading edge, instead of the trailing.
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


	var stickyHeader = debounce(function (e) {

		var scrollY = e.currentTarget.scrollY;

		$debugBar.text(scrollY);

		switch (true) {

			case scrollY < 40:
				$debugBar.removeClass('sticky unsticky');
				break;
			case scrollY < 300:
				if ($debugBar.hasClass('sticky')) {
					$debugBar.addClass('unsticky');
				}
				break;
			case scrollY >= 300:
				$debugBar.removeClass('unsticky');
				$debugBar.addClass('sticky');
				break;
		}

	}, 250);


	var stickyHeaderOnScrollUpwards = debounce(function (e) {

		var scrollY = e.currentTarget.scrollY;

		$debugBar.text(scrollY);
		
		if(scrollY < 40) {
			$debugBar.removeClass('sticky unsticky');
		}
		else if (scrollY > lastScrollTop) {
			// USER SCROLLING DOWN
			if ($debugBar.hasClass('sticky')) {
				$debugBar.addClass('unsticky');
			}
		}
		else {
			// USER SCROLLING UP
			$debugBar.removeClass('unsticky');
			$debugBar.addClass('sticky');
		}

		lastScrollTop = scrollY;

	}, 250);

	$(window).on('scroll', stickyHeaderOnScrollUpwards);
	
})();