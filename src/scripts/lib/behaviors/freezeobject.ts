import WorldObject from "../worldobject";
import AbstractBehavior from "./abstractbehavior";

export default class FreezeObject extends AbstractBehavior {
    private person: WorldObject;
    private freezeTime: number;
    private currentTime: number = 0;
    private finalized: boolean = false;

    public constructor(id: number, person: WorldObject, freezeTime: number) {
        super(id);
        this.person = person;
        this.freezeTime = freezeTime;
    }

    public doAction():void {
        if (this.currentTime == 0) {
            this.person.freezed = true;
            this.currentTime++;
        } else if (this.currentTime < this.freezeTime) {
            this.currentTime++;
        } else {
            this.person.freezed = false;
            this.finalized = true;
        }
    }

    public isFinalized(): boolean {
        return this.finalized;
    }
}