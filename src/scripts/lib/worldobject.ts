import GameObject = Phaser.GameObjects.GameObject;
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Matter.Sprite;

export default class WorldObject {
    get freezed(): boolean {
        return this._freezed;
    }

    set freezed(value: boolean) {
        this._freezed = value;
    }

    protected components: any;

    private worldObject: Sprite;
    protected speed: number = 1;
    private _freezed: boolean = false;
    protected id: number = 0;

    public constructor(id: number, worldObject: Sprite, components: any = {}) {
        this.id = id;
        this.components = components;
        this.worldObject = worldObject;
    }

    public getWorldObject(): Sprite {
        return this.worldObject;
    };

    public setPosition(position: Vector2) {
        this.getWorldObject().setPosition(position.x, position.y);
    };

    public getPosition(): Phaser.Math.Vector2 {
        return new Vector2(this.getWorldObject().x, this.getWorldObject().y);
    };

    public getAngle(): number {
       return this.getWorldObject().angle;
    };

    public setAngle(angle: number): void {
        this.getWorldObject().setAngle(angle);
    }

    public moveUp () {
        this.move(Vector2.UP, this.speed);
    };

    public moveDown() {
        this.move(Vector2.DOWN, this.speed);
    };

    public moveLeft() {
        this.move(Vector2.LEFT, this.speed);
    };

    public moveRight() {
        this.move(Vector2.RIGHT, this.speed);
    };

    public moveByDirection(vector: Vector2) {
        this.move(vector, this.speed);
    }

    protected move(vector:Vector2, speed: number) {
        if (this._freezed) return;

        this.getWorldObject().setVelocity(vector.x * speed, vector.y * speed);
    };

    public stop() {
        this.getWorldObject().setVelocity(0, 0);
    };

    public getId(): number {
        return this.id;
    }
}