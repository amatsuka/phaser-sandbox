import WorldObject from "../worldobject";
import {Watchable} from "../interfaces";
import AbstractBehavior from "./abstractbehavior";
import Vector2 = Phaser.Math.Vector2;

export default class PursueObject extends AbstractBehavior {
    private person: WorldObject;
    private watchable: Watchable;
    private finalized: boolean = false;

    public constructor(id: number, person: WorldObject, watchable: Watchable) {
        super(id);
        this.person = person;
        this.watchable = watchable;
    }

    public doAction(): void {
        let playerPosition: Vector2 = this.person.getPosition();
        let mousePosition: Vector2 = this.watchable.getPosition();
        let cursorByPlayer = mousePosition.subtract(playerPosition);
        let normalVector = cursorByPlayer.normalize();
        this.person.moveByDirection(normalVector);
    }

    public isFinalized(): boolean {
        return this.finalized;
    }
}