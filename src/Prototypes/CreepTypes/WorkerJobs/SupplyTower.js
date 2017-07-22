module.exports = function ()
{
	Creep.prototype.supplyTower = function ()
	{
		let tower = Game.getObjectById(this.memory.job.targetID);

		if (tower)
		{
			let action = this.transfer(tower, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if (tower.energy == tower.energyCapacity) // job complete
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyTower[tower.id].creep = null;
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyTower[tower.id].active = false;

				this.memory.job = null;
				this.memory.currentTask = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplyTower[tower.id].creep = null;

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