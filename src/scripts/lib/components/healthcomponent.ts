/**
 * @TODO базовый интерфейс компонент
 */
export default class HealthComponent {
    private health: number;

    public constructor(heath: number) {
        this.health = heath;
    }

    public get() {
        return this.health;
    }

    public increase(value: number) {
        this.health += value;
    }

    public decrase(value: number) {
        this.health -= value;
    }
}