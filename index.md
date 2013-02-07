## Introduction
Roole is a language that compiles to CSS.

It drew many inspirations from other CSS preprocessing languages like [Sass](http://sass-lang.com/), [LESS](http://lesscss.org/) and [Stylus](http://learnboost.github.com/stylus/).

The most unique feature of Roole is that it has vendor prefixing built-in, so the language stays dead simple yet being able to prefix some extremely complex rules transparently.

Roole is implemented in JavaScript, so it can be run both on the server side (via [node.js](http://nodejs.org/)) or in a browser.

INFO: Roole will be able to run in old browsers like IE6 in a future version.

## Overview

Indentations represents curly braces `{}`:

```roole
body
	margin: 0
```

<hr>

Store repeating values in variables:

```roole
$pos = left
#sidebar
	float: $pos
	margin-$pos: 20px
```

<hr>

Conditonally generate rules:

```roole
$support-old-ie = false

li
	@if $support-old-ie
		display: inline
	float: left
	margin-left: 10px
```

<hr>

Quickly generate many rules:

```roole
@for $i in 1..3
	.span-$i
		width: $i * 60px
```

<hr>

Define your own way of generating rules:

```roole
$button = @mixin $color, $bg-color
	display: inline-block
	color: $color
	background-color: $bg-color

.submit
	$button(black, white)

.reset
	$button(red, white)
```

<hr>

Or simplely extend already defined rules:

```roole
.button
	display: inline-block
	color: black
	background-color: white

.submit
	@extend .button

.reset
	@extend .button
	color: red
```

<hr>

And forget about prefixing:

```roole
@keyframes become-round
	from
		border-radius: 0
	to
		border-radius: 50%
```

## Installation

### Node.js

Run command:

```
npm install roole -g
```

### Browser

Insert the downloaded file into HTML:

```html
<script src="/path/to/roole.js"></script>
```

## Usage

### Command line

Compile a single file:

```
roole /path/to/style.roo /path/to/style.css
```

For more usage on the `roole` command, please run `roole -h` to see.

### Browser

Link to an external file:

```html
<link rel="stylesheet/roole" href="styles.roo">
```

INFO: Will be implemented in a future version

Or embed code directly:

```html
<style type="stylesheet/roole">
	// put code here
</style>
```

INFO: Will be implemented in a future version

### JavaScript API

```javascript
roole.compile(input, options, callback)
```

*	`input` - source code

*	`options` - an optional hash object which supports the following options:

	*	`indent` (default: `"\t"`) - string used for indentations when generating CSS

	*	`percision` (default: `3`) - max number of digits to used for decimal numbers when generating CSS

	*	`prefix` (default: `["o", "ms", "moz", "webkit"]`) - vendor names to use when prefixing rules, use `[]` or `null` to disable prefixing

* `callback(error, css)` - a function will be called when done generating CSS:

	*	`error` - `null` if there was no error when generating CSS, otherwise an error object

	*	`css` - a string containing the generated CSS

## Language

### Rule Set

Semicolons `;` between declarations can be replaced with new lines:

```roole
body
	margin: 0; padding: 0

#main > li
	margin: 0 auto
	width: 980px
```

<hr>

If a rule set has multiple selectors, commas `,` between them can also be replaced with new lines:

```roole
#header
#footer
	margin: 0 auto

#main, #sidebar
	float: left
```

<hr>

If a property has multiple values, commas `,` between them can be replaced with new lines too, when they are indented:

```
body
	font-family: Arial, san-serif

#canvas
	background:
		url(castle.png)
		url(dragon.png)
```

INFO: Will be implemented in a future version.

<hr>

Rule sets can be nested, and their selectors will be joined together:

```roole
#header
	.logo
		float: left
```

```roole
ul
	overflow: hidden

	> li
		float: left
```

```roole
#main
#sidebar
	h1, h2
		color: #333
```

<hr>

Use the `&` selector to reference the outer rule set's selector:

```roole
a
	&:hover
		text-decoration: underline
```

```roole
img
	a &
		border: none
```

<hr>

The `&` selector can also be nested:

```roole
a
	&:hover
		text-decoration: underline
		.button &
			text-decoration: none
```

### @media

`@media` can be nested into rule sets:

```roole
#sidebar
	@media print
		display: none
```

```roole
#container
	@media print
		.sidebar
			display: none
```

<hr>

Or within one another, and their media queries will be joined together:

```roole
@media screen
	a
		color: blue

		@media (monochrome)
			color: black
```

### Comment

Single-line commnets `//` are removed from the CSS output, while multi-line commnets `/* */` are preserved:

```roole
/*
 * Box module
 *
 * Display a nice box
 */

.box
	float: left
	margin-left: 20px
	// Fix IE6
	display: inline
```

WARNING: Multi-line commnets are currently only allowed at the top level, e.g., it's a syntax error to insert a multi-line comment inside a rule set.

### Variable

Variables are case-insensitive. Their names start with `$` and are defined using assignments:

```roole
$margin = 20px 0
$MARGIN = 30px 0

p
	margin: $margin
```

<hr>

If variables are assigned using `?=`, the assigments will only success if the variables is currently undefined:

```roole
$margin = 20px 0
$margin ?= 30px 0

p
	margin: $margin
```

```roole
$margin ?= 0 20px

p
	margin: $margin
```

<hr>

Variables are allowed where values like numbers, strings, identifiers, etc are allowed:

```roole
$tag = body

$tag
	margin: 0
```

```roole
$attribute = type
$value = button

input[$attribute=$value]
	border: none
```

```roole
$property = margin
$value = 20px

p
	$property: $value
```

```roole
$feature = max-width
$value = 1024px

@media ($feature: $value)
	#main
		width: 960px
```

<hr>

When being assigned with an string value, variables can also be used as selectors:

```roole
$selector = '#sidebar a'

$selector
	color: green
```

```roole
$tab = '.tabs .tab'

#sidebar $tab
	padding: 5px
```

<hr>

This also works for media queries:

```roole
$query = '(max-width: 1024px)'

@media $query
	body
		width: 960px
```

```roole
$lt-desktop = '(max-width: 1199px)'
$gt-phone = '(min-width: 768px)'

@media $gt-phone and $lt-desktop
	body
		width: 800px
```

<hr>

Variables can also be used in interpolations (see the next section).

### Interpolation

Variables can be interpolated into doubled-quoted strings:

```roole
$number = 12

.heading::before
	content: "Chapter $number: "
```

<hr>

But not single-quoted strings:

```roole
.heading::before
	content: 'Chapter $num: '
```

<hr>

Variables can also be interpolated into identifiers:

```roole
$name = star

.icon-$name
	width: 20px
	height: 20px
```

```roole
$position = left

.sidebar
	padding-$position: 20px
	border-$position: 1px solid
```

<hr>

Use `\$` to escape variables inside strings:

```roole
.heading::before
	content: "Chapter \$number: "
```

<hr>

Wrap the variable in curly braces `{}` to seperate characters come after it, which will otherwise be part of its name:

```roole
$chapter = 4

.figcaption::before
	content: "Figure {$chapter}-12: "
```

```roole
$position = left

.sidebar
	border-{$position}-width: 1px
```

<hr>

Use `\{` to escape it:

```roole
$chapter = 4

.figcaption::before
	content: "Figure \{$chapter}-12: "
```

<hr>

If the curly brace does not form an interpolation there is no need to escape it:

```roole
.figcaption::before
	content: "Figure {\$chapter}-12: "
```

```roole
.title::before
	content: "latex \\hat{x}"
```

### Operation

Arithmetic operators `+`, `-`, `*`, `/` and parentheses `()` are supported:

```roole
$total = 250px
$padding = 20px
$border = 1px

#sidebar
	width: $total - ($padding + $border) * 2
	padding: 0 $padding
	border-width: $border
```

<hr>

At lease one space should exist around `/`, otherwise it is generated literally:

```roole
body
	font: 14px/1.25 sans-serif
```

```roole
@media (device-aspect-ratio: 16/9)
	body
		background: url(bg-16-9.png)
```

<hr>

At lease one space should exist on the right side of `+`(`-`), otherwise unary `+`(`-`) is applied:

```roole
#box
	margin: 40px -20px
```

```roole
#box
	margin: 40px +20px
```

<hr>

Arithmetic operations can be combined with assignments:

```
$text = 'Hello, '

.guest::before
	$text += 'Guest'
	content: $text
```

INFO: Will be implemented in a future version.

<hr>

Comparison operation are also supported, which comes in handy when specifying `@if` conditions (see the next section).

### @if

`@if` allows rules inside it to be conditionally generated:

```roole
$support-old-ie = false

li
	@if $support-old-ie
		display: inline
	float: left
	margin-left: 10px
```

Sample truthy values: `true`, `12`, `0.5em`, `'0'`. Sample falsey values: `false`, `0`, `0px`, `""`.

<hr>

`@if` can be followed by any number of `@else if` and optionally one `@else`:

```roole
$color = black

body
	@if $color is white
		background: #fff
	@else if $color is black
		background: #000
	@else if $color is gray
		background: #999
	@else
		background: url(bg.png)
```

This example also demonstrates the use of `is` operator.

<hr>

Like `is`, which tests equalitys, `isnt` tests inequality:

```roole
$size = large

.button
	@if $size isnt small
		border: 1px solid
```

<hr>

`and` expects values on its both sides to be truthy:

```roole
$size = large
$type = split

.button
	@if $size is large and $type is split
		padding: 10px
```

<hr>

`or` expects values on its either sides to be truthy:

```roole
$size = large

.button
	@if $size is medium or $size is large
		border: 1px solid
```

<hr>

`<`, `<=`, `>` and `>=` compare numeric values:

```roole
$width = 100px

.button
	@if $width < 100px
		border: none
	@else if $width >= 100px and $width < 200px
		border: 1px solid
```
Sample numberic values: `1.2`, `2em`, `50%`.

### @for

`@for` allows rules in it to be generated multiple times:

```roole
@for $i in 1..3
	.span-$i
		width: $i * 60px
```

<hr>

Values like `1..3` are ranges, and are inclusive. Use `...` to denote an exclusive range:

```roole
@for $i in 1...3
	.span-$i
		width: $i * 60px
```

<hr>

Ranges can be in reversed order:

```roole
@for $i in 3..1
	.span-$i
		width: $i * 60px
```

```roole
@for $i in 3...1
	.span-$i
		width: $i * 60px
```

<hr>

Ranges are essentially lists, so regular lists works as well:

```roole
@for $icon in arrow star heart
	.icon-$icon
		background: url("$icon.png")
```
Lists are values separated by spaces, commas `,`, or slashs `/`.

<hr>

To specify a step other than 1, use `by`:

```roole
@for $i by 2 in 1..5
	.span-$i
		width: $i * 60px
```

<hr>

If step is a negative number, the order of iteration is reversed:

```roole
@for $i by -1 in 1..2
	.span-$i
		width: $i * 60px
```

```roole
@for $i by -1 in 2..1
	.span-$i
		width: $i * 60px
```

<hr>

To access indices, specify one more variable:

```roole
@for $icon, $i in arrow star heart
	.icon-$icon
		background-position: 0 $i * 20px
```

### Mixin

Mixins allow you to store blocks of rules in variables for later use:

```roole
$clearfix = @mixin
	*zoom: 1
	&:before
	&:after
		content: " "
		display: table
	&:after
		clear: both

ul
	$clearfix()
```

(Hat tip to [Nicolas Gallagher](http://nicolasgallagher.com/), for this example uses his [micro clearfix](http://nicolasgallagher.com/micro-clearfix-hack/))

<hr>

Mixins can have parameters, which can also have a default value:

```roole
$button = @mixin $color, $bg-color, $size = large
	color: $color
	background-color: $bg-color
	@if $size is small
		font-size: 12px
	@else if $size is large
		font-size: 14px

#submit
	$button(#000, #fff)
```

<hr>

Arguments passed to a mixin can also be accessed dynamically using `$arguments`:

```
$social-icons = @mixin
	@for $icon in $arguments
		.icon-$icon
			background: url("$icon.png")

#social
	$social-icons(twitter, google, facebook)
```

INFO: Will be implemented in a future version.

<hr>

Use rest parameters to capture multiple arguments:

```
$social-icons = ($size, ...$icons)
	@for $icon in $icons
		.icon-$icon
			background: url($size/$icon.png)

#social
	$social-icons(large, twitter, facebook, google)
```

INFO: Will be implemented in a future version.

<hr>

Unpassed parameters have a `null` value:

```roole
$button = @mixin $color, $bg-color, $size
	color: $color
	background-color: $bg-color
	@if $size is null
		font-size: 12px
	@else
		font-size: 14px

#submit
	$button(#000, #fff)
```

### @extend

`@extend` extends other rulesets of the matching selectors:

```roole
.button
	display: inline-block
	border: 1px solid

.large-button
	@extend .button
	display: block
```

<hr>

`@extend` can be nested:

```roole
.button
	display: inline-block
	border: 1px solid

.large-button
	@extend .button
	display: block

#submit
	@extend .large-button
	margin: 0 20px
```

<hr>

Or be specified multiple times:

```roole
.button
	display: inline-block
	border: 1px solid

.large-button
	@extend .button
	display: block

.dangerous-button
	@extend .button
	color: #fff
	background: red

#reset
	@extend .large-button
	@extend .dangerous-button
	margin: 0 20px
```

<hr>

Or simply specify a list of selectors:

```roole
.button
	display: inline-block
	border: 1px solid

.large-button
	@extend .button
	display: block

.dangerous-button
	@extend .button
	color: #fff
	background: red

#reset
	@extend .large-button, .dangerous-button
	margin: 0 20px
```

<hr>

Complex selectors also work as intended:

```roole
.button .icon
	font-family: icon-font

.button .edit-icon
	@extend .button .icon
	content: 'i'
```

<hr>

Note that selector are matched exactly, so `.icon` will not match `.button .icon`:

```roole
.icon
	font-family: icon-font

.button .icon
	font-family: button-font

.button .edit-icon
	@extend .icon
	content: 'i'
```

<hr>

And `@extend` will not extend rule sets that come after it

```roole
.button
	display: inline-block

#submit
	@extend .button

.button
	display: block
```

<hr>

When using `@extend` under a `@media`, it will only match rule set under `@media` with the same media query:

```roole
.button
	display: block

@media (min-width: 512px)
	.button
		display: inline-block

@media (min-width: 1024px)
	.button
		display: inline-block
		border: 1px solid

@media (min-width: 512px)
	#submit
		@extend .button
```

### @void

Rule sets inside `@void` are removed from the CSS output, unless they are extended by a rule set not inside a `@void`, but original selectors are always removed:

```roole
@void
	.button
		display: inline-block

	.tabs
		.tab
			@extend .button
			float: left

#submit
	@extend .button
```

### @import

`@import` imports rules from other files:

```roole
// tabs.roo

.tabs
	.tab
		float: left
```

```roole
@import 'tabs'
```

`.roo` will be added if the file's name doesn't end with an extension.

<hr>

Files are not imported if their paths are sepecified using `url()`, starting with a protocol like `http://`, ending with `.css`, containing a variable, or followed by a media query:

```roole
@import url(tabs)

@import url("tabs")

@import "http://example.com/tabs"

@import 'tabs.css'

$module = 'tabs'
@import $module

@import 'tabs' screen
```

<hr>

Files are only imported once:

```roole
// reset.roo

body
	margin: 0
```

```roole
// tabs.roo

@import 'reset'

.tabs
	.tab
		float: left
```

```roole
// button.roo

@import 'reset'

.button
	display: inline-block
```

```roole
@import 'reset'
@import 'tabs'
@import 'button'
```

<hr>

`@import` can be nested inside other rules:

```roole
// sidebar.roo
.sidebar
	float: left
	margin-left: 20px
```

```roole
// sidebar-old-ie.roo
.sidebar
	display: inline
```

```roole
@import 'sidebar'

$support-old-ie = false

@if $support-old-ie
	@import 'sidebar-old-ie'
```

```roole
// framework.roo

.button
	display: inline-block

.tabs .tab
	float: left
```

```roole
@void
	@import 'framework'

#submit
	@extend .button
```

<hr>

Variable scope in the imported file is explained in the next section.

### Scope

<hr>

Variables have to be defined before they can be used. Once defined, they are only available within the boundary of their respective rule block, which defines their scope:

```roole
$menu = @mixin
	$width = 200px
	width: $width

.menu
	$menu()
	// $width is undefined here
```

<hr>

Changing variables in an inner scope has no effect in outer scopes:

```roole
$width = 200px

.mini-menu
	$width = 100px
	width: $width

.menu
	width: $width
```

<hr>

Variables defined in an imported file is exposed to the importing file:

```roole
// vars.roo
$color = #000
$bg-color = #fff
```

```roole
@import 'vars'

#main
	color: $color
	background: $bg-color
```

<hr>

The imported file also has access to variables defined the importing file:

```roole
// base.roo
#main
	color: $color
	background: $bg-color
```

```roole
$color = #000
$bg-color = #fff

@import 'base'
```

<hr>

### @block

`@block` simply introduces a new scope, which can be used to prevent the imported file from polluting variables, and easily use default values in them:

```roole
// foo-framework.roo
$width = 200px

.foo-module
	width: $width
```

```roole
// bar-framework.roo
$width ?= 100px

.bar-module
	width: $width
```

```roole
@block
	@import 'foo-framework'

@block
	@import 'bar-framework'
```

### Prefix

Roole automatically prefixes rules:

```roole
#box
	box-shadow: 0 1px 3px #000
```

<hr>

Start position in `linear-gradient()` is automatically translated:

```roole
#box
	background: linear-gradient(to bottom right, #fff, #000)
```

WARNING: Currently only keywords are translated, angle values will be translated in a future version

INFO: `-webkit-gradient()` will be added in a future version

<hr>

When properties are nested inside other rules which needs to be prefixed, Roole handles it correctly:

```roole
@keyframes become-round
	from
		border-radius: 0
	to
		border-radius: 50%
```

## Feedback

To report issues, open [a new issue on Github](https://github.com/curvedmark/roole/issues), use the search function to make sure the issue is not already reported before opening a new one.