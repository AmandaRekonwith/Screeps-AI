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
			if(this.carry.energy < this.carryCapacity &&
				(this.memory.currentTask == "WalkingToJobSite"
				|| this.memory.currentTask == "Harvesting"))
			{
				this.memory.currentTask = "Harvesting";

				if(storage.store[RESOURCE_ENERGY] == 0 || this.carry.energy == this.carryCapacity)
				{
					this.memory.currentTask = "Working";
				}
				else
				{
					this.withdraw(storage, RESOURCE_ENERGY);
				}
			}
			else
			{
				this.memory.currentTask = "Working";

				let manageStorageAndTerminalJobsArray = new Array();

				let checkForTerminalConstructionSiteArray = this.room.lookForAtArea(LOOK_CONSTRUCTION_SITES,this.pos.y-1,this.pos.x-1,this.pos.y+1,this.pos.x+1, true);
				if(checkForTerminalConstructionSiteArray.length > 0)
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

				if (this.carry.energy == 0)
				{
					this.memory.currentTask = "Harvesting";
				}
			}
		}
	}
}