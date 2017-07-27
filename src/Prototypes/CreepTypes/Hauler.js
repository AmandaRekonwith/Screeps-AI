module.exports = function ()
{
	Creep.prototype.getHaulerJob = function ()
	{
		let job = null;
		let room = this.room;

		if (this.memory.currentTask == null || this.memory.currentTask == "Getting Energy" && (this.memory.job == null || !this.memory.job))
		{
			let containerIDsArray = new Array();

			for (let containerID in room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
			{
				containerIDsArray.push(containerID);
			}

			if (containerIDsArray.length > 0)
			{
				containerIDsArray = this.FisherYatesShuffle(containerIDsArray);

				job = {
					targetID: containerIDsArray[0],
					type: "moveEnergyFromContainer"
				};

				return job;
			}
		}

		if (this.memory.currentTask == "Working" && this.memory.job == null)
		{
			let routineJobsArray = new Array();
			for (let extensionID in this.room.memory.jobs.generalJobBoard.supplyExtension)
			{
				let job = {
					targetID: extensionID,
					type: "supplyExtension"
				};
				routineJobsArray.push(job);
			}

			for (let spawnID in this.room.memory.jobs.generalJobBoard.supplySpawn)
			{
				let job = {
					targetID: spawnID,
					type: "supplySpawn"
				};
				routineJobsArray.push(job);
			}

			for (let towerID in this.room.memory.jobs.generalJobBoard.supplyTower)
			{
				let job = {
					targetID: towerID,
					type: "supplyTower"
				};
				routineJobsArray.push(job);
			}

			let jobsCount = routineJobsArray.length;
			if (jobsCount > 0)
			{
				let jobRandomizer = Math.floor((Math.random() * jobsCount));
				return routineJobsArray[jobRandomizer];
			}
			else
			{
				if(room.storage)
				{
					if(room.memory.jobs.generalJobBoard.supplyStorage[room.storage.id])
					{
						let job = {
							targetID: room.storage.id,
							type: "supplyStorage"
						}
					}
				}
			}
		}
	}

	Creep.prototype.runHauler = function ()
	{

		console.log(this.memory.job);

		if (this.memory.currentTask == "Getting Energy" || this.memory.currentTask == null)
		{
			if(this.memory.job == null || !this.memory.job)
			{
				this.memory.job = this.getHaulerJob();
			}
			else
			{
				switch (this.memory.job.type)
				{
					case "moveEnergyFromContainer":
						if (this.room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[this.memory.job.targetID]) //if job still exists
						{
							this.runHaulerMoveEnergyFromContainer();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					default:
				}
			}
		}

		if (this.memory.currentTask == "Working")
		{
			if(this.memory.job != null)
			{
				switch (this.memory.job.type)
				{
					case "supplyExtension":
						if (this.room.memory.jobs.generalJobBoard.supplyExtension[this.memory.job.targetID])
						{
							this.supplyExtension();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					case "supplySpawn":
						if (this.room.memory.jobs.generalJobBoard.supplySpawn[this.memory.job.targetID])
						{
							this.supplySpawn();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					case "supplyTower":
						if (this.room.memory.jobs.generalJobBoard.supplyTower[this.memory.job.targetID])
						{
							this.supplyTower();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					case "supplyStorage":
						if (this.room.memory.jobs.generalJobBoard.supplyStorage[this.memory.job.targetID])
						{
							this.supplyStorage();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					default:

						break;
				}
			}
			else
			{
				this.memory.job = this.getHaulerJob();
			}
		}
	}
}