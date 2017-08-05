module.exports = function ()
{
	Creep.prototype.getStationaryJob = function ()
	{
		let job = null;

		let room = this.room;

		console.log('fucktits');

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

		for(let energySourceID in room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal)
		{
			let manageStorageAndTerminalJob = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[energySourceID];
			if (manageStorageAndTerminalJob.active == false)
			{
				console.log(room.controller.id);
				job = {
					targetID: room.controller.id,
					type: "manageStorageAndTerminal"
				};
			}
		}

		/*
		for(let resourceID in room.memory.jobs.stationaryJobBoard.harvestResource)
		{

			let harvestResourceJob = room.memory.jobs.stationaryJobBoard.harvestResource[resourceID];
			if (harvestResourceJob.active == false)
			{
				job = {
					targetID: resourceID,
					type: "harvestResource"
				};
			}
		}*/

		return job;
	}

	Creep.prototype.runStationary = function ()
	{
		if(this.pos.x == 0)
		{
			console.log("FFFFUUUUCK");
			this.moveTo(1, this.pos.y);
		}
		else
		{
			if (this.memory.job != null)
			{
				switch (this.memory.job.type)
				{
					case "harvestEnergy":
						if (this.room.memory.jobs.stationaryJobBoard.harvestEnergy[this.memory.job.targetID]) //if job still exists
						{
							this.runStationaryEnergyHarvester();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					case "manageStorageAndTerminal":
						if (this.room.memory.structures.storageArray[0])
						{
							let storageID = this.room.memory.structures.storageArray[0].id;

							if (this.room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID]) //if job still exists
							{
								this.runManageStorageAndTerminal();
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
}