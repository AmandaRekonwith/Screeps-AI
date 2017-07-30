/**
 * Created by Amand on 6/20/2017.
 */
//let workerCreepModel = require('Models_Creep_WorkerModel');
//let stationaryCreepModel = require('Models_Creep_StationaryModel');
//let haulerCreepModel = require('Models_Creep_HaulerModel');

let jobsController = require('Controllers_Room_JobsController');
require('Prototypes_Spawn')();
require('Prototypes_Creep')();

require('Prototypes_CreepTypes_GeneralJobs_SupplyExtension')();
require('Prototypes_CreepTypes_GeneralJobs_SupplySpawn')();
require('Prototypes_CreepTypes_GeneralJobs_SupplyStorage')();
require('Prototypes_CreepTypes_GeneralJobs_SupplyTower')();

require('Prototypes_CreepTypes_Worker')();
require('Prototypes_CreepTypes_WorkerJobs_BuildStructure')();
require('Prototypes_CreepTypes_WorkerJobs_RepairStructure')();
require('Prototypes_CreepTypes_WorkerJobs_RepairWall')();
require('Prototypes_CreepTypes_WorkerJobs_UpgradeController')();

require('Prototypes_CreepTypes_Stationary')();
require('Prototypes_CreepTypes_StationaryJobs_ManageStorageAndTerminal')();
require('Prototypes_CreepTypes_StationaryJobs_HarvestEnergy')();

require('Prototypes_CreepTypes_Hauler')();
require('Prototypes_CreepTypes_HaulerJobs_MoveEnergyFromContainer')();

require('Prototypes_CreepTypes_Remote')();
require('Prototypes_CreepTypes_RemoteJobs_ClaimController')();
require('Prototypes_CreepTypes_RemoteJobs_RemoteBuildStructure')();
require('Prototypes_CreepTypes_RemoteJobs_RemoteUpgradeController')();

