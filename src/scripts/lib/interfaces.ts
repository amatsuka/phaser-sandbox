import WorldObject from "./worldobject";
import Vector2 = Phaser.Math.Vector2;

export interface HandItem {
    useToCoordinates(person: WorldObject, point: Vector2): void;
    useToObject(person: WorldObject, object: WorldObject): void;
}

export interface Watchable {
    getPosition(): Vector2;
}