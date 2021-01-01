import {Vector} from "matter";

export default class Converter {
	private static instance: Converter;

	private constructor() {};

	public static getInstance() {
		if (!Converter.instance) {
			Converter.instance = new Converter();
		}

		return Converter.instance;
	}

	public convertX(x: number): number {
		return x;
	};

	public convertY(y: number): number {
		return -y;
	}

	private convertAngle(angle: number): number {
		return angle;
	}

	public convertVector(vector: Vector): Vector {
		return Vector.clone(vector); 
	}
}