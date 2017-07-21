module.exports = function ()
{
	Creep.prototype.supplyExtension = function ()
	{
		let extension = Game.getObjectById(this.memory.job.targetID);

		if (extension)
		{
			let action = this.transfer(extension, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if (extension.energy == extension.energyCapacity) // job complete
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].creep = null;
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].active = false;

				this.memory.job = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extension.id].creep = null;

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