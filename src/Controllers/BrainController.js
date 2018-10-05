let gameController = require('Controllers_GameController');
let marketController = require('Controllers_Market_MarketController');

let BrainController =
{

//EXTERNAL METHODS
	processStimuli: function ()
	{
		this.brainWash();
		this.initializeMemory();
		gameController.scanRooms();
	},

	takeAction: function ()
	{
		gameController.run();
		marketController.sellEverything();
	},
	
//INTERNAL METHODS	
	brainWash: function ()
	{
		this.deleteALLMemoryOnFirstRun();

		//clear memory of dead creepers
		for (let i in Memory.creeps)
		{
			if (!Game.creeps[i])
			{
				delete Memory.creeps[i];
			}
		}
	},

	deleteALLMemoryOnFirstRun: function()
	{
		let rooms = Game.rooms;
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			if(!room.memory.initialized || room.memory.initialized == false)
			{
				let propertiesArray = Object.getOwnPropertyNames(room.memory);
				let propertiesCount = propertiesArray.length;
				for(let x=0; x<propertiesCount; x++)
				{
					delete room.memory[propertiesArray[x]];
				}
				room.memory.initialized = true;
			}
		}
	},

	initializeMemory: function()
	{
		let rooms = Game.rooms;
		for (let roomName in Game.rooms)
		{
			let room = Game.rooms[roomName];

			if(room)
			{
				if (!room.memory.DEFCON)
				{
					room.memory.DEFCON = 5;
				}

				if (!room.memory.ownership)
				{
					room.memory.ownership = false;
				}

				if (!room.memory.environment || !room.memory.environment.energySourcesArray)
				{
					room.memory.environment = {
						terrainMapArray: [],
						energySourcesArray: [],
						resourcesArray: []
					};
				}

				if (!room.memory.construction)
				{
					room.memory.construction = {
						extensionPlacement: {
							RightUp: {x: 0, y: 0},
							RightDown: {x: 0, y: 0},
							LeftUp: {x: 0, y: 0},
							LeftDown: {x: 0, y: 0}
						}
					};
				}

				if (!room.memory.jobs)
				{
					room.memory.jobs = {
						claimerJobBoard: {
							claimController: {},
							reserveController: {}
						},
						generalJobBoard: {
							supplyExtension: {},
							supplySpawn: {},
							supplyStorage: {},
							supplyTower: {}
						},
						workerJobBoard: {
							firstPriorityJobs: {
								buildStructure: {}
							},
							routineJobs: {
								repairStructure: {}
							}
						},
						haulerJobBoard: {
							collectDroppedEnergy: {},
							moveEnergyFromContainer: {},
							moveResourceFromLabToTerminal: {},
							supplyTerminalResource: {}
						},
						stationaryJobBoard: {
							mapArray: [],

							manageStorageAndTerminal: {},
							harvestEnergy: {},
							harvestResource: {}
						}
					};
					let stationaryJobSitesMapArray = new Array();
					for (let x = 0; x < 50; x++)
					{
						stationaryJobSitesMapArray[x] = new Array();
						for (let y = 0; y < 50; y++)
						{
							stationaryJobSitesMapArray[x][y] = 0;
						}
					}
					room.memory.jobs.stationaryJobBoard.mapArray = stationaryJobSitesMapArray;
				}

				//These need to be scanned each tick... so clear them out every tick
				room.memory.creeps = {
					remoteCreeps: {
						claimerCreepsArray: [],
						remoteBuildStructureCreepsArray: [],
						remoteUpgradeControllerCreepsArray: []
					},
					workerCreeps: {
						smallestWorkerCreepsArray: [],
						smallerWorkerCreepsArray: [],
						smallWorkerCreepsArray: [],
						bigWorkerCreepsArray: [],
						biggerWorkerCreepsArray: [],
						biggestWorkerCreepsArray: []
					},
					haulerCreeps: [],
					maintenanceCreeps: [],
					stationaryCreeps: [],
					infantryCreeps: []
				};

				room.memory.structures = {
					mapArray: [],

					spawnsArray: [],
					extensionsArray: [],
					extractorsArray: [],
					containersArray: [],
					storageArray: [],
					labsArray: [],
					linksArray: [],
					terminalsArray: [],
					towersArray: [],
					wallsArray: [],
					rampartsArray: []
				};

				room.memory.flags = {
					claimController: {},
					remoteBuildStructure: {},
					remoteUpgradeController: {},
					attack: {}
				};

				let structuresMapArray = new Array();
				for (let x = 0; x < 50; x++)
				{
					structuresMapArray[x] = new Array();
					for (let y = 0; y < 50; y++)
					{
						structuresMapArray[x][y] = 0;
					}
				}
				room.memory.structures.mapArray = structuresMapArray;
			}
		}
	}
};

module.exports = BrainController;