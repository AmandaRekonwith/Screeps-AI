module.exports = function ()
{
    Creep.prototype.buildStructure = function ()
    {
        let structure = Game.getObjectById(this.memory.job.index);
        //it's possible that the structure could disappear if construction completes,
        // so check, and then set the current task and job to null if it's gone.
        if (structure)
        {
            let action = this.build(structure);

            if (action == ERR_NOT_IN_RANGE)
            {
                this.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if (this.carry[RESOURCE_ENERGY] == 0)
            {
                this.memory.job = null;
                this.memory.currentTask = null;
            }
        }
        else
        {
            if (this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[this.memory.job.index])
            {
                delete this.room.memory.jobs.workerJobBoard.firstPriorityJobs.buildStructure[this.memory.job.index];
            }

            this.memory.job = null;
            this.memory.currentTask = null;
        }
    }
}