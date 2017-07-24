module.exports = function ()
{
	Creep.prototype.getStationaryJob = function ()
	{
		let job = null;

		let room = this.room;

		for(let energySourceID in room.memory.jobs.stationaryJobBoard.harvestEnergy)
		{

			let harvestEnergyJob = room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID];
			if (harvestEnergyJob.active == false)
			{
				job = {
					targetID: energySourceID,
					type: "harvestEnergy"
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
				case "harvestEnergy":
					if(this.room.memory.jobs.stationaryJobBoard.harvestEnergy[this.memory.job.targetID]) //if job still exists
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