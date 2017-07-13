module.exports = function ()
{
	Creep.prototype.upgradeTheController = function ()
	{
		let controller = this.room.controller;

		let action = this.upgradeController(controller);

		if (action == ERR_NOT_IN_RANGE)
		{
			this.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
		}

		if (this.carry[RESOURCE_ENERGY] == 0) // job complete
		{
			this.memory.job = null;
			this.memory.currentTask = null;
		}
	}
}