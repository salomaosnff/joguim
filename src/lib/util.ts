import { Body } from "matter-js";
import { Point } from "pixi.js";
import { Tank } from "../objects/Tank";
import { PhysicsObject } from "./physics/physics-object";

export type Constructor<T> = new (...args: any[]) => T

export function angularVelocity(angle: number, velocity: number) {
    const x = Math.sin(-angle) * velocity
    const y = Math.cos(angle) * velocity

    return new Point(x, y)
}

export function getObjectOfType<T extends PhysicsObject>(items: (Body & { object: T })[], type: Constructor<T>) {
    const item = items.find(item => item.object instanceof type)

    return item && item.object
}