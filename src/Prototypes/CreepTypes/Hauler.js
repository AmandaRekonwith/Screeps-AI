module.exports = function ()
{
	Creep.prototype.getHaulerJob = function ()
	{
		let job = null;

		let room = this.room;

		for(let containerID in room.memory.jobs.haulerJobBoard.containerToStorage)
		{
			let harvesterJob = room.memory.jobs.haulerJobBoard.containerToStorage[containerID];
			if (harvesterJob.active == false)
			{
				job = {
					targetID: containerID,
					type: "containerToStorage"
				};
			}
		}

		return job;
	}

	Creep.prototype.runHauler = function ()
	{

		if (this.memory.job != null)
		{
			switch (this.memory.job.type)
			{
				case "containerToStorage":
					if(this.room.memory.jobs.haulerJobBoard.containerToStorage[this.memory.job.targetID]) //if job still exists
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