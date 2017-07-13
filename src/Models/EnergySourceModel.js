class EnergySource {
	constructor()
	{


	}
}
let numberOfEnergySources = energySourcesArray.length;
for (let x = 0; x < numberOfEnergySources; x++)
{
	let xPosition = energySourcesArray[x].pos.x;
	let yPosition = energySourcesArray[x].pos.y;

	energySourcesArray[x].linkNearby = false;

	//checks that adjacent tiles are not walls and counts how many there are
	//counts both tiles that are swamp or plains by negating walls (3)
	//...
	//uses simple if statements to count...
	//checks top 3 tiles first, middle 2 second, bottom 3 last
	//... A drawing, as if it wasn't obvious enough what I'm doing ...
	//
	//    [][][]
	//    []  []
	//    [][][]

	let numberOfAdjacentOpenTerrainTiles = 0;

	if (room.memory.terrainArray[xPosition - 1][yPosition - 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition][yPosition - 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition + 1][yPosition - 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition - 1][yPosition] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition + 1][yPosition] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition - 1][yPosition + 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition][yPosition + 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
	if (room.memory.terrainArray[xPosition + 1][yPosition + 1] != 3)
	{
		numberOfAdjacentOpenTerrainTiles += 1;
	}
}

room.memory.energySourcesArray = energySourcesArray;