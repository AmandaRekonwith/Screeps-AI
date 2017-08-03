let roomController = require('Controllers_Room_RoomController');
let roomJobsController = require('Controllers_Room_JobsController');
let contructionDecorativeWallsController = require('Controllers_Room_Construction_DecorativeWallsController');

let GameController =
{
	run: function ()
	{
		let rooms = Game.rooms;
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			roomController.run(room);
		}
	},

	scanFlags: function()
	{
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			for (let flagName in room.memory.flags.claimController)
			{
				if(!Game.flags[flagName])
				{
					delete  room.memory.flags.claimController[flagName];
				}
			}

			for (let flagName in room.memory.flags.remoteBuildStructure)
			{
				if(!Game.flags[flagName])
				{
					delete  room.memory.flags.remoteBuildStructure[flagName];
				}
			}

			for (let flagName in room.memory.flags.remoteUpgradeController)
			{
				if(!Game.flags[flagName])
				{
					delete  room.memory.flags.remoteUpgradeController[flagName];
				}
			}
		}

		for (let name in Game.flags)
		{
			let flag = Game.flags[name];
			let room = flag.room;

			if(room != undefined)
			{
				if(flag.color == COLOR_PURPLE)
				{
					if(!room.memory.flags.claimController[flag.name])
					{
						room.memory.flags.claimController[flag.name] = {};
					}
				}

				if(flag.color == COLOR_YELLOW)
				{
					if(!room.memory.flags.remoteBuildStructure[flag.name])
					{
						room.memory.flags.remoteBuildStructure[flag.name] = {};
					}
				}

				if(flag.color == COLOR_RED)
				{
					if(!room.memory.flags.remoteUpgradeController[flag.name])
					{
						room.memory.flags.remoteUpgradeController[flag.name] = {};
					}
				}
			}
		}
	},

	scanRooms: function ()
	{
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			roomController.scanRoomEnvironment(room);
		}

		this.scanStructures();
		this.scanFlags();
		this.scanCreeps();

		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];
			roomJobsController.scanJobs(room);
			roomController.scanEnergy(room);
		}
	},

	scanStructures: function()
	{

		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			//find containers
			/*
			const containersWithEnergy = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
				i.store[RESOURCE_ENERGY] > 0
			});
			*/

			let structureContainersArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_CONTAINER
			});

			let structuresContainersCount = structureContainersArray.length;
			for (let x = 0; x < structuresContainersCount; x++)
			{
				let structureContainer = structureContainersArray[x];
				room.memory.structures.mapArray[structureContainer.pos.x][structureContainer.pos.y] = 16;
				room.memory.structures.containersArray.push(structureContainer);
			}

			//scan walls

			//decorative walls first
			let decorativeWallsArray = contructionDecorativeWallsController.getWallCoordinatesOfRoom(room);
			if(decorativeWallsArray != null)
			{
				let wallsCount = decorativeWallsArray.length;
				for(let x=0; x<wallsCount; x++)
				{
					let decorativeWall = decorativeWallsArray[x];
					room.memory.structures.mapArray[decorativeWall[0]][decorativeWall[1]] = 19;
				}
			}

			//organize by lowest amount of strength

			let structureWallsArray = room.find(FIND_STRUCTURES, {
				filter: (i) => i.structureType == STRUCTURE_WALL
			});
			structureWallsArray.sort(function(a,b) {return (a.hits > b.hits) ? 1 : ((b.hits > a.hits) ? -1 : 0);} );
			let structureWallsCount = structureWallsArray.length;
			for (let x = 0; x < structureWallsCount; x++)
			{
				let structureWall = structureWallsArray[x];

				if(room.memory.structures.mapArray[structureWall.pos.x][structureWall.pos.y] == 0) // don't count decorative walls..
				{
					room.memory.structures.mapArray[structureWall.pos.x][structureWall.pos.y] = 18;
					room.memory.structures.wallsArray.push(structureWall);
				}
			}
		}

		for (let name in Game.structures)
		{
			let structure = Game.structures[name];
			let structureType = structure.structureType;

			//numbers correspond to location in ordered list of constants in Screeps API
			switch(structureType)
			{
				case 'spawn':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 1;
					structure.room.memory.structures.spawnsArray.push(structure);
					break;
				case 'extension':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 2;
					structure.room.memory.structures.extensionsArray.push(structure);
					break;
				case 'road':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 3;
					break;
				case 'constructedWall':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 4;
					break;
				case 'rampart':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 5;
					break;
				/* keeperLairs are not in game hash, add these after this script (if needed)
				case 'keeperLair':
					structure.room.memory.structuresMapArray[structure.pos.x][structure.pos.y] = 6;
				*/
				/* portals are not in game hash, add these after this script (if needed)
				case 'portal':
					structure.room.memory.structuresMapArray[structure.pos.x][structure.pos.y] = 7;
					*/
				case 'link':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 8;
					structure.room.memory.structures.linksArray.push(structure);
					break;
				case 'storage':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 9;
					structure.room.memory.structures.storageArray.push(structure);
					break;
				case 'tower':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 10;
					structure.room.memory.structures.towersArray.push(structure);
					break;
				case 'observer':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 11;
					break;
				case 'powerBank':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 12;
					break;
				case 'extractor':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 13;
					structure.room.memory.structures.extractorsArray.push(structure);
					break;
				case 'lab':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 14;
					structure.room.memory.structures.labsArray.push(structure);
				case 'terminal':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 15;
					break;
				/* containers are not in game hash because they are not 'owned' by the player... code above puts it in this array
				case 'container':
				 structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 16;*/
					break;
				case 'nuker':
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 17;
					break;
				case 'wall':
					//added above... 18.. for reference here
					break;
				case 'decorativeWall':
					//added above.. 19 for reference here
					break;
				default:
					structure.room.memory.structures.mapArray[structure.pos.x][structure.pos.y] = 0;
			}
		}
	},

	scanCreeps: function()
	{
		let lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfWorkerCreeps = 1500;

		let lowestAmountOfTimeLeftToLiveOfHaulerCreeps = 1500;

		let lowestAmountOfTimeLeftToLiveOfClaimerCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfRemoteBuildStructureCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfRemoteUpgradeControllerCreeps = 1500;

		let lowestAmountOfTimeLeftToLiveOfSmallestStationaryCreeps = 1500;
		let lowestAmountOfTimeLeftToLiveOfBigStationaryCreeps =1500;
		let lowestAmountOfTimeLeftToLiveOfStationaryCreeps = 1500;
		let creepToDie;

		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			room.memory.creeps.workerCreeps.smallestWorkerCreepsArray = new Array();
			room.memory.creeps.workerCreeps.smallerWorkerCreepsArray = new Array();
			room.memory.creeps.workerCreeps.smallWorkerCreepsArray = new Array();
			room.memory.creeps.workerCreeps.bigWorkerCreepsArray = new Array();
			room.memory.creeps.workerCreeps.biggerWorkerCreepsArray = new Array();
			room.memory.creeps.workerCreeps.biggestWorkerCreepsArray = new Array();
			room.memory.creeps.haulerCreeps = new Array();
			room.memory.creeps.stationaryCreeps.smallestStationaryCreepsArray = new Array();
			room.memory.creeps.stationaryCreeps.bigStationaryCreepsArray = new Array();
			room.memory.creeps.remoteCreeps.claimerCreepsArray = new Array();
			room.memory.creeps.remoteCreeps.remoteBuildStructureCreepsArray = new Array();
			room.memory.creeps.remoteCreeps.remoteUpgradeControllerCreepsArray = new Array();
		}

		for (let name in Game.creeps)
		{
			let creep = Game.creeps[name];
			let room = creep.room;

			//this puts the creep with the lowest amount of time left to live at the start of the array..
			//useful for a function I have already written, later it can just reference this, instead of a full check through all creeps
			//see creeps.getCreepSoonestToDie();



			let creepType = (creep.memory.type);
			switch (creepType)
			{
				case 'worker':
					let workerCreepSize = creep.memory.size;
					switch (workerCreepSize)
					{
						case 'smallest':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallestWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallestWorkerCreepsArray.push(creep);
							}
							break;
						case 'smaller':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallerWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallerWorkerCreepsArray.push(creep);
							}
							break;
						case 'small':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.smallWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallWorkerCreepsArray.push(creep);
							}
							break;
						case 'big':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.bigWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBigWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.bigWorkerCreepsArray.push(creep);
							}
							break;
						case 'bigger':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBiggerWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.biggerWorkerCreepsArray.push(creep);
							}
							break;
						case 'biggest':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps)
							{
								room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBiggestWorkerCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.biggestWorkerCreepsArray.push(creep);
							}
							break;
						default:
					}
					break;
				case 'hauler':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfHaulerCreeps)
					{
						room.memory.creeps.haulerCreeps.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfHaulerCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.haulerCreeps.push(creep);
					}
					break;
				case 'stationary':
					let stationaryCreepSize = creep.memory.size;
					switch (stationaryCreepSize)
					{
						case 'smallest':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfSmallestStationaryCreeps)
							{
								room.memory.creeps.workerCreeps.smallestStationaryCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfSmallestStationaryCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.smallestStationaryCreepsArray.push(creep);
							}
							break;
						case 'big':
							if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfBigStationaryCreeps)
							{
								room.memory.creeps.workerCreeps.bigStationaryCreepsArray.unshift(creep);
								lowestAmountOfTimeLeftToLiveOfBigStationaryCreeps = creep.ticksToLive;
							}
							else
							{
								room.memory.creeps.workerCreeps.bigStationaryCreepsArray.push(creep);
							}
					}
					break;
				case 'claimer':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfClaimerCreeps)
					{
						room.memory.creeps.remoteCreeps.claimerCreepsArray.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfClaimerCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.remoteCreeps.claimerCreepsArray.push(creep);
					}
					break;
				case 'remoteBuildStructure':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfRemoteBuildStructureCreeps)
					{
						room.memory.creeps.remoteCreeps.remoteBuildStructureCreepsArray.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfRemoteBuildStructureCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.remoteCreeps.remoteBuildStructureCreepsArray.push(creep);
					}
					break;
				case 'remoteUpgradeController':
					if (creep.ticksToLive < lowestAmountOfTimeLeftToLiveOfRemoteUpgradeControllerCreeps)
					{
						room.memory.creeps.remoteCreeps.remoteUpgradeControllerCreepsArray.unshift(creep);
						lowestAmountOfTimeLeftToLiveOfRemoteUpgradeControllerCreeps = creep.ticksToLive;
					}
					else
					{
						room.memory.creeps.remoteCreeps.remoteUpgradeControllerCreepsArray.push(creep);
					}
					break;
				default:
			}
		}
	}
};
module.exports = GameController;