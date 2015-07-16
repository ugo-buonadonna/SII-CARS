
var raccoon = require('raccoon');

var redisConfig = {
	
	url: "127.0.0.1",
	port: 6379	
};

raccoon.connect(redisConfig.port, redisConfig.url);
