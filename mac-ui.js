class MacWindow {
	static remove_window(win) {
		var idx = this.window_stack.indexOf(win);
		if (idx < 0) return;
		this.window_stack.splice(idx, 1);
	}

	static clear_windows() {
		this.window_stack.forEach(mac_window => {
			this.remove_window(mac_window);
			var parent = $(mac_window).parent().parent();
			if (parent) parent.remove();
		});
	}

	static emplace_window(win) {
		if (this.window_stack.length == 0) return;

		var idx = this.window_stack.indexOf(win);
		if (idx < 0) return;
		this.window_stack.push(this.window_stack.splice(idx, 1)[0]);

		for (var i = idx; i < this.window_stack.length; i++) {
			this.window_stack[i].style.zIndex = i;
		}
	}

	static create_window(title="", x=0, y=0, width=100, height=100, url="", parent_div=document.body) {
		// create window wrapper
		var mac_win = document.createElement('div');
		mac_win.setAttribute('class', 'mac-window-wrapper');
		mac_win.setAttribute('maximized', false);

		// create window bar
		var bar = document.createElement('div');
		bar.setAttribute('class', 'mac-bar');
		mac_win.appendChild(bar);

		// create window area
		var window_area = document.createElement('div');
		window_area.setAttribute('class', 'mac-window');
		mac_win.appendChild(window_area);

		// create bar buttons
		['close-mac-button', 'minimize-mac-button', 'maximize-mac-button'].forEach(button_class => {
			var button = document.createElement('div');
			button.setAttribute('class', 'mac-button ' + button_class);
			bar.appendChild(button);
		});

		// create title
		var window_title = document.createElement('div');
		window_title.setAttribute('class', 'mac-title');
		window_title.innerHTML = title;
		bar.appendChild(window_title);

		if (url) {
			$(window_area).html('<object data="' + url + '" style="width:100%;height:100%"/>');
		}

		mac_win.style.left = x;
		mac_win.style.top = y;
		mac_win.style.width = width;
		mac_win.style.height = height;
		mac_win.style.zIndex = this.window_stack.length;

		parent_div.appendChild(mac_win);
		this.window_stack.push(mac_win);
		return mac_win;
	}
}

MacWindow.window_stack = new Array();

$(".close-mac-button").on('click', function() {
	var parent_div = $(this).parent().parent();
	if (parent_div) {
		MacWindow.remove_window($(parent_div)[0]);
		parent_div.remove();
	}
});

$(".minimize-mac-button").on('click', function() {
	var parent_div = $(this).parent().parent();
	if (parent_div) parent_div.fadeOut();
});

$(".maximize-mac-button").on("click", function() {
	var parent_div = $(this).parent().parent();
	if (!parent_div) return;

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

$(".mac-window-wrapper").draggable({
	handle : ".mac-bar"
});

$(".mac-window-wrapper").on('mousedown', function() {
	MacWindow.emplace_window($(this)[0]);
});