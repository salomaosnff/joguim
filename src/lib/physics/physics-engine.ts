import { Container, Rectangle } from "pixi.js"

interface PhysicBody {
    getBounds(): PIXI.Rectangle
    isStatic: boolean
    rotation: number
    acceleration: number
    velocity: PIXI.Point
    position: PIXI.Point
    angularVelocity: number
}

export class PhysicsEngine {
    bodies: PhysicBody[] = []

    add(...bodies: PhysicBody[]) {
        this.bodies = this.bodies.concat(bodies)
    }

    collides(a: PhysicBody, b: PhysicBody) {
        const rectA = a.getBounds()
        const rectB = b.getBounds()

        return (rectA.contains(rectB.x, rectB.y) || rectA.contains(rectB.right, rectB.bottom)) ||
            (rectB.contains(rectB.x, rectB.y) || rectB.contains(rectB.right, rectB.bottom))

    }

    update(dt: number) {
        this.bodies.forEach((a) => {
            if (a.isStatic) return;

            const x = Math.sin(-a.rotation) * a.angularVelocity
            const y = Math.cos(a.rotation) * a.angularVelocity

            a.velocity.x += a.acceleration
            a.velocity.y += a.acceleration

            a.position.x += a.velocity.x + x
            a.position.y += a.velocity.y + y
        })
    }
}