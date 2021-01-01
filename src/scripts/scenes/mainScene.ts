import Player from "../lib/player";
import GraviGun from "../lib/gravigun";
import WorldObjectRegistry from "../lib/worldobjectregistry";
import BehaviorRegistry from "../lib/behaviorregistry";
import Mouse from "../lib/control/mouse";
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Matter.Sprite;
import Generator from "../levelgenerator/Generator";
import Level from "../levelgenerator/Level";
import LevelTile from "../levelgenerator/LevelTile";
import FpsText from "../objects/fpsText";
import Vertex from "../levelgenerator/Vertex";
import PathFinder from "../levelgenerator/PathFinder";
import Graphics = Phaser.GameObjects.Graphics;

export default class MainScene extends Phaser.Scene {
    private readonly TILE_SIZE: number = 20;
    private readonly WALL_SIZE: number = 2;
    private graphics: Graphics;
    constructor() {
        super({key: 'MainScene'})
    }

    private objectRegistry: WorldObjectRegistry;
    private behaviorRegistry: BehaviorRegistry;
    private player: Player;
    private mouse: Mouse;

    private WKey: Phaser.Input.Keyboard.Key;
    private SKey: Phaser.Input.Keyboard.Key;
    private DKey: Phaser.Input.Keyboard.Key;
    private AKey: Phaser.Input.Keyboard.Key;
    private ZKey: Phaser.Input.Keyboard.Key;
    private XKey: Phaser.Input.Keyboard.Key;
    private CKey: Phaser.Input.Keyboard.Key;
    private level: Level;

    private drawX: number = 0;
    private drawY: number = 0;
    private drawAcc: number = 0;
    private text: FpsText;
    private renderFinish: Boolean = false;

    private vertices: Array<Vertex>;

    private pathFinder: PathFinder;

    create() {
        this.objectRegistry = WorldObjectRegistry.getInstance();
        this.behaviorRegistry = BehaviorRegistry.getInstance();

        this.player = new Player(0, this.matter.add.sprite(30, 30, "hero").setScale(0.3));
        this.player.setHandItem(new GraviGun());

        this.matter.add.world.add(this.player.getWorldObject());
        //this.matter.world.setBounds(-this.cameras.main.width, -this.cameras.main.height, this.cameras.main.width * 2, this.cameras.main.height * 2, 64, true, true, true, true);
        //this.matter.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height, 64);
        //this.cameras.main.startFollow(this.player.getWorldObject());
        this.cameras.main.setZoom(1);
        this.mouse = new Mouse();

        this.behaviorRegistry.create("watch", [this.player, this.mouse]);


        this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.ZKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.XKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.CKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        let levelGenerator = new Generator();
        this.level = levelGenerator.wilson(1, 1);
        this.vertices = this.level.getVertices();

        this.text = new FpsText(this);

        this.pathFinder = new PathFinder();

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xff0000, 1);
    }

    private drawTile(x: number, y: number, tile: LevelTile, tileSize: number, wallWidth: number) {
        let color = (x + y) % 2 == 0 ? 0xff0000 : 0x0000ff;

        let position: Vector2 = new Vector2(x * tileSize, y * tileSize);

        if (tile.upBound) {
            let obj = this.add.rectangle(position.x + tileSize / 2, position.y, tileSize, wallWidth, color, 1);
            this.matter.add.gameObject(obj, {isStatic: true/*, isSensor:false*/});
        }

        if (tile.downBound) {
            let obj = this.add.rectangle(position.x + tileSize / 2, position.y + tileSize - wallWidth, tileSize, wallWidth, color, 1);
            this.matter.add.gameObject(obj, {isStatic: true/*, isSensor:false*/});
        }

        if (tile.leftBound) {
            let obj = this.add.rectangle(position.x + wallWidth/2, position.y + tileSize / 2, wallWidth, tileSize - wallWidth * 2, color, 1);
            this.matter.add.gameObject(obj, {isStatic: true/*, isSensor:false*/});
        }

        if (tile.rightBound) {
            let obj = this.add.rectangle(position.x + tileSize - wallWidth/2, position.y + tileSize / 2, wallWidth, tileSize - wallWidth * 2, color, 1);
            this.matter.add.gameObject(obj, {isStatic: true/*, isSensor:false*/});
        }
    }

    update(time: number, delta: number) {
        this.drawAcc += delta;
        this.render();
        this.render();
        this.render();
        this.render();
        this.render();

        let activePointer = this.input.activePointer;

        this.mouse.update(activePointer.x, activePointer.y, activePointer.isDown);

        if (this.mouse.isDown()) {
            this.player.useHandItem(this.mouse.getPosition());
        }
        if (this.WKey.isDown) {
            this.player.moveUp();
        } else if (this.SKey.isDown) {
            this.player.moveDown();
        }

        if (this.DKey.isDown) {
            this.player.moveRight();
        } else if (this.AKey.isDown) {
            this.player.moveLeft();
        }

        if (this.ZKey.isDown) {
            let newObject = this.objectRegistry.create("npc", this.matter.add.sprite(this.cameras.main.width / 2, 0, "enemy").setScale(0.3).setInteractive());
            this.behaviorRegistry.create("watch", [newObject, this.player]);
            this.behaviorRegistry.create("pursue", [newObject, this.player]);
        }

        if (this.XKey.isDown) {
            this.player.setPosition(new Vector2(100, 100));
        }

        if (this.input.keyboard.checkDown(this.CKey)) {
            this.graphics.clear();

            let mousePosition = this.mouse.getPosition();
            let playerPosition = this.player.getPosition();


            let playerCellPosition = playerPosition.clone().scale(1/this.TILE_SIZE);
            let mouseCellPosition = mousePosition.clone().scale(1/this.TILE_SIZE);

            playerCellPosition.x = Math.round(playerCellPosition.x);
            playerCellPosition.y = Math.round(playerCellPosition.y);

            mouseCellPosition.x = Math.round(mouseCellPosition.x);
            mouseCellPosition.y = Math.round(mouseCellPosition.y);

            if (this.level.inBound(playerCellPosition) && this.level.inBound(mouseCellPosition)) {

                let path = this.pathFinder.findPath(this.vertices, this.level.getTile(playerCellPosition).vertexNum, this.level.getTile(mouseCellPosition).vertexNum);

                if (path != null) {
                    for (const vertex of path) {
                        this.graphics.fillCircle(vertex.x * this.TILE_SIZE + this.TILE_SIZE / 2, vertex.y * this.TILE_SIZE + this.TILE_SIZE / 2, 2);
                    }
                }

                let circle = new Phaser.Geom.Circle(100, 100, 2);
                this.graphics.fillCircleShape(circle);
            }
        }

        this.behaviorRegistry.execute();
        let p = this.mouse.getPosition();
        this.text.update(p.x, p.y);
    }

    private render() {
        if (!this.renderFinish) {
            this.drawAcc = 0;
            this.drawTile(this.drawX, this.drawY, this.level.tiles[this.drawY][this.drawX], this.TILE_SIZE, this.WALL_SIZE);

            this.drawX++;

            if (this.drawX == this.level.sizeX) {
                this.drawY++;

                if (this.drawX >= this.level.sizeX && this.drawY >= this.level.sizeY) {
                    this.renderFinish = true;
                }
                this.drawX = 0;
            }
        }
    }
}
