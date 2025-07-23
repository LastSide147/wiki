import { test, expect } from "@playwright/test";
import { get } from "http";

test.beforeEach(async ({page}) => {
    await page.goto('https://www.wikipedia.org')
})

test('Только пробелы - нет резульатов', async({page}) => {
  const searchRequest = "               "
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})

test('Спецсимволы - нет результатов', async({page}) => {
  const searchRequest = "!№;%:?"
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})

test('Ноль - ничего не ломает, есть результат', async({page}) => {
  const searchRequest = "0"
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('h1#firstHeading span.mw-page-title-main')).toHaveText(searchRequest);
})

test('100 символов не нарушают работу сервиса', async({page}) => {
    function generateString(char, count) {
    let str = '';
    for (let i = 0; i < count; i++) str += char;
    return str;
    }
  const searchRequest = generateString("A", 100)
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})

test('1000 символов не нарушают работу сервиса, появляется сообщение с ошибкой запроса', async({page}) => {
    function generateString(char, count) {
    let str = '';
    for (let i = 0; i < count; i++) str += char;
    return str;
    }
  const searchRequest = generateString("A", 1000)
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  // await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
  await expect(page.locator('div.cdx-message__content > p')).toHaveText("An error has occurred while searching: Search request is longer than the maximum allowed length. (Actual: 1000; allowed: 300)");
})


// Система должна уведомлять о превышении допустимого количества символа без ухода на экран ошибки - Тест упадет
test('FAIL 10.000 символов не нарушают работу сервиса', async({page}) => {
    function generateString(char, count) {
    let str = '';
    for (let i = 0; i < count; i++) str += char;
    return str;
 }
  const searchRequest = generateString("A", 10000)
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})
// Система должна уведомлять о превышении допустимого количества символа без ухода на экран ошибки - Тест упадет

test('На 10.000 символов приходит верный статус', async({page}) => {
    function generateString(char, count) {
    let str = '';
    for (let i = 0; i < count; i++) str += char;
    return str;
 }
  const searchRequest = generateString("A", 10000)
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);

  const responsePromiseGet = page.waitForResponse(resp => resp.request().method() === "GET");
  await page.locator('input[name="search"]').press('Enter'); 
  const getResponse = await responsePromiseGet;
  expect(getResponse.status()).toBe(414);
})

test('Скрипт не ломает сервис - нет результатов', async({page}) => {
  const searchRequest = "<script>alert('XSS')<script>";
  await page.locator('input[name="search"]').fill(searchRequest);
  await expect(page.locator('input[name="search"]')).toHaveValue(searchRequest);
  await page.locator('input[name="search"]').press('Enter');    
  await expect(page.locator('input.oo-ui-inputWidget-input')).toHaveValue(searchRequest);
  await expect(page.locator('h1#firstHeading')).toHaveText('Search results');
})
