import { Container, Graphics, Point, Rectangle } from "pixi.js";
import { GameScene } from "../scenes/game";

const VIEW_AREA = 128;

export class MiniMap extends Container {
    bg = new Graphics()

    zoom = 0.05;

    get max() {
        return Math.max(this.data.width, this.data.height)
    }

    get data() {
        return this.game.map.data
    }

    get ratio() {
        return this.data.width / this.data.height
    }

    constructor(public game: GameScene) {
        super()
        this.addChild(this.bg)
    }

    update() {

        this.bg.clear()

        const { x: PX, y: PY } = this.game.player
        const origin = new Point(
            PX - (VIEW_AREA / 2 / this.zoom),
            PY - (VIEW_AREA / 2 / this.zoom),
        )

        const view = new Rectangle(
            0,
            0,
            VIEW_AREA,
            VIEW_AREA,
        )

        // Background
        this.bg.beginFill(0x000000, 0.82)
        this.bg.drawRect(0, 0, VIEW_AREA, VIEW_AREA);
        this.bg.endFill()

        // Player
        this.bg.beginFill(this.game.player.options.baseColor)
        this.bg.drawCircle(
            (PX - origin.x) * this.zoom,
            (PY - origin.y) * this.zoom,
            4
        )

        this.game.tanks.forEach((tank) => {
            const x = (tank.position.x - origin.x) * this.zoom
            const y = (tank.position.y - origin.y) * this.zoom

            if (view.contains(x, y)) {
                this.bg.beginFill(tank.options.baseColor, 1)
                this.bg.drawCircle(x, y, 2)
                this.bg.endFill()
            }
        })

        // Positionate
        this.position.set(
            0, 0
        )
    }

    build() { }
}