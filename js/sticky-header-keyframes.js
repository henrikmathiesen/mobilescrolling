(function () {
	
	/*
		TWO VARIANTS: toggle sticky header on coord or on scroll direction upwards
		- With debounce (sticky behavior happens N ms after scroll event is done), for perfomance reasons (OBS Foundation has this function built in)
		- The y coordinate seems to update fine on iOS, even when accelerated swipe
		- When rubber scrolling on iOS, above top is a negative y coord
		- Dont mess with padding on body during animation, it will be jerky on iOS
		- Observe the css classes, their position states
			* debug-bar begins with position:absolute (thus body has padding top equal to debug-bars height), it seems to be more stable on iOS
		- Use CSS animations (not transition, not jQuery animate)
	*/
	

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
	
	//
	// Sticky header functions
	
	var stickyHeader = function(e){
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
	};
	
	var stickyHeaderOnScrollUpwards = function(e){
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
	};
	
	//
	// Sticky header functions with debounce
	var stickyHeaderDebounce = debounce(stickyHeader, 250);
	var stickyHeaderOnScrollUpwardsDebounce = debounce(stickyHeaderOnScrollUpwards, 250);

	//
	// On scroll call sticky header functions, with or without debounce
	$(window).on('scroll', stickyHeaderOnScrollUpwardsDebounce);
	
})();