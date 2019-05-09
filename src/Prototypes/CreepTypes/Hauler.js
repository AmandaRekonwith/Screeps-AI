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
			let job = {
				targetID: labID,
				type: "moveResourceFromLabToTerminal"
			};
			return job;
		}

		return null;
	}

	Creep.prototype.getHaulerJob = function ()
	{
		let job = null;
		let room = this.room;
		let resource = Game.getObjectById(room.memory.environment.resourcesArray[0]);

		if ((!this.memory.currentTask || this.memory.currentTask == null || this.memory.currentTask == "Getting Energy" || this.memory.currentTask == "Getting Resource")
			&& (this.memory.job == null || !this.memory.job)
			&& (_.sum(this.carry) != this.carryCapacity && !this.carry[resource.mineralType]))
		{

			let targetLabID = null;
			for (let labID in this.room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal)
			{
				targetLabID = labID; 
			}

			if(targetLabID != null)
			{
				lab = Game.getObjectById(targetLabID);

				let currentHighestAmountOfEnergyInContainers = 0;
				for (let containerID in this.room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
				{
					let container = Game.getObjectById(containerID);
					if(container.store[RESOURCE_ENERGY] > currentHighestAmountOfEnergyInContainers){ currentHighestAmountOfEnergyInContainers = container.store[RESOURCE_ENERGY]; }

				}

				if(lab.mineralAmount > currentHighestAmountOfEnergyInContainers)
				{
					job = this.memory.job = {
						targetID: lab.id,
						type: "moveResourceFromLabToTerminal"
					};
					this.memory.currentTask = "Getting Resource";
				}
				else
				{
					job = this.haulerCollectEnergy();
					this.memory.currentTask = "Getting Energy";
				}
			}
			else
			{
				job = this.haulerCollectEnergy();
				this.memory.currentTask = "Getting Energy";
			}

			return job;
		}

		if (this.carry[resource.mineralType])
		{
			if (room.terminal)
			{
				let job = {
					targetID: room.terminal.id,
					type: "supplyTerminalResource"
				}
				this.memory.currentTask ="Working";

				return job;
			}
		}

		if (this.carry[RESOURCE_ENERGY] == this.carryCapacity){ this.memory.currentTask = "Working" }

		if (this.memory.currentTask == "Working")
		{
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

				if (room.energyAvailable < room.energyCapacityAvailable)
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
				else
				{
					if (room.storage)
					{
						let job = {
							targetID: room.storage.id,
							type: "supplyStorage"
						}
						routineJobsArray.push(job);
					}
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

				return routineJobsArray[closestIndex];
			}
			else
			{
				this.memory.currentTask = "";
				this.memory.job = null;
			}
		}
	}

	Creep.prototype.runHauler = function ()
	{
		/*if(this.pos.x*this.pos.y === 0 || this.pos.x === 49 || this.pos.y === 49)
		this.moveTo(new RoomPosition(25,25,this.room.name));*/

		let resource = Game.getObjectById(this.room.memory.environment.resourcesArray[0]);

		if(!this.memory.currentTask || this.memory.currentTask == null)
		{
			this.memory.job = this.getHaulerJob();
		}
		else
		{
			if(this.memory.currentTask == "Renewing")
			{
				this.runHaulerRenew();
			}


			if (this.memory.currentTask == "Getting Energy" || this.memory.currentTask == "Getting Resource")
			{
				if(this.memory.job == null || !this.memory.job)
				{
					this.memory.job = this.getHaulerJob();
				}
				else
				{
					switch (this.memory.job.type)
					{
						case "moveResourceFromContainerToTerminal":
							if (this.room.memory.jobs.haulerJobBoard.moveResourceFromContainerToTerminal[this.memory.job.targetID]) //if job still exists
							{
								this.runHaulerMoveResourceFromContainerToTerminal();
							}
							else
							{
								this.memory.job = null;
							}
							break;
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
						case "moveResourceFromContainerToTerminal":
							if (this.room.memory.jobs.haulerJobBoard.moveResourceFromContainerToTerminal[this.memory.job.targetID]) //if job still exists
							{
								this.runHaulerMoveResourceFromContainerToTerminal();
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
}