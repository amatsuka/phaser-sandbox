import Vector2 = Phaser.Math.Vector2;

export default class LevelTile {
    public vertexNum: number;
    public x: number;
    public y: number;
    public upBound: boolean = true;
    public downBound: boolean = true;
    public leftBound: boolean = true;
    public rightBound: boolean = true;

    public constructor(x: number, y: number, vertexNum: number) {
        this.vertexNum = vertexNum;
        this.x = x;
        this.y = y;
    }

    public openBound(direction: Vector2) {
        if (direction.y == -1) this.upBound = false;
        if (direction.y == 1) this.downBound = false;
        if (direction.x == -1) this.leftBound = false;
        if (direction.x == 1) this.rightBound = false;
    }

    public getPosition() {
        return new Vector2(this.x, this.y);
    }
}