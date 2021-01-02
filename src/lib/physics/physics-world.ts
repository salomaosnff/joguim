import { Container } from "pixi.js";
import Matter, { Gravity, World } from 'matter-js'
import { PhysicsObject } from "./physics-object";

export class PhysicsContainer extends Container {
    physics = Matter.Engine.create()
    objects: Set<PhysicsObject> = new Set()

    get gravity() {
        return this.physics.world.gravity
    }

    set gravity(value: Gravity) {
        this.physics.world.gravity = value
    }

    constructor() {
        super()

        Matter.Engine.run(this.physics);
    }

    destroy() {
        Matter.Engine.clear(this.physics);
    }

    add(...objects: PhysicsObject[]) {
        objects.forEach((obj) => {
            obj.container = this

            this.addChild(obj.sprite)

            Matter.World.add(this.physics.world, obj.body)

            this.objects.add(obj)
        })
    }

    remove(...objects: PhysicsObject[]) {
        objects.forEach((obj) => {
            obj.container = null

            this.removeChild(obj.sprite)

            Matter.World.remove(this.physics.world, obj.body)

            this.objects.delete(obj)
        })
    }

    update(dt: number) {
        // Recalcula a física
        Matter.Engine.update(this.physics, dt)

        // Atualiza os objetos
        this.objects.forEach((child) => child.updateSprite())
    }
}