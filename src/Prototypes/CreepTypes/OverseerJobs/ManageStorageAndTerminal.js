module.exports = function ()
{
	/* The logic of the following code can be summarized in laymen's terms as follows...

	Go to the job site.

	Move energy
		IF link has energy, prioritize that first. Move fuel out of link.
		If no energy in link, grab a bunch of energy out of storage.

	Then Determine what job to do.
		If, the storage tank contains more than 10000 energy do a randomized list of jobs
			These jobs include:
			Making sure all turrets are charged. This is PRIORITIZED FIRST.
			then, a random set of jobs, including.
			- building construction sites around the job site
			- /* not implemented yet * repairing buildings around job site
			- upgrading controller *note* because of the way this is programmed, this will be for one tick only.*

			- ensuring the terminal has at least 10000 energy
			- if it does, then possibly reinsert energy into storage

		If, the storage tank does not contain more than 10000 energy,
			just fill the storage tank
	*/


	Creep.prototype.runOverseerManageStorageAndTerminal = function ()
	{
		let room = this.room;
		let storage = room.storage;
		let storageID = storage.id
		let job = room.memory.jobs.overseerJobBoard.manageStorageAndTerminal[storageID];
		let jobSitePosition = job.pos;
		let controllerID = job.targetID;
		let controller = Game.getObjectById(controllerID);
		let currentTask = this.memory.currentTask;

		room.memory.jobs.overseerJobBoard.manageStorageAndTerminal[storageID].creepID = this.id;
		room.memory.jobs.overseerJobBoard.manageStorageAndTerminal[storageID].active = true;

		if ((this.pos.x != jobSitePosition.x) || (this.pos.y != jobSitePosition.y))
		{
			this.moveTo(jobSitePosition.x, jobSitePosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			if(this.carry.energy == this.carryCapacity){ this.memory.currentTask = "Working";}
			if (this.carry.energy == 0){ this.memory.currentTask = "Harvesting";}

			let link = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
			{filter: {structureType: STRUCTURE_LINK}})[0];
			//AT JOB SITE

			if(this.memory.currentTask == "Harvesting")
			{
				if(link && link.energy > 0)
				{
					this.withdraw(link, RESOURCE_ENERGY);
				}
				else
				{
					if(this.room.storage.store[RESOURCE_ENERGY] > 10000)
					{
						this.withdraw(this.room.storage, RESOURCE_ENERGY);
					}
				}
			}

			if(this.memory.currentTask == "Working")
			{
				let jobType = null;
				let jobTarget = null;
				//FIGURE OUT WHAT JOB TO DO FIRST
				if(this.room.storage.store[RESOURCE_ENERGY] > 990000)
				{
					if(this.room.terminal)
					{
						jobTarget = this.room.terminal;
						jobType = "supplyStructure";
					}
				}
				else
				{

					if(this.room.storage.store[RESOURCE_ENERGY] > 10000)
					{
						let structuresInRange = this.room.lookForAtArea(LOOK_STRUCTURES, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
						let structuresInRangeCount = structuresInRange.length;
						let towerToSupply = null;
						if(structuresInRangeCount > 0)
						{
							for(let x=0; x<structuresInRangeCount; x++)
							{
								let structure = structuresInRange[x].structure;
								if(structure.structureType == "tower" && structure.energy < structure.energyCapacity - 150)
								{
									towerToSupply = structure;
								}
							}
						}
						if(towerToSupply != null)
						{
							jobTarget = towerToSupply;
							jobType = "supplyStructure";
						}
						else
						{
							if(link && link.energy > 0)
							{
								jobTarget = this.room.storage;
								jobType = "supplyStructure";
							}
							else
							{
								let spawn = Game.spawns[this.room.controller.id];

								let jobFound = false;

								if(spawn)
								{
									if(spawn.energy < spawn.energyCapacity)
									{
										jobTarget = spawn;
										jobType = "supplyStructure";
										jobFound = true;
									}
									if(this.ticksToLive < 1400)
				        			{
				        				spawn.renewCreep(this);
				        			}
								}

								if(jobFound == false)
								{

									let manageStorageAndTerminalJobsArray = [];

									let upgradeJob = {
										target: this.room.controller,
										type: "upgradeController"
									};
									manageStorageAndTerminalJobsArray.push(upgradeJob);


									if(this.room.storage && room.storage.store[RESOURCE_ENERGY] < 500000 )
									{
										let storageJob = {
											target: this.room.storage,
											type: "supplyStructure"
										};	
										manageStorageAndTerminalJobsArray.push(storageJob);
									}


									let jobRandomizer = Math.floor((Math.random() * manageStorageAndTerminalJobsArray.length));

									let randomJob = manageStorageAndTerminalJobsArray[jobRandomizer];

									jobType = randomJob.type;
									jobTarget = randomJob.target;
								}
							}
						}
					}
					else
					{
						if(this.room.storage)
						{
							jobType = "supplyStructure";
							jobTarget = this.room.storage;
						}
					}
				}//storage greater than 950000 energy

				//now do JOB
				let action = null;

				switch (jobType) {
				    case "supplyStructure":
				        action = this.transfer(jobTarget, RESOURCE_ENERGY);
						break;
					case "build":
						action = this.build(jobTarget);
						break;
					case "upgradeController":
						action = this.upgradeController(jobTarget);
						break;
				}
			}
		}//job site
	}
}