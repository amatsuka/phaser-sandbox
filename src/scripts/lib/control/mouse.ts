import Vector2 = Phaser.Math.Vector2;

export default class Mouse {
    private position: number[] = [0, 0];
    private down: boolean;

    public getPosition(): Vector2 {
        return new Vector2(this.position[0], this.position[1]);
    }

    public update(x: number, y: number, isDown: boolean) {
        this.down = isDown;
        this.position = [x, y];
    }

    public isDown(): boolean {
        return this.down;
    }
}
