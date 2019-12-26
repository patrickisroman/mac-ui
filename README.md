# mac-ui

**mac-ui** is a simple package for creating an interactive division (div) based on MacOSx ui.

Requires jQuery & jQuery ui:

```
<!-- Include jQuery & jQuery ui -->
<script type="text/javascript" src="./jquery.js"></script>
<script type="text/javascript" src="./jquery-ui.js"></script>

<!-- Include mac-ui.js -->
<link rel="stylesheet" type="text/css" href="./mac-ui.css">
<script type="text/javascript" src="./mac-ui.js"></script>
```

Then, to create a new window, in your javascript, call create_window()

```
// creates a 100x300 window at position (0, 0)

var win = MacWindow.create_window('My First Window', 0, 0, 100, 300);

// creates a 500x500 window at position (100, 100) and loads google.com

var win = MacWindow.create_window('Google', 100, 100, 500, 500, 'www.google.com');
```

[Example windows](https://imgur.com/KbZUcfQ.gif "Example windows"):
![](https://imgur.com/KbZUcfQ.gif)
