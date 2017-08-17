module.exports = function ()
{
	Creep.prototype.supplyTerminalResource = function ()
	{
		let terminal = Game.getObjectById(this.memory.job.targetID);

		if (terminal)
		{
			let action = null;

			if(this.room.name == "W17S12" || this.room.name == "W17S13")
			{
				action = this.transfer(terminal, RESOURCE_HYDROGEN);
			}

			if(this.room.name == "W16S11")
			{
				action = this.transfer(terminal, RESOURCE_OXYGEN);
			}

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if ( _.sum(terminal.store) == terminal.storeCapacity) // job complete
			{
				//this.memory.job = null;
			}

			if (_.sum(this.carry) == 0)
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