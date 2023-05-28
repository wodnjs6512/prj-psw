import { test, expect, Locator } from "@playwright/test";

const 오픈_시간 = "2023-05-29 09:00:00";
const 예약날짜 = "2023-06-19";
const 최소_시간 = 10;

test("스피드예약 로그인", async ({ page }) => {
  await page.goto("https://onetheclub.com/member/login");
  await page.getByPlaceholder("아이디").fill("psw3210");
  await page.getByPlaceholder("비밀번호").fill("Qkrtkddnr1!");
  await page.getByRole("button", { name: "login" }).click();
  await page.getByRole("button", { name: "확인" }).click();
  await page.getByRole("link", { name: "요금확인/예약" }).click();

  await new Promise(async (resolve, reject) => {
    while (new Date().getTime() < new Date(오픈_시간).getTime()) {
      await page.waitForTimeout(1000);
    }
    resolve(null);
  });

  await page.locator(`id=A${예약날짜.replace(/-/gi, "")}`).click();

  await page.locator('h5:has-text("클럽72 하늘")').locator("button").click();

  let list: Locator | null = null;
  let cnt = 최소_시간;

  const base = await page.locator("[data-name='company_list_7']");

  while (!list) {
    const test = await base
      .locator(
        `[data-name='company_list_J57_1'] li:has-text('${cnt
          .toString()
          .padStart(0, "0")}:')`
      )
      .count();

    const probe = base.locator(
      `li:has-text('${cnt.toString().padStart(0, "0")}:')`
    );

    const elemCnt = await probe.count();

    if (elemCnt > 0) {
      list = probe;
      break;
    } else {
      cnt++;
    }
    if (cnt > 20) throw Error();
  }
  await list.locator("button").first().click();

  const a = list.locator("button").first();

  const 기본인증키 = await page
    .locator(
      ".grid.gut-guide.cross-center:has-text('두 자리를 그대로 입력하세요.')"
    )
    .locator(".color-04.f_size-22px")
    .innerText();

  await page.locator("#certNoChk").fill(기본인증키);

  await new Promise(() => {});
});
