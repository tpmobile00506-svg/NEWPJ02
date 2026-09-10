import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const lines = execFileSync('git', ['diff', '--name-status', '-M', '7f9f05d', 'c882eba'], { encoding: 'utf8' }).trim().split('\n');
const notes = {
  'backend/auth/sessions.ts': 'เปลี่ยน ChatGPT เป็น cookie session; หลังจากนั้นเพิ่ม public bootstrap และผ่อน Origin/password ซึ่งรุ่นนี้แก้กลับให้เข้มงวด',
  'backend/config/env.ts': 'เพิ่ม DATABASE_URL, origin และค่าของ Vercel',
  'backend/db/client.ts': 'เปลี่ยนเป็น Prisma/pg; เพิ่ม TLS แบบไม่ตรวจใบรับรองและเรียก DDL ตอน request ซึ่งรุ่นนี้เอาออก',
  'backend/db/index.ts': 'ส่งออก client ของ Prisma แทน Drizzle',
  'backend/db/init.ts': 'สร้างตารางอัตโนมัติตอน request; ย้ายเข้า archive และใช้ migrations แทน',
  'backend/routes/data.ts': 'API ใช้ sessions และ Prisma; พบ BigInt serialize/error handling ผิด ซึ่งแก้แล้ว',
  'backend/routes/source.ts': 'R2 เปลี่ยนเป็น disk; รุ่นนี้โหลดไฟล์จาก PostgreSQL',
  'backend/services/asset-service.ts': 'อ่านข้อมูลและนำเข้าด้วย Prisma; กฎตรวจทานต้นฉบับยังเดิม; รุ่นนี้เก็บ bytes พร้อม metadata ใน transaction',
  'backend/services/asset-mutations.ts': 'แยก mutation, serializable transactions และ idempotency จากงานย้าย PostgreSQL ที่เริ่มก่อน commit นี้',
  'backend/services/errors.ts': 'เพิ่ม ApiError กลางสำหรับ API',
  'backend/storage/files.ts': 'แทน R2 ด้วย disk; รุ่นนี้เปลี่ยนเป็น BYTEA เพื่ออยู่ถาวรบน Vercel',
  'backend/prisma/schema.prisma': 'เพิ่มโมเดล PostgreSQL/Prisma 17 โมเดล; รุ่นแก้เพิ่ม StoredFile และ LoginAttempt รวม 19',
  'backend/prisma/prisma.config.ts': 'เพิ่ม config Prisma ภายใน backend; รุ่นนี้เป็น config หลักเพียงตำแหน่งเดียว',
  'backend/prisma/seed.ts': 'เพิ่ม explicit Admin seed; เก็บไว้เป็นวิธี bootstrap ที่ไม่เปิดผ่าน public login',
  'frontend/components/common.tsx': 'เพิ่มป้องกัน JSON parse เมื่อได้ HTML; รุ่นนี้ตรวจรูปแบบ response และแจ้ง session หมดอายุด้วย',
  'frontend/features/inventory/workspace.tsx': 'เพิ่ม login/logout อีเมลรหัสผ่าน พร้อมค่าเริ่มต้นที่ฝังใน UI; รุ่นนี้ลบค่าเริ่มต้นและล้างข้อมูลเมื่อ session หมดอายุ',
  'scripts/db-push.mjs': 'เพิ่ม db push --accept-data-loss ตอน build และข้าม error; รุ่นนี้ย้ายเข้า archive และไม่เรียกใช้งาน',
  'package.json': 'เปลี่ยน dev/build/start เป็น native Next และเพิ่ม auto db push; รุ่นนี้ build ไม่เขียน DB และคืนคำสั่ง test/migrate',
  'package-lock.json': 'เปลี่ยน dependency graph ตาม PostgreSQL/Prisma และ Next; รุ่นนี้ตัด Cloudflare/Vinext/Drizzle ที่เลิกใช้',
  'prisma.config.ts': 'config ซ้ำที่ root เพื่อแก้ Prisma CLI; รุ่นนี้ใช้ --config ของ backend ชัดเจน',
  'next.config.ts': 'คืน config native Next ที่ root; รุ่นนี้ย้ายไป frontend พร้อม tracing root',
  'postcss.config.mjs': 'คืน config Tailwind ที่ root; รุ่นนี้ย้ายไป frontend',
};
function describe(status, path) {
  if (status.startsWith('R')) return 'ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม';
  if (notes[path]) return notes[path];
  if (path.startsWith('backend/generated/')) return 'Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git';
  if (path.startsWith('app/api/auth/')) return 'เพิ่ม route login/logout; รุ่นนี้อยู่ frontend/app และส่งข้อผิดพลาดแบบไม่เปิดเผยรายละเอียด DB';
  if (path === 'app/api/health/route.ts') return 'เพิ่ม diagnostics ที่เผย host/error; รุ่นนี้เหลือสถานะพร้อมใช้งานและ HTTP 503 เมื่อมีปัญหา';
  if (path.startsWith('app/')) return 'เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app';
  if (path.startsWith('tooling/reference/')) return 'สำเนาโค้ด D1/Sites เก็บไว้อ้างอิง; รุ่นนี้ย้ายเข้า backend/archive ซึ่งไม่ใช่โค้ด deploy';
  return 'ตรวจ diff แล้ว; ดู commit เดิมประกอบ';
}
const rows = lines.map(line => { const [status, ...paths] = line.split('\t'); const path = paths.at(-1); return `| \`${paths.join(' → ')}\` | ${status} | ${describe(status, path)} |`; });
const report = `# รายงานตรวจโค้ดก่อน Deploy NEWPJ02

เปรียบเทียบ Git 7f9f05d ถึง c882eba รวม 7 commits และ ${lines.length} paths ที่เปลี่ยน
commit 80aea3f รวมงานย้าย Prisma ที่ Codex เริ่มแต่ยังไม่ commit ด้วย จึงไม่ควรสรุปว่าโค้ดทุกบรรทัดใน commit นี้เขียนโดย Antigravity

## จุดที่พบและแก้ในรุ่นนี้

- ยกเลิกการแก้ schema แบบยอมให้ข้อมูลหายตอน build และ DDL ตอน login; ใช้ migrations ที่ตรวจทานแยกต่างหาก
- ยกเลิกผู้ล็อกอินคนแรกเป็น Admin, ค่าเริ่มต้นใน UI และ Origin แบบ wildcard; ใช้ seed, session และจำกัดการลองรหัสผ่าน
- แปลง BIGINT เป็น safe integer ก่อนส่ง JSON เพื่อให้ทะเบียนที่มีสินทรัพย์อ่านได้
- เพิ่มช่องกำหนด/เปลี่ยนรหัสผ่านผู้ใช้ และทดสอบครบ 5 บทบาท
- เก็บไฟล์ต้นฉบับและข้อมูลที่อ่านแล้วใน PostgreSQL ภายใน transaction เดียว ไม่พึ่ง disk ชั่วคราวของ Vercel
- ตรวจใบรับรอง TLS, ส่ง error ทั่วไปแทนรายละเอียด DB และ health คืน 503 เมื่อยังไม่พร้อม
- รวม source เป็น frontend/backend, แก้คำสั่ง build และคู่มือ; เก็บไฟล์ต้นฉบับและ backup ไว้ส่วนตัว

## รายไฟล์

A = เพิ่ม, M = แก้, R100 = ย้ายโดยเนื้อหาเดิมครบ

| ไฟล์ในช่วงที่ตรวจ | Git | สิ่งที่เปลี่ยนและการจัดการ |
|---|---|---|
${rows.join('\n')}

## สิ่งที่ยังคงเดิม

มาตรฐาน 11 คอลัมน์, กฎเก็บหัวชุด/โครงการ, การแยกแอร์คนละ QR, Split Lot ด้วย integer satang, บทบาท 5 กลุ่ม และข้อมูล Excel ต้นทางยังคงอยู่
ข้อมูลต้นฉบับไม่เพิ่มเป็นทะเบียนอัตโนมัติ เจ้าหน้าที่ต้องตรวจทานก่อน

## หลักฐานทดสอบ

Native Next production build และ TypeScript ผ่าน ชุดทดสอบ PostgreSQL บนฐานข้อมูล local แยกผ่าน: cookie login, 5 roles, forged headers, Origin, BigInt JSON, Split Lot, concurrent replay/split, transfer/repair/disposal approvals, stocktake, XLSX ต้นฉบับ byte-for-byte, reset/deactivate/logout และไม่มี credential ใน API/audit
สถานะ Deploy จริงให้ตรวจจาก Vercel หลังเชื่อม NEWPJ02 ไม่อนุมานว่า Git push สำเร็จแปลว่าเว็บขึ้นแล้ว

อ้างอิง: [Prisma baselining](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining), [Vercel monorepo](https://vercel.com/docs/monorepos/monorepo-faq), [Vercel body size](https://vercel.com/docs/functions/limitations)
`;
mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
writeFileSync(new URL('../docs/CHANGE_AUDIT.md', import.meta.url), report);
console.log('Audit inventory generated for', lines.length, 'changed paths.');
