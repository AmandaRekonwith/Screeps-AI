var LinksController =
{
	run: function (room)
	{
		let linksArray = room.memory.structures.linksArray;

		let harvesterLinksArray = new Array();
		let storageLink = null;

		let linksCount = linksArray.length;
		for(let x=0; x<linksCount; x++)
		{
			let link = linksArray[x];

			let linkXPosition = link.pos.x;
			let linkYPosition = link.pos.y;

			let structuresArray = room.lookForAtArea(LOOK_STRUCTURES, linkYPosition - 1, linkXPosition - 1, linkYPosition + 1, linkXPosition + 1, true);

			let structuresCount = structuresArray.length;

			let containerFound = false;
			for(let y=0; y<structuresCount; y++)
			{
				let structureObject = structuresArray[y];
				if(structureObject.structure.structureType == "container")
				{
					harvesterLinksArray.push(link);
					containerFound = true;
				}
			}

			if(containerFound == false)
			{
				storageLink = link;
			}
		}

		let harvesterLinksCount = harvesterLinksArray.length;
		for(let z=0; z<harvesterLinksCount; z++)
		{
			let harvesterLink = harvesterLinksArray[z];

			if(harvesterLink.energy > 0)
			{
				harvesterLink.transferEnergy(storageLink);
			}
		}
	}
}

module.exports = LinksController;