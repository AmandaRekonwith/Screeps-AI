/**
 * Created by Amand on 6/20/2017.
 * Rethinking how jobs are assigned and completed.
 * Eventually doing away with 'roles' in favor of assigning prioritized jobs to screeps
 */

var RoomJobsController =
{
	scanJobs: function (room)
	{
		this.scanWorkerJobs(room);
		this.scanHaulerJobs(room);
		this.scanStationaryJobs(room);
		//this.scanClaimerJobs(room);
	},

	scanWorkerJobs: function (room)
	{
		this.scanGeneralJobs(room);
		this.scanWorkerConstructionJobs(room);
		this.scanWorkerRepairJobs(room);
	},

	scanWorkerConstructionJobs: function(room)
	{
		//if job complete delete job
		for(let constructionIndex in room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure)
		{
			if(!Game.getObjectById(constructionIndex))
			{
				delete room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionIndex];
			}
		}

		//now scan jobs
		let constructionSitesArray = room.find(FIND_MY_CONSTRUCTION_SITES);

		let constructionSitesCount = constructionSitesArray.length;
		for (let x = 0; x < constructionSitesCount; x++)
		{
			let constructionSite = constructionSitesArray[x];
			if (!room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id])
			{
				room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[constructionSite.id] = {};
			}
		}
	},

	scanWorkerRepairJobs: function(room)
	{
		let repairStructureJobs = room.memory.jobs.workerJobBoard.routineJobs.repairStructure;

		for(let structureID in repairStructureJobs)
		{
			if(!Game.getObjectById(structureID))
			{
				delete room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structureID];
			}
			else
			{
				let structure = Game.getObjectById(structureID);
				if(structure.hits == structure.hitsMax)
				{
					delete room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structureID];
				}
			}
		}

		//now scan
		let structuresArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.hits < structure.hitsMax);
			}
		});

		let structuresCount = structuresArray.length;
		for(let x=0; x<structuresCount; x++)
		{
			if(!room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structuresArray[x].id])
			{
				room.memory.jobs.workerJobBoard.routineJobs.repairStructure[structuresArray[x].id] = {};
			}
		}

		//scan walls

		/* I used to have workers repair walls.
		NO MORE! Turret heals ramparts and walls at critical levels.
		A maintainer builds them up further.
		*/

		/*
		let repairWallJobs = room.memory.jobs.workerJobBoard.routineJobs.repairWall;

		for(let wallID in repairWallJobs)
		{
			if(!Game.getObjectById(wallID))
			{
				delete room.memory.jobs.workerJobBoard.routineJobs.repairWall[wallID];
			}
			else
			{
				let wall = Game.getObjectById(wallID);
				if(wall.hits == wall.hitsMax)
				{
					delete room.memory.jobs.workerJobBoard.routineJobs.repairWall[wallID];
				}
			}
		}

		let wallsCount = room.memory.structures.wallsArray.length;
		for(let x=0; x<wallsCount; x++)
		{
			wall = room.memory.structures.wallsArray[x];
			if(!room.memory.jobs.workerJobBoard.routineJobs.repairWall[wall.id] && wall.hits < wall.hitsMax)
			{
				room.memory.jobs.workerJobBoard.routineJobs.repairWall[wall.id] = {};
			}
		}

		*/
	},

	scanGeneralJobs: function (room)
	{
		this.scanGeneralSupplyExtensionJobs(room);
		this.scanGeneralSupplySpawnJobs(room);
		this.scanGeneralSupplyTowerJobs(room);
		this.scanGeneralSupplyStorageJobs(room);
	},

	scanGeneralSupplyExtensionJobs: function (room)
	{
		let supplyExtensionJobs = room.memory.jobs.generalJobBoard.supplyExtension;

		for(let structureID in supplyExtensionJobs)
		{
			if(!Game.getObjectById(structureID))
			{
				delete room.memory.jobs.workerJobBoard.generalJobBoard.supplyExtension[structureID];
			}
		}

		let extensionsArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_EXTENSION);
			}
		});

		//generate a GENERAL job for each one provided one doesn't already exist
		let extensionsCount = extensionsArray.length;
		for (let x = 0; x < extensionsCount; x++)
		{
			let extension = extensionsArray[x];

			if (extension.energy < extension.energyCapacity && !room.memory.jobs.generalJobBoard.supplyExtension[extension.id])
			{
				room.memory.jobs.generalJobBoard.supplyExtension[extension.id] = {};
			}
			if (extension.energy == extension.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyExtension[extension.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyExtension[extension.id];
				}
			}
		}
	},

	scanGeneralSupplySpawnJobs: function (room)
	{
		let supplySpawnJobs = room.memory.jobs.generalJobBoard.supplySpawn;

		for(let structureID in supplySpawnJobs)
		{
			if(!Game.getObjectById(structureID))
			{
				delete room.memory.jobs.generalJobBoard.supplySpawn[structureID];
			}
		}

		let spawnsArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_SPAWN);
			}
		});

		//generate a WORKER job for each one provided one doesn't already exist
		let spawnsCount = spawnsArray.length;

		for (let x = 0; x < spawnsCount; x++)
		{
			let spawn = spawnsArray[x];

			if (spawn.energy <= spawn.energyCapacity && !room.memory.jobs.generalJobBoard.supplySpawn[spawn.id])
			{
				room.memory.jobs.generalJobBoard.supplySpawn[spawn.id] = {};
			}
			if (spawn.energy == spawn.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplySpawn[spawn.id])
				{
					delete room.memory.jobs.generalJobBoard.supplySpawn[spawn.id];
				}
			}
		}
	},

	scanGeneralSupplyStorageJobs: function (room)
	{
		if(room.storage)
		{
			let storage = room.storage;

			if( _.sum(storage.store) < storage.storeCapacity) // job complete && !room.memory.jobs.generalJobBoard.supplyStorage[storage.id])
			{
				room.memory.jobs.generalJobBoard.supplyStorage[storage.id] = {};
			}
			if (_.sum(storage.store) == storage.storeCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyStorage[storage.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyStorage[storage.id];
				}
			}
		}
		else
		{
			for(let storageID in room.memory.jobs.generalJobBoard.supplyStorage)
			{
				if(!Game.getObjectById(storageID))
				{
					delete room.memory.jobs.generalJobBoard.supplyStorage[structureID];
				}
			}
		}
	},

	scanGeneralSupplyTowerJobs: function (room)
	{
		let supplyTowersJob = room.memory.jobs.generalJobBoard.supplyTower;

		for(let structureID in supplyTowersJob)
		{
			if(!Game.getObjectById(structureID))
			{
				delete room.memory.jobs.generalJobBoard.supplyTower[structureID];
			}
		}


		let towersArray = room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				return (structure.structureType == STRUCTURE_TOWER);
			}
		});

		//generate a WORKER job for each one provided one doesn't already exist
		let towersCount = towersArray.length;

		for (let x = 0; x < towersCount; x++)
		{
			let tower = towersArray[x];

			if (tower.energy <= tower.energyCapacity && !room.memory.jobs.generalJobBoard.supplyTower[tower.id])
			{
				room.memory.jobs.generalJobBoard.supplyTower[tower.id] = {};
			}
			if (tower.energy == tower.energyCapacity)
			{
				if (room.memory.jobs.generalJobBoard.supplyTower[tower.id])
				{
					delete room.memory.jobs.generalJobBoard.supplyTower[tower.id];
				}
			}
		}
	},


	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<HAULER JOBS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	scanHaulerJobs: function (room)
	{
		let storageCount = room.memory.structures.storageArray.length;

		//delete hauler jobs first if objects disappeared...or there is no energy in containers.
		for(let containerID in room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
		{
			if (!Game.getObjectById(containerID))
			{
				delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
			}
			else
			{
				if (Game.getObjectById(containerID).store[RESOURCE_ENERGY] <= 499)
				{
					delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
				}
			}

			if (storageCount == 0)
			{
				delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
			}
		}

		//create hauler jobs, based on how many storage and containers exist... will fidget with this eventually
		if (storageCount > 0)
		{

			for(let containerID in room.memory.jobs.haulerJobBoard.moveEnergyFromContainer)
			{
				if (!Game.getObjectById(containerID))
				{
					delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[containerID];
				}
			}
				
			/*
			let ignoreStructureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
				&& i.store[RESOURCE_ENERGY] <= 499
			});
			let ignoreStructureContainersCount = structureContainersArray.length;

			for (let x = 0; x < ignoreStructureContainersCount; x++)
			{
				if (room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[ignoreStructureContainersArray[x].id])
				{
					delete room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[ignoreStructureContainersArray[x]];
				}
			}*/

			let structureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
				&& i.store[RESOURCE_ENERGY] >= 500
			});
			let structureContainersCount = structureContainersArray.length;

			for (let x = 0; x < structureContainersCount; x++)
			{
				if (!room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[structureContainersArray[x].id])
				{
					room.memory.jobs.haulerJobBoard.moveEnergyFromContainer[structureContainersArray[x].id] = {};
				}
			}
		}

		//delete hauler jobs first if objects disappeared...or there is no energy in containers.
		 for(let energyID in room.memory.jobs.haulerJobBoard.collectDroppedEnergy)
		 {
			 if (!Game.getObjectById(energyID))
			 {
			 	delete room.memory.jobs.haulerJobBoard.collectDroppedEnergy[energyID];
			 }
		 }

		let droppedEnergySources = room.find(FIND_DROPPED_RESOURCES, RESOURCE_ENERGY);
		let droppedEnergySourcesCount = droppedEnergySources.length;
		for(let x=0; x<droppedEnergySourcesCount; x++)
		{
			let energySource = droppedEnergySources[x];
			if (energySource.pos.x > 2 && energySource.pos.x < 47 && energySource.pos.y > 2 && energySource.pos.y < 47)
			{
				room.memory.jobs.haulerJobBoard.collectDroppedEnergy[energySource.id] = {};
			}
		}

	},

	/*
	 getNumberOfAvailableStationaryJobs: function (room)
	 {
	 let stationaryHarvesterJobs = room.memory.jobs.stationaryJobBoard.harvestEnergy;
	 let manageStorageAndTerminalJobs = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal;

	 let numberOfAvailableStationaryHarvesterJobs = 0;
	 for (let energySourceID in stationaryHarvesterJobs)
	 {
	 let stationaryHarvesterJob = stationaryHarvesterJobs[energySourceID];

	 if (stationaryHarvesterJob.creepID == null && stationaryHarvesterJob.active == false)
	 {
	 numberOfAvailableStationaryHarvesterJobs += 1;
	 }
	 }

	 for (let energySourceID in manageStorageAndTerminalJobs)
	 {
	 let manageStorageAndTerminalJob = manageStorageAndTerminalJobs[energySourceID];

	 if (manageStorageAndTerminalJob.creepID == null && manageStorageAndTerminalJob.active == false)
	 {
	 numberOfAvailableStationaryHarvesterJobs += 1;
	 }
	 }

	 return numberOfAvailableStationaryHarvesterJobs;
	 },
	 */

	scanStationaryJobs: function (room)
	{
		this.scanHarvestEnergyJobs(room);
		//this.scanHarvestResourceJobs(room);
		this.scanStationaryManageStorageAndTerminalJobs(room);
	},

	scanStationaryManageStorageAndTerminalJobs: function (room)
	{
		let manageStorageAndTerminalJobs = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal;

		let numberOfStationaryManageStorageAndTerminalJobsActive = 0;
		for (let storageID in manageStorageAndTerminalJobs)
		{
			let storage = Game.getObjectById(storageID);
			if(storage) //if the storage container exists... then continue... if not.. make sure the job is deleted.
			{
				let stationaryManageStorageAndTerminalJob = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID];
				let creepID = stationaryManageStorageAndTerminalJob.creepID;

				if (creepID != null)
				{
					let creep = Game.getObjectById(creepID);
					if (stationaryManageStorageAndTerminalJob.active == true && !creep)
					{
						room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID].active = false;
						room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID].creepID = null;
					} //if creep died, reset job active to false
					else
					{
						if (stationaryManageStorageAndTerminalJob.active == true && creep)
						{
							numberOfStationaryManageStorageAndTerminalJobsActive += 1;
						}
					}
				}
			}
			else
			{
				delete room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID];
			}
		}

		//now scan
		if(room.storage)
		{
			let storageID = room.storage.id;
			let storage = room.storage;
			if(!room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID])
			{
				let manageStorageAndTerminalJob = {};
				manageStorageAndTerminalJob.active = false;
				manageStorageAndTerminalJob.creepID = null;

				room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID] = manageStorageAndTerminalJob;
			}

			let jobPosition = null;

			let storagePositionX = storage.pos.x;
			let storagePositionY = storage.pos.y;

			//FOR NOW, I am making sure the storage container is within distance of the upgrade controller
			// (this is not automated, but placed on the game map by hand)
			//AND am MANUALLY making sure the space above the storage unit is empty, and in range of the upgrade controller.
			//that will be the site of this job. ... so that said, x-1, y - 1.


			if(room.terminal)
			{
				jobPosition = {x: room.terminal.pos.x - 1, y: room.terminal.pos.y + 1};
			}
			else
			{
				if(room.memory.environment.terrainMapArray[storagePositionX - 1][ storagePositionY] != 3)
				{
					jobPosition = {x: storagePositionX - 1, y: storagePositionY};
				}
				else
				{
					if (room.memory.environment.terrainMapArray[storagePositionX][storagePositionY - 1] != 3)
					{
						jobPosition = {x: storagePositionX, y: storagePositionY - 1};
					}
				}
			}//terminal

			room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID].pos = jobPosition;
		}
	},

	scanHarvestEnergyJobs: function(room)
	{
		let stationaryHarvestEnergyJobs = room.memory.jobs.stationaryJobBoard.harvestEnergy;

		for (let energySourceID in stationaryHarvestEnergyJobs)
		{
			let stationaryHarvestEnergyJob = stationaryHarvestEnergyJobs[energySourceID];

			let creepID = stationaryHarvestEnergyJob.creepID;

			if(creepID != null)
			{
				let creep = Game.getObjectById(creepID);
				if (stationaryHarvestEnergyJob.active == true && !creep)
				{
					room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].active = false;
					room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].creepID = null;
				} //if creep died, reset job active to false
			}

			let container = Game.getObjectById(stationaryHarvestEnergyJob.containerID);
			if(!container)
			{
				delete room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID];
			}
		}

		//now scan.

		let energySourcesArray = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySourcesArray.length;
		for(let x=0; x<energySourcesCount; x++)
		{
			let energySource = energySourcesArray[x];

			let energySourceXPosition = energySource.pos.x;
			let energySourceYPosition = energySource.pos.y;

			let containersArray = room.lookForAtArea(LOOK_STRUCTURES, energySourceYPosition - 1, energySourceXPosition - 1, energySourceYPosition + 1, energySourceXPosition + 1, true);
			let containersCount = containersArray.length;
			for(let y=0; y<containersCount; y++)
			{
				let structure = containersArray[y].structure;
				if(structure.structureType == "container")
				{
					if(!room.memory.jobs.stationaryJobBoard.harvestEnergy[energySource.id])
					{
						room.memory.jobs.stationaryJobBoard.harvestEnergy[energySource.id] = {
							active: false,
							containerID: structure.id,
							creepID: null
						}
					}
				}
			}
		}
	},

	scanHarvestResourceJobs: function(room)
	{
		let stationaryHarvestResourceJobs = room.memory.jobs.stationaryJobBoard.harvestResource;

		for (let resourceID in stationaryHarvestResourceJobs)
		{
			let stationaryHarvestResourceJob = stationaryHarvestResourceJobs[resourceID];

			let creepID = stationaryHarvestResourceJob.creepID;

			if(creepID != null)
			{
				let creep = Game.getObjectById(creepID);
				if (stationaryHarvestResourceJob.active == true && !creep)
				{
					room.memory.jobs.stationaryJobBoard.harvestResource[resourceID].active = false;
					room.memory.jobs.stationaryJobBoard.harvestResource[resourceID].creepID = null;
				} //if creep died, reset job active to false
			}
		}

		//now scan.

		let resourcesArray = room.memory.environment.resourcesArray;
		let resourcesCount = resourcesArray.length;
		for(let x=0; x<resourcesCount; x++)
		{
			let resourceID = resourcesArray[x];
			let resource = Game.getObjectById(resourceID);

			let extractorExists = false;
			let extractorsArray = room.memory.structures.extractorsArray;
			let extractorsCount = extractorsArray.length;

			/*for(let y=0; y<extractorsCount; y++)
			{
				let extractor = extractorsArray[y];
				if(resource.pos.x == extractor.pos.x && resource.pos.y == extractor.pos.y)
				{
					extractorExists = true;
				}
			}*/



			if(extractorsCount > 0)
			{
				if (resource.ticksToRegeneration > 0)
				{
					let top = 2;
					let left = 2;
					let bottom = 2;
					let right = 2;

					if (resource.pos.y - 2 < 0)
					{
						top = 1;
						if (resource.pos.y - 1 < 0)
						{
							top = 0;
						}
					}

					if (resource.pos.x - 2 < 0)
					{
						left = 1;
						if (resource.pos.x - 1 < 0)
						{
							left = 0;
						}
					}

					if (resource.pos.y + 2 > 49)
					{
						bottom = 1;
						if (resource.pos.y + 1 > 49)
						{
							bottom = 0;
						}
					}

					if (resource.pos.x + 2 > 49)
					{
						right = 1;
						if (resource.pos.x + 1 > 49)
						{
							right = 0;
						}
					}

					let structures = room.lookForAtArea(LOOK_STRUCTURES, resource.pos.y - top, resource.pos.x - left, resource.pos.y + bottom, resource.pos.x + right, true);
					let structuresCount = structures.length;

					labExists = false;

					for (let k = 0; k < structuresCount; k++)
					{
						let structureObject = structures[k];

						if (structureObject.structure.structureType == "lab")
						{
							labExists = true;
							if (room.memory.jobs.stationaryJobBoard.harvestResource[resource.id])
							{
								delete room.memory.jobs.stationaryJobBoard.harvestResource[resource.id];
							}
						}
					}

					if (room.terminal)
					{
						if (room.memory.jobs.haulerJobBoard.supplyTerminalResource[room.terminal.id])
						{
							delete room.memory.jobs.haulerJobBoard.supplyTerminalResource[room.terminal.id];
						}
					}
				}
				else
				{
					if (room.terminal)
					{
						if (!room.memory.jobs.haulerJobBoard.supplyTerminalResource[room.terminal.id])
						{
							room.memory.jobs.haulerJobBoard.supplyTerminalResource[room.terminal.id] = {};
						}

						let top = 2;
						let left = 2;
						let bottom = 2;
						let right = 2;

						if (resource.pos.y - 2 < 0)
						{
							top = 1;
							if (resource.pos.y - 1 < 0)
							{
								top = 0;
							}
						}

						if (resource.pos.x - 2 < 0)
						{
							left = 1;
							if (resource.pos.x - 1 < 0)
							{
								left = 0;
							}
						}

						if (resource.pos.y + 2 > 49)
						{
							bottom = 1;
							if (resource.pos.y + 1 > 49)
							{
								bottom = 0;
							}
						}

						if (resource.pos.x + 2 > 49)
						{
							right = 1;
							if (resource.pos.x + 1 > 49)
							{
								right = 0;
							}
						}

						let structures = room.lookForAtArea(LOOK_STRUCTURES, resource.pos.y - top, resource.pos.x - left, resource.pos.y + bottom, resource.pos.x + right, true);
						let structuresCount = structures.length;

						labExists = false;

						for (let k = 0; k < structuresCount; k++)
						{
							let structureObject = structures[k];

							if (structureObject.structure.structureType == "lab")
							{
								labExists = true;
								if (!room.memory.jobs.stationaryJobBoard.harvestResource[resource.id])
								{
									room.memory.jobs.stationaryJobBoard.harvestResource[resource.id] =
									{
										active: false,
										creepID: null
									}
								}

								if (!room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[structureObject.structure.id] &&
									structureObject.structure.mineralAmount >= 500)
								{
									room.memory.jobs.haulerJobBoard.moveResourceFromLabToTerminal[structureObject.structure.id] = {};
								}
							}
						}

						if (labExists == false)
						{
							if (room.memory.jobs.stationaryJobBoard.harvestResource[resource.id])
							{
								delete room.memory.jobs.stationaryJobBoard.harvestResource[resource.id];
							}
						}
					} // no terminal
					else
					{
						for (terminalID in room.memory.jobs.haulerJobBoard.supplyTerminalResource)
						{
							delete room.memory.jobs.haulerJobBoard.supplyTerminalResource[terminalID];
						}
					}
				}
			}
			else // no extractor
			{
				if(room.memory.jobs.stationaryJobBoard.harvestResource[resource.id])
				{
					delete room.memory.jobs.stationaryJobBoard.harvestResource[resource.id];
				}
			}
		}
	}
}

module.exports = RoomJobsController;