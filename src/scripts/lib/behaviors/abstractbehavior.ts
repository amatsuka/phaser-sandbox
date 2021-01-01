export default abstract class AbstractBehavior {
    protected id: number = 0;
    abstract doAction(): void;
    abstract isFinalized(): boolean;

    public constructor(id: number) {
        this.id = id;
    }
}