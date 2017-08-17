module.exports = function ()
{
	Creep.prototype.runHaulerMoveEnergyFromContainer = function ()
	{
		let room = this.room;
		let containerID = this.memory.job.targetID;

		if (room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID])
		{
			let currentTask = this.memory.currentTask;

			if (this.memory.currentTask == null || this.memory.currentTask == "Getting Energy")
			{
				this.memory.currentTask = "Getting Energy";
				let container = Game.getObjectById(containerID);

				if(container.store[RESOURCE_ENERGY] <= 500)
				{
					this.memory.currentTask = null;
				}

				let action = this.withdraw(container, RESOURCE_ENERGY);

				if (action == ERR_NOT_IN_RANGE)
				{
					this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
				}

				if (this.carry[RESOURCE_ENERGY] == this.carryCapacity && this.memory.currentTask == "Getting Energy")
				{
					this.memory.currentTask = "Working";
					room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID].creepID = null;

					this.memory.job = null;
				}
			}
		}
	}
}