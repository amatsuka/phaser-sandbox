import Npc from "./npc";
import AbstractBehavior from "./behaviors/abstractbehavior";
import WatchObject from "./behaviors/watchobject";
import PursueObject from "./behaviors/pursueobject";
import FreezeObject from "./behaviors/freezeobject";


export default class BehaviorRegistry {
	private static instance: BehaviorRegistry;
	private index: number = 0;
	private behaviors: AbstractBehavior[] = [];
	private constructor() {};

	public static getInstance(): BehaviorRegistry {
		if (!BehaviorRegistry.instance) {
			BehaviorRegistry.instance = new BehaviorRegistry();
		}

		return BehaviorRegistry.instance;
	}

	private getIndex(): number {
		return ++this.index;
	}

	public create(typeId: string, args: any[]): AbstractBehavior {
		let newId = this.getIndex();

		let obj = this.factory(typeId, newId, args);
		this.behaviors[newId] = obj;

		return obj;
	}

	public add(obj: AbstractBehavior): number {
		let newId = this.getIndex();
		this.behaviors[newId] = obj;

		return newId;
	}

	public remove(obj: AbstractBehavior): void {
		let id = this.behaviors.indexOf(obj);
		delete this.behaviors[id];
	}

	public removeById(id: number): void {
		delete this.behaviors[id];
	}

	public getById(id: number): AbstractBehavior {
		return this.behaviors[id];
	}


	private factory(typeId: string, id: number, args: any[]): AbstractBehavior {
		//@TODO передача аргументов по нормальному
		switch (typeId) {
			case "watch":
				return new WatchObject(id, args[0], args[1]);
			case "pursue":
				return new PursueObject(id, args[0], args[1]);
			case "freeze":
				return new FreezeObject(id, args[0], args[1]);
			default: throw new Error("undefined behavior")
		}
	}

	public execute() {
		let __context = this;
		this.behaviors.forEach(function (behavior, index) {
			behavior.doAction();
			if (behavior.isFinalized()) __context.removeById(index);
		});
	}
}