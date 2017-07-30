module.exports = function ()
{
	Creep.prototype.runRemoteBuildStructure = function ()
	{
		let flag = Game.flags[this.memory.job.targetID];

		if (flag)
		{
			let creepPosition = this.pos;

			if (creepPosition != flag.pos)
			{
				let action = this.moveTo(flag.pos, {visualizePathStyle: {stroke: '#ffffff'}});

				let constructionSite = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, flag.pos);
				if (constructionSite)
				{
					let action = this.build(constructionSite[0]);
				}

				let structure = this.room.lookForAt(LOOK_STRUCTURES, flag.pos);
				if (structure)
				{
					let action2 = this.repair(structure[0]);
				}

				let controller = this.room.controller;
				if (controller)
				{
					let action3 = this.upgradeController(controller);
				}

				if(this.carry[RESOURCE_ENERGY] == 0)
				{
					this.memory.currentTask = "Getting Energy";
				}
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}