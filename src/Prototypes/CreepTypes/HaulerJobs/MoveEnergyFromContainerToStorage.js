module.exports = function ()
{
	Creep.prototype.runHaulerContainerToStorage = function ()
	{
		let room = this.room;
		let containerID = this.memory.job.targetID;

		if (room.memory.jobs.haulerJobBoard.moveEnergyFromContainerToStorage[containerID])
		{
			let currentTask = this.memory.currentTask;

			if (this.memory.currentTask == null || this.memory.currentTask == "Getting Energy")
			{
				this.memory.currentTask = "Getting Energy";
				let container = Game.getObjectById(containerID);

				let action = this.withdraw(container, RESOURCE_ENERGY);

				if (action == ERR_NOT_IN_RANGE)
				{
					this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
				}

				if (this.carry.energy == this.carryCapacity && this.memory.currentTask == "Getting Energy")
				{
					this.memory.currentTask = "Working";
				}
			}
			else
			{
				if (this.memory.currentTask == "Working")
				{
					if (this.carry.energy > 0)
					{
						let storage = room.memory.structures.storageArray[0];
						let action = this.transfer(storage, RESOURCE_ENERGY);

						if (action == ERR_NOT_IN_RANGE)
						{
							this.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
						}
					}
					else
					{
						this.memory.job = null;
						this.memory.currentTask = "Getting Energy";
					}
				}
			}
		}
	}
}