import WorlObject from "./worldobject";
import Npc from "./npc";
import Wall from "./wall";
import HealthComponent from "./components/healthcomponent";
import WorldObject from "./worldobject";
import Sprite = Phaser.Physics.Matter.Sprite;


export default class WorldObjectRegistry {
	private static instance: WorldObjectRegistry;
	private index: number = 10;
	private objects: WorlObject[] = [];
	private constructor() {};

	public static getInstance(): WorldObjectRegistry {
		if (!WorldObjectRegistry.instance) {
			WorldObjectRegistry.instance = new WorldObjectRegistry();
		}

		return WorldObjectRegistry.instance;
	}

	private getIndex(): number {
		return ++this.index;
	}

	public create(typeId: string, worldObject: Sprite): WorlObject {
		let newId = this.getIndex();

		let obj = this.factory(typeId, newId, worldObject);
		this.objects[newId] = obj;

		return obj;
	}

	public add(obj: WorlObject): number {
		let newId = this.getIndex();
		this.objects[newId] = obj;

		return newId;
	}

	public remove(obj: WorlObject): void {
		let id = this.objects.indexOf(obj);
		delete this.objects[id];
	}

	public removeById(id: number): void {
		delete this.objects[id];
	}

	public getById(id: number): WorlObject {
		return this.objects[id];
	}


	private factory(typeId: string, id: number, worldObject: Sprite): WorldObject {
		/**
		 * @TODO коды компонент в константы вынести
		 */
		switch (typeId) {
			case "npc":
				return new Npc(id, worldObject, {health: new HealthComponent(100)});
			case "wall":
				return new Wall(id, worldObject, {health: new HealthComponent(200)});
			default: throw new Error("undefined item")
		}
	}

	public getAll() {
		return this.objects;
	}
}