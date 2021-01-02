import { Bodies, Body } from "matter-js";
import { Container, Graphics, Sprite, Text, Texture, Ticker } from "pixi.js";
import { app, sceneManager } from "../app";
import { PhysicsObject } from "../lib/physics/physics-object";
import { angularVelocity } from "../lib/util";
import { GameScene } from "../scenes/game";
import { Bullet } from "./Bullet";

interface TankOptions {
    game: GameScene,
    username: string
    towerColor: number
    baseColor: number
}

const ACCELERATION = 1;
const ANGULAR_VELOCITY = 1 * Math.PI / 180;
const SHOOT_THROTTLE = 500; // 1 a cada 3 seg

export class Tank extends PhysicsObject<Sprite> {

    // Parts
    tower = new Sprite(app.loader.resources.tank.textures['TankBrancoTorre128.png'])
    towerHole = new Sprite()
    details = new Sprite(app.loader.resources.tank.textures['TankBrancoDetalhes128.png'])
    label: Text
    lifeBar = new Graphics()

    // Props
    towerAngularVelocity = 0;

    nextShoot = 0;
    life = 100;

    translateBody = {
        x: 0,
        y: 16
    }

    constructor(public readonly options: TankOptions, public bullets: Set<Bullet> = new Set()) {
        super(new Sprite(app.loader.resources.tank.textures['TankBrancoBase128.png']))

        this.body = Bodies.rectangle(0, 0, 60, 94)

        this.frictionAir = 0.1
        this.mass = 5

        this.label = new Text(this.options.username, {
            fontFamily: 'Press Start 2P',
            fontSize: 10,
            fill: 0xFFFFFF,
            strokeThickness: 2
        })

        this.sprite.tint = this.options.baseColor
        this.details.tint = this.options.baseColor
        this.tower.tint = this.options.towerColor

        this.tower.anchor.set(0.5, 0.5)

        this.tower.position.x = 64
        this.tower.position.y = 64

        this.tower.addChild(this.towerHole)

        this.towerHole.position.set(
            -1,
            (this.tower.height / 2) - 4,
        )

        this.label.addChild(this.lifeBar)
        this.sprite.addChild(this.details, this.tower, this.label)

        this.label.position.x = this.sprite.width / 2;
        this.label.position.y = 16;
        this.label.pivot.x = this.label.width / 2
        this.label.pivot.y = this.label.height / 2
    }

    createBar(g = new Graphics(), progress = 1, width = 64) {
        let color = 0xFF0000

        if (progress > 0.75) color = 0x00FF00
        else if (progress > 0.5) color = 0xFFFF00
        else if (progress > 0.25) color = 0xFFAA00

        g.clear()
        g.beginFill(color)
        g.drawRect(0, 0, (width * progress), 4)
        g.endFill()
    }

    updateLifeBar() {
        const progress = Math.max(0, Math.min(1, this.life / 100))

        this.createBar(this.lifeBar, progress, this.label.width)

        this.lifeBar.position.y = this.label.height + 4
    }

    update(dt: number) {
        this.tower.angle += this.towerAngularVelocity * dt

        // Atualiza o angulo do label
        this.label.rotation = -this.angle;

        // Atualiza a barra de recarga
        this.updateLifeBar()

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > this.options.game.map.data.width) {
            this.x = this.options.game.map.data.width
        }

        if (this.y < 0) {
            this.y = 0;
        } else if (this.y > this.options.game.map.data.height) {
            this.y = this.options.game.map.data.height
        }
    }

    run(direction = 1) {
        this.body.force = angularVelocity(this.sprite.rotation, Math.sign(direction) * ACCELERATION)
        return this
    }

    stop() {
        // this.acceleration = 0
        return this
    }

    rotate(direction = 1) {
        this.angularVelocity = Math.sign(direction) * ANGULAR_VELOCITY
        return this
    }

    rotateTower(direction = 1) {
        this.towerAngularVelocity = Math.sign(direction) * 1
        return this
    }

    stopRotateTower() {
        this.towerAngularVelocity = 0
        return this
    }

    shoot() {
        if (this.nextShoot > Ticker.shared.lastTime) {
            return this
        }

        this.nextShoot = Ticker.shared.lastTime + SHOOT_THROTTLE

        this.bullets.add(new Bullet(this))
    }
}