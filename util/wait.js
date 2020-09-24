module.exports.run = async (time) => new Promise(resolve => {
	// console.log('Waiting for: ' + time / 1000);
	setTimeout(() => resolve(time), time);
});
module.exports.help = {
	name: 'wait',
	description: 'resolves after a specific time',
};