module.exports = function ()
{
	Creep.prototype.supplyExtension = function ()
	{
		let extension = Game.getObjectById(this.memory.job.targetID);

		if (extension)
		{
			let action = this.transfer(extension, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				let action2 = null;

				let structuresInRange = this.room.lookForAtArea(LOOK_STRUCTURES, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
				let structuresInRangeCount = structuresInRange.length;
				if(structuresInRangeCount > 0)
				{
					for(let x=0; x<structuresInRangeCount; x++)
					{
						let structure = structuresInRange[x].structure;
						if(structure.structureType == "extension" && structure.energy < structure.energyCapacity)
						{
							action2 = this.transfer(structure, RESOURCE_ENERGY);
						}
					}
				}

				if(action2 == null)
				{
					this.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}

			if (extension.energy == extension.energyCapacity) // job complete
			{
				this.room.memory.jobs.generalJobBoard.supplyExtension[extension.id].creep = null;
				this.room.memory.jobs.generalJobBoard.supplyExtension[extension.id].active = false;

				this.memory.job = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
			{
				this.room.memory.jobs.generalJobBoard.supplyExtension[extension.id].creep = null;

				this.memory.job = null;
				this.memory.currentTask = null;
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}