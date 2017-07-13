module.exports = function ()
{
	Creep.prototype.supplySpawn = function ()
	{
		let index = this.memory.job.index;
		let spawn = Game.getObjectById(index);

		if (spawn)
		{
			let action = this.transfer(spawn, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if (spawn.energy == spawn.energyCapacity) // job complete
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[index].creep = null;
				this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[index].active = false;

				this.memory.job = null;
				this.memory.currentTask = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[index].creep = null;

				this.memory.job = null;
				this.memory.currentTask = null;
			}
		}
		else
		{
			this.memory.job = null;
			this.memory.currentTask = null;
		}
	}
}