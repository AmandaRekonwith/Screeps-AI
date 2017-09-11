module.exports = function ()
{
	Creep.prototype.getRemoteEnergy = function ()
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
			if (this.memory.energySource == null)
			{
				let energySources = this.room.find(FIND_SOURCES);
				if(energySources.length > 0)
				{
					let randomSource = Math.floor(Math.random() * energySources.length);
					this.memory.energySource = energySources[randomSource].id;
				}
			}
			else
			{
				energySource = Game.getObjectById(this.memory.energySource);
				action = this.harvest(energySource);
			}
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
			let flagsCount = 0;

			for (let flagName in room.memory.flags.remoteBuildStructure)
			{
				flagsCount += 1;
				job = {
					targetID: flagName,
					type: "remoteBuildStructure"
				};
			}

			if(flagsCount == 0)
			{
				if(this.memory.job == null || !Game.getObjectById(this.memory.job.targetID))
				{
					let possibleConstructionSite = this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
					if (possibleConstructionSite != null && possibleConstructionSite.room.roomName == this.room.roomName)
					{
						job = {
							targetID: possibleConstructionSite.id,
							type: "remoteBuildStructure"
						};
					}
					else
					{
						let damagedStructures = this.room.find(FIND_STRUCTURES,
							{
								filter: function (object)
								{
									return ( object.hits < object.hitsMax );
								}
							});

						let damagedStructuresCount = damagedStructures > 0;

						let structureRandomizer = Math.floor((Math.random() * damagedStructuresCount));

						job = {
							targetID: damagedStructures[structureRandomizer].id,
							type: "remoteBuildStructure"
						};
					}
				}
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
			this.getRemoteEnergy();
		}

		if(this.memory.currentTask == "Working")
		{
			/*if(this.carry[RESOURCE_ENERGY] == 0)
			{
				this.suicide();
			}
			*/

			this.memory.job = this.getRemoteJob();

			if(this.memory.job != null)
			{
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
}