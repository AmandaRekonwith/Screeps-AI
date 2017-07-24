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

		for(let energySourceID in room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController)
		{
			let continuouslyUpgradeControllerJob = room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController[energySourceID];
			if (continuouslyUpgradeControllerJob.active == false)
			{
				console.log(room.controller.id);
				job = {
					targetID: room.controller.id,
					type: "continuouslyUpgradeController"
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
				case "continuouslyUpgradeController":
					if(this.room.memory.structures.storageArray[0])
					{
						let storageID = this.room.memory.structures.storageArray[0].id;

						if(this.room.memory.jobs.stationaryJobBoard.continuouslyUpgradeController[storageID]) //if job still exists
						{
							this.runContinuouslyUpgradeController();
						}
						else
						{
							this.memory.job = null;
						}
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