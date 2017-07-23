module.exports = function ()
{
	Creep.prototype.runHaulerContainerToStorage = function ()
	{
		let room = this.room;
		let containerID = this.memory.job.targetID;

		if (room.memory.jobs.haulerJobBoard.containerToStorage[containerID])
		{
			let job = room.memory.jobs.haulerJobBoard.containerToStorage[containerID];
			let currentTask = this.memory.currentTask;

			room.memory.jobs.haulerJobBoard.containerToStorage[containerID].creepID = this.id;
			room.memory.jobs.haulerJobBoard.containerToStorage[containerID].active = true;

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
					let storage = room.memory.structures.storageArray[0];
					this.memory.energySource = {
						type: "storage",
						targetID: storage.id
					};

					this.memory.currentTask = "Working";
				}
			}
			else
			{
				if (this.memory.currentTask == "Working")
				{
					if (this.carry.energy > 0)
					{
						let storage = Game.getObjectById(this.memory.energySource.targetID);
						let action = this.transfer(storage, RESOURCE_ENERGY);

						if (action == ERR_NOT_IN_RANGE)
						{
							this.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
						}
					}
					else
					{
						this.memory.currentTask = "Getting Energy";
					}
				}
			}
		}
	}
}