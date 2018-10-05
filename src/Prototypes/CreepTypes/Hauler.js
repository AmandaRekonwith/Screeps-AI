module.exports = function ()
{
	Creep.prototype.haulerCollectEnergy = function ()
	{
		let droppedEnergyIDsArray = new Array();

		for (let energyID in this.room.memory.jobs.haulerJobBoard.collectDroppedEnergy)
		{
			droppedEnergyIDsArray.push(energyID);
		}

		if (droppedEnergyIDsArray.length > 0)
		{
			//find closest dropped energy
				let closestIndex = 0;
				let leastDistance = 98;

				let droppedEnergyCount = droppedEnergyIDsArray.length;
				if(droppedEnergyCount > 0)
				{
					for(let x=0; x<droppedEnergyCount; x++)
					{
						let targetJobSite = Game.getObjectById(droppedEnergyIDsArray[x]);
						let xDifference = Math.abs(this.pos.x - targetJobSite.pos.x);
						let yDifference = Math.abs(this.pos.y - targetJobSite.pos.y);
						let totalDifference = xDifference + yDifference;
						if(totalDifference < leastDistance)
						{
							closestIndex = x;
							leastDistance = totalDifference;
						}
					}
				}

			job = {
				targetID: droppedEnergyIDsArray[closestIndex],
				type: "collectDroppedEnergy"
			};

			return job;
		}

		let containerIDsArray = new Array();

		for (let containerID in this.room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
		{
			containerIDsArray.push(containerID);
		}

		if (containerIDsArray.length > 0)
		{
			//find closest dropped energy
			let closestIndex = 0;
			let leastDistance = 98;

			let containersCount = containerIDsArray.length;
			if(containersCount > 0)
			{
				for(let x=0; x<containersCount; x++)
				{
					let targetJobSite = Game.getObjectById(containerIDsArray[x]);
					let xDifference = Math.abs(this.pos.x - targetJobSite.pos.x);
					let yDifference = Math.abs(this.pos.y - targetJobSite.pos.y);
					let totalDifference = xDifference + yDifference;
					if(totalDifference < leastDistance)
					{
						closestIndex = x;
						leastDistance = totalDifference;
					}
				}
			}

			if (Game.getObjectById(containerIDsArray[closestIndex]).store[RESOURCE_ENERGY] >= 500)
			{
				job = {
					targetID: containerIDsArray[closestIndex],
					type: "moveEnergyFromContainer"
				};

				return job;
			}
		}

		return null;
	}

	Creep.prototype.haulerCollectResource = function()
	{
		for (let labID in this.room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal)
		{

			if (Game.getObjectById(labID).mineralAmount >= 500)
			{
				let job = {
					targetID: labID,
					type: "moveResourceFromLabToTerminal"
				};

				return job;
			}
		}

		return null;
	}

	Creep.prototype.getHaulerJob = function ()
	{
		let job = null;
		let room = this.room;

		if(this.memory.currentTask == "Working" && _.sum(this.carry) == 0)
		{
			this.memory.currentTask = null;
		}

		if ((this.memory.currentTask == null || this.memory.currentTask == "Getting Energy" || this.memory.currentTask == "Getting Resource")
			&& (this.memory.job == null || !this.memory.job))
		{
			if(_.sum(this.carry) == this.carryCapacity)
			{
				this.memory.currentTask = "Working";
				this.memory.job = null;
			}
			else
			{
				this.memory.currentTask = "Getting Energy";
				job = this.haulerCollectEnergy();

				/*

				let percentageChanceCollectResource = 50;
				let chanceRandomizer = Math.floor((Math.random() * 100));
				if(chanceRandomizer < percentageChanceCollectResource)
				{
					job = this.haulerCollectResource();
					if(job == null)
					{
						job = this.haulerCollectEnergy();
						if(job != null)
						{
							this.memory.currentTask = "Getting Energy";
						}
					}
					else
					{
						this.memory.currentTask = "Getting Resource";
					}
				}
				else
				{
					job = this.haulerCollectEnergy();
					if(job == null)
					{
						job = this.haulerCollectResource();
						if(job != null)
						{
							this.memory.currentTask = "Getting Resource";
						}
					}
					else
					{
						this.memory.currentTask = "Getting Energy";
					}
				}
				*/
			}

			/*
			if(_.sum(this.carry) - this.carry[RESOURCE_ENERGY] == 0 && _.sum(this.carry > 0))
			{
				job = this.haulerCollectEnergy();
			}


			if (_.sum(this.carry) - this.carry[RESOURCE_ENERGY] > 0)
			{
				job = this.haulerCollectResource();
			}
			*/

			return job;
		}

		if (this.memory.currentTask == "Working" && (this.memory.job == null || !this.memory.job))
		{
			if (_.sum(this.carry) > 0 && this.carry[RESOURCE_ENERGY] == 0)
			{
				if (room.terminal)
				{
					let job = {
						targetID: room.terminal.id,
						type: "supplyTerminalResource"
					}

					return job;
				}
			}

			if(this.carry[RESOURCE_ENERGY] > 0)
			{
				let numberOfSmallestWorkerCreeps = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.length;
				let numberOfSmallerWorkerCreeps = room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.length;
				let numberOfSmallWorkerCreeps = room.memory.creeps.workerCreeps.smallWorkerCreepsArray.length;
				let numberOfBigWorkerCreeps = room.memory.creeps.workerCreeps.bigWorkerCreepsArray.length;
				let numberOfBiggerWorkerCreeps = room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.length;
				let numberOfBiggestWorkerCreeps = room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.length;
				let totalNumberOfWorkerCreeps = numberOfSmallestWorkerCreeps + numberOfSmallerWorkerCreeps + numberOfSmallWorkerCreeps + numberOfBigWorkerCreeps + numberOfBiggerWorkerCreeps + numberOfBiggestWorkerCreeps;

				let routineJobsArray = new Array();

				if (totalNumberOfWorkerCreeps == 0 || !room.storage)
				{
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

					/*
					for (let towerID in this.room.memory.jobs.generalJobBoard.supplyTower)
					{
						let job = {
							targetID: towerID,
							type: "supplyTower"
						};
						routineJobsArray.push(job);
					}
					*/
				}

				if (room.storage)
				{
					let job = {
						targetID: room.storage.id,
						type: "supplyStorage"
					}
					routineJobsArray.push(job);
				}

				//find closest target
				let closestIndex = 0;
				let leastDistance = 98;

				let jobsCount = routineJobsArray.length;
				if(jobsCount > 0)
				{
					for(let x=0; x<jobsCount; x++)
					{
						let targetJobSite = Game.getObjectById(routineJobsArray[x].targetID);
						let xDifference = Math.abs(this.pos.x - targetJobSite.pos.x);
						let yDifference = Math.abs(this.pos.y - targetJobSite.pos.y);
						let totalDifference = xDifference + yDifference;
						if(totalDifference < leastDistance)
						{
							closestIndex = x;
							leastDistance = totalDifference;
						}
					}
				}

				//let jobRandomizer = Math.floor((Math.random() * routineJobsArray.length));
				return routineJobsArray[closestIndex];
			}
		}
	}

	Creep.prototype.runHauler = function ()
	{
		if (this.memory.currentTask == "Getting Energy" || this.memory.currentTask == null || this.memory.currentTask == "Getting Resource")
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
					case "moveResourceFromLabToTerminal":
						if (this.room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[this.memory.job.targetID]) //if job still exists
						{
							this.runHaulerMoveResourceFromLabToTerminal();
						}
						else
						{
							this.memory.job = null;
						}
						break;
					case "collectDroppedEnergy":
						if (this.room.memory.jobs.haulerJobBoard.collectDroppedEnergy[this.memory.job.targetID]) //if job still exists
						{
							this.runHaulerCollectDroppedEnergy();
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
					case "supplyTerminalResource":
						this.supplyTerminalResource();
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