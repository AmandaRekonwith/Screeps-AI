module.exports = function ()
{
	Creep.prototype.getOverseerJob = function ()
	{
		let job = null;

		let room = this.room;

		for(let energySourceID in room.memory.jobs.overseerJobBoard.manageStorageAndTerminal)
		{
			let manageStorageAndTerminalJob = room.memory.jobs.overseerJobBoard.manageStorageAndTerminal[energySourceID];
			if (manageStorageAndTerminalJob.active == false)
			{
				job = {
					targetID: room.controller.id,
					type: "manageStorageAndTerminal"
				};
			}
		}

		/*
		 for(let resourceID in room.memory.jobs.overseerJobBoard.harvestResource)
		 {

		 let harvestResourceJob = room.memory.jobs.overseerJobBoard.harvestResource[resourceID];
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

	Creep.prototype.runOverseer = function ()
	{
		if(this.pos.x == 0)
		{
			this.moveTo(1, this.pos.y);
		}
		else
		{
			if (this.memory.job != null)
			{
				switch (this.memory.job.type)
				{
					case "manageStorageAndTerminal":
						if (this.room.memory.structures.storageArray[0])
						{
							let storageID = this.room.memory.structures.storageArray[0].id;

							if (this.room.memory.jobs.overseerJobBoard.manageStorageAndTerminal[storageID]) //if job still exists
							{
								this.runOverseerManageStorageAndTerminal();
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
				this.memory.job = this.getOverseerJob();
			}
		}
	}
}