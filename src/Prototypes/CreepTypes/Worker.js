module.exports = function ()
{
	Creep.prototype.getFirstPriorityJob = function ()
	{
		for (let constructionSiteID in this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure)
		{
			let job = {
				index: constructionSiteID,
				type: "buildStructure"
			};
			return job;
		}

		return this.getRoutineJob(); //if no first prioirty jobs....
	}
	Creep.prototype.getRoutineJob = function ()
	{
		for (let extensionID in this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension)
		{
			let supplyExtensionJob = this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extensionID];
			if (supplyExtensionJob.active == true && supplyExtensionJob.creep == null)
			{
				if (Game.getObjectById(extensionID).isActive)
				{
					this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[extensionID].creep = this;
					let job = {
						index: extensionID,
						type: "supplyExtension"
					};
					return job;
				}
			}
		}

		for (let spawnID in this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn)
		{
			let supplySpawnJob = this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawnID];
			if (supplySpawnJob.active == true && supplySpawnJob.creep == null)
			{
				this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[spawnID].creep = this;

				let job = {
					index: spawnID,
					type: "supplySpawn"
				};
				return job;
			}
		}

		//default... upgrade the controller
		let job = {
			index: this.room.controller.id,
			type: "upgradeController"
		}

		return job;
	}

	Creep.prototype.getWorkerJob = function ()
	{
		let job = null;

		let room = this.room;

		let percentageChanceOfWorkingFirstPriorityJob = 80;

		let typeOfJobRandomizer = Math.floor((Math.random() * 100));

		if (typeOfJobRandomizer < percentageChanceOfWorkingFirstPriorityJob)
		{
			job = this.getFirstPriorityJob();
		}
		else
		{
			job = this.getRoutineJob();
		}

		return job;
	}

	Creep.prototype.runWorker = function ()
	{
		if (this.memory.job != null)
		{
			switch (this.memory.job.type)
			{
				case "buildStructure":
					this.buildStructure();
					break;
				case "supplyExtension":
					this.supplyExtension();
					break;
				case "supplySpawn":
					this.supplySpawn();
					break;
				case "upgradeController":
					this.upgradeTheController();
					break;
				default:
			}
		}
		else
		{
			this.memory.job = this.getWorkerJob();
		}

	}
}


