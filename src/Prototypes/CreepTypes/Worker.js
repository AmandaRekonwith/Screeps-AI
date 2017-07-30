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

		return this.getRoutineJob(); //if no first priority jobs....
	},

	Creep.prototype.getRoutineJob = function ()
	{
		let DEFCON = this.room.memory.DEFCON;

		let creepXPosition = this.pos.x;
		let creepYPosition = this.pos.y;

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

		for (let structureID in this.room.memory.jobs.workerJobBoard.routineJobs.repairStructure)
		{
			let job = {
				targetID: structureID,
				type: "repairStructure"
			};
			routineJobsArray.push(job);
		}

		/*
		if(this.room.memory.structures.wallsArray.length > 0)
		{
			let wall = this.room.memory.structures.wallsArray[0];
			let wallJob = this.room.memory.jobs.workerJobBoard.routineJobs.repairWall[wall.id];
			if (wallJob)
			{
				let job = {
					targetID: wall.id,
					type: "repairWall"
				};
				routineJobsArray.push(job);
			}
		}*/

		if(!this.room.memory.structures.storageArray[0])
		{
			let job = {
				index: this.room.controller.id,
				type: "upgradeController"
			}
			routineJobsArray.push(job);
		}

		let jobsCount = routineJobsArray.length;
		if(jobsCount > 0)
		{
			let jobRandomizer = Math.floor((Math.random() * jobsCount));
			return routineJobsArray[jobRandomizer];
		}
		else
		{
			return null;
		}
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
					if(this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[this.memory.job.targetID])
					{
						this.buildStructure();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "repairStructure":
					if(this.room.memory.jobs.workerJobBoard.routineJobs.repairStructure[this.memory.job.targetID])
					{
						this.repairStructure();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "repairWall":
					if(this.room.memory.jobs.workerJobBoard.routineJobs.repairWall[this.memory.job.targetID])
					{
						this.repairWall();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "supplyExtension":
					if(this.room.memory.jobs.generalJobBoard.supplyExtension[this.memory.job.targetID])
					{
						this.supplyExtension();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "supplySpawn":
					if(this.room.memory.jobs.generalJobBoard.supplySpawn[this.memory.job.targetID])
					{
						this.supplySpawn();
					}
					else
					{
						this.memory.job = null;
					}
					break;
				case "supplyTower":
					if(this.room.memory.jobs.generalJobBoard.supplyTower[this.memory.job.targetID])
					{
						this.supplyTower();
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


