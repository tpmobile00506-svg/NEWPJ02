# รายงานตรวจโค้ดก่อน Deploy NEWPJ02

เปรียบเทียบ Git 7f9f05d ถึง c882eba รวม 7 commits และ 70 paths ที่เปลี่ยน
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
| `app/api/auth/login/route.ts` | A | เพิ่ม route login/logout; รุ่นนี้อยู่ frontend/app และส่งข้อผิดพลาดแบบไม่เปิดเผยรายละเอียด DB |
| `app/api/auth/logout/route.ts` | A | เพิ่ม route login/logout; รุ่นนี้อยู่ frontend/app และส่งข้อผิดพลาดแบบไม่เปิดเผยรายละเอียด DB |
| `app/api/data/route.ts` | A | เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app |
| `app/api/health/route.ts` | A | เพิ่ม diagnostics ที่เผย host/error; รุ่นนี้เหลือสถานะพร้อมใช้งานและ HTTP 503 เมื่อมีปัญหา |
| `app/api/source/route.ts` | A | เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app |
| `app/layout.tsx` | A | เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app |
| `app/login/page.tsx` | A | เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app |
| `app/page.tsx` | A | เพิ่ม native Next route/layout; ทำให้ frontend/app เดิมไม่ได้ถูกใช้; รุ่นนี้รวมไว้ใน frontend/app |
| `backend/auth/sessions.ts` | A | เปลี่ยน ChatGPT เป็น cookie session; หลังจากนั้นเพิ่ม public bootstrap และผ่อน Origin/password ซึ่งรุ่นนี้แก้กลับให้เข้มงวด |
| `backend/config/env.ts` | A | เพิ่ม DATABASE_URL, origin และค่าของ Vercel |
| `backend/db/client.ts` | A | เปลี่ยนเป็น Prisma/pg; เพิ่ม TLS แบบไม่ตรวจใบรับรองและเรียก DDL ตอน request ซึ่งรุ่นนี้เอาออก |
| `backend/db/index.ts` | M | ส่งออก client ของ Prisma แทน Drizzle |
| `backend/db/init.ts` | A | สร้างตารางอัตโนมัติตอน request; ย้ายเข้า archive และใช้ migrations แทน |
| `backend/generated/prisma/browser.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/client.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/commonInputTypes.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/enums.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/internal/class.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/internal/prismaNamespace.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/internal/prismaNamespaceBrowser.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Approval.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Asset.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/AssetGroup.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/AssetRequest.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Audit.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Branch.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Category.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/ImportFile.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Invite.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Location.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Operation.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Session.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Setting.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/SourceRow.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/Stocktake.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/StocktakeItem.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/generated/prisma/models/User.ts` | A | Prisma สร้างอัตโนมัติ; ไม่ใช่กฎธุรกิจเขียนมือ; รุ่นนี้สร้างตอน install/build และไม่ส่ง generated เข้า Git |
| `backend/prisma/prisma.config.ts` | A | เพิ่ม config Prisma ภายใน backend; รุ่นนี้เป็น config หลักเพียงตำแหน่งเดียว |
| `backend/prisma/schema.prisma` | A | เพิ่มโมเดล PostgreSQL/Prisma 17 โมเดล; รุ่นแก้เพิ่ม StoredFile และ LoginAttempt รวม 19 |
| `backend/prisma/seed.ts` | A | เพิ่ม explicit Admin seed; เก็บไว้เป็นวิธี bootstrap ที่ไม่เปิดผ่าน public login |
| `backend/routes/data.ts` | M | API ใช้ sessions และ Prisma; พบ BigInt serialize/error handling ผิด ซึ่งแก้แล้ว |
| `backend/routes/source.ts` | M | R2 เปลี่ยนเป็น disk; รุ่นนี้โหลดไฟล์จาก PostgreSQL |
| `backend/services/asset-mutations.ts` | A | แยก mutation, serializable transactions และ idempotency จากงานย้าย PostgreSQL ที่เริ่มก่อน commit นี้ |
| `backend/services/asset-service.ts` | M | อ่านข้อมูลและนำเข้าด้วย Prisma; กฎตรวจทานต้นฉบับยังเดิม; รุ่นนี้เก็บ bytes พร้อม metadata ใน transaction |
| `backend/services/errors.ts` | A | เพิ่ม ApiError กลางสำหรับ API |
| `backend/storage/files.ts` | A | แทน R2 ด้วย disk; รุ่นนี้เปลี่ยนเป็น BYTEA เพื่ออยู่ถาวรบน Vercel |
| `frontend/components/common.tsx` | M | เพิ่มป้องกัน JSON parse เมื่อได้ HTML; รุ่นนี้ตรวจรูปแบบ response และแจ้ง session หมดอายุด้วย |
| `frontend/features/inventory/workspace.tsx` | M | เพิ่ม login/logout อีเมลรหัสผ่าน พร้อมค่าเริ่มต้นที่ฝังใน UI; รุ่นนี้ลบค่าเริ่มต้นและล้างข้อมูลเมื่อ session หมดอายุ |
| `next.config.ts` | A | คืน config native Next ที่ root; รุ่นนี้ย้ายไป frontend พร้อม tracing root |
| `package-lock.json` | M | เปลี่ยน dependency graph ตาม PostgreSQL/Prisma และ Next; รุ่นนี้ตัด Cloudflare/Vinext/Drizzle ที่เลิกใช้ |
| `package.json` | M | เปลี่ยน dev/build/start เป็น native Next และเพิ่ม auto db push; รุ่นนี้ build ไม่เขียน DB และคืนคำสั่ง test/migrate |
| `postcss.config.mjs` | A | คืน config Tailwind ที่ root; รุ่นนี้ย้ายไป frontend |
| `prisma.config.ts` | A | config ซ้ำที่ root เพื่อแก้ Prisma CLI; รุ่นนี้ใช้ --config ของ backend ชัดเจน |
| `scripts/db-push.mjs` | A | เพิ่ม db push --accept-data-loss ตอน build และข้าม error; รุ่นนี้ย้ายเข้า archive และไม่เรียกใช้งาน |
| `tooling/reference/d1/asset-service.ts` | A | สำเนาโค้ด D1/Sites เก็บไว้อ้างอิง; รุ่นนี้ย้ายเข้า backend/archive ซึ่งไม่ใช่โค้ด deploy |
| `backend/db/drizzle.config.ts → tooling/reference/d1/drizzle.config.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/db/migrations/0000_cool_ender_wiggin.sql → tooling/reference/d1/migrations/0000_cool_ender_wiggin.sql` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/db/migrations/meta/0000_snapshot.json → tooling/reference/d1/migrations/meta/0000_snapshot.json` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/db/migrations/meta/_journal.json → tooling/reference/d1/migrations/meta/_journal.json` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/db/schema.ts → tooling/reference/d1/schema.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `.openai/hosting.json → tooling/reference/sites/.openai/hosting.json` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `frontend/app/api/data/route.ts → tooling/reference/sites/api/data/route.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `frontend/app/api/source/route.ts → tooling/reference/sites/api/source/route.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/auth/chatgpt.ts → tooling/reference/sites/auth/chatgpt.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `backend/types/cloudflare-env.d.ts → tooling/reference/sites/cloudflare-env.d.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `tooling/hosting/sites-vite-plugin.LICENSE → tooling/reference/sites/hosting/sites-vite-plugin.LICENSE` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `tooling/hosting/sites-vite-plugin.ts → tooling/reference/sites/hosting/sites-vite-plugin.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `tooling/scripts/sites-env.mjs → tooling/reference/sites/sites-env.mjs` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |
| `vite.config.ts → tooling/reference/sites/vite.config.ts` | R100 | ย้ายไฟล์เดิมโดยเนื้อหาไม่เปลี่ยน; เก็บประวัติไว้ใน local archive/Git เดิม |

