module.exports = function ()
{
	Creep.prototype.supplyStorage = function ()
	{
		let storage = Game.getObjectById(this.memory.job.targetID);

		if (storage)
		{
			let action = this.transfer(storage, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if ( _.sum(storage.store) == storage.storeCapacity) // job complete
			{
				this.memory.job = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
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