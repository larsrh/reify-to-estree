import * as ESTree from "estree";
import {generate} from "astring";
import fc, {Arbitrary} from "fast-check";
import * as Reify from "../index";
import {runInNewContext} from "vm";
import {objectFromEntries} from "../util";

function checkReified(expr: ESTree.Expression, t: any): void {
    const stmt: ESTree.ExpressionStatement = {
        expression: expr,
        type: "ExpressionStatement"
    };
    const string = generate(stmt);
    const t2 = runInNewContext(string, {});
    expect(t2).toEqual(t);
}

function checkReify<T>(arb: Arbitrary<T>, reify: (t: T) => ESTree.Expression, post?: (t: T) => any): void  {
    fc.assert(fc.property(arb, t => {
        checkReified(reify(t), post ? post(t): t);
    }));
}

describe("Reify", () => {

    it("null", () => checkReified(Reify.any(null), null));
    it("undefined", () => checkReified(Reify.any(undefined), undefined));

    it("string", () => checkReify(fc.fullUnicodeString(), Reify.string));
    it("any(string)", () => checkReify(fc.fullUnicodeString(), Reify.any));

    it("number", () => checkReify(fc.nat(), Reify.number));
    it("any(number)", () => checkReify(fc.nat(), Reify.any));

    it("boolean", () => checkReify(fc.boolean(), Reify.boolean));
    it("any(boolean)", () => checkReify(fc.boolean(), Reify.any));

    it("object", () => {
        const gen = fc.array(fc.tuple(fc.fullUnicodeString(), fc.fullUnicodeString()));
        checkReify(
            gen,
            array => Reify.any(objectFromEntries(array)),
            array => objectFromEntries(array)
        );
    });
    it("any(object)", () => {
        const gen = fc.array(fc.tuple(fc.fullUnicodeString(), fc.fullUnicodeString())).map(entries => objectFromEntries(entries));
        checkReify(gen, Reify.any);
    });

    it("array", () => {
        const gen = fc.array(fc.fullUnicodeString());
        checkReify(gen, array => Reify.array(array.map(x => Reify.string(x))));
    });
    it("any(array)", () => checkReify(fc.array(fc.fullUnicodeString()), Reify.any));

    it("function", () => {
        expect(() => Reify.any(() => {/* do nothing */})).toThrow(/function/i);
    })

});
