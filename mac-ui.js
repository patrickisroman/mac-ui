// stack of windows
var window_stack = new Array();

function emplace_window(win) {
	if (window_stack.length == 0) return;

	var idx = window_stack.indexOf(win);
	window_stack.push(window_stack.splice(idx, 1)[0]);

	for (i = idx; i < window_stack.length; i++) {
		window_stack[i].style.zIndex = i;
	}
}

function create_window(title, x, y, width, height, url) {
	// create window wrapper
	var window_wrapper_div = document.createElement('div');
	window_wrapper_div.setAttribute('class', 'mac-window-wrapper');
	window_wrapper_div.setAttribute('maximized', false);

	// create window bar
	var bar_div = document.createElement('div');
	bar_div.setAttribute('class', 'mac-bar');
	window_wrapper_div.appendChild(bar_div);

	// create window div
	var window_div = document.createElement('div');
	window_div.setAttribute('class', 'mac-window');
	window_wrapper_div.appendChild(window_div);

	if (url) {
		$(window_div).html('<object data="' + url + '" style="width:100%;height:100%"/>');
	}

	// create buttons
	['close-mac-button', 'minimize-mac-button', 'maximize-mac-button'].forEach(button_class => {
		var button_div = document.createElement('div');
		button_div.setAttribute('class', 'mac-button ' + button_class);
		bar_div.appendChild(button_div);
	});

	// create title
	var title_div = document.createElement('div');
	title_div.setAttribute('class', 'mac-title');
	title_div.innerHTML = title;
	bar_div.appendChild(title_div);
	document.body.appendChild(window_wrapper_div);

	window_wrapper_div.style.left = x;
	window_wrapper_div.style.top = y;
	window_wrapper_div.style.width = width;
	window_wrapper_div.style.height = height;
	window_wrapper_div.style.zIndex = window_stack.length;

	window_stack.push(window_wrapper_div);
	return window_wrapper_div;
}

// close button
$(".close-mac-button").on('click', function() {
	var parent_div = $(this).parent().parent();

	if (parent_div) {
		parent_div.remove();
	}
});

// minimize button
$(".minimize-mac-button").on('click', function() {
	var parent_div = $(this).parent().parent();

	if (parent_div) {
		parent_div.fadeOut();
	}
});

// maximize button
$(".maximize-mac-button").on("click", function() {
	var parent_div = $(this).parent().parent();
	var maxed = JSON.parse(parent_div.attr('maximized').toLowerCase());

	parent_div.attr('maximized', !maxed);

	if (!maxed) {
		parent_div.attr('memory', JSON.stringify({
			"x" : parent_div.position().left,
			"y" : parent_div.position().top,
			"w" : parent_div.outerWidth(),
			"h" : parent_div.outerHeight()
		}));
		parent_div.css({
			"top": 0,
			"left": 0,
			"width" : window.outerWidth,
			"height" : window.outerHeight,
			"border-radius" : 0
		});
	} else {
		var original_json_state = JSON.parse(parent_div.attr('memory'));
		parent_div.css({
			"top" : original_json_state.y,
			"left" : original_json_state.x,
			"width" : original_json_state.w,
			"height" : original_json_state.h,
			"border-radius" : "7px"
		});
	}
});

// Draggable functions 
$(".mac-window-wrapper").draggable({
	handle : ".mac-bar"
});

$(".mac-window-wrapper").on('mousedown', function(e) {
	emplace_window($(this)[0]);
});