import WorldObject from "../worldobject";
import {Watchable} from "../interfaces";
import AbstractBehavior from "./abstractbehavior";
import Vector2 = Phaser.Math.Vector2;

export default class WatchObject extends AbstractBehavior {
    private person: WorldObject;
    private watchable: Watchable;
    private finalized: boolean = false;

    public constructor(id: number, person: WorldObject, watchable: Watchable) {
        super(id);
        this.person = person;
        this.watchable = watchable;
    }

    public doAction():void {
        let playerPosition = this.person.getPosition();
        let mousePosition = this.watchable.getPosition();
        let cursorByPlayer = mousePosition.subtract(playerPosition);
        let normalVector = new Vector2(-1, 0);
        let targetAngle = Phaser.Math.Angle.BetweenPoints(cursorByPlayer, normalVector);
        this.person.setAngle(targetAngle);
    }

    public isFinalized(): boolean {
        return this.finalized;
    }
}