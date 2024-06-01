import { mod } from "../../app/utils/general";

test('mod with simple values', () => {
    expect(mod(5, 2)).toBe(1);
});