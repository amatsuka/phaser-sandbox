import {HandItem} from "./interfaces";
import WorldObject from "./worldobject";
import WorldObjectRegistry from "./worldobjectregistry";
import Sector from "./util/sector";
import BehaviorRegistry from "./behaviorregistry";

export default class GraviGun implements HandItem {
    private getParams() {
        return {
            radius: 200,
            range: 90,
            force: 0.001
        }
    }
    useToCoordinates(person: WorldObject, point: MatterJS.Vector): void {
        let params = this.getParams();
        let objectRegistry = WorldObjectRegistry.getInstance();

        let sector = new Sector(person.getPosition(), params.radius, person.getAngle(), params.range);

        objectRegistry.getAll().forEach(function (obj) {
            let vector = sector.inSector(obj.getPosition());
            if (vector !== null) {
                let forceVector = vector.normalize();
                let length = vector.length();

                obj.getWorldObject().applyForceFrom(person.getPosition(), forceVector.scale(params.force * params.radius/length));
                //BehaviorRegistry.getInstance().create("freeze", [obj, 120]);
            }
        });
    }

    useToObject(person: WorldObject, object: WorldObject): void {

    }
}