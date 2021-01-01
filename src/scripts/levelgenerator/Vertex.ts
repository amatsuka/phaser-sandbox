export default class Vertex {
    public x: number;
    public y: number;
    public vertexNum: number;

    public neighbors: Array<Vertex> = [];

    constructor(x: number, y: number, vertexNum: number) {
        this.x = x;
        this.y = y;
        this.vertexNum = vertexNum;
    }
}
