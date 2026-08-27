import assert from "node:assert/strict";
import test from "node:test";
import { keKursorArsip } from "./renungan";

test("memilih kursor sebelumnya yang valid sebelum kursor berikutnya", () => {
  assert.deepEqual(
    keKursorArsip({ sampai: "2026-08-18", sebelum: "2026-08-19" }),
    { cursor: "2026-08-19", arah: "sebelumnya" }
  );
});

test("mengabaikan kursor invalid dan array", () => {
  assert.deepEqual(
    keKursorArsip({ sampai: "bukan-tanggal", sebelum: ["2026-08-19"] }),
    { cursor: undefined, arah: "berikutnya" }
  );
});
