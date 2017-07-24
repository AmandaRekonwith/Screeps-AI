module.exports = function ()
{
	Creep.prototype.getHaulerJob = function ()
	{
		let job = null;
		let room = this.room;

		let containerIDsArray = new Array();
		for (let containerID in room.memory.jobs.haulerJobBoard.moveEnergyFromContainerToStorage)
		{
			containerIDsArray.push(containerID);
		}

		if (containerIDsArray.length > 0)
		{
			containerIDsArray = this.FisherYatesShuffle(containerIDsArray);

			job = {
				targetID: containerIDsArray[0],
				type: "moveEnergyFromContainerToStorage"
			};
		}

		return job;
	}

	Creep.prototype.runHauler = function ()
	{
		if (this.memory.job != null)
		{
			switch (this.memory.job.type)
			{
				case "moveEnergyFromContainerToStorage":
					if(this.room.memory.jobs.haulerJobBoard.moveEnergyFromContainerToStorage[this.memory.job.targetID]) //if job still exists
					{
						this.runHaulerContainerToStorage();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				default:
			}
		}
		else
		{
			this.memory.job = this.getHaulerJob();
		}
	}
}