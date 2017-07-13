/**
 * Created by Amand on 6/20/2017.
 */
//let workerCreepModel = require('Models_Creep_WorkerModel');
//let stationaryCreepModel = require('Models_Creep_StationaryModel');
//let haulerCreepModel = require('Models_Creep_HaulerModel');

require('Prototypes_Spawn')();
require('Prototypes_Creep')();
require('Prototypes_CreepTypes_Worker')();
require('Prototypes_CreepTypes_WorkerJobs_BuildStructure')();
require('Prototypes_CreepTypes_WorkerJobs_SupplyExtension')();
require('Prototypes_CreepTypes_WorkerJobs_SupplySpawn')();
require('Prototypes_CreepTypes_WorkerJobs_UpgradeController')();

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

		let totalNumberOfStationaryCreeps = 0;

		let totalNumberOfHaulerCreeps = 0;

		//MY CURRENT FORMULA FOR SPAWNING SHIT
		let totalNumberOfOpenTilesNextToEnergySources = 0;
		for (let x = 0; x < energySourcesCount; x++)
		{
			totalNumberOfOpenTilesNextToEnergySources += energySourcesArray[x].numberOfAdjacentOpenTerrainTiles;
		}

		//let totalNumberOfWorkerCreeps = totalNumberOfOpenTilesNextToEnergySources - stationaryCreepsCount - haulerCreepsCount;
		let maximumNmberOfWorkerCreeps = totalNumberOfOpenTilesNextToEnergySources;

		if (totalNumberOfWorkerCreeps < maximumNmberOfWorkerCreeps)
		{
			let derp = spawn.createSmallestWorkerCreep();
		}
		else
		{
			if (room.energyAvailable == room.energyCapacityAvailable)
			{
				//check for creeps near death first
				let creepToDie = this.getSmallestWorkerCreepClosestToDeath(room);
				if (creepToDie.ticksToLive < 100)
				{
					creepToDie.suicide();
					this.spawnNewWorkerCreep(room);
				}
			}
			//then do sheer upgrades... ... hmm have to think about how to do this...
		}


		let stationaryHarvesterJobs = room.memory.jobs.stationaryJobBoard.harvesterJobs;
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
		let spawn = room.memory.structures.spawnsArray[0];

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

		/*
		 let stationaryCreepsArray = room.memory.creeps.stationaryCreepsArray;
		 let stationaryCreepsCount = stationaryCreepsArray.length;
		 for(let x=0; x<stationaryCreepsCount; x++)
		 {
		 let stationaryCreep = stationaryCreepsArray[x];
		 stationaryCreep.run(stationaryCreep);
		 }

		 let haulerCreepsArray = room.memory.creeps.haulerCreepsArray;
		 let haulerCreepsCount = haulerCreepsArray.count;
		 for(let x=0; x<haulerCreepsArray; x++)
		 {
		 let haulerCreep = haulerCreepsArray[x];
		 haulerCreep.run(haulerCreep);
		 }*/
	}
};

module.exports = RoomCreepsController;