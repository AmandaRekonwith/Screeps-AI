module.exports = function ()
{
	Creep.prototype.getStationaryJob = function ()
	{
		let job = null;

		let room = this.room;

		for(let energySourceID in room.memory.jobs.stationaryJobBoard.harvester)
		{

			let harvesterJob = room.memory.jobs.stationaryJobBoard.harvester[energySourceID];
			if (harvesterJob.active == false)
			{
				job = {
					targetID: energySourceID,
					type: "harvester"
				};
			}
		}

		return job;
	}

	Creep.prototype.runStationary = function ()
	{
		if (this.memory.job != null)
		{
			switch (this.memory.job.type)
			{
				case "harvester":
					if(this.room.memory.jobs.stationaryJobBoard.harvester[this.memory.job.targetID]) //if job still exists
					{
						this.runStationaryHarvester();
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
			this.memory.job = this.getStationaryJob();
		}
	}
}