## สิ่งที่ยังคงเดิม

มาตรฐาน 11 คอลัมน์, กฎเก็บหัวชุด/โครงการ, การแยกแอร์คนละ QR, Split Lot ด้วย integer satang, บทบาท 5 กลุ่ม และข้อมูล Excel ต้นทางยังคงอยู่
ข้อมูลต้นฉบับไม่เพิ่มเป็นทะเบียนอัตโนมัติ เจ้าหน้าที่ต้องตรวจทานก่อน

## หลักฐานทดสอบ

Native Next production build และ TypeScript ผ่าน ชุดทดสอบ PostgreSQL บนฐานข้อมูล local แยกผ่าน: cookie login, 5 roles, forged headers, Origin, BigInt JSON, Split Lot, concurrent replay/split, transfer/repair/disposal approvals, stocktake, XLSX ต้นฉบับ byte-for-byte, reset/deactivate/logout และไม่มี credential ใน API/audit
สถานะ Deploy จริงให้ตรวจจาก Vercel หลังเชื่อม NEWPJ02 ไม่อนุมานว่า Git push สำเร็จแปลว่าเว็บขึ้นแล้ว

อ้างอิง: [Prisma baselining](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining), [Vercel monorepo](https://vercel.com/docs/monorepos/monorepo-faq), [Vercel body size](https://vercel.com/docs/functions/limitations)