let RoomCreepsController =
{
	spawnCreeps: function (room)
	{
		let DEFCON = room.memory.DEFCON;
		let controllerLevel = room.controller.level;
		console.log("DEFCON: " + DEFCON);

		let spawn = room.memory.structures.spawnsArray[0];
		let energyAvailable = room.energyAvailable;

		let energySourcesArray = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySourcesArray.length;
		let storageCount = room.memory.structures.storageArray.length;

		let numberOfSmallestWorkerCreeps = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.length;
		let numberOfSmallerWorkerCreeps = room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.length;
		let numberOfSmallWorkerCreeps = room.memory.creeps.workerCreeps.smallWorkerCreepsArray.length;
		let numberOfBigWorkerCreeps = room.memory.creeps.workerCreeps.bigWorkerCreepsArray.length;
		let numberOfBiggerWorkerCreeps = room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.length;
		let numberOfBiggestWorkerCreeps = room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.length;
		let totalNumberOfWorkerCreeps = numberOfSmallestWorkerCreeps + numberOfSmallerWorkerCreeps + numberOfSmallWorkerCreeps + numberOfBigWorkerCreeps + numberOfBiggerWorkerCreeps + numberOfBiggestWorkerCreeps;

		let numberOfStationaryCreeps = room.memory.creeps.stationaryCreeps.length;
		let numberOfHaulerCreeps = room.memory.creeps.haulerCreeps.length;

		let maximumNumberOfHarvesterStationaryCreeps = 0;
		if(controllerLevel >= 4){  maximumNumberOfHarvesterStationaryCreeps = energySourcesCount; }

		let maximumNumberOfContinuouslyUpgradeControllerCreeps = 0;
		if(controllerLevel >= 4){ maximumNumberOfContinuouslyUpgradeControllerCreeps = storageCount; }

		let maximumNumberOfStationaryCreeps = 0;
		if(controllerLevel >= 4){	maximumNumberOfStationaryCreeps = maximumNumberOfHarvesterStationaryCreeps + maximumNumberOfContinuouslyUpgradeControllerCreeps; }

		let maximumNumberOfContainerHaulerCreeps = 0;
		if(controllerLevel >= 4){	maximumNumberOfContainerHaulerCreeps = room.memory.structures.containersArray.length - energySourcesCount; }


		let numberOfClaimerCreeps = room.memory.creeps.remoteCreeps.claimerCreepsArray.length;
		let maximumNumberOfClaimerCreeps = 0;
		for(let flagName in room.memory.flags.claimController)
		{
			maximumNumberOfClaimerCreeps += 1;
		}

		let numberOfRemoteBuildStructureCreeps = room.memory.creeps.remoteCreeps.remoteBuildStructureCreepsArray.length;
		let maximumNumberOfRemoteBuildStructureCreeps = 0;
		for(let flagName in room.memory.flags.remoteBuildStructure)
		{
			maximumNumberOfRemoteBuildStructureCreeps += 1;
		}

		let numberOfRemoteUpgradeControllerCreeps = room.memory.creeps.remoteCreeps.remoteUpgradeControllerCreepsArray.length;
		let maximumNumberOfRemoteUpgradeControllerCreeps = 0;
		for(let flagName in room.memory.flags.remoteUpgradeController)
		{
			maximumNumberOfRemoteUpgradeControllerCreeps += 1;
		}

		//MY CURRENT FORMULA FOR SPAWNING SHIT
		let totalNumberOfOpenTilesNextToEnergySources = 0;
		for (let x = 0; x < energySourcesCount; x++)
		{
			totalNumberOfOpenTilesNextToEnergySources += energySourcesArray[x].numberOfAdjacentOpenTerrainTiles;
		}

		let maximumNumberOfWorkerCreeps = 0;
		if(DEFCON == 5)
		{
			maximumNumberOfWorkerCreeps = 1 - (2 * numberOfHaulerCreeps);
		}
		if(DEFCON < 5)
		{
			//also add some depending on room level
			let additionalWorkers = 14 - (room.controller.level * 2);

			maximumNumberOfWorkerCreeps = totalNumberOfOpenTilesNextToEnergySources - maximumNumberOfStationaryCreeps - maximumNumberOfContainerHaulerCreeps + additionalWorkers;
		}


		console.log("totalNumberOfWorkerCreeps: " + totalNumberOfWorkerCreeps + " maximumNumberOfWorkerCreeps:     " + maximumNumberOfWorkerCreeps);
		if (totalNumberOfWorkerCreeps < maximumNumberOfWorkerCreeps)
		{
			if(room.memory.DEFCON >= 4)
			{
				let numberOfSpawns = room.memory.structures.spawnsArray.length;
				let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
				let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
				spawn.createSmallestWorkerCreep(room);
			}
			else
			{
				this.spawnNewWorkerCreep(room);
			}
		}
		else
		{
			if (room.memory.DEFCON < 4)
			{
				if (totalNumberOfWorkerCreeps == maximumNumberOfWorkerCreeps)
				{
					let creepToDie = this.getSmallestWorkerCreepClosestToDeath(room);

					if (creepToDie && creepToDie.ticksToLive < 75)
					{
						//revising the logic here...
						//spawn if size BIGGER than creep to be suicided...
						let energyCostOfCreepToDie = this.getEnergyCostOfWorkerCreepOfCertainSize(creepToDie.memory.size);
						if (room.energyAvailable >= energyCostOfCreepToDie)
						{
							creepToDie.suicide();
							this.spawnNewWorkerCreep(room);
						}
					}
				}
			}


			if(controllerLevel >= 4)
			{

				let ticksTillOldestStationaryCreepDies = 43;
				if (room.memory.creeps.stationaryCreeps.length > 0)
				{
					let ticksTillOldestStationaryCreepDies = room.memory.creeps.stationaryCreeps[0].ticksToLive;
				}

				if ((numberOfStationaryCreeps < maximumNumberOfStationaryCreeps || ticksTillOldestStationaryCreepDies < 42) && room.energyAvailable >= 1200)
				{
					let numberOfSpawns = room.memory.structures.spawnsArray.length;
					let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
					let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
					spawn.createStationaryCreep(room);
				}
				console.log("numberOfStationaryCreeps:  " + numberOfStationaryCreeps + " maximumNumberOfStationaryCreeps: " + maximumNumberOfStationaryCreeps);
				if (numberOfStationaryCreeps == maximumNumberOfStationaryCreeps)
				{
					console.log('haulerCreeps:              ' + numberOfHaulerCreeps + " maxHaulerCreeps:                 " + maximumNumberOfContainerHaulerCreeps);


					let ticksTillOldestHaulerCreepDies = 61;
					if (room.memory.creeps.haulerCreeps.length > 0)
					{
						let ticksTillOldestHaulerCreepDies = room.memory.creeps.haulerCreeps[0].ticksToLive;
					}

					if (( numberOfHaulerCreeps < maximumNumberOfContainerHaulerCreeps || ticksTillOldestHaulerCreepDies < 60) && room.energyAvailable >= 1000)
					{
						let numberOfSpawns = room.memory.structures.spawnsArray.length;
						let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
						let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
						spawn.createHaulerCreep(room);
					}

					//now spawn a claimer if necessary
					if (numberOfHaulerCreeps == maximumNumberOfContainerHaulerCreeps)
					{
						console.log('numberOfClaimerCreeps: ' + numberOfClaimerCreeps + " maximumNumberOfClaimerCreeps: " + maximumNumberOfClaimerCreeps);
						if (numberOfClaimerCreeps < maximumNumberOfClaimerCreeps)
						{
							numberOfSpawns = room.memory.structures.spawnsArray.length;
							let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
							let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
							//spawn.createClaimerCreep(room);
						}

						console.log('numberOfRemoteBuildStructureCreeps: ' + numberOfRemoteBuildStructureCreeps + " maximumNumberOfRemoteBuildStructureCreeps: " + maximumNumberOfRemoteBuildStructureCreeps);
						if (numberOfRemoteBuildStructureCreeps < maximumNumberOfRemoteBuildStructureCreeps)
						{
							numberOfSpawns = room.memory.structures.spawnsArray.length;
							let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
							let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
							spawn.createRemoteBuildStructureCreep(room);
						}

						console.log('numberOfRemoteUpgradeControllerCreeps: ' + numberOfRemoteUpgradeControllerCreeps + " maximumNumberOfRemoteUpgradeControllerCreeps: " + maximumNumberOfRemoteUpgradeControllerCreeps);
						if (numberOfRemoteUpgradeControllerCreeps < maximumNumberOfRemoteUpgradeControllerCreeps)
						{
							numberOfSpawns = room.memory.structures.spawnsArray.length;
							let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
							let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
							//spawn.createRemoteUpgradeControllerCreep(room);
						}
					}
				}
			}//controllerLevel
		}
	},

	getSmallestWorkerCreepClosestToDeath: function (room)
	{
		let ticksToLive = 1500
		let creepToDie = null;

		if (room.memory.creeps.workerCreeps.smallestWorkerCreepsArray[0])
		{
			creepToDie = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray[0].ticksToLive;
		}

		if (room.memory.creeps.workerCreeps.smallerWorkerCreepsArray[0] &&
			room.memory.creeps.workerCreeps.smallerWorkerCreepsArray[0] < ticksToLive)
		{
			creepToDie = room.memory.creeps.workerCreeps.smallerWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.smallerWorkerCreepsArray[0].ticksToLive;
		}

		if (room.memory.creeps.workerCreeps.smallWorkerCreepsArray[0] &&
			room.memory.creeps.workerCreeps.smallWorkerCreepsArray[0] < ticksToLive)
		{
			creepToDie = room.memory.creeps.workerCreeps.smallWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.smallWorkerCreepsArray[0].ticksToLive;
		}

		if (room.memory.creeps.workerCreeps.bigWorkerCreepsArray[0] &&
			room.memory.creeps.workerCreeps.bigWorkerCreepsArray[0] < ticksToLive)
		{
			creepToDie = room.memory.creeps.workerCreeps.bigWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.bigWorkerCreepsArray[0].ticksToLive;
		}

		if (room.memory.creeps.workerCreeps.biggerWorkerCreepsArray[0] &&
			room.memory.creeps.workerCreeps.biggerWorkerCreepsArray[0] < ticksToLive)
		{
			creepToDie = room.memory.creeps.workerCreeps.biggerWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.biggerWorkerCreepsArray[0].ticksToLive;
		}

		if (room.memory.creeps.workerCreeps.biggestWorkerCreepsArray[0] &&
			room.memory.creeps.workerCreeps.biggestWorkerCreepsArray[0] < ticksToLive)
		{
			creepToDie = room.memory.creeps.workerCreeps.biggestWorkerCreepsArray[0];
			ticksToLive = room.memory.creeps.workerCreeps.biggestWorkerCreepsArray[0].ticksToLive;
		}

		return creepToDie;
	},

	spawnNewWorkerCreep: function (room)
	{
		let spawn = room.memory.structures.spawnsArray[0]; //change this later to accomodate all spawns

		let totalEnergy = room.energyAvailable;

		if (totalEnergy >= 1450)
		{
			let newName = spawn.createBiggestWorkerCreep();
		}
		else if (totalEnergy >= 1150)
		{
			let newName = spawn.createBiggerWorkerCreep();
		}
		else if (totalEnergy >= 900)
		{
			let newName = spawn.createBigWorkerCreep();
		}
		else if (totalEnergy >= 650)
		{
			let newName = spawn.createSmallWorkerCreep();
		}
		else if (totalEnergy >= 400)
		{
			let newName = spawn.createSmallerWorkerCreep();
		}
		else if (totalEnergy >= 200)
		{
			let newName = spawn.createSmallestWorkerCreep();
		}
	},

	getEnergyCostOfWorkerCreepOfCertainSize: function(size)
	{
		let energyCost = 0;
		switch (size)
		{
			case 'smallest':
				energyCost = 200;
				break;
			case 'smaller':
				energyCost = 400;
				break;
			case 'small':
				energyCost = 650;
				break;
			case 'big':
				energyCost = 900;
				break;
			case 'bigger':
				energyCost = 1150;
				break;
			case 'biggest':
				energyCost = 1450;
				break;
			default:
				energyCost = 0;
		}
		return energyCost;
	},

	run: function (room)
	{
		let workerCreepsSizesArray = ["smallest", "smaller", "small", "big", "bigger", "biggest"];
		let workerCreepSizesCount = workerCreepsSizesArray.length;
		for (let z = 0; z < workerCreepSizesCount; z++)
		{
			let workerCreepsArray = room.memory.creeps.workerCreeps[workerCreepsSizesArray[z] + "WorkerCreepsArray"];
			let workerCreepsCount = workerCreepsArray.length;
			for (let x = 0; x < workerCreepsCount; x++)
			{
				let workerCreep = workerCreepsArray[x];
				workerCreep.run(workerCreep);
			}
		}

		 let stationaryCreepsArray = room.memory.creeps.stationaryCreeps;
		 let stationaryCreepsCount = stationaryCreepsArray.length;
		 for(let x=0; x<stationaryCreepsCount; x++)
		 {
			 let stationaryCreep = stationaryCreepsArray[x];
			 stationaryCreep.runStationary(stationaryCreep);
		 }

		 let haulerCreepsArray = room.memory.creeps.haulerCreeps;
		 let haulerCreepsCount = haulerCreepsArray.length;
		 for(let x=0; x<haulerCreepsCount; x++)
		 {
			 let haulerCreep = haulerCreepsArray[x];
			 haulerCreep.runHauler(haulerCreep);
		 }

		let claimerCreepsArray = room.memory.creeps.remoteCreeps.claimerCreepsArray;
		let claimerCreepsCount = claimerCreepsArray.length;
		for(let x=0; x<claimerCreepsCount; x++)
		{
			let claimerCreep = claimerCreepsArray[x];
			claimerCreep.runRemote();
		}

		let remoteBuildStructureCreepsArray = room.memory.creeps.remoteCreeps.remoteBuildStructureCreepsArray;
		let remoteBuildStructureCreepsCount = remoteBuildStructureCreepsArray.length;
		for(let x=0; x<remoteBuildStructureCreepsCount; x++)
		{
			let remoteBuildStructureCreep = remoteBuildStructureCreepsArray[x];
			remoteBuildStructureCreep.runRemote();
		}

		let remoteUpgradeControllerCreepsArray = room.memory.creeps.remoteCreeps.remoteUpgradeControllerCreepsArray;
		let remoteUpgradeControllerCreepsCount = remoteUpgradeControllerCreepsArray.length;
		for(let x=0; x<remoteUpgradeControllerCreepsCount; x++)
		{
			let remoteUpgradeControllerCreep = remoteUpgradeControllerCreepsArray[x];

			remoteUpgradeControllerCreep.runRemote();
		}
	}
};

module.exports = RoomCreepsController;