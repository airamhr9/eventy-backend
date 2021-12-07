import { loadTest } from 'loadtest';

const options = {
	url: 'http://localhost:8000',
	maxRequests: 1000,
    concurrency: 20
};
loadTest(options, function(error, result)
{
	if (error)
	{
		return console.error('Got an error: %s', error);
	}
	console.log('Tests run successfully in ', result);
});