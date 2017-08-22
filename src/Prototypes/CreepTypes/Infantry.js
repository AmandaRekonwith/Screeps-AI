module.exports = function ()
{
	Creep.prototype.runInfantry = function ()
	{
		let attackFlags =  this.room.memory.flags.attack;
		let attackFlagsCount = 0;
		let flag = null;

		for(let flagName in attackFlags)
		{
			flag = Game.flags[flagName];
			attackFlagsCount += 1;
		}

		if(this.pos.y == 0 || this.pos.y == 1)
		{
			this.moveTo(this.pos.x, 2);
		}

		if(attackFlagsCount > 0)
		{
			console.log(flag);
			let target = this.room.lookForAt(LOOK_STRUCTURES, flag.pos.x, flag.pos.y);
			if(target.length == 0)
			{
				let target = this.room.lookForAt(LOOK_CREEPS, flag.pos.x, flag.pos.y);
			}

			if(target[0])
			{
				let action = this.attack(target[0])

				if(action == ERR_NOT_IN_RANGE)
				{
					this.moveTo(target[0]);
				}
			}
			else
			{
				let action = this.moveTo(flag);
				if (action == ERR_NO_PATH)
				{
					let target = this.pos.findClosestByRange(FIND_STRUCTURES);

					console.log(target);
					if (target)
					{
						if (this.attack(target) == ERR_NOT_IN_RANGE)
						{
							this.moveTo(target);
						}
					}
				}
			}
		}
		else
		{
			if(this.hits < this.maxHits)
			{
				this.heal(this);
			}
			else
			{

				let structures = this.room.find(FIND_STRUCTURES);

				let structuresCount = structures.length;

				console.log(structuresCount);

				if(structuresCount > 1)
				{
					let spawn = null;
					let tower = null;
					let extension = null;

					for (let x=0; x<structuresCount; x++)
					{
						if (structures[x].structureType == "extension"){ extension = structures[x];	}
						if (structures[x].structureType == "tower"){ tower = structures[x]; }
						if (structures[x].structureType == "spawn"){ spawn = structures[x]; }
					}

					if(tower != null)
					{
						let action = this.attack(tower);
						if (action == ERR_NOT_IN_RANGE)
						{
							this.moveTo(tower);
						}
					}
					else
					{
						if (spawn != null)
						{
							let action = this.attack(spawn);
							if (action == ERR_NOT_IN_RANGE)
							{
								this.moveTo(spawn);
							}
						}
						else
						{
							if(extension != null)
							{
								let action = this.attack(extension);
								if (action == ERR_NOT_IN_RANGE)
								{
									this.moveTo(extension);
								}
							}
						}
					}


				}
				else
				{
					let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

					console.log(target);
					if(target) {
						if(this.attack(target) == ERR_NOT_IN_RANGE) {
							this.moveTo(target);
						}
					}
				}
			}
		}
	}
}


