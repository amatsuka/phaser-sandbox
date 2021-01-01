import LevelTile from "./LevelTile";
import Vertex from "./Vertex";
import Vector2 = Phaser.Math.Vector2;

export default class Level {
    public tiles: Array<Array<LevelTile>>;
    public sizeX: number;
    public sizeY: number;
    public vertexNumList: number[] = [];

    public constructor(sizeX: number, sizeY: number) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.tiles = new Array<Array<LevelTile>>(this.sizeY);
        for (let y = 0; y < this.tiles.length; y++) {
            this.tiles[y] = new Array<LevelTile>(this.sizeX);

            for (let x = 0; x < this.tiles[y].length; x++) {
                this.tiles[y][x] = new LevelTile(x, y, y * this.sizeX + x);
                this.vertexNumList.push(this.tiles[y][x].vertexNum);
            }
        }
    }

    public inBound(path: Vector2): boolean {
        return path.x >= 0 && path.x < this.sizeX && path.y >= 0 && path.y < this.sizeY;
    }

    public getTile(pos: Vector2) {
        return this.tiles[pos.y][pos.x];
    }

    public getTileByNum(num: number) {
        let y = Math.floor(num / this.sizeX);
        let x = num % this.sizeX;

        return this.tiles[y][x];
    }

    public setPath(current: Vector2, path: Vector2) {
        let direction = path.clone().subtract(current);
        this.tiles[current.y][current.x].openBound(direction);

        let reversedDirection = direction.clone().scale(-1);
        if (this.inBound(path)) {
            this.tiles[path.y][path.x].openBound(reversedDirection);
        }
    }

    public getVertices(): Array<Vertex> {
        let vertices = new Array<Vertex>(this.sizeX * this.sizeY);

        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                let tile = this.tiles[y][x];
                let vertex = new Vertex(x, y, tile.vertexNum);

                if (!tile.upBound) {
                    let nv = new Vertex(x, y + 1, this.tiles[y - 1][x].vertexNum);
                    vertex.neighbors.push(nv);
                }

                if (!tile.downBound) {
                    let nv = new Vertex(x, y - 1, this.tiles[y + 1][x].vertexNum);
                    vertex.neighbors.push(nv);
                }

                if (!tile.leftBound) {
                    let nv = new Vertex(x - 1, y, this.tiles[y][x - 1].vertexNum);
                    vertex.neighbors.push(nv);
                }

                if (!tile.rightBound) {
                    let nv = new Vertex(x + 1, y, this.tiles[y][x + 1].vertexNum);
                    vertex.neighbors.push(nv);
                }

                vertices[tile.vertexNum] = vertex;
            }
        }

        return vertices;
    }
}