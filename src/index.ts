import * as ESTree from "estree";
import {objectFromEntries} from "./util";

export function string(s: string): ESTree.SimpleLiteral {
    return {
        type: "Literal",
        value: s
    };
}

export function array(items: (ESTree.Expression | ESTree.SpreadElement)[]): ESTree.ArrayExpression {
    return {
        type: "ArrayExpression",
        elements: items
    };
}

export function number(i: number): ESTree.SimpleLiteral {
    return {
        type: "Literal",
        value: i
    };
}

export function boolean(b: boolean): ESTree.SimpleLiteral {
    return {
        type: "Literal",
        value: b
    };
}

export function object(fields: Record<string, ESTree.Expression>): ESTree.ObjectExpression {
    const props = Object.entries(fields).map(field => {
        const [key, value] = field;
        const prop: ESTree.Property = {
            type: "Property",
            key: string(key),
            kind: "init",
            computed: false,
            method: false,
            shorthand: false,
            value: value
        };
        return prop;
    });
    return {
      type: "ObjectExpression",
      properties: props
    };
}

export function any(x: unknown): ESTree.Expression {
    if (x === null)
        return {
            type: "Literal",
            value: null
        };

    if (x === undefined)
        return {
            type: "UnaryExpression",
            operator: "void",
            prefix: true,
            argument: {
                type: "Literal",
                value: 0
            }
        };

    if (typeof x === "boolean")
        return boolean(x);

    if (typeof x === "number")
        return number(x);

    if (typeof x === "string")
        return string(x);

    if (Array.isArray(x))
        return array(x.map(item => any(item)));

    if (typeof x === "object") {
        const map = objectFromEntries(Object.entries(x as Record<string, unknown>).map(entry => {
            const [key, value] = entry;
            return [key, any(value)];
        }));
        return object(map);
    }

    if (typeof x === "function")
        throw new Error("Functions can't be reified");

    throw new Error("Unknown value");
}

