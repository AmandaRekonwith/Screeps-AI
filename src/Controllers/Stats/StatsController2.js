//stolen without permission from: https://raw.githubusercontent.com/Remz-Jay/empire-source/master/src/shared/statsManager.ts
//repackaged code into a class controller.. removed typing from typescript
let username;

let StatsController2 =
{
	gclCalc: function ()
	{
		let runTimeGCL = 10;
		if ((Game.time % runTimeGCL) === 0) {
			let timer = Game.time;
			let memName = "Estimates";
			if (Memory.stats[memName] === undefined) {
				Memory.stats[memName] = {
					nextGCLLevelTick: 0,
					currentGCLProgress: 0,
					lastGCLProgress: 0,
					estimatedTime: 0
				};
			} else {
				let GCLData = Memory.stats[memName];
				if (GCLData.currentGCLProgress === 0) {
					GCLData.currentGCLProgress = Game.gcl.progress;
					GCLData.currentTime = Date.now();
				} else {
					GCLData.lastGCLProgress = GCLData.currentGCLProgress;
					GCLData.lastTime = GCLData.currentTime;
					GCLData.currentGCLProgress = (Game.gcl.progress + GCLData.lastGCLProgress) / 2;
					GCLData.currentTime = Date.now();
					let progressPer1kTicks = Number(Game.time) + (Game.gcl.progressTotal - Game.gcl.progress) / ((GCLData.currentGCLProgress - GCLData.lastGCLProgress));
					GCLData.nextGCLLevelTick = progressPer1kTicks.toFixed(0);
					let seconds = 3;
					let milliseconds = 1000 * seconds;
					let CEST = 1000 * 60 * 60 * 2;
					let t = new Date();
					t.setTime(((Game.gcl.progressTotal - Game.gcl.progress) / (GCLData.currentGCLProgress - GCLData.lastGCLProgress) * runTimeGCL) * milliseconds);
					let options = {
						weekday: "long",
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						timeZone: "Europe/Amsterdam",
						timeZoneName: "short",
						hour12: false
					};
					GCLData.estimatedTime = (new Date(Date.now() + t.getTime() + CEST)).toLocaleString("nl", options);
				}
				Memory.stats[memName] = GCLData;
				console.log(`${Game.time} Estimated GCL leveling, Tick: ${GCLData.nextGCLLevelTick}, Date: ${GCLData.estimatedTime} Execution time: ${Game.time - timer}`);
				if ((Game.time % 50000) === 0) {
					Game.notify(`(${Game.time}): Estimated GCL leveling, Tick: ${GCLData.nextGCLLevelTick}, `
					+ `Date: ${GCLData.estimatedTime}\n Execution time: ${Game.time - timer}`);
				}
			}
		}
	},

	init: function ()
	{

		if (Memory.stats === undefined)
		{
			Memory.stats = {};
		}
		username = _.get(
			_.find(Game.structures, (s) => true), "owner.username",
			_.get(_.find(Game.creeps, (s) => true), "owner.username")
		) as string;
		this.clean();
	},

	clean: function ()
	{
		Memory.stats = {};
	},

	getStats: function (json)
	{
		if (json)
		{
			return JSON.stringify(Memory.stats);
		} else
		{
			return Memory.stats;
		}
	},

	addStat: function (key, value)
	{
		Memory.stats[key] = value;
	},

	flattenObject: function (ob)
	{
		const toReturn = {};

		for (const i in ob)
		{
			if (!ob.hasOwnProperty(i))
			{
				continue;
			}

			if ((typeof ob[i]) === "object")
			{
				const flatObject = this.flattenObject(ob[i]);
				for (const x in flatObject)
				{
					if (!flatObject.hasOwnProperty(x))
					{
						continue;
					}

					toReturn[i + "." + x] = flatObject[x];
				}
			}
			else
			{
				toReturn[i] = ob[i];
			}
		}
		return toReturn;
	},

	runBuiltinStats: function (runExpensive = false)
	{
		this.clean();
		const stats = {
			time: new Date().toISOString(),
			tick: Game.time,
			cpu: {
				limit: Game.cpu.limit,
				tickLimit: Game.cpu.tickLimit,
				bucket: Game.cpu.bucket
			},
			gcl: {
				level: Game.gcl.level,
				progress: Game.gcl.progress,
				progressTotal: Game.gcl.progressTotal
			},
			rooms: undefined,
			reservedRoom: undefined,
			terminal: undefined,
			spawns: undefined,
			room: undefined,
			sources: undefined,
			minerals: undefined
		};

		_.defaults(stats, {
			rooms: {},
			reservedRoom: {}
		});

		_.forEach(Game.rooms, (room) =>
		{

			if (_.isEmpty(room.controller))
			{
				return;
			}
			const controller = room.controller;

			// Is hostile room? Continue
			if (!controller.my && !!controller.reservation && controller.reservation.username === this.username)
			{
				// Reserved room
				if (!stats.rooms[room.name])
				{
					stats.rooms[room.name] = {};
				}
				_.merge(stats.rooms[room.name], {
					myRoom: 0,
					level: controller.level,
					reservation: _.get(controller, "reservation.ticksToEnd"),
					energy: 0,
					energyCapacity: 0,
					mineralAmount: 0,
					mineralType: ""
				});
				if (runExpensive)
				{
					this.roomExpensive(stats, room);
				}
			} else
			{
				// this is my room. Put it in rooms.
				if (!stats.rooms[room.name])
				{
					stats.rooms[room.name] = {};
				}
				// Controller
				_.merge(stats.rooms[room.name], {
					myRoom: 1,
					level: controller.level,
					controllerProgress: controller.progress,
					controllerProgressTotal: room.controller.progressTotal,
					upgradeBlocked: controller.upgradeBlocked,
					ticksToDowngrade: controller.ticksToDowngrade,
					energy: 0,
					storedEnergy: 0,
					energyCapacity: 0,
					mineralAmount: 0,
					mineralType: ""
				});

				if (controller.level > 0)
				{

					// Room
					_.merge(stats.rooms[room.name], {
						energyAvailable: room.energyAvailable,
						energyCapacityAvailable: room.energyCapacityAvailable
					});

					// Storage
					if (room.storage)
					{
						_.defaults(stats.rooms[room.name], {
							storage: {}
						});
						stats.rooms[room.name].storage = {
							store: _.sum(room.storage.store),
							resources: {},
							id: room.storage.id
						};
						for (const resourceType in room.storage.store)
						{
							if (room.storage.store.hasOwnProperty(resourceType))
							{
								stats.rooms[room.name].storage.resources[resourceType] = room.storage.store[resourceType];
								stats.rooms[room.name].storage[resourceType] = room.storage.store[resourceType];
								if (resourceType === RESOURCE_ENERGY)
								{
									stats.rooms[room.name].storedEnergy = stats.rooms[room.name].storedEnergy + room.storage.store[resourceType];
								}
							}
						}
					}

					// Terminals
					if (room.terminal)
					{
						_.defaults(stats, {
							terminal: {}
						});
						stats.terminal[room.terminal.id] = {
							room: room.name,
							store: _.sum(room.terminal.store),
							resources: {}
						};
						for (const resourceType in room.terminal.store)
						{
							if (room.terminal.store.hasOwnProperty(resourceType))
							{
								stats.terminal[room.terminal.id].resources[resourceType] = room.terminal.store[resourceType];
								stats.terminal[room.terminal.id][resourceType] = room.terminal.store[resourceType];
							}
						}
					}
				}
				if (runExpensive)
				{
					this.roomExpensive(stats, room);
				}
			}
		});

		// Spawns
		_.defaults(stats, {
			spawns: {}
		});
		_.forEach(Game.spawns, function (spawn)
		{
			stats.spawns[spawn.name] = {
				room: spawn.room.name,
				busy: !!spawn.spawning,
				remainingTime: _.get(spawn, "spawning.remainingTime", 0)
			};
		});
		stats.room = stats.rooms;
		delete stats.rooms;
		for (const key in stats.room)
		{
			if (!stats.room.hasOwnProperty(key))
			{
				continue;
			}
			const r = stats.room[key];
			if (r.myRoom === 0)
			{
				if (!stats.reservedRoom[key])
				{
					stats.reservedRoom[key] = {};
				}
				stats.reservedRoom[key] = r;
				delete stats.room[key];
			}
		}
		Memory.stats = this.flattenObject(stats);
	},

	roomExpensive: function (stats, room)
	{
		// Source Mining
		_.defaults(stats, {
			sources: {},
			minerals: {}
		});

		stats.rooms[room.name].sources = {};
		const sources = room.sources;

		_.forEach(sources, (source) =>
		{
			stats.sources[source.id] = {
				room: room.name,
				energy: source.energy,
				energyCapacity: source.energyCapacity,
				ticksToRegeneration: source.ticksToRegeneration
			};
			if (source.energy < source.energyCapacity && source.ticksToRegeneration)
			{
				const energyHarvested = source.energyCapacity - source.energy;
				if (source.ticksToRegeneration < ENERGY_REGEN_TIME)
				{
					const ticksHarvested = ENERGY_REGEN_TIME - source.ticksToRegeneration;
					stats.sources[source.id].averageHarvest = energyHarvested / ticksHarvested;
				}
			} else
			{
				stats.sources[source.id].averageHarvest = 0;
			}
			stats.rooms[room.name].energy = stats.rooms[room.name].energy + source.energy;
			stats.rooms[room.name].energyCapacity = stats.rooms[room.name].energyCapacity + source.energyCapacity;
		});

		// Mineral Mining
		const minerals = room.minerals;
		stats.rooms[room.name].minerals = {};
		_.forEach(minerals, (mineral) =>
		{
			stats.minerals[mineral.id] = {
				room: room.name,
				mineralType: mineral.mineralType,
				mineralAmount: mineral.mineralAmount,
				ticksToRegeneration: mineral.ticksToRegeneration
			};
			stats.rooms[room.name].mineralAmount = stats.rooms[room.name].mineralAmount + mineral.mineralAmount;
			stats.rooms[room.name].mineralType = stats.rooms[room.name].mineralType + mineral.mineralType;
		});

		// Hostiles in Room
		const hostiles = room.hostileCreeps;
		stats.rooms[room.name].hostiles = {};
		_.forEach(hostiles, (hostile) =>
		{
			if (!stats.rooms[room.name].hostiles[hostile.owner.username])
			{
				stats.rooms[room.name].hostiles[hostile.owner.username] = 1;
			} else
			{
				stats.rooms[room.name].hostiles[hostile.owner.username] = stats.rooms[room.name].hostiles[hostile.owner.username] + 1;
			}
		});

		// My Creeps
		stats.rooms[room.name].creeps = room.myCreeps.length;
	}
}