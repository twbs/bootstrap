#!/usr/bin/env ./nodeunit/bin/nodeunit

var crc = require('../lib/crc');

var fixture = {
	'crc8': [
		['hello world', 64]
	],
	
	'crc16': [
		['hello world', 15332]
	],
	
	'crc32': [
		['hello world', 222957957]
	],
	
	'crcArc': [
		['hello world', 14785]
	],
	
	'fcs16': [
		['hello world', 44550]
	],
	
	'hex8': [
		[64, '40']
	],
	
	'hex16': [
		[15332, '3BE4']
	],
	
	'hex32': [
		[222957957, '0D4A1185']
	]
};

var suite = module.exports['crc'] = {};

for(var func in fixture)
{
	var list = fixture[func];
	
	for(var i = 0; i < list.length; i++)
	{
		var input	= list[i][0],
			output	= list[i][1],
			name	= [ func, input, output ].join(' - ')
			;
		
		suite[name] = (function(func, input, output)
		{
			
			return function(assert)
			{
				assert.deepEqual(crc[func](input), output);
				assert.done();
			};
			
		})(func, input, output);
	}
};

