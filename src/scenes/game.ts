import { Events } from "matter-js";
import { Graphics, Polygon, SCALE_MODES, Ticker, TilingSprite } from "pixi.js";
import { app, Key, Keyboard } from "../app";
import { GameMap } from "../lib/game-map";
import { PhysicsContainer } from "../lib/physics/physics-world";
import { Scene } from "../lib/scene";
import { getObjectOfType } from "../lib/util";
import { Bullet } from "../objects/Bullet";
import { MiniMap } from "../objects/MiniMap";
import { Tank } from "../objects/Tank";

interface GameOptions {
    map: string
}

export class GameScene extends Scene {
    world = new PhysicsContainer()
    map: GameMap
    grid: TilingSprite
    player: Tank
    minimap: MiniMap

    bullets = new Set<Bullet>()

    constructor(public options: GameOptions) {
        super()
    }

    tanks = new Set<Tank>()

    setup() {
        Keyboard.downKeys.clear()

        this.camera.wheel()
        this.renderGrid()

        this.player = new Tank({
            username: 'salomaosnff',
            baseColor: 0xFF0000,
            towerColor: 0xFFFF00,
            game: this
        }, this.bullets)

        this.world.gravity = { x: 0, y: 0, scale: 0 }

        if (!(this.options.map in app.loader.resources)) {
            alert(`O mapa não existe!`)
            return;
        }

        this.map = new GameMap(app.loader.resources[this.options.map].data)
        this.minimap = new MiniMap(this)

        this.player.position = {
            x: Math.random() * this.map.data.width,
            y: Math.random() * this.map.data.height,
        }

        this.tanks = new Set(
            new Array(20).fill(null).map((_, i) => {
                const tank = new Tank({
                    game: this,
                    baseColor: 0x00AAFF,
                    towerColor: 0x00AAFF,
                    username: `Enemy ${i + 1}`
                })

                tank.position = {
                    x: Math.random() * this.map.data.width,
                    y: Math.random() * this.map.data.height,
                }

                tank.angle = Math.random()

                return tank
            })
        )

        this.tanks.add(this.player)

        this.map.load().then(() => {
            this.camera.addChild(this.map, this.world)
            this.world.add(this.player)
            this.world.add(...this.tanks)
            this.camera.follow(this.player.sprite)
        })

        Events.on(this.world.physics, 'collisionStart', (e) => {
            const { bodyA, bodyB } = e.pairs[0]
            const bodies = [bodyA, bodyB]
            const bullet = getObjectOfType<Bullet>(bodies as any, Bullet)
            const tank = getObjectOfType<Tank>(bodies as any, Tank)

            if (tank && bullet) {
                tank.life -= bullet.damage;

                this.world.remove(bullet)
                this.bullets.delete(bullet)

                if (tank.life <= 0) {
                    this.world.remove(tank)
                    this.tanks.delete(tank)
                }
            }
        })

        this.stage.addChild(this.minimap)
    }

    renderGrid() {
        const size = 32;
        const g = new Graphics()

        const shape = new Polygon([0, 0, 0, size, size, size]);

        shape.closeStroke = false;

        g.lineStyle(1, 0xFFFFFF, 0.1, 0)
        g.drawShape(shape)

        const texture = app.renderer.generateTexture(g, SCALE_MODES.LINEAR, 1)
        this.grid = new TilingSprite(texture, app.view.width, app.view.height)

        this.stage.addChildAt(this.grid, 0)
    }

    update(dt: number) {
        // Frente e ré
        if (Keyboard.isDown(Key.UP)) {
            this.player.run()
        } else if (Keyboard.isDown(Key.DOWN)) {
            this.player.run(-1)
        } else {
            this.player.stop()
        }

        // Direção do tanque
        if (Keyboard.isDown(Key.LEFT)) {
            this.player.rotate(-1)
        } else if (Keyboard.isDown(Key.RIGHT)) {
            this.player.rotate()
        }

        // Direção da torre
        if (Keyboard.isDown(Key.ARROW_LEFT)) {
            this.player.rotateTower(-1)
        } else if (Keyboard.isDown(Key.ARROW_RIGHT)) {
            this.player.rotateTower()
        } else {
            this.player.stopRotateTower()
        }

        // Atirar
        if (Keyboard.isDown(Key.ENTER)) {
            this.player.shoot()
        }

        // Atualiza os tiros
        this.bullets.forEach((bullet) => {
            // Remove tiros que venceram
            if (
                bullet.endTime <= Ticker.shared.lastTime ||
                bullet.x <= 0 ||
                bullet.x >= this.map.data.width ||
                bullet.y <= 0 ||
                bullet.y >= this.map.data.height
            ) {
                this.bullets.delete(bullet)
                this.world.remove(bullet)
                return;
            }
        })

        // Atualiza os tanks
        this.tanks.forEach((tank) => tank.update(dt))

        // Atualiza a física
        this.world.update(dt);

        // Atualiza minimap
        this.minimap.update()

        // Atualiza o grid
        this.grid.tilePosition.copyFrom(this.camera)
    }
}