module.exports = function ()
{
	Creep.prototype.getFirstPriorityJob = function ()
	{
		let percentageChanceOfWorkingFirstPriorityJob = 95;

		let typeOfJobRandomizer = Math.floor((Math.random() * 100));

		if (typeOfJobRandomizer < percentageChanceOfWorkingFirstPriorityJob)
		{
			for (let constructionSiteID in this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure)
			{
				let job = {
					targetID: constructionSiteID,
					type: "buildStructure"
				};
				return job;
			}

			for (let structureID in this.room.memory.jobs.workerJobBoard.routineJobs.repairStructure)
			{
				let job = {
					targetID: structureID,
					type: "repairStructure"
				};
				return job;
			}
		}
		else
		{
			return null;
		}

		//return this.getRoutineJob(); //if no first priority jobs....
	},

		Creep.prototype.getRoutineJob = function ()
		{
			let DEFCON = this.room.memory.DEFCON;

			let creepXPosition = this.pos.x;
			let creepYPosition = this.pos.y;

			let percentageChanceOfUpgradingController = 2;

			let upgradeControllerChance = Math.floor((Math.random() * 100));
			if(upgradeControllerChance >= percentageChanceOfUpgradingController)
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


					numberOfExtensions = this.room.memory.structures.extensionsArray.length / 2;
					for(let z=0; z<numberOfExtensions; z++)
					{
						routineJobsArray.push(job);
					}
				}

				let percentageChanceOfAddingRepairWallJobController = 30;

				let repairWallChance = Math.floor((Math.random() * 100));

				if(repairWallChance <= percentageChanceOfAddingRepairWallJobController)
				{
					/*
					if (this.room.memory.structures.wallsArray.length > 0)
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
					}
					*/
				}

				let jobsCount = routineJobsArray.length;
				if (jobsCount > 0)
				{
					let jobRandomizer = Math.floor((Math.random() * jobsCount));
					return routineJobsArray[jobRandomizer];
				}
				else
				{
					return null;
				}
			}
			else
			{
				return this.getUpgradeControllerJob();
			}
		}

	Creep.prototype.getUpgradeControllerJob = function ()
	{
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


		if(this.room.energyAvailable < this.room.energyCapacityAvailable / 1.2)
		{
			job = this.getRoutineJob();
		}

		if(job == null)
		{
			job = this.getFirstPriorityJob();
		}

		if(job == null)
		{
			job = this.getRoutineJob();
		}

		if(job == null)
		{
			job = this.getUpgradeControllerJob();
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


