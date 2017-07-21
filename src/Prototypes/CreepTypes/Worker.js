module.exports = function ()
{
	Creep.prototype.getFirstPriorityJob = function ()
	{
		for (let constructionSiteID in this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure)
		{
			let job = {
				targetID: constructionSiteID,
				type: "buildStructure"
			};
			return job;
		}

		return this.getRoutineJob(); //if no first prioirity jobs....
	}
	Creep.prototype.getRoutineJob = function ()
	{
		let routineJobsArray = new Array();
		for (let extensionID in this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension)
		{
			let job = {
				targetID: extensionID,
				type: "supplyExtension"
			};
			routineJobsArray.push(job);
		}
		for (let spawnID in this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn)
		{
			let job = {
				targetID: spawnID,
				type: "supplySpawn"
			};
			routineJobsArray.push(job);
		}
		let job = {
			index: this.room.controller.id,
			type: "upgradeController"
		}
		routineJobsArray.push(job);

		let jobsCount = routineJobsArray.length;


		let jobRandomizer = Math.floor((Math.random() * jobsCount));
		console.log(routineJobsArray[jobRandomizer].type);
		return routineJobsArray[jobRandomizer];
	}

	Creep.prototype.getWorkerJob = function ()
	{
		let job = null;

		let room = this.room;

		let percentageChanceOfWorkingFirstPriorityJob = 95;

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
					if(this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[this.memory.job.targetID])
					{
						this.buildStructure();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "supplyExtension":
					if(this.room.memory.jobs.workerJobBoard.routineJobs.supplyExtension[this.memory.job.targetID])
					{
						this.supplyExtension();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "supplySpawn":
					if(this.room.memory.jobs.workerJobBoard.routineJobs.supplySpawn[this.memory.job.targetID])
					{
						this.supplySpawn();
					}
					else
					{
						this.memory.job = null;
					}
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


