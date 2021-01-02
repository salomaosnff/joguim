import { Graphics, Polygon, Ticker } from "pixi.js";
import { sceneManager } from "../app";
import { PhysicsObject } from "../lib/physics/physics-object";
import { angularVelocity } from "../lib/util";
import { Tank } from "./Tank";

const VELOCITY = 10
const LIFETIME = 3000
const DAMAGE = 10;

export class Bullet extends PhysicsObject<Graphics> {
    endTime = Ticker.shared.lastTime + LIFETIME
    damage = DAMAGE;

    constructor(public readonly tank: Tank) {
        super(new Graphics())

        const shape = new Polygon([
            0, 0,
            4, 0,
            4, 4,
            2, 16,
            0, 4
        ])

        this.sprite.beginFill(0xffff00)
        this.sprite.drawShape(shape)

        this.body = this.createRectBody()

        this.position = sceneManager.currentScene.camera.toLocal(tank.towerHole.getGlobalPosition())
        this.angle = tank.angle + tank.tower.rotation

        this.mass = 10

        this.velocity = angularVelocity(this.angle, VELOCITY)

        tank.container.add(this)
    }
}