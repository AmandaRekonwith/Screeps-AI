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
					let target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
					let action = this.build(target);
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