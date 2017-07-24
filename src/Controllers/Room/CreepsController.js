/**
 * Created by Amand on 6/20/2017.
 */
//let workerCreepModel = require('Models_Creep_WorkerModel');
//let stationaryCreepModel = require('Models_Creep_StationaryModel');
//let haulerCreepModel = require('Models_Creep_HaulerModel');

let jobsController = require('Controllers_Room_JobsController');
require('Prototypes_Spawn')();
require('Prototypes_Creep')();
require('Prototypes_CreepTypes_Worker')();
require('Prototypes_CreepTypes_WorkerJobs_BuildStructure')();
require('Prototypes_CreepTypes_WorkerJobs_RepairStructure')();
require('Prototypes_CreepTypes_WorkerJobs_RepairWall')();
require('Prototypes_CreepTypes_WorkerJobs_SupplyExtension')();
require('Prototypes_CreepTypes_WorkerJobs_SupplySpawn')();
require('Prototypes_CreepTypes_WorkerJobs_SupplyTower')();
require('Prototypes_CreepTypes_WorkerJobs_UpgradeController')();

require('Prototypes_CreepTypes_Stationary')();
require('Prototypes_CreepTypes_StationaryJobs_HarvestEnergy')();

require('Prototypes_CreepTypes_Hauler')();
require('Prototypes_CreepTypes_HaulerJobs_MoveEnergyFromContainerToStorage')();

let RoomCreepsController =
{
	spawnCreeps: function (room)
	{
		let spawn = room.memory.structures.spawnsArray[0];
		let energyAvailable = room.energyAvailable;

		let energySourcesArray = room.memory.environment.energySourcesArray;
		let energySourcesCount = energySourcesArray.length;

		let numberOfSmallestWorkerCreeps = room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.length;
		let numberOfSmallerWorkerCreeps = room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.length;
		let numberOfSmallWorkerCreeps = room.memory.creeps.workerCreeps.smallWorkerCreepsArray.length;
		let numberOfBigWorkerCreeps = room.memory.creeps.workerCreeps.bigWorkerCreepsArray.length;
		let numberOfBiggerWorkerCreeps = room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.length;
		let numberOfBiggestWorkerCreeps = room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.length;
		let totalNumberOfWorkerCreeps = numberOfSmallestWorkerCreeps + numberOfSmallerWorkerCreeps + numberOfSmallWorkerCreeps + numberOfBigWorkerCreeps + numberOfBiggerWorkerCreeps + numberOfBiggestWorkerCreeps;

		let numberOfStationaryCreeps = room.memory.creeps.stationaryCreeps.length;
		let maximumNumberOfHarvesterStationaryCreeps = energySourcesCount;

		let numberOfHaulerCreeps = room.memory.creeps.haulerCreeps.length;
		let maximumNumberOfContainerToStorageHaulerCreeps = room.memory.structures.containersArray.length - energySourcesCount;

		//MY CURRENT FORMULA FOR SPAWNING SHIT
		let totalNumberOfOpenTilesNextToEnergySources = 0;
		for (let x = 0; x < energySourcesCount; x++)
		{
			totalNumberOfOpenTilesNextToEnergySources += energySourcesArray[x].numberOfAdjacentOpenTerrainTiles;
		}

		//let totalNumberOfWorkerCreeps = totalNumberOfOpenTilesNextToEnergySources - stationaryCreepsCount - haulerCreepsCount;
		let maximumNumberOfWorkerCreeps = totalNumberOfOpenTilesNextToEnergySources - numberOfStationaryCreeps - numberOfHaulerCreeps;
		// I am adding one or two to fidget with efficiency,
		// since the creeps will be doing other things at times in addition to harvesting



		console.log(totalNumberOfWorkerCreeps + " " + maximumNumberOfWorkerCreeps);
		if (totalNumberOfWorkerCreeps < maximumNumberOfWorkerCreeps)
		{
			this.spawnNewWorkerCreep(room);
		}
		else
		{
			//console.log('fuck');
			//console.log(jobsController.getNumberOfAvailableStationaryJobs(room));
			//console.log("ticksToLive" + room.memory.creeps.stationaryCreeps[0].ticksToLive);
			if((jobsController.getNumberOfAvailableStationaryJobs(room) > 0 || room.memory.creeps.stationaryCreeps[0].ticksToLive < 40) && room.energyAvailable >= 1150)
			{
				let numberOfSpawns = room.memory.structures.spawnsArray.length;
				let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
				let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
				spawn.createStationaryCreep(room);
			}
			if(numberOfStationaryCreeps == maximumNumberOfHarvesterStationaryCreeps)
			{
				if(( numberOfHaulerCreeps < maximumNumberOfContainerToStorageHaulerCreeps || room.memory.creeps.haulerCreeps[0].ticksToLive < 31) && room.energyAvailable >= 500)
				{
					let numberOfSpawns = room.memory.structures.spawnsArray.length;
					let spawnRandomizer = Math.floor((Math.random() * numberOfSpawns));
					let spawn = room.memory.structures.spawnsArray[spawnRandomizer];
					spawn.createHaulerCreep(room);
				}
			}

			/*
			this code will continually upgrade creep size... the logic is that...
			it first checks for a creep that is near death, and forces it to suicide.
			then spawns the biggest creep it can.

			if... no creeps are near death, code should just wait until the room hits 1450 available energy,
			then spawn the 'biggest' creep worker type, IF not all workers are of the 'biggest' type.

			ideally, this should allow an efficient continual spawning of the worker creep population,
			while allowing resources to be used on other things
			 */

			if(totalNumberOfWorkerCreeps == maximumNumberOfWorkerCreeps)
			{
				let creepToDie = this.getSmallestWorkerCreepClosestToDeath(room);

				if (creepToDie && creepToDie.ticksToLive < 100)
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

/*
		let stationaryHarvesterJobs = room.memory.jobs.stationaryJobBoard.harvester;
		let stationaryHarvesterJobsCount = stationaryHarvesterJobs.length;

		if (totalNumberOfStationaryCreeps < stationaryHarvesterJobsCount && energyAvailable >= 1400)
		{
			let derp = spawn.createStationaryHarvesterCreep();
		}

		let haulerJobs = room.memory.jobs.haulerJobBoard.jobs;
		let haulerJobsCount = haulerJobs.length;

		if (totalNumberOfHaulerCreeps < haulerJobsCount && energyAvailable >= 1000)
		{
			let derp = spawn.createHaulerCreep();
		}
		*/
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
	}
};

module.exports = RoomCreepsController;