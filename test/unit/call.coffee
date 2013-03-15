assert = require '../assert'

suite 'call'

test 'single argument', ->
	assert.compileTo '''
		a {
			content: attr(href);
		}
	''', '''
		a {
			content: attr(href);
		}
	'''

test 'multiple arguments', ->
	assert.compileTo '''
		a {
			content: counters(item, '.');
		}
	''', '''
		a {
			content: counters(item, '.');
		}
	'''