module.exports = function ()
{
	Creep.prototype.supplyTerminalResource = function ()
	{
		let terminal = Game.getObjectById(this.memory.job.targetID);
		let resource = Game.getObjectById(this.room.memory.environment.resourcesArray[0]);

		if (terminal)
		{
			let action = null;

			action = this.transfer(terminal, resource.mineralType);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if (_.sum(this.carry[resource.mineralType]) == 0)
			{
				this.memory.job = null;
				this.memory.currentTask = null;
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}