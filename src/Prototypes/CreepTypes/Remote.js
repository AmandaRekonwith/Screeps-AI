module.exports = function ()
{
	Creep.prototype.getEnergy = function ()
	{
		let energySource = null;
		let action = null;
		if(this.room.storage)
		{
			energySource = this.room.storage;

			action = this.withdraw(this.room.storage, RESOURCE_ENERGY);
		}
		else
		{
			energySource = this.pos.findClosestByRange(FIND_SOURCES);
			action = this.harvest(energySource);
		}

		if (action == ERR_NOT_IN_RANGE)
		{
			let secondAction = this.moveTo(energySource, {visualizePathStyle: {stroke: '#ffffff'}});
		}

		if(this.carry[RESOURCE_ENERGY] == this.carryCapacity)
		{
			this.memory.currentTask = "Working";
		}
		else
		{
			this.memory.currentTask = "Getting Energy";
		}
	}

	Creep.prototype.getRemoteJob = function ()
	{
		let job = null;
		let room = this.room;

		if(this.memory.type == "claimer")
		{
			for (let flagName in room.memory.flags.claimController)
			{
				job = {
					targetID: flagName,
					type: "claimController"
				};
			}
		}

		if(this.memory.type == "remoteBuildStructure")
		{
			for (let flagName in room.memory.flags.remoteBuildStructure)
			{
				job = {
					targetID: flagName,
					type: "remoteBuildStructure"
				};
			}
		}

		if(this.memory.type == "remoteUpgradeController")
		{
			for (let flagName in room.memory.flags.remoteUpgradeController)
			{
				job = {
					targetID: flagName,
					type: "remoteUpgradeController"
				};
			}
		}

		return job;
	}

	Creep.prototype.runRemote = function ()
	{
		if(this.memory.currentTask == null || this.memory.currentTask == "Getting Energy")
		{
			this.getEnergy();
		}

		if(this.memory.currentTask == "Working")
		{
			this.memory.job = this.getRemoteJob();
			switch (this.memory.job.type)
			{
				case 'claimController':
					this.runClaimController();
					break;
				case 'remoteBuildStructure':
					this.runRemoteBuildStructure();
					break;
				case 'remoteUpgradeController':
					this.runRemoteUpgradeController();
					break;
			}
		}
	}
}