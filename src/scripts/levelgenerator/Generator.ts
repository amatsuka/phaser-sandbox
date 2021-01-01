import Level from "./Level";
import Vector2 = Phaser.Math.Vector2;
import {version} from "webpack";
import LevelTile from "./LevelTile";

export default class Generator {
    public binaryTree(sizeX: number, sizeY: number): Level {
        let level: Level = new Level(sizeX, sizeY);
        let maxIndexX: number = sizeX - 1;
        let maxIndexY: number = sizeY - 1;

        let directions: Vector2[] = [Vector2.UP, Vector2.RIGHT];

        for (let y = 0; y <= maxIndexY; y++) {
            for (let x = 0; x <= maxIndexX; x++) {
                let current = new Vector2(x, y);
                let direction = directions[Math.round(Math.random())];
                let anotherDirection = directions[1 - directions.indexOf(direction)];
                let path = current.clone().add(direction);
                let anotherPath = current.clone().add(anotherDirection);

                if (level.inBound(path)) {
                    level.setPath(current, path.clone());
                } else if (level.inBound(anotherPath)) {
                    level.setPath(current, anotherPath.clone());
                }
            }
        }

        return level;
    }

    public sidewinder(sizeX: number, sizeY: number): Level {
        let level: Level = new Level(sizeX, sizeY);
        let maxIndexX: number = sizeX - 1;
        let maxIndexY: number = sizeY - 1;

        let startOfSet = 0;

        for (let y = 0; y <= maxIndexY; y++) {
            for (let x = 0; x <= maxIndexX; x++) {
                if (y == 0) {
                    if (x != maxIndexX) {
                        level.setPath(new Vector2(x, y), new Vector2(x + 1, y));
                    }
                    continue;
                }

                if (this.random(0, 1) == 1 && x != maxIndexX) {
                    level.setPath(new Vector2(x, y), new Vector2(x + 1, y));
                } else {
                    let randX = this.random(startOfSet, x);
                    level.setPath(new Vector2(randX, y), new Vector2(randX, y - 1));

                    if (x != maxIndexX) {
                        startOfSet = x + 1;
                    } else {
                        startOfSet = 0;
                    }
                }
            }
        }

        return level;
    }

    public aldousBorder(sizeX: number, sizeY: number): Level {
        let level: Level = new Level(sizeX, sizeY);
        let maxIndexX: number = sizeX - 1;
        let maxIndexY: number = sizeY - 1;

        let visited: number[] = [];
        let path: Vector2[] = [];

        let directions: Vector2[] = [Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT];

        let current = new Vector2(this.random(0, maxIndexX), this.random(0, maxIndexY));
        visited.push(level.getTile(current).vertexNum);
        path.push(current);

        while (visited.length < sizeX * sizeY) {
            let randomDirection = directions[this.random(0, 3)].clone();

            let neighbour = current.clone().add(randomDirection);
            if (level.inBound(neighbour)) {
                if (visited.indexOf(level.getTile(neighbour).vertexNum) == -1) {
                    level.setPath(current, neighbour);
                    visited.push(level.getTile(neighbour).vertexNum);
                }

                current = neighbour.clone();
                path.push(current);
            }
        }
        return level;

    }

    public wilson(sizeX: number, sizeY: number): Level {
        let level: Level = new Level(sizeX, sizeY);
        let maxIndexX: number = sizeX - 1;
        let maxIndexY: number = sizeY - 1;
        let directions: Vector2[] = [Vector2.UP, Vector2.DOWN, Vector2.LEFT, Vector2.RIGHT];

        let visited: number[] = [level.getTile(new Vector2(0, 0)).vertexNum];

        let randomTile = this.randomTileExclude(level.vertexNumList, visited);

        if (randomTile == null) {
            return level;
        }

        let current: LevelTile = level.getTileByNum(randomTile);
        let currentPath: number[] = [];

        while (visited.length < sizeX * sizeY) {

            let randomDirection = directions[this.random(0, 3)].clone();

            let neighbor = current.getPosition().add(randomDirection);

            if (!level.inBound(neighbor)) {
                continue;
            }

            currentPath.push(current.vertexNum);

            if (visited.indexOf(level.getTile(neighbor).vertexNum) >= 0) {
                //добавляем к лабиринту
                for (let i = 0; i < currentPath.length - 1; i++) {
                    let from = level.getTileByNum(currentPath[i]);
                    let to = level.getTileByNum(currentPath[i + 1]);

                    level.setPath(from.getPosition(), to.getPosition());
                    visited.push(from.vertexNum);
                }

                //добавляем к лабиринту связь между последним элементом пути и текщим соседом
                {
                    let from = level.getTileByNum(currentPath[currentPath.length - 1]);
                    let to = level.getTile(neighbor);
                    level.setPath(from.getPosition(), to.getPosition());
                    visited.push(from.vertexNum);
                }

                currentPath = [];

                let randomTile = this.randomTileExclude(level.vertexNumList, visited);
                if (randomTile == null) {
                    break;
                }

                current = level.getTileByNum(randomTile);
                continue;
            }

            let i = currentPath.indexOf(level.getTile(neighbor).vertexNum);
            if (i >= 0) {
                //откатываем цикл. Удаляем так-же вершину в которую уперлись. Она добавится в начале цикла
                currentPath = currentPath.slice(0, i);
            }

            current = level.getTile(neighbor);
        }

        return level;

    }

    private random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public randomTileExclude(vertices: number[], visited: number[]): number | null {
        let filteredNums = vertices.filter(num => {
            return visited.indexOf(num) == -1;
        });

        let index = this.random(0, filteredNums.length - 1);
        return filteredNums[index] ? filteredNums[index] : null;
    }
}