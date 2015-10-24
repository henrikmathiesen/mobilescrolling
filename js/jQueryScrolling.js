(function () {

	var $body = $('body');
	var $debugBar = $('.debug-bar');


	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
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







	$(window).on('scroll', stickyHeader);

})();


/*

	- The y coordinate seems to update fine on iOS, even when accelerated swipe
	- When rubber scrolling on iOS, above top is a negative y coord
	- We always want to add padding top to body, equal to size of sticky header, else user loses track of content
		* But doing so makes jerky behavoir in iOS

*/