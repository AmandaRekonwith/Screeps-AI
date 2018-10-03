module.exports = function ()
{
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
			if(this.carry.energy < this.carryCapacity &&
				(this.memory.currentTask == "WalkingToJobSite"
				|| this.memory.currentTask == "Harvesting"))
			{
				let link = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
				{filter: {structureType: STRUCTURE_LINK}})[0];

				if(link.energy > 0)
				{
					this.withdraw(link, RESOURCE_ENERGY);
				}
				else
				{
					if(this.room.storage.store[RESOURCE_ENERGY] > 5000)
					{
						this.withdraw(this.room.storage, RESOURCE_ENERGY);
					}
				}
			}

			if(this.memory.currentTask == "Working")
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

				//these take priority over normal upgrading of controller, building, or withdrawing energy from link
				if(towerToSupply != null)
				{
					let action = this.transfer(towerToSupply, RESOURCE_ENERGY);
				}
				else
				{
					if(this.room.memory.structures.terminalsArray.length > 0 && this.room.terminal.store[RESOURCE_ENERGY] < 20000)
					{
						let terminal = this.room.memory.structures.terminalsArray[0];
						let action = this.transfer(terminal, RESOURCE_ENERGY);
					}
					else
					{
						if(this.room.storage)
						{
							if(_.sum(this.room.storage.store) < this.room.storage.storeCapacity)
							{
								let action = this.transfer(storage, RESOURCE_ENERGY);
							}
						}
						else
						{
							let manageStorageAndTerminalJobsArray = new Array();

							let checkForTerminalConstructionSiteArray = this.room.lookForAtArea(LOOK_CONSTRUCTION_SITES, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
							if (checkForTerminalConstructionSiteArray.length > 0)
							{
								let constructionSite = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, checkForTerminalConstructionSiteArray[0].x, checkForTerminalConstructionSiteArray[0].y);
								let job = {
									targetID: constructionSite[0].id,
									type: "build"
								};
								manageStorageAndTerminalJobsArray.push(job);
							}

							let job = {
								targetID: this.room.controller.id,
								type: "upgradeController"
							};
							manageStorageAndTerminalJobsArray.push(job);

							let jobRandomizer = Math.floor((Math.random() * manageStorageAndTerminalJobsArray.length));
							let manageStorageAndTerminalJob = manageStorageAndTerminalJobsArray[jobRandomizer];

							switch (manageStorageAndTerminalJob.type)
							{
								case 'build':
									this.build(Game.getObjectById(manageStorageAndTerminalJob.targetID));
									break;
								case 'upgradeController':
									this.upgradeController(Game.getObjectById(manageStorageAndTerminalJob.targetID));
									break;
								default:
							}
						}
					}
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