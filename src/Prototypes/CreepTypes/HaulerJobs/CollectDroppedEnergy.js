module.exports = function ()
{
	Creep.prototype.runHaulerCollectDroppedEnergy = function ()
	{
		let droppedEnergy = Game.getObjectById(this.memory.job.targetID);

		if (droppedEnergy)
		{
			action = this.pickup(droppedEnergy, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				this.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
			}

			if (!Game.getObjectById(this.memory.job.targetID)) // job complete
			{
				this.room.memory.jobs.haulerJobBoard.collectDroppedEnergy[droppedEnergy.id] = null;

				this.memory.job = null;
			}

			if (this.carry[RESOURCE_ENERGY] == this.carryCapacity)
			{
				this.memory.currentTask = "Working";
				this.room.memory.jobs.haulerJobBoard.collectDroppedEnergy[droppedEnergy.id] = null;

				this.memory.job = null;
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}