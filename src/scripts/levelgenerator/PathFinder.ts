import Vertex from "./Vertex";

export default class PathFinder {
    public findPath(vertices: Array<Vertex>, from: number, to: number): Array<Vertex> | null {
        let distances = new Array<number>(vertices.length);
        distances[from] = 0;

        let toVisitQueue = [vertices[from]];

        let paths = new Array<number>();

        let found = false;

        while (toVisitQueue.length != 0) {
            let vertex = toVisitQueue.shift();

            if (vertex == undefined) {
                break;
            }

            if (vertex.vertexNum == to) {
                found = true;
                break;
            }

            for (const neighbor of vertex.neighbors) {
                let newDistance = distances[neighbor.vertexNum] + 1;

                if (distances[neighbor.vertexNum] == undefined || distances[neighbor.vertexNum] > newDistance) {
                    distances[neighbor.vertexNum] = newDistance;
                    paths[neighbor.vertexNum] = vertex.vertexNum;
                    toVisitQueue.push(vertices[neighbor.vertexNum]);
                }
            }
        }

        if (!found) {
            return null;
        }

        let current = to;
        let resultPath = new Array<Vertex>();
        resultPath.push(vertices[current]);

        while (current != from) {
            current = paths[current];
            resultPath.push(vertices[current]);
        }

        return resultPath.reverse();
    }
}
