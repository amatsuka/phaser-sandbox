import {HandItem} from "./interfaces";
import WorldObject from "./worldobject";
import Vector2 = Phaser.Math.Vector2;

export default class Player extends WorldObject {
    protected speed: number = 3;

    private handItem: HandItem;

    public useHandItem(point: Vector2) {
        if (this.handItem) {
            this.handItem.useToCoordinates(this, point);
        }
    }

    public setHandItem(item: HandItem) {
        this.handItem = item;
    }
}