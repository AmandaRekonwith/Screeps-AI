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


	Creep.prototype.runManageStorageAndTerminal = function ()
	{
		let room = this.room;
		let storage = room.memory.structures.storageArray[0];
		let storageID = storage.id
		let job = room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID];
		let jobSitePosition = job.pos;
		let controllerID = job.targetID;
		let controller = Game.getObjectById(controllerID);
		let currentTask = this.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID].creepID = this.id;
		room.memory.jobs.stationaryJobBoard.manageStorageAndTerminal[storageID].active = true;

		if ((this.pos.x != jobSitePosition.x) || (this.pos.y != jobSitePosition.y))
		{
			this.moveTo(jobSitePosition.x, jobSitePosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			//AT JOB SITE
			if(this.memory.currentTask == "Harvesting")
			{
				let link = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
				{filter: {structureType: STRUCTURE_LINK}})[0];

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
						jobType = "supplyTower";
						jobTarget = towerToSupply;
					}
					else
					{
						let manageStorageAndTerminalJobsArray = new Array();

						let checkForConstructionSiteArray = this.room.lookForAtArea(LOOK_CONSTRUCTION_SITES, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
						if (checkForConstructionSiteArray.length > 0)
						{
							let constructionSite = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, checkForConstructionSiteArray[0].x, checkForConstructionSiteArray[0].y);
							let constructionJob = {
								target: constructionSite[0],
								type: "build"
							};
							manageStorageAndTerminalJobsArray.push(constructionJob);
						}

						let upgradeJob = {
							target: this.room.controller,
							type: "upgradeController"
						};
						manageStorageAndTerminalJobsArray.push(upgradeJob);


						if(this.room.terminal && this.room.terminal.store[RESOURCE_ENERGY] < 10000 && _.sum(this.room.terminal.store) <= 299000)
						{
							let storageJob = {
								target: this.room.terminal,
								type: "supplyTerminal"
							};	
							manageStorageAndTerminalJobsArray.push(storageJob);
						}
						else
						{
							if(this.room.storage && room.storage.store[RESOURCE_ENERGY] < 500000 )
							{
								let storageJob = {
									target: this.room.storage,
									type: "storeEnergy"
								};	
								manageStorageAndTerminalJobsArray.push(storageJob);
							}
						}


						let jobRandomizer = Math.floor((Math.random() * manageStorageAndTerminalJobsArray.length));

						let randomJob = manageStorageAndTerminalJobsArray[jobRandomizer];



						jobType = randomJob.type;
						jobTarget = randomJob.target;
					}




				}
				else
				{
					if(this.room.storage)
					{
						if(_.sum(this.room.storage.store) < this.room.storage.storeCapacity)
						{
							jobType = "storeEnergy";
							jobTarget = this.room.storage;
						}
					}
				}

				//now do JOB

				let action = null;

				switch (jobType) {
				    case "supplyTower":
				        action = this.transfer(jobTarget, RESOURCE_ENERGY);
				        break; 
				    case "supplyTerminal":
				        action = this.transfer(jobTarget, RESOURCE_ENERGY);
				        break; 
				    case "storeEnergy":
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

			if(this.carry.energy == this.carryCapacity)
			{
				this.memory.currentTask = "Working";
			}

			if (this.carry.energy == 0)
			{
				this.memory.currentTask = "Harvesting";
			}
		}//job site
	}
}