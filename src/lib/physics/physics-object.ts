import { Bodies, Body, Vector } from "matter-js";
import { Container, Graphics } from "pixi.js";
import { sceneManager } from "../../app";
import { PhysicsContainer } from "./physics-world";

declare module 'matter-js' {
    export interface Body {
        object: PhysicsObject
    }
}

export class PhysicsObject<T extends Container = Container> {
    private _debug = new Graphics()
    private _body: Body

    container: PhysicsContainer
    translateBody: Vector = { x: 0, y: 0 }

    get body() {
        return this._body
    }

    set body(body: Body) {
        body.object = this;
        this._body = body
    }

    get position() {
        return this.body.position
    }

    set position(position: Matter.Vector) {
        Body.translate(this.body, position)
        this.sprite.position.copyFrom(this.body.position)
    }

    get x() {
        return this.position.x
    }

    set x(x: number) {
        Body.setPosition(this.body, { ...this.body.position, x })
        this.sprite.x = x
    }

    get y() {
        return this.position.y
    }

    set y(y: number) {
        Body.setPosition(this.body, { ...this.body.position, y })
        this.sprite.x = y
    }

    get angle() {
        return this.body.angle
    }

    set angle(angle: number) {
        Body.setAngle(this.body, angle)
        this.sprite.rotation = angle
    }

    get angularVelocity() {
        return this.body.angularVelocity
    }

    set angularVelocity(velocity: number) {
        Body.setAngularVelocity(this.body, velocity)
    }

    get density() {
        return this.body.density
    }

    set density(density: number) {
        Body.setDensity(this.body, density)
    }

    get inertia() {
        return this.body.inertia
    }

    set inertia(inertia: number) {
        Body.setInertia(this.body, inertia)
    }

    get mass() {
        return this.body.mass
    }

    set mass(mass: number) {
        Body.setMass(this.body, mass)
    }

    get isStatic() {
        return this.body.isStatic
    }

    set isStatic(isStatic: boolean) {
        Body.setStatic(this.body, isStatic)
    }

    get velocity() {
        return this.body.velocity
    }

    set velocity(velocity: Vector) {
        Body.setVelocity(this.body, velocity)
    }

    get vertices() {
        return this.body.vertices
    }

    set vertices(vertices: Vector[]) {
        Body.setVertices(this.body, vertices)
    }

    get restitution() {
        return this.body.restitution
    }

    set restitution(restitution: number) {
        this.body.restitution = restitution
    }

    get friction() {
        return this.body.friction
    }

    set friction(friction: number) {
        this.body.friction = friction
    }

    get frictionAir() {
        return this.body.frictionAir
    }

    set frictionAir(frictionAir: number) {
        this.body.frictionAir = frictionAir
    }

    get frictionStatic() {
        return this.body.frictionStatic
    }

    set frictionStatic(frictionStatic: number) {
        this.body.frictionStatic = frictionStatic
    }

    constructor(public readonly sprite: T) {
        this.sprite
            .on('removed', () => {
                if (this._debug.parent) {
                    this._debug.parent.removeChild(this._debug)
                }
            })
    }

    createRectBody(options?: Matter.IChamferableBodyDefinition) {
        const { x, y, width, height } = this.sprite.getBounds()
        return Bodies.rectangle(x, y, width, height, options)
    }

    updateSprite() {
        this.sprite.rotation = this.angle
        this.sprite.position.copyFrom(this.position)

        this.sprite.pivot.set(
            (this.sprite.width / 2) - this.translateBody.x,
            (this.sprite.height / 2) - this.translateBody.y,
        )

        const camera = sceneManager.currentScene.camera

        if (false) {
            const points = this.body.vertices.flatMap((point) => {
                let { x, y } = point

                return [x, y]
            })

            this._debug.clear()

            this._debug.lineStyle(2, 0xFFFFFF, 1, 0)
            this._debug.drawPolygon(points)

            if (!this._debug.parent) {
                camera.addChild(this._debug)
            }
        } else if (this._debug.parent) {
            camera.removeChild(this._debug)
        }
    }
}