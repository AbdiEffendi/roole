assert = require '../assert'

suite 'comment'

test 'empty input', ->
	assert.compileTo '', ''

test 'pure spaces input', ->
	assert.compileTo '  ', ''

test 'single-line commnet', ->
	assert.compileTo '''
		// before selector
		body // selctor
		{
		// after selector
			// before property
			width: auto; // property
			// after property
		// outdent
			height: auto; // before eof
		}
	''', '''
		body {
			width: auto;
			height: auto;
		}
	'''

test 'multi-line commnet', ->
	assert.compileTo '''
		/* license */

		body {
		/* after selector */
			margin: 0;
		}
	''', '''
		/* license */

		body {
			margin: 0;
		}
	'''
